import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser)

router.get("/admin/users", auth(Role.ADMIN), userController.getAllUser)

router.get("/admin/stats", auth(Role.ADMIN), userController.getDashboardStats)

router.patch("/admin/userStatus", auth(Role.ADMIN), userController.updateUserStatus)

export const userRoutes = router;