import { Request, Response } from "express";
import httpStatus from "http-status";

import { cloudinaryService } from "./cloudinary.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getCloudinarySignature = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await cloudinaryService.getCloudinarySignature();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message:
                "Cloudinary signature generated successfully",
            data: result,
        });
    }
);

export const cloudinaryController = {
    getCloudinarySignature,
};