import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/", serviceController.getService)
router.post("/", auth(Role.TECHNICIAN), serviceController.createService)
router.get("/technician", auth(Role.TECHNICIAN), serviceController.getServiceForTechnician)
router.get("/top-services", serviceController.topServices)
router.patch("/:serviceId", auth(Role.TECHNICIAN), serviceController.updateService)
router.get("/:serviceId", serviceController.getServiceById)

router.delete("/:serviceId", auth(Role.TECHNICIAN), serviceController.deleteService);

export const serviceRoutes = router;
