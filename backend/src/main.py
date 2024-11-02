from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import time
import tempfile 
import os
from pydantic import BaseModel
import joblib
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

from predict import predict  

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL of React application
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to log requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()  # Start timing
    response = await call_next(request)  # Process the request
    process_time = time.time() - start_time  # Calculate process time
    log_details = {
        "method": request.method,
        "url": request.url,
        "duration": f"{process_time:.4f} seconds"
    }
    print(f"Request Details: {log_details}")  # Log details for each request
    return response

# Exception handler for HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "error": "An error occurred"}
    )

@app.post("/predict")
async def predict_delay(
    file: UploadFile = File(...), 
    choice: str = Form('random_forest'), 
    sample_size: int = Form(3000)
):
    temp_file_path = None  
    try:
        print(f"Model choice received: {choice}")  
        
        valid_choices = ['random_forest', 'k_nearest_neighbor', 'gradient_boosting']
        if choice not in valid_choices:
            raise ValueError(f"Invalid model choice '{choice}'. Must be one of: {valid_choices}")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp_file:
            contents = await file.read()  
            temp_file.write(contents)  
            temp_file_path = temp_file.name  

        result_file = predict(temp_file_path, choice=choice)

        data = pd.read_csv(result_file)

        return JSONResponse(content=data.to_dict(orient='records'))

    except FileNotFoundError as fnf_error:
        raise HTTPException(status_code=404, detail=f"File not found: {str(fnf_error)}")
    except ValueError as val_error:
        raise HTTPException(status_code=400, detail=f"Value error: {str(val_error)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)  



@app.get('/evaluate')
async def evaluate_models():
  try:
    # Load your pre-trained models
    model_names = {
      "Gradient Boosting": joblib.load('../trained/gradient_boosting_model.pkl'),
      "K Nearest Neighbor": joblib.load('../trained/k_nearest_neighbor_model.pkl'),
      "Random Forest": joblib.load('../trained/random_forest_model.pkl')
    }

    # Define evaluation data paths based on model requirements
    evaluation_data_paths = {
      "Gradient Boosting": "../CSV/evaluation_data_weather.csv",
      "K Nearest Neighbor": "../CSV/evaluation_data_knn.csv",
      "Random Forest": "../CSV/evaluation_data_flight_status.csv"
    }

    metrics = {}

    for model_display_name, model in model_names.items():
      X_eval = pd.read_csv(evaluation_data_paths[model_display_name])
      y_true = X_eval.pop('DEP_DEL15')

      if model_display_name == 'Random Forest':
          features = ['PART_OF_DAY', 'MONTH', 'CONCURRENT_FLIGHTS', 'PLANE_AGE', 'SEGMENT_NUMBER', 'DISTANCE_GROUP', 'AIRPORT_FLIGHTS_MONTH']
      elif model_display_name == 'K Nearest Neighbor':
          features = [
                      'DEP_DEL15', 'PART_OF_DAY', 'DISTANCE_GROUP',
                      'CONCURRENT_FLIGHTS', 'PREVIOUS_AIRPORT',
                      'MONTH', 'PLANE_AGE', 'SEGMENT_NUMBER',
                      'PRCP', 'SNOW', 'AWND', 'SNWD', 'TMAX', 'AIRPORT_FLIGHTS_MONTH'
                      ]
      elif model_display_name == 'Gradient Boosting':
          features = ['PART_OF_DAY', 'MONTH', 'AWND', 'SNOW', 'PRCP', 'SNWD', 'TMAX']
      else:
          raise ValueError("Invalid model choice. Choose from 'random_forest', 'k_nearest_neighbor', or 'gradient_boosting'.")

      x_eval_np = X_eval[features].values

      accuracy = accuracy_score(y_true, model.predict(x_eval_np))
      metrics[model_display_name] = {
        "accuracy": accuracy,
        "confusion_matrix": confusion_matrix(y_true, model.predict(x_eval_np)).tolist(),
        "classification_report": classification_report(y_true, model.predict(x_eval_np), output_dict=True)
      }

    return metrics

  except FileNotFoundError as fnf_error:
    raise HTTPException(status_code=404, detail=f"File not found: {str(fnf_error)}")
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error during evaluation: {str(e)}")