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
        
        valid_choices = ['random_forest', 'log_reg', 'gradient_boosting']
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
            "Logistic Regression": joblib.load('../trained/log_reg_model.pkl'),
            "Random Forest": joblib.load('../trained/random_forest_model.pkl')
        }

        X_eval = pd.read_csv('../CSV/evaluation_data.csv')  
        y_true = X_eval.pop('DEP_DEL15')  

        x_eval_np = X_eval.values
        metrics = {}

        for model_display_name, model in model_names.items():
            y_pred = model.predict(x_eval_np)
            accuracy = accuracy_score(y_true, y_pred)
            metrics[model_display_name] = {
                "accuracy": accuracy,
                "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(), 
                "classification_report": classification_report(y_true, y_pred, output_dict=True) 
            }

        return metrics

    except FileNotFoundError as fnf_error:
        raise HTTPException(status_code=404, detail=f"File not found: {str(fnf_error)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during evaluation: {str(e)}")
