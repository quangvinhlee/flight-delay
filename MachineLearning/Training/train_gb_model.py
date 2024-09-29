import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

print('Start Training!')
data = np.load('../TrainedModel/preprocessed_data.npz')
X_train_scaled = data['X_train']
X_test_scaled = data['X_test']
y_train = data['y_train']
y_test = data['y_test']

scaler = joblib.load('../TrainedModel/scaler.pkl')

gb_model = GradientBoostingClassifier(random_state=42)
gb_model.fit(X_train_scaled, y_train)

y_pred = gb_model.predict(X_test_scaled)
print("Gradient Boosting Model Evaluation")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("Classification Report:")
print(classification_report(y_test, y_pred))

print('Training Success')
joblib.dump(gb_model, '../TrainedModel/gradient_boosting_model.pkl')
