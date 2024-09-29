# **Flight Delay Prediction**

## **Project Overview**
This project predicts flight delays using weather, flight, and airport-related features. The pipeline includes data preprocessing, training a model (e.g., Random Forest), and predicting flight delays on new data.

---

## **1. Environment Setup**

We use `pip` to install dependencies. Follow the steps below to set up the environment.

### Upgrade pip
```bash 
pip install --upgrade pip
```

### Install Required Libraries
```bash
pip install pandas numpy scikit-learn joblib
```
## **2. Data Preprocessing**
The script data_preprocessing.py loads the flight delay dataset, cleans it, and prepares it for model training. It handles missing values, duplicates, and generates time-related features from the departure time.

### Steps for Preprocessing
1. Modify the input file path in the preprocess_data() function within data_preprocessing.py to point to your dataset (CSV file). (Optional you dont need change when use our dataset)
2. Run the preprocessing script:
```bash
cd training
python data_preprocessing.py 
```
The processed data will be saved in the `../TrainedModel` directory as `preprocessed_data.npz`.
The data scaler will be saved as `scaler.pkl`.

## **3. Training the Model**
After preprocessing the data, train a machine learning model. The provided script uses a Random Forest classifier.

### Training Steps:
1. Ensure that you have completed the preprocessing step by running the `data_preprocessing.py` script.
2. You can train the models using the following commands:

#### Train the Random Forest Model:
```bash
cd training
python train_rf_model.py
```
- The Random Forest model will be trained with the preprocessed data and evaluated on a test set.
- This will print the accuracy score, confusion matrix, and classification report.
- The trained model will be saved as `random_forest_model.pkl` in the `../TrainedModel` folder.

#### Train the Gradient Boosting Model:
```bash
cd training
python train_rf_model.py
```
- The Gradient Boosting model will be trained similarly using the preprocessed data.
- The script will output the accuracy score, confusion matrix, and classification report.
- The trained model will be saved as `gradient_boosting_model.pkl` in the `../TrainedModel` folder.

#### Train the Random Forest Model:
```bash
cd training
python train_log_reg_model.py
```
- The Logistic Regression model will be trained with the same preprocessed data.
- You will see the accuracy score, confusion matrix, and classification report after training.
- The trained model will be saved as `log_reg_model.pkl` in the `../TrainedModel` folder.

Each model can then be used for predictions based on your choice in the `test_prediction.py` script. Simply specify the model when calling the prediction function.

## **4. Making Predictions**
To make predictions on new flight data, use the predict_on_new_data() function from predict.py. You can choose from different trained models (Random Forest, Logistic Regression, Gradient Boosting).

###Steps for Prediction:
1. Open test_prediction.py file.
2. Choose the desired model for prediction by uncommenting the corresponding line of code at the end of the predict.py file:
        - 'random_forest' for Random Forest,
        - 'log_reg' for Logistic Regression,
        - 'gradient_boosting' for Gradient Boosting.
```bash
# Example usage:
# predict_on_new_data('../CSV/test_flight_data_100_rows.csv', model_choice='random_forest')
# predict_on_new_data('../CSV/test_flight_data_100_rows.csv', model_choice='log_reg')
# predict_on_new_data('../CSV/test_flight_data_100_rows.csv', model_choice='gradient_boosting')
```
3.The script is set up to use the provided test dataset (test_flight_data_100_rows.csv), which contains 100 rows of sample data. If you'd like to use your own dataset, simply replace the filename (test_flight_data_100_rows.csv) with the path to your custom CSV file.
4. Once you have uncommented the line corresponding to your desired model, save the file and run the prediction script:
```bash
cd training
python test_prediction.py
```
- The predictions will be saved in the `../Result` directory as a CSV file named `test_predictions_<model_choice>.csv`.

## **5. File Structure**
MachineLearning/
│
├── CSV/
│   └── full_data_flightdelay.csv         # Input training data
│   └── test_flight_data_100_rows.csv     # Input test data
│
├── TrainedModel/
│   └── preprocessed_data.npz             # Preprocessed data
│   └── scaler.pkl                        # Scaler for feature normalization
│   └── random_forest_model.pkl           # Trained model
│   └── .....                             # Other models
├── Result/
│   └── test_predictions_random_forest.csv # Output predictions
│   └── .....                              # Other results
├── data_preprocessing.py                  # Data preprocessing script
├── train_rf_model.py                      # Model training script
└── test.predict.py                        # Prediction script
└──  .....                                 # Other model training

## **6. Notes**
-Ensure that the input CSV files match the expected format as per the preprocessing script.
-Adjust the sample size in `preprocess_data()` for faster execution during testing.


This `README.md` should help users understand how to configure the environment, preprocess data, train the model, and make predictions.
