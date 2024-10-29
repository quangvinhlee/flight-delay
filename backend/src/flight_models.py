# data_preprocessing.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

def preprocess_data(file_path='../CSV/processed_data.csv', sample_num=100_000):
    
    print("Start Preprocessing")
    data = pd.read_csv(file_path)

    
    # Optionally sample the data if sample_num is provided
    if sample_num:
        data = data.sample(n=sample_num, random_state=42).reset_index(drop=True)

    # Select relevant columns for preprocessing
    columns = [
        'MONTH', 'DAY_OF_WEEK', 'DEP_DEL15', 'DEP_TIME_BLK', 'DISTANCE_GROUP',
        'SEGMENT_NUMBER', 'CONCURRENT_FLIGHTS', 'NUMBER_OF_SEATS', 'CARRIER_NAME',
        'AIRPORT_FLIGHTS_MONTH', 'AIRLINE_FLIGHTS_MONTH', 'AIRLINE_AIRPORT_FLIGHTS_MONTH',
        'AVG_MONTHLY_PASS_AIRPORT', 'AVG_MONTHLY_PASS_AIRLINE', 'FLT_ATTENDANTS_PER_PASS',
        'GROUND_SERV_PER_PASS', 'PLANE_AGE', 'DEPARTING_AIRPORT', 'PREVIOUS_AIRPORT',
        'PRCP', 'SNOW', 'SNWD', 'TMAX', 'AWND'
    ]
    data = data[columns]

    # Remove rows with missing values
    data.dropna(inplace=True)

    # Remove duplicate rows and print information
    duplicate_rows = data.duplicated()
    print(f"Number of duplicate rows: {duplicate_rows.sum()}")
    data.drop_duplicates(inplace=True)
    print(f"Number of duplicate rows after removal: {data.duplicated().sum()}")

    # Define time blocks for 'PART_OF_DAY' feature
    time_blocks_order = [
        'Early Morning & Late Night',  # 0001-0559
        'Morning',                    # 0600-1159
        'Afternoon',                  # 1200-1659
        'Evening',                    # 1700-1959
        'Night'                       # 2000-2359
    ]

    # Map 'DEP_TIME_BLK' to corresponding time block categories
    data['PART_OF_DAY'] = pd.cut(
        data['DEP_TIME_BLK'].map(lambda x: int(x.split('-')[0])),
        bins=[0, 600, 1200, 1700, 2000, 2400],
        labels=time_blocks_order,
        right=False
    )

    # Map time block categories to numerical values
    block_num = {
        'Early Morning & Late Night': 1,
        'Morning': 2,
        'Afternoon': 3,
        'Evening': 4,
        'Night': 5
    }
    data['PART_OF_DAY'] = data['PART_OF_DAY'].map(block_num)
    data[['DEP_TIME_BLK', 'PART_OF_DAY']].head()

    # Prepare X (features) and y (target) for training
    X = data[["PRCP", "AWND", "SNOW", "SNWD", "SEGMENT_NUMBER", "PART_OF_DAY"]].to_numpy()
    y = data["DEP_DEL15"].to_numpy()

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Standardize features using StandardScaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Save preprocessed data and scaler for future use
    joblib.dump(scaler, '../trained/scaler.pkl')
    
    # Save the test set for evaluation
    test_data = pd.DataFrame(X_test_scaled, columns=["PRCP", "AWND", "SNOW", "SNWD", "SEGMENT_NUMBER", "PART_OF_DAY"])
    test_data['DEP_DEL15'] = y_test  # Add the target variable back to the test data
    test_data.to_csv('../CSV/evaluation_data.csv', index=False)  # Save to CSV
    
    # Train Random Forest Classifier
    rf_model = RandomForestClassifier(random_state=42)
    rf_model.fit(X_train_scaled, y_train)
    y_pred_rf = rf_model.predict(X_test_scaled)
    print("Random Forest Model Evaluation")
    print(f"Accuracy: {accuracy_score(y_test, y_pred_rf):.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred_rf))
    print("Classification Report:")
    print(classification_report(y_test, y_pred_rf))
    joblib.dump(rf_model, '../trained/random_forest_model.pkl')

    # Train Logistic Regression
    log_reg_model = LogisticRegression(random_state=42)
    log_reg_model.fit(X_train_scaled, y_train)
    y_pred_log_reg = log_reg_model.predict(X_test_scaled)
    print("Logistic Regression Model Evaluation")
    print(f"Accuracy: {accuracy_score(y_test, y_pred_log_reg):.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred_log_reg))
    print("Classification Report:")
    print(classification_report(y_test, y_pred_log_reg))
    joblib.dump(log_reg_model, '../trained/log_reg_model.pkl')

    # Train Gradient Boosting Classifier
    gb_model = GradientBoostingClassifier(random_state=42)
    gb_model.fit(X_train_scaled, y_train)
    y_pred_gb = gb_model.predict(X_test_scaled)
    print("Gradient Boosting Model Evaluation")
    print(f"Accuracy: {accuracy_score(y_test, y_pred_gb):.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred_gb))
    print("Classification Report:")
    print(classification_report(y_test, y_pred_gb))
    joblib.dump(gb_model, '../trained/gradient_boosting_model.pkl')

    print('Training Success')

preprocess_data()