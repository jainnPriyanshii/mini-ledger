export interface User {
  id: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  friend_name: string;
  amount: number;
  due_date: string;
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

export interface AuthTokenPayload {
  userId: string;
  phone: string;
}
