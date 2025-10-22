## Python Fraud Detection Service (Flask)

- Port: 5001
- Endpoint: POST /predict

Body example:
```json
{
  "DiagnosisCode": "A01",
  "TreatmentCode": "T01",
  "IsDuplicate": "Unknown",
  "ClaimAmount": 1200
}
```

Response:
```json
{ "fraud": false }
```

Start:
```bash
cd python
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Note: Update model paths in `python/app.py` if running outside original Windows path.
