# MiniLedger API Reference

Base URL: `http://localhost:5000` (or `http://<YOUR_IP>:5000`)

---

## Endpoints

### 1. Health Check
- **`GET /health`**
- **Auth:** None
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "MiniLedger API is running smoothly",
    "timestamp": "2026-10-23T16:00:00.000Z"
  }
  ```

---

### 2. Send Mock OTP
- **`POST /api/auth/send-otp`**
- **Auth:** None
- **Request Body:**
  ```json
  {
    "phone": "+919876543210"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP generated successfully. Check your backend console terminal.",
    "debugOtp": "482915"
  }
  ```

---

### 3. Verify OTP & Authenticate
- **`POST /api/auth/verify-otp`**
- **Auth:** None
- **Request Body:**
  ```json
  {
    "phone": "+919876543210",
    "otp": "482915"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Authentication successful.",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "e871ef08-50a8-48da-8f21-61717af84987",
      "phone": "+919876543210"
    }
  }
  ```

---

### 4. Fetch User Loans
- **`GET /api/loans`**
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  {
    "success": true,
    "loans": [
      {
        "id": "c768a355-83b6-455b-9d41-4c7b89736c0a",
        "user_id": "e871ef08-50a8-48da-8f21-61717af84987",
        "friend_name": "Rahul Sharma",
        "amount": 2500,
        "due_date": "2026-10-15",
        "is_repaid": false,
        "repaid_at": null,
        "created_at": "2026-10-23T15:00:00.000Z",
        "updated_at": "2026-10-23T15:00:00.000Z"
      }
    ]
  }
  ```

---

### 5. Create Loan Entry
- **`POST /api/loans`**
- **Auth:** `Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "friend_name": "Priya Patel",
    "amount": 1500,
    "due_date": "2026-11-10"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Loan added successfully.",
    "loan": { ... }
  }
  ```

---

### 6. Mark Loan as Repaid
- **`PATCH /api/loans/:id/repay`**
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Loan marked as repaid.",
    "loan": {
      "id": "c768a355-83b6-455b-9d41-4c7b89736c0a",
      "is_repaid": true,
      "repaid_at": "2026-10-23T16:15:00.000Z"
    }
  }
  ```

---

### 7. Loan Summary Metrics
- **`GET /api/loans/summary`**
- **Auth:** `Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  {
    "success": true,
    "summary": {
      "totalLent": 4000,
      "totalRepaid": 1500,
      "overdueAmount": 2500,
      "pendingAmount": 2500,
      "totalLoans": 2
    }
  }
  ```
