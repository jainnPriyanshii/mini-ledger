import { Router } from "express";
import { loanController } from "../controllers/loanController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All loan endpoints require authentication
router.use(authenticateToken);

router.get("/summary", loanController.getSummary);
router.get("/", loanController.getLoans);
router.post("/", loanController.createLoan);
router.patch("/:id/repay", loanController.repayLoan);

export default router;
