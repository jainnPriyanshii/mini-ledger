# MiniLedger 💳

A full-stack financial application to track money lent to friends, monitor repayments, and highlight overdue balances in Indian Rupee (`₹`).

- **Frontend:** React Native with Expo SDK 57 (TypeScript, Beige & Brown Theme, `react-native-safe-area-context`)
- **Backend:** Node.js, Express, and TypeScript
- **Database:** Prepared for PostgreSQL / Supabase with in-memory fallback

---

## 🚀 How to Run

### Step 1: Install Dependencies
```bash
# Backend dependencies
cd apps/backend
npm install

# Mobile app dependencies
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
*(Runs on `http://localhost:5000` and `http://0.0.0.0:5000`)*

### Step 3: Start the Mobile Application
In a new terminal from the project root:
```bash
npm run dev:mobile
```
Then:
- **Expo Go App:** Scan the QR code displayed in the terminal.
- **Web Browser:** Press `w`.
- **Android Emulator:** Press `a`.

---

## 📱 Testing the Flow

1. **Phone Number Login:**
   - Enter any phone number (e.g. `+91 98765 43210`) and tap **Send OTP Code**.
   - Check the backend terminal console for the generated 6-digit mock OTP:
     ```text
     =======================================================
     🔑 [MiniLedger OTP Notification]
     📱 Phone Number : +91 98765 43210
     👉 Mock OTP     : 482915
     ⏱️  Expires In   : 10 minutes
     =======================================================
     ```
   - In development mode, tap the **Developer Quick-Fill** banner or type the OTP code, then tap **Verify & Login**.

2. **Dashboard Overview:**
   - View your **TOTAL LENT**, **REPAID**, and **OVERDUE** cards formatted in `₹`.

3. **Add a Loan:**
   - Tap **+ Add Loan**.
   - Enter your friend's name, amount, and pick a due date.
   - Tap **Save Loan**.

4. **Overdue Highlighting:**
   - Any loan with a due date in the past will automatically be highlighted with a red border, overdue badge, and added to the Overdue metric card.

5. **Mark as Repaid:**
   - Tap **Mark as Repaid** on any active loan to settle it. The balance instantly shifts to Total Repaid with a green `✓ Repaid` badge.

---

## 📚 Detailed Documentation

All detailed technical documentation is available in the [`doc/`](./doc) folder:

- 🏛️ [Architecture & Project Structure](./doc/ARCHITECTURE.md)
- ⚙️ [Environment Variables & Setup Guide](./doc/SETUP_AND_ENV.md)
- 🗄️ [PostgreSQL & Supabase Setup Guide](./doc/DATABASE_SUPABASE.md)
- 🔌 [API Reference & Endpoints](./doc/API_REFERENCE.md)
