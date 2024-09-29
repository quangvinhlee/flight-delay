import numpy as np
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

print('Start Training!')
data = np.load('../TrainedModel/preprocessed_data.npz')
X_train_scaled = data['X_train']
X_test_scaled = data['X_test']
y_train = data['y_train']
y_test = data['y_test']

scaler = joblib.load('../TrainedModel/scaler.pkl')


log_reg_model = LogisticRegression(random_state=42)
log_reg_model.fit(X_train_scaled, y_train)

y_pred_log_reg = log_reg_model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred_log_reg)
conf_matrix = confusion_matrix(y_test, y_pred_log_reg)
class_report = classification_report(y_test, y_pred_log_reg)

# Print the evaluation results
print("Accuracy:", accuracy)
print("\nConfusion Matrix:\n", conf_matrix)
print("\nClassification Report:\n", class_report)

print('Training Success')
# Save the trained model
joblib.dump(log_reg_model, '../TrainedModel/log_reg_model.pkl')
