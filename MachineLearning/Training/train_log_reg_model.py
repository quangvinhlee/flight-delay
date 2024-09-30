import numpy as np
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

print('Start Training!')

# Load preprocessed data from the .npz file
data = np.load('../TrainedModel/preprocessed_data.npz')
X_train_scaled = data['X_train']  # Scaled training features
X_test_scaled = data['X_test']      # Scaled testing features
y_train = data['y_train']            # Training labels
y_test = data['y_test']              # Testing labels

# Load the scaler (though it's not used in this case since data is already scaled)
scaler = joblib.load('../TrainedModel/scaler.pkl')

# Initialize the Logistic Regression model with a fixed random state for reproducibility
log_reg_model = LogisticRegression(random_state=42)

# Fit the model to the training data
log_reg_model.fit(X_train_scaled, y_train)

# Make predictions on the test set
y_pred_log_reg = log_reg_model.predict(X_test_scaled)

# Evaluate the model's performance
accuracy = accuracy_score(y_test, y_pred_log_reg)
conf_matrix = confusion_matrix(y_test, y_pred_log_reg)
class_report = classification_report(y_test, y_pred_log_reg)

# Print the evaluation results
print("Accuracy:", accuracy)
print("\nConfusion Matrix:\n", conf_matrix)
print("\nClassification Report:\n", class_report)

# Indicate successful training
print('Training Success')

# Save the trained model to a file for future use
joblib.dump(log_reg_model, '../TrainedModel/log_reg_model.pkl')
