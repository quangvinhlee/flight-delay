# data_preprocessing.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

def preprocess_data(file_path, sample_num=None):
    data = pd.read_csv(file_path)

    if sample_num:
        data = data.sample(n=sample_num, random_state=42).reset_index(drop=True)

    columns = [
        'MONTH', 'DAY_OF_WEEK', 'DEP_DEL15', 'DEP_TIME_BLK', 'DISTANCE_GROUP',
        'SEGMENT_NUMBER', 'CONCURRENT_FLIGHTS', 'NUMBER_OF_SEATS', 'CARRIER_NAME',
        'AIRPORT_FLIGHTS_MONTH', 'AIRLINE_FLIGHTS_MONTH', 'AIRLINE_AIRPORT_FLIGHTS_MONTH',
        'AVG_MONTHLY_PASS_AIRPORT', 'AVG_MONTHLY_PASS_AIRLINE', 'FLT_ATTENDANTS_PER_PASS',
        'GROUND_SERV_PER_PASS', 'PLANE_AGE', 'DEPARTING_AIRPORT', 'PREVIOUS_AIRPORT',
        'PRCP', 'SNOW', 'SNWD', 'TMAX', 'AWND'
    ]
    data = data[columns]

    data.dropna(inplace=True)

    duplicate_rows = data.duplicated()
    print(f"Number of duplicate rows: {duplicate_rows.sum()}")
    data.drop_duplicates(inplace=True)
    print(f"Number of duplicate rows after removal: {data.duplicated().sum()}")

    time_blocks_order = [
        'Early Morning & Late Night',  # 0001-0559
        'Morning',                      # 0600-1159
        'Afternoon',                    # 1200-1659
        'Evening',                      # 1700-1959
        'Night'                         # 2000-2359
    ]

    data['PART_OF_DAY'] = pd.cut(
        data['DEP_TIME_BLK'].map(lambda x: int(x.split('-')[0])),
        bins=[0, 600, 1200, 1700, 2000, 2400],
        labels=time_blocks_order,
        right=False
    )

    block_num = {
    'Early Morning & Late Night': 1,
    'Morning' : 2,
    'Afternoon' : 3,
    'Evening' : 4,
    'Night' : 5
    }
    data['PART_OF_DAY'] = data['PART_OF_DAY'].map(block_num)
    data[['DEP_TIME_BLK' ,'PART_OF_DAY']].head()

    X = data[["PRCP", "AWND", "SNOW", "SNWD", "SEGMENT_NUMBER", "PART_OF_DAY"]].to_numpy()
    
    y = data["DEP_DEL15"].to_numpy()

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    np.savez('../TrainedModel/preprocessed_data.npz', X_train=X_train_scaled, X_test=X_test_scaled, y_train=y_train, y_test=y_test)
    joblib.dump(scaler, '../TrainedModel/scaler.pkl')

    print("Training Features:")
    print(X_train.shape[1])  

    print("Test Features:")
    print(X_test.shape[1])    

    print('Preprocessing success')

preprocess_data('../CSV/full_data_flightdelay.csv', sample_num=1_000_000)
