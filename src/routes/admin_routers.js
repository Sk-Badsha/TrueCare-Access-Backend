import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import {
  getAllDoctors,
  getAllUsers,
  changeAccountStatus,
} from "../controllers/admin_controller.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";
const router = Router();

router
  .route("/getAllDoctors")
  .get(verifyJWT, authorizeRoles("admin"), getAllDoctors);
router
  .route("/getAllUsers")
  .get(verifyJWT, authorizeRoles("admin"), getAllUsers);

router
  .route("/changeAccountStatus")
  .post(verifyJWT, authorizeRoles("admin"), changeAccountStatus);

export default router;
