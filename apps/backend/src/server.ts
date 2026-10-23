import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "./config";
import { testDbConnection } from "./db";
import authRoutes from "./routes/authRoutes";
import loanRoutes from "./routes/loanRoutes";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow mobile app and web clients
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Request logging in development
if (config.nodeEnv !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "MiniLedger API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Unhandled Server Error]:", err);
  res.status(500).json({
    success: false,
    error: err.message || "An unexpected internal server error occurred",
  });
});

// Start Server
async function startServer() {
  await testDbConnection();

  app.listen(config.port, "0.0.0.0", () => {
    console.log(`\n======================================================`);
    console.log(`🚀 MiniLedger Backend Server is running!`);
    console.log(`🌐 Local URL    : http://localhost:${config.port}`);
    console.log(`📡 Network URL  : http://0.0.0.0:${config.port}`);
    console.log(`🩺 Health check : http://localhost:${config.port}/health`);
    console.log(`======================================================\n`);
  });
}

startServer();

export default app;
