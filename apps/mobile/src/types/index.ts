export interface User {
  id: string;
  phone: string;
}

export interface Loan {
  id: string;
  user_id: string;
  friend_name: string;
  amount: number;
  due_date: string; // YYYY-MM-DD
  is_repaid: boolean;
  repaid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoanSummary {
  totalLent: number;
  totalRepaid: number;
  overdueAmount: number;
  pendingAmount: number;
  totalLoans: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  user?: User;
  loans?: Loan[];
  loan?: Loan;
  summary?: LoanSummary;
  debugOtp?: string;
}
