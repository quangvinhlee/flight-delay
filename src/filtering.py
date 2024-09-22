import pandas as pd

data = pd.read_csv(r'C:\Users\valgo\Downloads\full_data_flightdelay.csv\full_data_flightdelay.csv')

print(data.head())

print(data.isnull().sum())

columns = [
    'MONTH', 'DAY_OF_WEEK', 'DEP_DEL15', 'DEP_TIME_BLK', 'DISTANCE_GROUP',
    'SEGMENT_NUMBER', 'CONCURRENT_FLIGHTS', 'NUMBER_OF_SEATS', 'CARRIER_NAME',
    'AIRPORT_FLIGHTS_MONTH', 'AIRLINE_FLIGHTS_MONTH', 'AIRLINE_AIRPORT_FLIGHTS_MONTH',
    'AVG_MONTHLY_PASS_AIRPORT', 'AVG_MONTHLY_PASS_AIRLINE', 'FLT_ATTENDANTS_PER_PASS',
    'GROUND_SERV_PER_PASS', 'PLANE_AGE', 'DEPARTING_AIRPORT', 'PREVIOUS_AIRPORT',
    'PRCP', 'SNOW', 'SNWD', 'TMAX', 'AWND'
]

data = data[columns]

print(data.head())

data.dropna(inplace=True)

print(data.head())

data.to_csv(r'C:\Users\valgo\Downloads\processed_data.csv', index=False)
