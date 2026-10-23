import crypto from "crypto";
import { pool, isUsingPostgres } from "./index";
import { User, Loan, LoanSummary } from "../types";

// In-memory fallback state
const memoryUsers = new Map<string, User>();
const memoryLoans = new Map<string, Loan>();

export const repository = {
  // Find or create user by phone number
  async findOrCreateUserByPhone(phone: string): Promise<User> {
    if (isUsingPostgres() && pool) {
      // Find existing
      const findRes = await pool.query<User>(
        "SELECT id, phone, created_at, updated_at FROM users WHERE phone = $1 LIMIT 1",
        [phone]
      );
      if (findRes.rows.length > 0) {
        return findRes.rows[0];
      }

      // Create new
      const insertRes = await pool.query<User>(
        "INSERT INTO users (phone) VALUES ($1) RETURNING id, phone, created_at, updated_at",
        [phone]
      );
      return insertRes.rows[0];
    }

    // Fallback: In-memory store
    for (const user of memoryUsers.values()) {
      if (user.phone === phone) {
        return user;
      }
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryUsers.set(newUser.id, newUser);
    return newUser;
  },

  async getUserById(id: string): Promise<User | null> {
    if (isUsingPostgres() && pool) {
      const res = await pool.query<User>(
        "SELECT id, phone, created_at, updated_at FROM users WHERE id = $1 LIMIT 1",
        [id]
      );
      return res.rows[0] || null;
    }

    return memoryUsers.get(id) || null;
  },

  // Get all loans for a user ordered by created_at DESC
  async getLoans(userId: string): Promise<Loan[]> {
    if (isUsingPostgres() && pool) {
      const res = await pool.query<any>(
        `SELECT 
          id, 
          user_id, 
          friend_name, 
          amount::numeric, 
          TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date, 
          is_repaid, 
          repaid_at, 
          created_at, 
          updated_at
         FROM loans 
         WHERE user_id = $1 
         ORDER BY due_date ASC, created_at DESC`,
        [userId]
      );
      return res.rows.map((row) => ({
        ...row,
        amount: Number(row.amount),
      }));
    }

    // In-memory
    const userLoans = Array.from(memoryLoans.values())
      .filter((l) => l.user_id === userId)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    return userLoans;
  },

  // Create a new loan
  async createLoan(
    userId: string,
    data: { friend_name: string; amount: number; due_date: string }
  ): Promise<Loan> {
    if (isUsingPostgres() && pool) {
      const res = await pool.query<any>(
        `INSERT INTO loans (user_id, friend_name, amount, due_date)
         VALUES ($1, $2, $3, $4)
         RETURNING 
           id, 
           user_id, 
           friend_name, 
           amount::numeric, 
           TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date, 
           is_repaid, 
           repaid_at, 
           created_at, 
           updated_at`,
        [userId, data.friend_name.trim(), data.amount, data.due_date]
      );
      const row = res.rows[0];
      return {
        ...row,
        amount: Number(row.amount),
      };
    }

    // In-memory
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      user_id: userId,
      friend_name: data.friend_name.trim(),
      amount: Number(data.amount),
      due_date: data.due_date,
      is_repaid: false,
      repaid_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryLoans.set(newLoan.id, newLoan);
    return newLoan;
  },

  // Mark loan as repaid
  async repayLoan(userId: string, loanId: string): Promise<Loan | null> {
    if (isUsingPostgres() && pool) {
      const res = await pool.query<any>(
        `UPDATE loans
         SET is_repaid = TRUE, repaid_at = NOW(), updated_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING 
           id, 
           user_id, 
           friend_name, 
           amount::numeric, 
           TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date, 
           is_repaid, 
           repaid_at, 
           created_at, 
           updated_at`,
        [loanId, userId]
      );
      if (res.rows.length === 0) return null;
      const row = res.rows[0];
      return {
        ...row,
        amount: Number(row.amount),
      };
    }

    // In-memory
    const loan = memoryLoans.get(loanId);
    if (!loan || loan.user_id !== userId) {
      return null;
    }

    loan.is_repaid = true;
    loan.repaid_at = new Date().toISOString();
    loan.updated_at = new Date().toISOString();
    memoryLoans.set(loanId, loan);
    return loan;
  },

  // Get summary of user loans (total lent, total repaid, overdue amount)
  async getSummary(userId: string): Promise<LoanSummary> {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (isUsingPostgres() && pool) {
      const res = await pool.query<{
        total_lent: string | null;
        total_repaid: string | null;
        overdue_amount: string | null;
        total_loans: string;
      }>(
        `SELECT 
          COALESCE(SUM(amount), 0) AS total_lent,
          COALESCE(SUM(CASE WHEN is_repaid = TRUE THEN amount ELSE 0 END), 0) AS total_repaid,
          COALESCE(SUM(CASE WHEN is_repaid = FALSE AND due_date < $2::date THEN amount ELSE 0 END), 0) AS overdue_amount,
          COUNT(*) AS total_loans
         FROM loans
         WHERE user_id = $1`,
        [userId, today]
      );

      const row = res.rows[0];
      const totalLent = Number(row?.total_lent || 0);
      const totalRepaid = Number(row?.total_repaid || 0);
      const overdueAmount = Number(row?.overdue_amount || 0);
      const pendingAmount = Math.max(0, totalLent - totalRepaid);

      return {
        totalLent,
        totalRepaid,
        overdueAmount,
        pendingAmount,
        totalLoans: Number(row?.total_loans || 0),
      };
    }

    // In-memory
    const userLoans = Array.from(memoryLoans.values()).filter(
      (l) => l.user_id === userId
    );

    let totalLent = 0;
    let totalRepaid = 0;
    let overdueAmount = 0;

    for (const loan of userLoans) {
      totalLent += loan.amount;
      if (loan.is_repaid) {
        totalRepaid += loan.amount;
      } else {
        // Compare YYYY-MM-DD
        if (loan.due_date < today) {
          overdueAmount += loan.amount;
        }
      }
    }

    return {
      totalLent,
      totalRepaid,
      overdueAmount,
      pendingAmount: Math.max(0, totalLent - totalRepaid),
      totalLoans: userLoans.length,
    };
  },
};
