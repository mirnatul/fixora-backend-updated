import { Router } from "express";
import { cloudinaryController } from "./cloudinary.controller";

const router = Router();

router.get(
    "/signature",
    cloudinaryController.getCloudinarySignature
);

export const cloudinaryRoutes = router;