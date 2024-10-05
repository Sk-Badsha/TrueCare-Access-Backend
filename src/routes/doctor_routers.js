import { Router } from "express";
import {
  getDoctorInfo,
  getDoctorDetailsByID,
  updateDoctorInfo,
  doctorAppointments,
  changeBookingStatus,
} from "../controllers/doctor_controller.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
const router = Router();

router
  .route("/getDoctorInfo")
  .post(verifyJWT, authorizeRoles("doctor"), getDoctorInfo);
router
  .route("/updateDoctorInfo")
  .post(verifyJWT, authorizeRoles("doctor"), updateDoctorInfo);
router.route("/getDoctorDetailsByID").post(verifyJWT, getDoctorDetailsByID);
router
  .route("/doctor-appointments")
  .get(verifyJWT, authorizeRoles("doctor"), doctorAppointments);
router
  .route("/changeBookingStatus")
  .post(verifyJWT, authorizeRoles("doctor"), changeBookingStatus);
export default router;
