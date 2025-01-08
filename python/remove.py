import pandas as pd
import re

# Dataset file path
file_path = 'E:\\JAIMATADI\\healthcare-system\\healthcare-system\\python\\datasets\\Cleaned_Fraud_Detection_Dataset.csv'

# Load the dataset
df = pd.read_csv(file_path)

# Replace all walletAddress values with the new one
df['walletAddress'] = '0xda9de3c6efa3d0721d80640a5ea690e716d16be9'

# Function to extract numeric part of doctorId and patientId
def extract_numeric_id(id_value):
    return ''.join(re.findall(r'\d', str(id_value)))

# Apply the function to convert doctorId and patientId to numeric values
df['doctorId'] = df['doctorId'].apply(extract_numeric_id)
df['patientId'] = df['patientId'].apply(extract_numeric_id)

# Save the updated dataset to a new CSV file
updated_file_path = 'E:\\JAIMATADI\\healthcare-system\\healthcare-system\\python\\datasets\\Updated_Fraud_Detection_Dataset.csv'
df.to_csv(updated_file_path, index=False)

print(f"Dataset updated successfully! The updated dataset is saved at: {updated_file_path}")
