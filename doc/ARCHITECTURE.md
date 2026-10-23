# MiniLedger Architecture & Project Structure

## 📁 Monorepo Structure

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
│   └── mobile/                # React Native + Expo SDK 57 + TypeScript App
│       ├── src/
│       │   ├── components/    # SummaryCards, LoanItem, AddLoanModal
│       │   ├── context/       # AuthContext (state & persistent session)
│       │   ├── screens/       # LoginScreen, DashboardScreen
│       │   ├── services/      # API client communicating with backend
│       │   ├── config.ts      # API base URL & warm beige/brown theme
│       │   └── types/         # Client TypeScript types
│       ├── App.tsx            # Mobile root navigator with SafeAreaProvider
│       ├── .env.example       # Mobile env template
│       └── package.json
├── doc/                       # Detailed Documentation
│   ├── ARCHITECTURE.md        # Architecture & project structure
│   ├── SETUP_AND_ENV.md       # Environment variables & configuration
│   ├── DATABASE_SUPABASE.md   # PostgreSQL / Supabase connection guide
│   └── API_REFERENCE.md       # Complete API documentation
├── supabase/
│   └── schema.sql             # SQL table definitions, indexes & triggers
├── package.json               # Root monorepo scripts
├── .gitignore
└── README.md                  # Quick-start run instructions & test flow
```

---

## 🛠️ Technology Stack

- **Mobile Client:** React Native, Expo SDK 57, TypeScript, React Native Safe Area Context, Async Storage.
- **Backend API:** Node.js, Express, TypeScript, tsx, jsonwebtoken, pg, cors, dotenv.
- **Database:** Prepared for PostgreSQL / Supabase via `pg.Pool`, with an in-memory data store fallback for initial development.
- **Design System:** Elegant Warm Beige & Rich Mocha Brown financial dashboard with Rupee (`₹`) formatting.
