# import os
# import joblib
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.model_selection import train_test_split, GridSearchCV
# from sklearn.metrics import classification_report
# from sklearn.impute import SimpleImputer
# from sklearn.preprocessing import LabelEncoder
# from imblearn.over_sampling import SMOTE
# import pandas as pd
# import numpy as np

# # Dataset file path
# file_path = 'E:\\JAIMATADI\\healthcare-system\\healthcare-system\\python\\datasets\\Fraud_Detection_Dataset.csv'

# # Load the dataset
# data = pd.read_csv(file_path)

# # Check for missing values
# print("Missing values in dataset:\n", data.isnull().sum())

# # Handle missing values for numerical and categorical columns
# num_cols = data.select_dtypes(include=['float64', 'int64']).columns
# cat_cols = data.select_dtypes(include=['object']).columns

# imputer_num = SimpleImputer(strategy='mean')  # Mean for numerical columns
# imputer_cat = SimpleImputer(strategy='most_frequent')  # Most frequent for categorical columns

# data[num_cols] = imputer_num.fit_transform(data[num_cols])
# data[cat_cols] = imputer_cat.fit_transform(data[cat_cols])

# # Ensure 'IsFraudulent' column is integer (binary 0/1)
# data['IsFraudulent'] = data['IsFraudulent'].astype(int)

# # Drop unnecessary columns
# X = data.drop(columns=['ClaimID', 'IsFraudulent', 'ReportCID'], errors='ignore')

# # Encode categorical columns
# encoders = {}
# for column in ['DiagnosisCode', 'TreatmentCode', 'IsDuplicate']:
#     if column in X.columns:
#         encoder = LabelEncoder()
#         X[column] = encoder.fit_transform(X[column])
#         encoders[column] = encoder  # Save encoder for deployment

# # Save encoders
# encoder_dir = 'model/encoders/'
# os.makedirs(encoder_dir, exist_ok=True)
# for col, enc in encoders.items():
#     joblib.dump(enc, os.path.join(encoder_dir, f"{col}_encoder.pkl"))

# # Target variable
# y = data['IsFraudulent']

# # Check for class imbalance
# print("Class distribution:\n", y.value_counts())

# # Handle imbalance using SMOTE (Synthetic Minority Oversampling Technique)
# smote = SMOTE(random_state=42)
# X_resampled, y_resampled = smote.fit_resample(X, y)
# print("Class distribution after SMOTE:\n", pd.Series(y_resampled).value_counts())

# # Split data into training and test sets
# X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# # Initialize RandomForestClassifier with class_weight='balanced'
# model = RandomForestClassifier(random_state=42, class_weight='balanced')

# # Hyperparameter tuning with GridSearchCV
# param_grid = {
#     'n_estimators': [100, 200, 300],
#     'max_depth': [10, 20, 30, None],
#     'min_samples_split': [2, 5, 10],
#     'min_samples_leaf': [1, 2, 4],
#     'max_features': ['sqrt', 'log2', None]
# }

# grid_search = GridSearchCV(estimator=model,
#                            param_grid=param_grid,
#                            cv=5,
#                            scoring='f1',  # Use F1-score for imbalance
#                            n_jobs=-1,
#                            verbose=2)

# # Fit the grid search to find the best model
# grid_search.fit(X_train, y_train)

# # Get the best model
# best_model = grid_search.best_estimator_

# # Evaluate the best model
# y_pred = best_model.predict(X_test)
# print("Classification Report:\n", classification_report(y_test, y_pred))

# # Ensure the directory exists
# model_dir = 'model/'
# os.makedirs(model_dir, exist_ok=True)

# # Save the trained model
# model_file_path = os.path.join(model_dir, 'fraud_detection_model.pkl')
# joblib.dump(best_model, model_file_path)

# print(f"Model training complete and saved as {model_file_path}")






# import os
# import joblib
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.model_selection import train_test_split, GridSearchCV
# from sklearn.metrics import classification_report, roc_auc_score
# from sklearn.impute import SimpleImputer
# from sklearn.preprocessing import LabelEncoder
# from imblearn.over_sampling import SMOTE
# import pandas as pd
# import numpy as np
# import matplotlib.pyplot as plt

# # Dataset file path
# file_path = 'E:\\JAIMATADI\\healthcare-system\\healthcare-system\\python\\datasets\\Large_Fraud_Detection_Dataset.csv'

# # Load the dataset
# data = pd.read_csv(file_path)

# # Print column names to check for 'IsFraudulent' and other issues
# print("Column names in dataset:\n", data.columns)

# # Strip any leading/trailing spaces from column names
# data.columns = data.columns.str.strip()

# # Check for missing values
# print("Missing values in dataset:\n", data.isnull().sum())

# # Handle missing values for numerical and categorical columns
# num_cols = data.select_dtypes(include=['float64', 'int64']).columns
# cat_cols = data.select_dtypes(include=['object']).columns

# imputer_num = SimpleImputer(strategy='mean')  # Mean for numerical columns
# imputer_cat = SimpleImputer(strategy='most_frequent')  # Most frequent for categorical columns

# data[num_cols] = imputer_num.fit_transform(data[num_cols])
# data[cat_cols] = imputer_cat.fit_transform(data[cat_cols])

# # Ensure 'isFraudulent' column is integer (binary 0/1), and check if it exists
# if 'isFraudulent' in data.columns:
#     data['isFraudulent'] = data['isFraudulent'].astype(int)
# else:
#     print("isFraudulent column not found")

# # Drop unnecessary columns
# X = data.drop(columns=['ClaimID', 'isFraudulent', 'reportCID'], errors='ignore')

# # Encode categorical columns using Label Encoding or One-Hot Encoding
# encoders = {}
# for column in cat_cols:
#     if column in X.columns:
#         encoder = LabelEncoder()
#         X[column] = encoder.fit_transform(X[column])
#         encoders[column] = encoder  # Save encoder for deployment

# # Save encoders
# encoder_dir = os.path.join('model', 'encoders')
# os.makedirs(encoder_dir, exist_ok=True)
# for col, enc in encoders.items():
#     joblib.dump(enc, os.path.join(encoder_dir, f"{col}_encoder.pkl"))

# # Set 'isFraudulent' as the target variable
# y = data['isFraudulent']

# # Check for class imbalance
# print("Class distribution:\n", y.value_counts())

# # Handle imbalance using SMOTE (Synthetic Minority Oversampling Technique)
# smote = SMOTE(random_state=42)
# X_resampled, y_resampled = smote.fit_resample(X, y)
# print("Class distribution after SMOTE:\n", pd.Series(y_resampled).value_counts())

# # Split data into training, validation, and test sets
# X_train, X_temp, y_train, y_temp = train_test_split(X_resampled, y_resampled, test_size=0.3, random_state=42)
# X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# # Initialize RandomForestClassifier with class_weight='balanced'
# model = RandomForestClassifier(random_state=42, class_weight='balanced')

# # Hyperparameter tuning with GridSearchCV
# param_grid = {
#     'n_estimators': [100, 200, 300],
#     'max_depth': [10, 20, 30, None],
#     'min_samples_split': [2, 5, 10],
#     'min_samples_leaf': [1, 2, 4],
#     'max_features': ['sqrt', 'log2', None]
# }

# grid_search = GridSearchCV(estimator=model,
#                           param_grid=param_grid,
#                           cv=5,
#                           scoring='f1',  # Use F1-score for imbalance
#                           n_jobs=-1,
#                           verbose=2)

# # Fit the grid search to find the best model
# grid_search.fit(X_train, y_train)

# # Get the best model
# best_model = grid_search.best_estimator_

# # Evaluate the model on validation data
# y_val_pred = best_model.predict(X_val)
# val_roc_auc = roc_auc_score(y_val, best_model.predict_proba(X_val)[:, 1])
# print("Validation ROC-AUC Score:", val_roc_auc)
# print("Validation Classification Report:\n", classification_report(y_val, y_val_pred))

# # Final evaluation on test data
# y_test_pred = best_model.predict(X_test)
# test_roc_auc = roc_auc_score(y_test, best_model.predict_proba(X_test)[:, 1])
# print("Test ROC-AUC Score:", test_roc_auc)
# print("Test Classification Report:\n", classification_report(y_test, y_test_pred))

# # Save the trained model
# model_dir = 'model'
# os.makedirs(model_dir, exist_ok=True)
# model_file_path = os.path.join(model_dir, 'fraud_detection_model.pkl')
# joblib.dump(best_model, model_file_path)

# print(f"Model training complete and saved as {model_file_path}")

# # Feature importance analysis
# importances = best_model.feature_importances_
# features = X.columns
# importance_df = pd.DataFrame({'Feature': features, 'Importance': importances}).sort_values(by='Importance', ascending=False)

# # Plot feature importances
# plt.figure(figsize=(10, 6))
# plt.barh(importance_df['Feature'], importance_df['Importance'], color='skyblue')
# plt.xlabel("Importance")
# plt.ylabel("Feature")
# plt.title("Feature Importance")
# plt.gca().invert_yaxis()
# plt.tight_layout()
# plt.savefig(os.path.join(model_dir, 'feature_importance.png'))
# plt.show()

# # Save feature importance
# importance_df.to_csv(os.path.join(model_dir, 'feature_importance.csv'), index=False)
# print("Feature importance analysis saved.")


import os
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Dataset file path
file_path = 'E:\\JAIMATADI\\healthcare-system\\healthcare-system\\python\\datasets\\Updated_Fraud_Detection_Dataset.csv'

# Load the dataset
data = pd.read_csv(file_path)

# Strip any leading/trailing spaces from column names
data.columns = data.columns.str.strip()

# Check for missing values
print("Missing values in dataset:\n", data.isnull().sum())

# Handle missing values for numerical and categorical columns
num_cols = data.select_dtypes(include=['float64', 'int64']).columns
cat_cols = data.select_dtypes(include=['object']).columns

imputer_num = SimpleImputer(strategy='mean')  # Mean for numerical columns
imputer_cat = SimpleImputer(strategy='most_frequent')  # Most frequent for categorical columns

data[num_cols] = imputer_num.fit_transform(data[num_cols])
data[cat_cols] = imputer_cat.fit_transform(data[cat_cols])

# Ensure 'isFraudulent' column is integer (binary 0/1), and check if it exists
if 'isFraudulent' in data.columns:
    data['isFraudulent'] = data['isFraudulent'].astype(int)
else:
    print("isFraudulent column not found")

# Drop unnecessary columns
X = data.drop(columns=['ClaimID', 'isFraudulent', 'reportCID'], errors='ignore')

# Encode categorical columns using Label Encoding or One-Hot Encoding
encoders = {}
for column in cat_cols:
    if column in X.columns:
        encoder = LabelEncoder()
        X[column] = encoder.fit_transform(X[column].astype(str))  # Convert categories to strings before encoding
        encoders[column] = encoder  # Save encoder for deployment

# Save encoders
encoder_dir = os.path.join('model', 'encoders')
os.makedirs(encoder_dir, exist_ok=True)
for col, enc in encoders.items():
    joblib.dump(enc, os.path.join(encoder_dir, f"{col}_encoder.pkl"))

# Set 'isFraudulent' as the target variable
y = data['isFraudulent']

# Check for class imbalance
print("Class distribution:\n", y.value_counts())

# Handle imbalance using SMOTE (Synthetic Minority Oversampling Technique)
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)
print("Class distribution after SMOTE:\n", pd.Series(y_resampled).value_counts())

# Split data into training, validation, and test sets
X_train, X_temp, y_train, y_temp = train_test_split(X_resampled, y_resampled, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# Initialize RandomForestClassifier with class_weight='balanced'
model = RandomForestClassifier(random_state=42, class_weight='balanced')

# Hyperparameter tuning with GridSearchCV
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2', None]
}

grid_search = GridSearchCV(estimator=model,
                          param_grid=param_grid,
                          cv=5,
                          scoring='f1',  # Use F1-score for imbalance
                          n_jobs=-1,
                          verbose=2)

# Fit the grid search to find the best model
grid_search.fit(X_train, y_train)

# Get the best model
best_model = grid_searc.best_estimator_

# Evaluate the model on validation data
y_val_pred = best_model.predict(X_val)
val_roc_auc = roc_auc_score(y_val, best_model.predict_proba(X_val)[:, 1])
print("Validation ROC-AUC Score:", val_roc_auc)
print("Validation Classification Report:\n", classification_report(y_val, y_val_pred))

# Final evaluation on test data
y_test_pred = best_model.predict(X_test)
test_roc_auc = roc_auc_score(y_test, best_model.predict_proba(X_test)[:, 1])
print("Test ROC-AUC Score:", test_roc_auc)
print("Test Classification Report:\n", classification_report(y_test, y_test_pred))

# Save the trained model
model_dir = 'model'
os.makedirs(model_dir, exist_ok=True)
model_file_path = os.path.join(model_dir, 'fraud_detection_model.pkl')
joblib.dump(best_model, model_file_path)

print(f"Model training complete and saved as {model_file_path}")

# Feature importance analysis
importances = best_model.feature_importances_
features = X.columns
importance_df = pd.DataFrame({'Feature': features, 'Importance': importances}).sort_values(by='Importance', ascending=False)

# Plot feature importances
plt.figure(figsize=(10, 6))
plt.barh(importance_df['Feature'], importance_df['Importance'], color='skyblue')
plt.xlabel("Importance")
plt.ylabel("Feature")
plt.title("Feature Importance")
plt.gca().invert_yaxis()
plt.tight_layout()
plt.savefig(os.path.join(model_dir, 'feature_importance.png'))
plt.show()

# Save feature importance
importance_df.to_csv(os.path.join(model_dir, 'feature_importance.csv'), index=False)
print("Feature importance analysis saved.")
