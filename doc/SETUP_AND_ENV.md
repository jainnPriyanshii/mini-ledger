# Environment Variables & Configuration Guide

## 1. Backend Configuration (`apps/backend/.env`)

Create or update `apps/backend/.env` using `apps/backend/.env.example`:

| Variable | Required | Default / Example | Description |
|---|---|---|---|
| `PORT` | Optional | `5000` | Port on which the backend server runs |
| `NODE_ENV` | Optional | `development` | Runtime environment (`development` or `production`) |
| `JWT_SECRET` | Optional | `super_secret_jwt_key_replace_with_your_own` | Secret key used to sign JWT auth tokens |
| `DATABASE_URL` | Optional | *(Leave blank for in-memory fallback)* | PostgreSQL / Supabase connection URI |

> **Note on Database:** You can run the backend immediately without database credentials! If `DATABASE_URL` is empty, the backend automatically operates using an in-memory repository for local development.

---

## 2. Mobile App Configuration (`apps/mobile/.env`)

Create or update `apps/mobile/.env` using `apps/mobile/.env.example`:

| Variable | Default / Example | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | `http://10.211.84.62:5000` | The base URL of your backend API |

### Connecting from Different Devices:
- **Physical Phone with Expo Go:** Must use your computer's Wi-Fi IP (e.g. `http://10.211.84.62:5000`). Both phone and laptop must be on the same Wi-Fi.
- **Android Emulator:** `http://10.0.2.2:5000`
- **Web Browser / iOS Simulator:** `http://localhost:5000`
