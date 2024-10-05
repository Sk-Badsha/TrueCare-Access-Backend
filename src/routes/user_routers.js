import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  getCurrentUser,
  logoutUser,
  applyDoctor,
  getAllNotificationsByID,
  getAllNotification,
  deleteAllNotification,
  getAllDoctors,
  bookAppointment,
  bookingAvailability,
  userAppointments,
  updateProfile,
  getResetPassword,
  resetPassword,
  changePassword,
} from "../controllers/user_controller.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:id/:token").get(getResetPassword);
router.route("/reset-password/:id/:token").post(resetPassword);

// secure route
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/apply-doctor")
  .post(verifyJWT, authorizeRoles("user"), applyDoctor);
router
  .route("/getAllNotificationsByID")
  .post(verifyJWT, getAllNotificationsByID);
router.route("/get-all-notifications").post(verifyJWT, getAllNotification);
router
  .route("/delete-all-notifications")
  .post(verifyJWT, deleteAllNotification);
router.route("/getAllDoctors").get(verifyJWT, getAllDoctors);
router.route("/book-appointment").post(verifyJWT, bookAppointment);
router.route("/booking-availability").post(verifyJWT, bookingAvailability);
router.route("/user-appointments").get(verifyJWT, userAppointments);
router.route("/updateProfile").post(verifyJWT, updateProfile);
router.route("/change-Password").post(verifyJWT, changePassword);
export default router;
