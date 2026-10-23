import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { repository } from "../db/repository";

export const loanController = {
  // GET /api/loans
  async getLoans(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const loans = await repository.getLoans(userId);
      res.status(200).json({
        success: true,
        loans,
      });
    } catch (error: any) {
      console.error("[getLoans Error]:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve loan entries.",
      });
    }
  },

  // POST /api/loans
  async createLoan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { friend_name, amount, due_date } = req.body;

      if (!friend_name || typeof friend_name !== "string" || friend_name.trim() === "") {
        res.status(400).json({
          success: false,
          error: "Friend name is required.",
        });
        return;
      }

      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        res.status(400).json({
          success: false,
          error: "A valid positive loan amount is required.",
        });
        return;
      }

      if (!due_date || typeof due_date !== "string") {
        res.status(400).json({
          success: false,
          error: "Due date is required in YYYY-MM-DD format.",
        });
        return;
      }

      // Basic date validation
      const parsedDate = new Date(due_date);
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({
          success: false,
          error: "Invalid due date format. Expected YYYY-MM-DD.",
        });
        return;
      }

      const formattedDueDate = due_date.split("T")[0];

      const newLoan = await repository.createLoan(userId, {
        friend_name: friend_name.trim(),
        amount: Math.round(numAmount * 100) / 100, // round to 2 decimal places
        due_date: formattedDueDate,
      });

      res.status(201).json({
        success: true,
        message: "Loan added successfully.",
        loan: newLoan,
      });
    } catch (error: any) {
      console.error("[createLoan Error]:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create loan entry.",
      });
    }
  },

  // PATCH /api/loans/:id/repay
  async repayLoan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const loanId = req.params.id as string;

      if (!loanId) {
        res.status(400).json({
          success: false,
          error: "Loan ID is required.",
        });
        return;
      }

      const updated = await repository.repayLoan(userId, loanId);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: "Loan not found or does not belong to you.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Loan marked as repaid.",
        loan: updated,
      });
    } catch (error: any) {
      console.error("[repayLoan Error]:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update loan status.",
      });
    }
  },

  // GET /api/loans/summary
  async getSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const summary = await repository.getSummary(userId);

      res.status(200).json({
        success: true,
        summary,
      });
    } catch (error: any) {
      console.error("[getSummary Error]:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve summary metrics.",
      });
    }
  },
};
