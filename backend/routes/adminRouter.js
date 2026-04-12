import express from "express";
import {
  loginAdmin,
  registerAdmin,
  getPendingPDs,
  getPendingCDs,
  getApprovedPDs,
  getPDDetail,
  getCDDetail,
  processPDReview,
  processCDReview,
  getAdminDashboardStats,
  checkProgramReadiness,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  updatePreferences,
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

// Require Valid Admin JWT for below routes
adminRouter.use(authAdmin);

adminRouter.get("/dashboard-stats", getAdminDashboardStats);
adminRouter.get("/reviews/pds", getPendingPDs);
adminRouter.get("/reviews/cds", getPendingCDs);
adminRouter.get("/approved/pds", getApprovedPDs);

adminRouter.get("/reviews/pd/:id", getPDDetail);
adminRouter.get("/reviews/cd/:id", getCDDetail);

adminRouter.put("/reviews/pd/:id", processPDReview);
adminRouter.put("/reviews/cd/:id", processCDReview);

adminRouter.get("/compiler/readiness/:programId", checkProgramReadiness);

// Add these routes after your existing routes
adminRouter.get("/profile", authAdmin, getAdminProfile);
adminRouter.put("/profile", authAdmin, updateAdminProfile);
adminRouter.put("/change-password", authAdmin, changePassword);
adminRouter.put("/preferences", authAdmin, updatePreferences);

export default adminRouter;
