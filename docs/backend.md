## Backend (Node.js/Express)

- Port: 5000 (default)
- Start: npm run dev
- Base URL: http://localhost:5000

### Environment
Set in .env
- MONGO_URI
- JWT_SECRET
- EMAIL_USER, EMAIL_PASS
- CLOUD_NAME, API_KEY, API_SECRET
- PINATA_API_KEY, PINATA_SECRET_API_KEY
- GEMINI_API_KEY
- CLIENT_URL (for reset password)

### Routes (mounted under server.js)
- /api/auth: register, login, logout, forgot-password, reset-password
- /api/user: GET /profile, PUT /user/profile (auth)
- /api/contact: POST /send
- /api/chatbot: POST /send
- /api/: POST /upload, POST /upload-report, GET /reports
- /api/claims: doctor claim submit (multer); rejected, dispute/:claimId, analytics
- /api/reports: POST /generate, POST /send-email
- /api/users: admin CRUD and logs (JWT + admin)
- /api/compliance: GET /, POST /
- /api/activity-logs: GET /, POST /
- /api/insurance: GET /:claimId
- /api/claim-history: GET /history
- /api/claim-tracker: GET /:claimId
- /api/quote: POST /get-quote
- /api/_claims: POST /submit (blockchain + DB)
- /api/claims/approved: POST /approve
- /api/claims/pending: GET /pending, POST /validate/:claimId, POST /claims/upload-report, GET /claim/:claimId, POST /review/:claimId
- /api/reviewclaims: POST /review/:claimId

### Start
```bash
cd backend
npm install
npm run dev
```

