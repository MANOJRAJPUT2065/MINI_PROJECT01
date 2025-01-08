from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import logging

# Paths for the model and encoder directory
MODEL_PATH = 'E:\\JAIMATADI\\healthcare-system\\healthcare-system\\python\\model\\fraud_detection_model.pkl'
ENCODER_DIR = 'E:\\JAIMATADI\\healthcare-system\\healthcare-system\\python\\model\\encoders'

# Initialize Flask app
app = Flask(__name__)

# Set up logging configuration
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Load the trained model and encoders
try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)

    if not os.path.exists(ENCODER_DIR):
        raise FileNotFoundError(f"Encoder directory not found at {ENCODER_DIR}")
    
    # Load encoders for categorical features
    diagnosis_encoder = joblib.load(os.path.join(ENCODER_DIR, 'DiagnosisCode_encoder.pkl'))
    treatment_encoder = joblib.load(os.path.join(ENCODER_DIR, 'TreatmentCode_encoder.pkl'))
    is_duplicate_encoder = joblib.load(os.path.join(ENCODER_DIR, 'IsDuplicate_encoder.pkl'))
    
    logging.info("Model and encoders loaded successfully.")
except FileNotFoundError as e:
    logging.error(f"Error loading files: {e}")
    exit(1)

# Function to safely transform categorical features, handling unseen labels
def safe_transform(encoder, value):
    try:
        if value == 'Unknown':
            return 0  # Using 0 as a default for 'Unknown', modify this as needed
        else:
            if value in encoder.classes_:
                return encoder.transform([value])[0]
            else:
                logging.warning(f"Unseen label: '{value}' found for encoder '{encoder.__class__.__name__}'")
                return encoder.transform([encoder.classes_[0]])[0]
    except Exception as e:
        logging.error(f"Error transforming value '{value}' with encoder '{encoder.__class__.__name__}': {str(e)}")
        raise ValueError(f"Error transforming value '{value}' with encoder '{encoder.__class__.__name__}': {str(e)}")

# Define the root route for the home page
@app.route('/')
def home():
    return "Welcome to the Fraud Detection API!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from request
        data = request.get_json()

        # Log the incoming data
        logging.debug(f"Received data: {data}")

        # Extract the features from the incoming data
        doctor_name = data.get('doctorName', 'Unknown')
        doctor_id = data.get('doctorId', 0)  # Assuming doctor_id is numeric
        patient_name = data.get('patientName', 'Unknown')
        patient_id = data.get('patientId', 0)  # Assuming patient_id is numeric
        diagnosis = data.get('DiagnosisCode', 'Unknown')
        treatment = data.get('TreatmentCode', 'Unknown')
        claim_amount = data.get('ClaimAmount', 0)
        expected_amount = data.get('ExpectedAmount', 0)
        is_duplicate = data.get('IsDuplicate', 'Unknown')
        claim_frequency_patient = data.get('ClaimFrequencyPatient', 0)
        claim_frequency_doctor = data.get('ClaimFrequencyDoctor', 0)
        wallet_address = data.get('walletAddress', 'Unknown')
        description = data.get('description', 'Unknown')

        # Log the extracted features
        logging.debug(f"Extracted features: {doctor_name}, {doctor_id}, {patient_name}, {patient_id}, {diagnosis}, {treatment}, {claim_amount}, {expected_amount}, {is_duplicate}, {claim_frequency_patient}, {claim_frequency_doctor}, {wallet_address}, {description}")

        # Transform categorical features using the safe transform method
        features = np.array([[
            safe_transform(diagnosis_encoder, diagnosis),
            safe_transform(treatment_encoder, treatment),
            safe_transform(is_duplicate_encoder, is_duplicate),
            claim_amount,  # Use numeric feature directly
            expected_amount,  # Add ExpectedAmount as a feature
            claim_frequency_patient,  # Add ClaimFrequencyPatient as a feature
            claim_frequency_doctor,  # Add ClaimFrequencyDoctor as a feature
            safe_transform(diagnosis_encoder, doctor_name),  # Transform doctor_name
            doctor_id,  # Keep doctor_id as numeric
            safe_transform(treatment_encoder, patient_name),  # Transform patient_name
            patient_id,  # Keep patient_id as numeric
            safe_transform(is_duplicate_encoder, wallet_address),  # Transform wallet_address
            safe_transform(is_duplicate_encoder, description)  # Transform description
        ]])

        # Log the transformed features
        logging.debug(f"Transformed features: {features}")

        # Get prediction from the model
        prediction = model.predict(features)

        # Log the prediction
        logging.info(f"Prediction result: {prediction}")

        # Return the prediction as a response
        return jsonify({'fraud': bool(prediction[0])})  # Convert to boolean for clarity

    except ValueError as e:
        logging.error(f"ValueError: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
