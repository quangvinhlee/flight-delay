import pandas as pd
import joblib
import numpy as np
import os

def predict(file_path, choice='random_forest', sample_size=3000  ):
    # Load test data from the uploaded CSV file
    data = pd.read_csv(file_path)

    if len(data) > sample_size:
        data = data.sample(n=sample_size, random_state=1) 
    # Define relevant columns for prediction
    columns = [
        'MONTH', 'DAY_OF_WEEK', 'DEP_DEL15', 'DEP_TIME_BLK', 'DISTANCE_GROUP',
        'SEGMENT_NUMBER', 'CONCURRENT_FLIGHTS', 'NUMBER_OF_SEATS', 'CARRIER_NAME',
        'AIRPORT_FLIGHTS_MONTH', 'AIRLINE_FLIGHTS_MONTH', 'AIRLINE_AIRPORT_FLIGHTS_MONTH',
        'AVG_MONTHLY_PASS_AIRPORT', 'AVG_MONTHLY_PASS_AIRLINE', 'FLT_ATTENDANTS_PER_PASS',
        'GROUND_SERV_PER_PASS', 'PLANE_AGE', 'DEPARTING_AIRPORT', 'PREVIOUS_AIRPORT',
        'PRCP', 'SNOW', 'SNWD', 'TMAX', 'AWND'
    ]

    # Ensure the necessary columns exist in the uploaded file
    missing_columns = set(columns) - set(data.columns)
    if missing_columns:
        raise ValueError(f"File is missing some of the required columns: {missing_columns}")

    # Select only the necessary columns
    data = data[columns]

    # Remove any rows with missing values
    data.dropna(inplace=True)

    # Define time blocks based on the departure time block
    time_blocks_order = [
        'Early Morning & Late Night',  # 0001-0559
        'Morning',                      # 0600-1159
        'Afternoon',                    # 1200-1659
        'Evening',                      # 1700-1959
        'Night'                         # 2000-2359
    ]

    # Convert 'DEP_TIME_BLK' to corresponding time block category
    if 'DEP_TIME_BLK' in data.columns:
        data['PART_OF_DAY'] = pd.cut(
            data['DEP_TIME_BLK'].map(lambda x: int(x.split('-')[0])),
            bins=[0, 600, 1200, 1700, 2000, 2400],
            labels=time_blocks_order,
            right=False
        )
    else:
        raise ValueError("DEP_TIME_BLK column not found in the dataset.")

    # Map the PART_OF_DAY categories to numerical values
    block_num = {
        'Early Morning & Late Night': 1,
        'Morning': 2,
        'Afternoon': 3,
        'Evening': 4,
        'Night': 5
    }
    data['PART_OF_DAY'] = data['PART_OF_DAY'].map(block_num)

    # Load the pre-trained scaler
    try:
        scaler = joblib.load('../trained/scaler.pkl')
    except FileNotFoundError:
        raise FileNotFoundError("Scaler file not found. Please check the path.")

    # Select the features for prediction
    X_new = data[["PRCP", "AWND", "SNOW", "SNWD", "SEGMENT_NUMBER", "PART_OF_DAY"]].to_numpy()

    # Scale the new test data
    X_new_scaled = scaler.transform(X_new)

    # Choose the model based on the user's input
    model_paths = {
        'random_forest': '../trained/random_forest_model.pkl',
        'log_reg': '../trained/log_reg_model.pkl',
        'gradient_boosting': '../trained/gradient_boosting_model.pkl'
    }

    if choice not in model_paths:
        raise ValueError("Invalid model choice. Choose from 'random_forest', 'log_reg', or 'gradient_boosting'.")

    # Load the selected model
    try:
        model = joblib.load(model_paths[choice])
    except FileNotFoundError:
        raise FileNotFoundError(f"Model file for {choice} not found. Please check the path.")

    # Make predictions on the new test data
    predictions = model.predict(X_new_scaled)

    # Ensure the Result directory exists
    output_dir = '../Result/'
    os.makedirs(output_dir, exist_ok=True)

    # Save predictions to a new CSV file
    output_file_path = f"{output_dir}test_predictions_{choice}.csv"
    data['PREDICTED_DEP_DEL15'] = predictions
    data.to_csv(output_file_path, index=False)

    return output_file_path
