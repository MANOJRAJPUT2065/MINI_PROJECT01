# Healthcare Insurance Claim System - Complete Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Patient    │  │    Doctor    │  │    Admin     │         │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication │ Claims │ Users │ Reports │ Compliance  │  │
│  │     JWT Auth    │ Mgmt   │ Mgmt  │  Gen    │   Tracking  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           ↓                  ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    MongoDB       │  │   Blockchain     │  │  Cloud Storage   │
│  ┌────────────┐  │  │  ┌────────────┐  │  │  ┌────────────┐  │
│  │   Users    │  │  │  │  Smart     │  │  │  │ Cloudinary │  │
│  │   Claims   │  │  │  │ Contract   │  │  │  │   IPFS     │  │
│  │   Reports  │  │  │  │ (Solidity) │  │  │  └────────────┘  │
│  └────────────┘  │  │  └────────────┘  │  └──────────────────┘
└──────────────────┘  └──────────────────┘
                              ↓
                      ┌──────────────────┐
                      │  Ganache/Hardhat │
                      │  (Test Network)  │
                      └──────────────────┘
```

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, gmail only),
  password: String (hashed),
  role: Enum ['patient', 'doctor', 'admin', 'insurance'],
  blockchainWallet: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Claim Model

```javascript
{
  _id: ObjectId,
  claimId: String (unique, blockchain hash),
  doctorName: String,
  patientName: String,
  doctorId: Number,
  patientId: Number,
  diagnosis: String,
  treatment: String,
  amount: Number,
  reportCID: String (IPFS hash),
  walletAddress: String,
  status: Enum ['pending', 'verified', 'approved', 'rejected', 'paid'],
  transactionHash: String,
  documents: [{
    fileUrl: String,
    ipfsHash: String,
    fileType: String
  }],
  auditTrail: [{
    action: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Report Model

```javascript
{
  _id: ObjectId,
  reportUrl: String (Cloudinary URL),
  publicId: String,
  createdAt: Date
}
```

### ActivityLog Model

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  action: String,
  timestamp: Date
}
```

### Compliance Model

```javascript
{
  _id: ObjectId,
  feature: String,
  description: String,
  isCompliant: Boolean,
  createdAt: Date
}
```

## 🔐 API Endpoints with Code

### 1. Authentication APIs

#### POST /api/auth/register

```javascript
// Register new user
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword, role, blockchainWallet } =
    req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid Gmail address" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    blockchainWallet,
  });
  const savedUser = await user.save();

  res
    .status(201)
    .json({ message: "User registered successfully", user: savedUser });
});
```

#### POST /api/auth/login

```javascript
// User login
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid Gmail address" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (user.role !== role) {
    return res.status(403).json({ message: "Role does not match" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token, user });
});
```

#### POST /api/auth/logout

```javascript
// User logout
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});
```

#### POST /api/auth/forgot-password

```javascript
// Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate reset token and send email
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Reset your password using this link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
  res.json({ message: "Password reset link sent to email" });
});
```

#### POST /api/auth/reset-password

```javascript
// Reset password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
```

### 2. Claim Management APIs

#### POST /api/\_claims/submit

```javascript
// Submit claim to blockchain
router.post("/submit", async (req, res) => {
  const {
    doctorName,
    patientName,
    doctorId,
    patientId,
    diagnosis,
    treatment,
    claimAmount,
    reportCID,
    walletAddress,
    description,
  } = req.body;

  // Validation
  if (
    !patientName ||
    !patientId ||
    !doctorId ||
    !diagnosis ||
    !treatment ||
    !claimAmount ||
    !reportCID ||
    !description
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (isNaN(claimAmount) || claimAmount <= 0) {
    return res.status(400).json({ error: "Invalid claim amount." });
  }

  if (!reportCID.startsWith("Qm")) {
    return res.status(400).json({ error: "Invalid report CID." });
  }

  // Generate unique claim ID
  const claimId = ethers.keccak256(
    ethers.toUtf8Bytes(`${Date.now()}-${patientId}`)
  );
  const claimAmountInWei = ethers.parseUnits(claimAmount.toString(), 18);

  // Submit to blockchain
  const tx = await contract.submitClaim(
    claimId,
    claimAmountInWei,
    description,
    doctorName,
    patientName,
    doctorId,
    patientId,
    diagnosis,
    treatment,
    reportCID
  );

  const receipt = await provider.waitForTransaction(tx.hash);

  if (receipt.status !== 1) {
    return res.status(500).json({ error: "Blockchain transaction failed." });
  }

  // Save to database
  const newClaim = new Claim({
    claimId,
    doctorName,
    patientName,
    doctorId,
    patientId,
    diagnosis,
    treatment,
    amount: parseFloat(claimAmount),
    reportCID,
    walletAddress,
    status: "pending",
    documents: [
      {
        fileUrl: `https://ipfs.io/ipfs/${reportCID}`,
        ipfsHash: reportCID,
        fileType: "pdf",
      },
    ],
  });

  const savedClaim = await newClaim.save();
  res.status(201).json({ message: "Claim submitted successfully", claimId });
});
```

#### GET /api/\_claims/status/:claimId

```javascript
// Get claim status
router.get("/status/:claimId", async (req, res) => {
  const { claimId } = req.params;

  const claim = await Claim.findOne({ claimId: claimId });

  if (!claim) {
    return res.status(404).json({ error: "Claim not found." });
  }

  res.status(200).json({ status: claim.status });
});
```

#### GET /api/\_claims/claims

```javascript
// Get all claims
router.get("/claims", async (req, res) => {
  const claims = await Claim.find();

  if (!claims.length) {
    return res.status(404).json({ message: "No claims found" });
  }

  const claimsWithDetails = claims.map((claim) => ({
    claimId: claim.claimId,
    doctorName: claim.doctorName,
    patientName: claim.patientName,
    doctorId: claim.doctorId,
    patientId: claim.patientId,
    diagnosis: claim.diagnosis,
    treatment: claim.treatment,
    amount: claim.amount,
    status: claim.status.trim(),
    submissionDate: claim.createdAt ? claim.createdAt.toISOString() : "N/A",
    transactionHash: claim.transactionHash || "N/A",
    documents: claim.documents,
  }));

  res.status(200).json(claimsWithDetails);
});
```

#### DELETE /api/\_claims/claims/:claimId

```javascript
// Delete claim
router.delete("/claims/:claimId", async (req, res) => {
  const { claimId } = req.params;

  const deletedClaim = await ClaimSubmission.findOneAndDelete({ claimId });

  if (!deletedClaim) {
    return res.status(404).json({ error: "Claim not found" });
  }

  res.status(200).json({ message: "Claim deleted successfully", deletedClaim });
});
```

#### POST /api/claims/approve

```javascript
// Approve claim
router.post("/approve", async (req, res) => {
  const { claimId, doctorId, approvalStatus } = req.body;

  if (!claimId || !doctorId || !approvalStatus) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const claimObjectId = new mongoose.Types.ObjectId(claimId);
  const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

  const claim = await Claim.findById(claimObjectId);
  if (!claim) {
    return res.status(404).json({ message: "Claim not found" });
  }

  if (!claim.doctorId.equals(doctorObjectId)) {
    return res
      .status(403)
      .json({ message: "Unauthorized to approve this claim" });
  }

  if (claim.status !== "pending") {
    return res.status(400).json({ message: "Claim is already processed" });
  }

  const approvalResult = await approveClaimOnBlockchain(
    claimId,
    approvalStatus
  );

  if (approvalResult.success) {
    claim.status = approvalStatus;
    claim.auditTrail.push({
      action: `Claim ${approvalStatus}`,
      timestamp: new Date().toLocaleString(),
    });

    await claim.save();
    return res
      .status(200)
      .json({ message: "Claim successfully approved", claim });
  }

  res.status(400).json({ message: "Error approving claim on blockchain" });
});
```

#### GET /api/claims/rejected

```javascript
// Get rejected claims
router.get("/rejected", async (req, res) => {
  const rejectedClaims = await Claim.find({ status: "rejected" });
  res.json(rejectedClaims);
});
```

#### POST /api/claims/dispute/:claimId

```javascript
// Dispute a rejected claim
router.post("/dispute/:claimId", async (req, res) => {
  const { claimId } = req.params;
  const { reason } = req.body;

  const claim = await Claim.findById(claimId);

  if (!claim) {
    return res.status(404).json({ message: "Claim not found" });
  }

  claim.status = "disputed";
  claim.disputeReason = reason;
  claim.auditTrail.push({
    action: "Claim disputed",
    timestamp: new Date().toLocaleString(),
  });

  await claim.save();
  res.json({ message: "Dispute submitted successfully", claim });
});
```

#### GET /api/claims/analytics

```javascript
// Get claim analytics
router.get("/analytics", async (req, res) => {
  const totalClaims = await Claim.countDocuments();
  const rejectedClaims = await Claim.countDocuments({ status: "rejected" });
  const approvedClaims = await Claim.countDocuments({ status: "approved" });
  const pendingClaims = await Claim.countDocuments({ status: "pending" });

  res.json({
    total: totalClaims,
    rejected: rejectedClaims,
    approved: approvedClaims,
    pending: pendingClaims,
    rejectionRate: ((rejectedClaims / totalClaims) * 100).toFixed(2),
  });
});
```

### 3. Claim Tracking APIs

#### GET /api/claim-tracker/:claimId

```javascript
// Track claim status
router.get("/:claimId", async (req, res) => {
  const { claimId } = req.params;

  const claim = await Claim.findOne({ claimId });

  if (!claim) {
    return res.status(404).json({ message: "Claim not found" });
  }

  res.json({
    claimId: claim.claimId,
    status: claim.status,
    patientName: claim.patientName,
    diagnosis: claim.diagnosis,
    amount: claim.amount,
    submissionDate: claim.createdAt,
    auditTrail: claim.auditTrail,
  });
});
```

#### GET /api/claim-history/history

```javascript
// Get claim history with filters
router.get("/history", async (req, res) => {
  const {
    patientName,
    provider,
    status,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
  } = req.query;

  let query = {};

  if (patientName) {
    query.patientName = new RegExp(patientName, "i");
  }
  if (provider) {
    query.provider = new RegExp(provider, "i");
  }
  if (status) {
    query.status = status.toLowerCase();
  }
  if (fromDate) {
    query.createdAt = { $gte: new Date(fromDate) };
  }
  if (toDate) {
    query.createdAt = { ...query.createdAt, $lte: new Date(toDate) };
  }
  if (minAmount) {
    query.amount = { $gte: parseFloat(minAmount) };
  }
  if (maxAmount) {
    query.amount = { ...query.amount, $lte: parseFloat(maxAmount) };
  }

  const claims = await Claim.find(query);
  res.json(claims);
});
```

### 4. Insurance Quote APIs

#### POST /api/quote/get-quote

```javascript
// Get insurance quote
router.post("/get-quote", (req, res) => {
  const { name, age, coverage } = req.body;

  const plans = {
    basic: {
      price: 100,
      coverage: "Essential coverage for common medical expenses.",
    },
    standard: {
      price: 200,
      coverage: "Comprehensive coverage for a wide range of medical needs.",
    },
    premium: {
      price: 300,
      coverage: "Exclusive coverage with enhanced benefits and services.",
    },
  };

  if (!name || !age || !coverage || !plans[coverage]) {
    return res.status(400).json({ message: "Missing or invalid data." });
  }

  let priceMultiplier = 1;
  if (age < 30) {
    priceMultiplier = 1.0;
  } else if (age >= 30 && age < 50) {
    priceMultiplier = 1.5;
  } else {
    priceMultiplier = 2.0;
  }

  const plan = plans[coverage];
  const quotePrice = plan.price * priceMultiplier;

  const quote = {
    name,
    age,
    coverage,
    coverageDescription: plan.coverage,
    price: quotePrice.toFixed(2),
  };

  res.status(200).json(quote);
});
```

#### GET /api/insurance/:claimId

```javascript
// Get insurance claim status
router.get("/:claimId", async (req, res) => {
  const { claimId } = req.params;

  const claim = await Claim.findOne({ claimId });

  if (!claim) {
    return res.status(404).json({ message: "Claim not found" });
  }

  res.json({
    claimId: claim.claimId,
    status: claim.status,
    amount: claim.amount,
    submissionDate: claim.createdAt,
  });
});
```

### 5. User Management APIs

#### POST /api/users

```javascript
// Create user (Admin only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Users({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  await newUser.save();

  const newUserManagement = new UserManagement({
    user: newUser._id,
    role: role || "user",
    isActive: true,
  });

  await newUserManagement.save();

  const activityLog = new ActivityLog({
    user: newUser._id,
    action: `User created: ${newUser.firstName} ${newUser.lastName}`,
  });
  await activityLog.save();

  res.status(201).json({ message: "User created successfully" });
});
```

#### GET /api/user/profile

```javascript
// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});
```

#### PUT /api/user/profile

```javascript
// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, email, blockchainWallet } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, blockchainWallet },
    { new: true }
  ).select("-password");

  res.json({ message: "Profile updated successfully", user: updatedUser });
});
```

### 6. Report Generation APIs

#### POST /api/reports/generate

```javascript
// Generate report
router.post("/generate", async (req, res) => {
  const { reportType, format } = req.body;

  if (!reportType || !format) {
    return res.status(400).json({ error: "Missing reportType or format" });
  }

  const claimsData = await Claim.find();

  let reportBuffer;

  if (format === "CSV") {
    const ws = xlsx.utils.json_to_sheet(claimsData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Claims Report");
    reportBuffer = xlsx.write(wb, { bookType: "csv", type: "buffer" });
  }

  if (format === "Excel") {
    const ws = xlsx.utils.json_to_sheet(claimsData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Claims Report");
    reportBuffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });
  }

  if (format === "PDF") {
    const doc = new PDFDocument();
    const buffer = [];
    doc.on("data", (chunk) => buffer.push(chunk));
    doc.on("end", () => (reportBuffer = Buffer.concat(buffer)));
    doc.fontSize(12).text("Claims Report", { align: "center" });
    claimsData.forEach((claim) => {
      doc.text(
        `Patient: ${claim.patientName}, Amount: ${claim.amount}, Status: ${claim.status}`
      );
    });
    doc.end();
  }

  res.setHeader(
    "Content-Type",
    format === "PDF" ? "application/pdf" : "application/octet-stream"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${reportType}_report.${format.toLowerCase()}"`
  );
  res.send(reportBuffer);
});
```

#### POST /api/reports/send-email

```javascript
// Send report via email
router.post("/send-email", async (req, res) => {
  const { reportType, format, email } = req.body;

  if (!email || !reportType || !format) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const reportBuffer = await generateReport(reportType, format);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${reportType} Report`,
    text: "Please find the attached report.",
    attachments: [
      {
        filename: `${reportType}_report.${format.toLowerCase()}`,
        content: reportBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
  res.json({ message: "Report sent successfully" });
});
```

### 7. Document Upload APIs

#### POST /api/upload-report

```javascript
// Upload report to Cloudinary
router.post("/upload-report", upload.single("report"), async (req, res) => {
  const stream = cloudinary.v2.uploader.upload_stream(
    { folder: "uploads/reports" },
    async (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const newReport = new Report({
        reportUrl: result.secure_url,
        publicId: result.public_id,
      });

      await newReport.save();
      res.json(newReport);
    }
  );
  stream.end(req.file.buffer);
});
```

#### GET /api/reports

```javascript
// Get all reports
router.get("/reports", async (req, res) => {
  const reports = await Report.find({});
  res.json(reports);
});
```

#### POST /api/upload

```javascript
// Upload image to Cloudinary
router.post("/upload", upload.single("file"), async (req, res) => {
  const stream = cloudinary.v2.uploader.upload_stream(
    { folder: "uploads/images" },
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(result);
    }
  );
  stream.end(req.file.buffer);
});
```

### 8. Chatbot & Communication APIs

#### POST /api/chatbot/send

```javascript
// Chatbot with Gemini AI
router.post("/send", async (req, res) => {
  const { question } = req.body;

  const creationQuestions = [
    "who created you",
    "who is your creator",
    "who made you",
  ];
  const botInfoQuestions = [
    "what is your role",
    "tell me about yourself",
    "who are you",
  ];

  const normalizedQuestion = question.toLowerCase();

  if (creationQuestions.some((q) => normalizedQuestion.includes(q))) {
    return res.json({ answer: "I was created by Manoj." });
  }

  if (botInfoQuestions.some((q) => normalizedQuestion.includes(q))) {
    return res.json({
      answer: "I'm your personal doctor created by Manoj and his team.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: question }] }],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  const answer =
    data.candidates[0]?.content?.parts[0]?.text || "Sorry, I didn't get that.";

  res.json({ answer });
});
```

#### POST /api/contact/send

```javascript
// Contact form
router.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Form Submission from ${name}`,
    text: message,
  };

  await transporter.sendMail(mailOptions);
  res.status(200).send("Message sent successfully!");
});
```

### 9. Compliance & Activity Log APIs

#### GET /api/compliance

```javascript
// Get compliance features
router.get("/", async (req, res) => {
  const complianceFeatures = await Compliance.find();
  res.json(complianceFeatures);
});
```

#### POST /api/compliance

```javascript
// Add compliance feature
router.post("/", async (req, res) => {
  const { feature, description, isCompliant } = req.body;

  const newCompliance = new Compliance({ feature, description, isCompliant });
  await newCompliance.save();

  res.status(201).json(newCompliance);
});
```

#### GET /api/activity-logs

```javascript
// Get activity logs
router.get("/", async (req, res) => {
  const activityLogs = await ActivityLog.find().sort({ timestamp: -1 });
  res.json(activityLogs);
});
```

#### POST /api/activity-logs

```javascript
// Create activity log
router.post("/", async (req, res) => {
  const { action, user } = req.body;

  const newLog = new ActivityLog({ action, user });
  await newLog.save();

  res.status(201).json(newLog);
});
```

### 10. Patient Dashboard APIs

#### GET /api/patient/claim-status-progress

```javascript
// Get claim status progress
router.get("/claim-status-progress", async (req, res) => {
  const data = (await ClaimStatus.find()) || [20, 40, 60, 80];
  res.status(200).json({ data });
});
```

#### GET /api/patient/claim-submissions

```javascript
// Get claim submissions
router.get("/claim-submissions", async (req, res) => {
  const data = (await ClaimSubmission.find()) || [3, 5, 2, 8, 6, 4];
  res.status(200).json({ data });
});
```

#### GET /api/patient/recent-activities

```javascript
// Get recent activities
router.get("/recent-activities", async (req, res) => {
  const data = (await RecentActivities.find()) || [
    { claimId: "1234", message: "Successfully submitted on 10/01/2024" },
    { claimId: "1235", message: "In progress, awaiting document verification" },
  ];
  res.status(200).json({ activities: data });
});
```

#### GET /api/patient/notifications

```javascript
// Get notifications
router.get("/notifications", async (req, res) => {
  const data = (await Notification.find()) || [
    { message: "You have a new update on claim #1234" },
    { message: "Your recent medical report has been updated" },
  ];
  res.status(200).json({ notifications: data });
});
```

## 🔄 System Workflow

### Claim Submission Workflow

```
1. Doctor/Patient Login
   ↓
2. Fill Claim Form (Patient Info, Diagnosis, Treatment, Amount)
   ↓
3. Upload Medical Report to IPFS
   ↓
4. Get IPFS CID
   ↓
5. Submit Claim to Smart Contract (Blockchain)
   ↓
6. Generate Unique Claim ID (keccak256 hash)
   ↓
7. Save Claim to MongoDB
   ↓
8. Transaction Hash Recorded
   ↓
9. Status: PENDING
```

### Claim Approval Workflow

```
1. Admin/Insurance Reviews Claim
   ↓
2. Verify Documents from IPFS
   ↓
3. Check Blockchain Record
   ↓
4. Approve/Reject Decision
   ↓
5. Update Smart Contract Status
   ↓
6. Update MongoDB Status
   ↓
7. Add to Audit Trail
   ↓
8. Send Notification to Patient
   ↓
9. Status: APPROVED/REJECTED
```

### Report Generation Workflow

```
1. User Requests Report (CSV/Excel/PDF)
   ↓
2. Fetch Claims Data from MongoDB
   ↓
3. Generate Report in Selected Format
   ↓
4. Option 1: Download Report
   ↓
5. Option 2: Email Report to User
```

## 🔐 Smart Contract (Solidity)

```solidity
contract InsuranceClaim {
    struct Claim {
        uint256 claimId;
        address claimant;
        uint256 amount;
        string description;
        ClaimDetails details;
        ClaimStatus status;
        uint256 timestamp;
    }

    struct ClaimDetails {
        string doctorName;
        string patientName;
        uint256 doctorId;
        uint256 patientId;
        string diagnosis;
        string treatment;
        string reportCID;
    }

    enum ClaimStatus { Pending, Verified, Approved, Rejected, Paid }

    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public claimantClaims;

    function submitClaim(...) public { }
    function approveClaim(uint256 claimId) public onlyAdmin { }
    function rejectClaim(uint256 claimId, string memory reason) public onlyAdmin { }
    function payClaim(uint256 claimId) public payable onlyAdmin { }
    function getClaim(uint256 claimId) public view returns (Claim memory) { }
}
```

## 🛡️ Security Features

1. **JWT Authentication** - Token-based auth with 1-hour expiration
2. **Password Hashing** - bcrypt with salt rounds
3. **Role-Based Access Control** - Admin, Doctor, Patient, Insurance roles
4. **Email Validation** - Gmail-only restriction
5. **Rate Limiting** - Email sending limited to 5 per 15 minutes
6. **Blockchain Immutability** - Claims stored on Ethereum
7. **IPFS Storage** - Decentralized document storage
8. **Audit Trail** - All claim actions logged
9. **Input Validation** - Sanitization and validation on all inputs
10. **CORS Protection** - Configured CORS policy

## 📦 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/healthcare

# JWT
JWT_SECRET=your_jwt_secret_key

# Email
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_secret

# IPFS/Pinata
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret

# Blockchain
GANACHE_URL=HTTP://127.0.0.1:7545
CONTRACT_ADDRESS=0xF57d4C739495d44DE7bb176c75737E8be76327c8
PRIVATE_KEY=your_ganache_private_key

# AI
GEMINI_API_KEY=your_gemini_api_key

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Production Setup                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend: Vercel/Netlify                                   │
│  Backend: AWS EC2 / Heroku / DigitalOcean                   │
│  Database: MongoDB Atlas                                     │
│  Blockchain: Polygon/Ethereum Mainnet                       │
│  Storage: Cloudinary + IPFS (Pinata)                        │
│  Email: Gmail SMTP / SendGrid                               │
│  AI: Google Gemini API                                      │
│  SSL: Let's Encrypt                                         │
│  CDN: Cloudflare                                            │
└─────────────────────────────────────────────────────────────┘
```

## 📱 User Roles & Permissions

### Patient

- Submit claims
- Track claim status
- View claim history
- Upload documents
- Chat with AI doctor
- View notifications
- Generate reports

### Doctor

- Submit claims for patients
- View patient information
- Upload medical reports
- Manage claims
- Track claim status

### Admin

- Approve/Reject claims
- Manage users
- View analytics
- Generate reports
- Compliance monitoring
- Activity log access
- System settings

### Insurance Provider

- Review claims
- Check claim status
- Generate reports
- View analytics

## 🔧 Technology Stack Summary

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Frontend        | React, Tailwind CSS         |
| Backend         | Node.js, Express.js         |
| Database        | MongoDB, Mongoose           |
| Blockchain      | Ethereum, Solidity, Hardhat |
| Storage         | Cloudinary, IPFS (Pinata)   |
| Authentication  | JWT, bcrypt                 |
| Email           | Nodemailer                  |
| AI              | Google Gemini API           |
| Testing         | Ganache (Local Blockchain)  |
| Smart Contracts | ethers.js                   |
| File Upload     | Multer                      |
| Report Gen      | xlsx, pdfkit                |

---

**System Version:** 1.0.0  
**Last Updated:** December 24, 2025  
**Developed By:** Manoj Singh Rajput and Team
