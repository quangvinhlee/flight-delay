# data_preprocessing.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from collections import OrderedDict
from imblearn.over_sampling import SMOTE
from sklearn.neighbors import KNeighborsClassifier

def preprocess_data(file_path='../CSV/processed_data.csv', sample_num=1_000_000):
    
    print("Start Preprocessing")
    data = pd.read_csv(file_path)

    
    # Optionally sample the data if sample_num is provided
    if sample_num:
        data = data.sample(n=len(data), random_state=42).reset_index(drop=True)

    # Select relevant columns for preprocessing
    columns = [
        'DEP_DEL15', 'PART_OF_DAY', 'DISTANCE_GROUP',
        'CONCURRENT_FLIGHTS', 'PREVIOUS_AIRPORT',
        'MONTH', 'PLANE_AGE', 'SEGMENT_NUMBER',
        'PRCP', 'SNOW', 'AWND', 'SNWD', 'TMAX', 'AIRPORT_FLIGHTS_MONTH'
    ]
    data = data[columns]

    # Remove rows with missing values
    data.dropna(inplace=True)

    # Remove duplicate rows and print information
    duplicate_rows = data.duplicated()
    print(f"Number of duplicate rows: {duplicate_rows.sum()}")
    data.drop_duplicates(inplace=True)
    print(f"Number of duplicate rows after removal: {data.duplicated().sum()}")

    # # Define time blocks for 'PART_OF_DAY' feature
    # time_blocks_order = [
    #     'Early Morning & Late Night',  # 0001-0559
    #     'Morning',                    # 0600-1159
    #     'Afternoon',                  # 1200-1659
    #     'Evening',                    # 1700-1959
    #     'Night'                       # 2000-2359
    # ]

    # # Map 'DEP_TIME_BLK' to corresponding time block categories
    # data['PART_OF_DAY'] = pd.cut(
    #     data['DEP_TIME_BLK'].map(lambda x: int(x.split('-')[0])),
    #     bins=[0, 600, 1200, 1700, 2000, 2400],
    #     labels=time_blocks_order,
    #     right=False
    # )

    # # Map time block categories to numerical values
    # block_num = {
    #     'Early Morning & Late Night': 1,
    #     'Morning': 2,
    #     'Afternoon': 3,
    #     'Evening': 4,
    #     'Night': 5
    # }
    # data['PART_OF_DAY'] = data['PART_OF_DAY'].map(block_num)
    # data[['DEP_TIME_BLK', 'PART_OF_DAY']].head()
    
    encoder = OneHotEncoder(handle_unknown='ignore')
    encoded_features = encoder.fit_transform(data[['PREVIOUS_AIRPORT']])
    encoded_feature_names = encoder.get_feature_names_out(['PREVIOUS_AIRPORT'])
    data_encoded = pd.concat([pd.DataFrame(encoded_features.toarray(), columns=encoded_feature_names), data.drop(columns=['PREVIOUS_AIRPORT'])], axis=1)
    
    data_remaining = data.drop(columns=['PREVIOUS_AIRPORT'])
    data_encoded = pd.concat([pd.DataFrame(encoded_features.toarray(), columns=encoded_feature_names), data_remaining.reset_index(drop=True)], axis=1)
    
    X = data_encoded.drop(columns=['DEP_DEL15'])
    y = data_encoded['DEP_DEL15']
    
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X, y)
    X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Save preprocessed data and scaler for future use
    joblib.dump(scaler, '../trained/scaler.pkl')
    
    X_train_scaled_df = pd.DataFrame(X_train_scaled, columns=X_train.columns)

    # Identify columns with NaN values and count them
    nan_columns = X_train_scaled_df.columns[X_train_scaled_df.isna().any()].tolist()
    nan_counts = X_train_scaled_df[nan_columns].isna().sum()
    
    print(f'Attributes with NaN values and their counts:\n{nan_counts}')
    
    all_features = list(encoded_feature_names) + ['PART_OF_DAY', 'CONCURRENT_FLIGHTS', 'MONTH', 'PLANE_AGE', 'PRCP', 'SNOW', 'AWND', 'SNWD', 'SEGMENT_NUMBER', 'DISTANCE_GROUP', 'TMAX', 'AIRPORT_FLIGHTS_MONTH']

    X_train = pd.DataFrame(X_train_scaled, columns=all_features)
    X_test = pd.DataFrame(X_test_scaled, columns=all_features)
        
    flight_status_features = ['PART_OF_DAY', 'MONTH','CONCURRENT_FLIGHTS', 'PLANE_AGE', 'SEGMENT_NUMBER', 'DISTANCE_GROUP', 'AIRPORT_FLIGHTS_MONTH']
    X_flight_status_train = pd.DataFrame(X_train_scaled, columns=all_features)[flight_status_features]
    X_flight_status_train.dropna(inplace=True)
    X_flight_status_test = pd.DataFrame(X_test_scaled, columns=all_features)[flight_status_features]
    X_flight_status_test.dropna(inplace=True)

    weather_features = ['PART_OF_DAY', 'MONTH', 'AWND', 'SNOW', 'PRCP', 'SNWD', 'TMAX']
    X_weather_train = pd.DataFrame(X_train_scaled, columns=all_features)[weather_features]
    X_weather_train.dropna(inplace=True)
    X_weather_test = pd.DataFrame(X_test_scaled, columns=all_features)[weather_features]
    X_weather_test.dropna(inplace=True)
    
    # Save the test set with appropriate features for each model
    test_data_flight_status = pd.DataFrame(X_test_scaled, columns=all_features)[flight_status_features]
    test_data_flight_status['DEP_DEL15'] = y_test
    test_data_flight_status.dropna(inplace=True)
    test_data_flight_status.to_csv('../CSV/evaluation_data_flight_status.csv', index=False)

    test_data_weather = pd.DataFrame(X_test_scaled, columns=all_features)[weather_features]
    test_data_weather['DEP_DEL15'] = y_test
    test_data_weather.dropna(inplace=True)
    test_data_weather.to_csv('../CSV/evaluation_data_weather.csv', index=False)

    test_data_knn = pd.DataFrame(X_test_scaled, columns=all_features).copy()
    test_data_knn['DEP_DEL15'] = y_test
    test_data_knn.to_csv('../CSV/evaluation_data_knn.csv', index=False)
    
    print("Starting training...")
    print("Training Random Forest...")

        
    rf_model = RandomForestClassifier(random_state=42)
    rf_model.fit(X_flight_status_train, y_train)
    rf_predictions = rf_model.predict(X_flight_status_test)
    
    print("Training Gradient Boosting...")
    
    gb_model = GradientBoostingClassifier(random_state=42)
    gb_model.fit(X_weather_train, y_train)
    gb_predictions = gb_model.predict(X_weather_test)
    
    print("Training KNN...")
    
    knn_model = KNeighborsClassifier(n_neighbors=2)
    knn_model.fit(X_train, y_train)
    knn_predictions = knn_model.predict(X_test)
    
    print("Random Forest Classifier:")
    print("Accuracy:", accuracy_score(y_test, rf_predictions))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, rf_predictions))
    print("Classification Report:")
    print(classification_report(y_test, rf_predictions))
    joblib.dump(rf_model, '../trained/random_forest_model.pkl')

    # Train Logistic Regression
    print("K Nearest Neighbor Model Evaluation")
    print(f"Accuracy: {accuracy_score(y_test, knn_predictions):.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, knn_predictions))
    print("Classification Report:")
    print(classification_report(y_test, knn_predictions))
    joblib.dump(knn_model, '../trained/k_nearest_neighbor_model.pkl')

    # Train Gradient Boosting Classifier
    print("Gradient Boosting Model Evaluation")
    print(f"Accuracy: {accuracy_score(y_test, gb_predictions):.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, gb_predictions))
    print("Classification Report:")
    print(classification_report(y_test, gb_predictions))
    joblib.dump(gb_model, '../trained/gradient_boosting_model.pkl')

    print('Training Success')

preprocess_data()



    # # Prepare X (features) and y (target) for training
    # X = data[["PRCP", "AWND", "SNOW", "SNWD", "SEGMENT_NUMBER", "PART_OF_DAY"]].to_numpy()
    # y = data["DEP_DEL15"].to_numpy()

    # # Split data into training and testing sets
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # # Standardize features using StandardScaler
    # scaler = StandardScaler()
    # X_train_scaled = scaler.fit_transform(X_train)
    # X_test_scaled = scaler.transform(X_test)
    
    
    # # Train Random Forest Classifier
    # rf_model = RandomForestClassifier(random_state=42)
    # rf_model.fit(X_train_scaled, y_train)
    # y_pred_rf = rf_model.predict(X_test_scaled)