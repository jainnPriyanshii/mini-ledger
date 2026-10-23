# MiniLedger 💳

A full-stack financial application to track money lent to friends, monitor repayments, and highlight overdue balances.

Built with:
- **Frontend:** React Native with Expo and TypeScript
- **Backend:** Node.js, Express, and TypeScript
- **Database:** PostgreSQL prepared with `pg` (with instant local development in-memory fallback, ready for Supabase)

---

## 📁 Project Structure

```text
mini-ledger/
├── apps/
│   ├── backend/               # Node.js + Express + TypeScript API
│   │   ├── src/
│   │   │   ├── controllers/   # Auth and Loan request handlers
│   │   │   ├── db/            # PostgreSQL pool and repository layer
│   │   │   ├── middleware/    # JWT authentication middleware
│   │   │   ├── routes/        # Express routes (/api/auth, /api/loans)
│   │   │   ├── services/      # OTP generation & verification service
│   │   │   ├── types/         # TypeScript type definitions
│   │   │   ├── config.ts      # Environment configuration
│   │   │   └── server.ts      # Express server entry point
│   │   ├── .env.example       # Backend env template
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── mobile/                # React Native + Expo + TypeScript App
│       ├── src/
│       │   ├── components/    # SummaryCards, LoanItem, AddLoanModal
│       │   ├── context/       # AuthContext (state & persistent session)
│       │   ├── screens/       # LoginScreen, DashboardScreen
│       │   ├── services/      # API client communicating with backend
│       │   ├── config.ts      # API base URL & theme configuration
│       │   └── types/         # Client TypeScript types
│       ├── App.tsx            # Mobile root navigator
│       ├── .env.example       # Mobile env template
│       └── package.json
├── supabase/
│   └── schema.sql             # SQL table definitions, indexes & triggers
├── package.json               # Root monorepo scripts
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### 1. Backend (`apps/backend/.env`)

Create or update `apps/backend/.env` using `apps/backend/.env.example`:

| Variable | Required | Default / Example | Description |
|---|---|---|---|
| `PORT` | Optional | `5000` | Port on which the backend server runs |
| `NODE_ENV` | Optional | `development` | Runtime environment (`development` or `production`) |
| `JWT_SECRET` | Optional | `super_secret_jwt_key_replace_with_your_own` | Secret key used to sign JWT auth tokens |
| `DATABASE_URL` | Optional | *(Leave blank for in-memory fallback)* | PostgreSQL / Supabase connection string |

> **Note on Database:** You can run the backend immediately without database credentials! If `DATABASE_URL` is empty, the backend automatically operates using an in-memory repository for development.

### 2. Mobile App (`apps/mobile/.env`)

Create or update `apps/mobile/.env` using `apps/mobile/.env.example`:

| Variable | Default / Example | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | `http://localhost:5000` | The base URL of your backend API |

- **Web Browser / iOS Simulator:** `http://localhost:5000`
- **Android Emulator:** `http://10.0.2.2:5000`
- **Physical Phone with Expo Go:** `http://<YOUR_COMPUTER_LOCAL_IP>:5000` (e.g. `http://192.168.1.100:5000`)

---

## 🗄️ Supabase / PostgreSQL Setup (When Ready)

When you are ready to connect Supabase:

1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql). This creates:
   - `users` table (UUID, phone, timestamps)
   - `loans` table (UUID, user_id, friend_name, amount, due_date, is_repaid, repaid_at)
   - Performance indexes on `user_id`, `due_date`, and `is_repaid`
   - Automatic `updated_at` timestamp triggers
4. Go to **Project Settings > Database > Connection String > URI**.
5. Copy the URI and paste it into `apps/backend/.env`:
   ```bash
   DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require"
   ```
6. Restart the backend. It will detect the connection and execute all operations against Supabase.

---

## 🚀 How to Run

### Step 1: Install Dependencies

From the project root:
```bash
# Install backend dependencies
cd apps/backend
npm install

# Install mobile dependencies
cd ../mobile
npm install

# Return to root
cd ../..
```

### Step 2: Start the Backend Server

From the project root:
```bash
npm run dev:backend
```
*(Or navigate to `apps/backend` and run `npm run dev`)*

The server will start at `http://localhost:5000` and `http://0.0.0.0:5000`.

### Step 3: Start the Mobile Application

In a separate terminal, from the project root:
```bash
npm run dev:mobile
```
*(Or navigate to `apps/mobile` and run `npm start`)*

Press:
- `w` to open in your web browser (fastest way to test)
- `a` to open in Android Emulator
- `i` to open in iOS Simulator (macOS only)
- Or scan the QR code with **Expo Go** on your iOS or Android phone.

---

## 📱 Testing the Flow

1. **Phone Number Login:**
   - Enter any phone number (e.g. `+1 555 0199`) and tap **Send OTP Code**.
   - Look at the backend terminal output: you will see a highlighted box with the generated 6-digit mock OTP:
     ```text
     =======================================================
     🔑 [MiniLedger OTP Notification]
     📱 Phone Number : +1 555 0199
     👉 Mock OTP     : 482915
     ⏱️  Expires In   : 10 minutes
     =======================================================
     ```
   - In development mode, the app also shows a convenient **Developer Quick-Fill** banner. Tap it or enter the 6 digits and tap **Verify & Login**.
2. **Dashboard Overview:**
   - See **Total Lent**, **Total Repaid**, and **Overdue Amount** update dynamically.
3. **Add a Loan:**
   - Tap **+ Add Loan**.
   - Enter friend's name (e.g. "Sarah Connor"), amount (e.g. "120.00"), and choose or type a due date.
   - Tap **Save Loan**.
4. **Overdue Highlighting:**
   - Any loan with a due date prior to today will automatically display with a red border, red amount, and a `⚠️ Overdue` badge.
5. **Mark as Repaid:**
   - Tap **Mark as Repaid** on any active loan to settle it. The balance instantly updates into Total Repaid and the card receives a green `✓ Repaid` badge.

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Server health check |
| `POST` | `/api/auth/send-otp` | No | Generates mock OTP and logs to console |
| `POST` | `/api/auth/verify-otp` | No | Verifies OTP and returns JWT token |
| `GET` | `/api/loans` | Bearer JWT | Returns all loans for the user |
| `POST` | `/api/loans` | Bearer JWT | Creates a new loan entry |
| `PATCH` | `/api/loans/:id/repay` | Bearer JWT | Marks a loan as repaid |
| `GET` | `/api/loans/summary` | Bearer JWT | Returns aggregate metrics (total lent, repaid, overdue) |
