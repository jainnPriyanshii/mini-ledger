import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { otpService } from "../services/otpService";
import { repository } from "../db/repository";

export const authController = {
  // POST /api/auth/send-otp
  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phone } = req.body;

      if (!phone || typeof phone !== "string" || phone.trim().length < 6) {
        res.status(400).json({
          success: false,
          error: "A valid phone number (at least 6 characters) is required.",
        });
        return;
      }

      const cleanPhone = phone.trim();
      const otp = otpService.generateOtp(cleanPhone);

      res.status(200).json({
        success: true,
        message: "OTP generated successfully. Check your backend console terminal.",
      
        ...(config.nodeEnv !== "production" ? { debugOtp: otp } : {}),
      });
    } catch (error: any) {
      console.error("[sendOtp Error]:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate OTP. Please try again.",
      });
    }
  },

  // POST /api/auth/verify-otp
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        res.status(400).json({
          success: false,
          error: "Phone number and OTP code are required.",
        });
        return;
      }

      const cleanPhone = phone.trim();
      const isValid = otpService.verifyOtp(cleanPhone, otp.trim());

      if (!isValid) {
        res.status(400).json({
          success: false,
          error: "Invalid or expired OTP. Please request a new code.",
        });
        return;
      }

      // Upsert user
      const user = await repository.findOrCreateUserByPhone(cleanPhone);

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, phone: user.phone },
        config.jwtSecret,
        { expiresIn: "30d" }
      );

      res.status(200).json({
        success: true,
        message: "Authentication successful.",
        token,
        user: {
          id: user.id,
          phone: user.phone,
        },
      });
    } catch (error: any) {
      console.error("[verifyOtp Error]:", error);
      res.status(500).json({
        success: false,
        error: "Verification failed. Please try again.",
      });
    }
  },
};
