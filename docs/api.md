## API Reference (summary)

Base URL: http://localhost:5000

- Auth (/api/auth)
  - POST /register
  - POST /login
  - POST /logout
  - POST /forgot-password
  - POST /reset-password

- Users (/api/user)
  - GET /profile (JWT)
  - PUT /user/profile (JWT)

- Contact (/api/contact)
  - POST /send

- Chatbot (/api/chatbot)
  - POST /send

- Uploads (/api)
  - POST /upload
  - POST /upload-report
  - GET /reports

- Claims
  - Patient submission (/api/_claims)
    - POST /submit
  - Doctor claim file upload (/api/claims)
    - POST /submit
  - Review claims (/api/reviewclaims)
    - POST /review/:claimId
  - Pending namespace (/api/claims/pending)
    - GET /pending
    - POST /validate/:claimId
    - POST /claims/upload-report
    - GET /claim/:claimId
    - POST /review/:claimId
  - Approved namespace (/api/claims/approved)
    - POST /approve
  - Rejections and analytics (/api/claims)
    - GET /rejected
    - POST /dispute/:claimId
    - GET /analytics

- Reports (/api/reports)
  - POST /generate
  - POST /send-email

- Insurance (/api/insurance)
  - GET /:claimId

- Claim Tracker (/api/claim-tracker)
  - GET /:claimId

- Claim History (/api/claim-history)
  - GET /history (query params supported)

- Patient Overview (/api/patient)
  - GET /claim-status-progress
  - GET /claim-submissions
  - GET /recent-activities
  - GET /notifications

- User Management (/api/users) [Admin]
  - POST /
  - PUT /:userId/role
  - PUT /:userId/deactivate
  - GET /
  - GET /activity-log

