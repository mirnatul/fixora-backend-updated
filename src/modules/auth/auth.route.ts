import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import passport from "passport";

const router = Router();


router.post("/login", authController.loginUser)

router.get("/me", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), authController.getMyProfile)
router.put("/me/update", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), authController.updateMyInfo)
router.put("/technician/profile", auth(Role.TECHNICIAN), authController.updateTechnicianInfo)

router.post("/refresh-token", authController.refreshToken)
router.post("/google", authController.googleLogin);

export const authRoutes = router;