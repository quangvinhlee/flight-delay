import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

print('Start Training!')

# Load preprocessed data from the .npz file
data = np.load('../TrainedModel/preprocessed_data.npz')
X_train_scaled = data['X_train']  # Scaled training features
X_test_scaled = data['X_test']      # Scaled testing features
y_train = data['y_train']            # Training labels
y_test = data['y_test']              # Testing labels

# Load the scaler (although it seems unnecessary since the data is already scaled)
scaler = joblib.load('../TrainedModel/scaler.pkl')

# Initialize the Gradient Boosting Classifier
gb_model = GradientBoostingClassifier(random_state=42)

# Fit the model to the training data
gb_model.fit(X_train_scaled, y_train)

# Make predictions on the test set
y_pred = gb_model.predict(X_test_scaled)

# Evaluate the model's performance
print("Gradient Boosting Model Evaluation")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("Classification Report:")
print(classification_report(y_test, y_pred))

# Indicate successful training
print('Training Success')

# Save the trained model to a file for future use
joblib.dump(gb_model, '../TrainedModel/gradient_boosting_model.pkl')
