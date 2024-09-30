import pandas as pd
import numpy as np
import joblib

def predict_on_new_data(test_file_path, model_choice='random_forest'):
    # Load test data from CSV file
    test_data = pd.read_csv(test_file_path)

    # Define relevant columns for prediction
    columns = [
        'MONTH', 'DAY_OF_WEEK', 'DEP_DEL15', 'DEP_TIME_BLK', 'DISTANCE_GROUP',
        'SEGMENT_NUMBER', 'CONCURRENT_FLIGHTS', 'NUMBER_OF_SEATS', 'CARRIER_NAME',
        'AIRPORT_FLIGHTS_MONTH', 'AIRLINE_FLIGHTS_MONTH', 'AIRLINE_AIRPORT_FLIGHTS_MONTH',
        'AVG_MONTHLY_PASS_AIRPORT', 'AVG_MONTHLY_PASS_AIRLINE', 'FLT_ATTENDANTS_PER_PASS',
        'GROUND_SERV_PER_PASS', 'PLANE_AGE', 'DEPARTING_AIRPORT', 'PREVIOUS_AIRPORT',
        'PRCP', 'SNOW', 'SNWD', 'TMAX', 'AWND'
    ]
    test_data = test_data[columns]

    # Remove any rows with missing values
    test_data.dropna(inplace=True)

    # Define the time blocks based on the departure time block
    time_blocks_order = [
        'Early Morning & Late Night',  # 0001-0559
        'Morning',                      # 0600-1159
        'Afternoon',                    # 1200-1659
        'Evening',                      # 1700-1959
        'Night'                         # 2000-2359
    ]

    # Convert 'DEP_TIME_BLK' to corresponding time block category
    test_data['PART_OF_DAY'] = pd.cut(
        test_data['DEP_TIME_BLK'].map(lambda x: int(x.split('-')[0])),
        bins=[0, 600, 1200, 1700, 2000, 2400],
        labels=time_blocks_order,
        right=False
    )
    
    # Map the time blocks to numerical values
    block_num = {
        'Early Morning & Late Night': 1,
        'Morning': 2,
        'Afternoon': 3,
        'Evening': 4,
        'Night': 5
    }
    test_data['PART_OF_DAY'] = test_data['PART_OF_DAY'].map(block_num)

    # Select relevant features for the prediction
    X_new = test_data[["PRCP", "AWND", "SNOW", "SNWD", "SEGMENT_NUMBER", "PART_OF_DAY"]].to_numpy()

    # Load the pre-trained scaler used during training
    scaler = joblib.load('../TrainedModel/scaler.pkl')
    X_new_scaled = scaler.transform(X_new)

    # Choose the model based on the user's input
    if model_choice == 'random_forest':
        model_path = '../TrainedModel/random_forest_model.pkl'
    elif model_choice == 'log_reg':
        model_path = '../TrainedModel/log_reg_model.pkl'
    elif model_choice == 'gradient_boosting':
        model_path = '../TrainedModel/gradient_boosting_model.pkl'
    else:
        raise ValueError("Invalid model choice. Choose from 'random_forest', 'log_reg', or 'gradient_boosting'.")

    # Load the selected model
    model = joblib.load(model_path)

    # Make predictions on the new test data
    predictions = model.predict(X_new_scaled)

    # Save predictions to a new CSV file
    output_file_path = f"../Result/test_predictions_{model_choice}.csv"
    test_data['PREDICTED_DEP_DEL15'] = predictions
    test_data.to_csv(output_file_path, index=False)

    # Print confirmation messages
    print(f"Predictions saved to '{output_file_path}' using {model_choice} model")
    print(f"Please open the file '{output_file_path}' to see the result")

# Example usage:
# predict_on_new_data('../CSV/test_flight_data_100_rows.csv', model_choice='random_forest')
# predict_on_new_data('../CSV/test_flight_data_100_rows.csv', model_choice='log_reg')
# predict_on_new_data('../CSV/test_flight_data_100_rows.csv', model_choice='gradient_boosting')
