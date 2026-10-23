import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthTokenPayload } from "../types";

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Authentication token required. Please log in.",
    });
    return;
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({
        success: false,
        error: "Invalid or expired session. Please log in again.",
      });
      return;
    }

    req.user = decoded as AuthTokenPayload;
    next();
  });
}
