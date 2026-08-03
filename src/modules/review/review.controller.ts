import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const bookingId = req.params.bookingId as string;
    const result = await reviewService.createReview(bookingId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review created successfully",
        data: result
    })
})

export const reviewController = {
    createReview
}