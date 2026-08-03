import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';

const createCechoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const userId = req.user?.id;

    const result = await paymentService.createCheckoutSession(bookingId as string, userId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checkout completed successfully",
        data: result
    })
})

const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers['stripe-signature']!;

    await paymentService.handleWebhook(event, signature as string)

    // we won't get that response just show for design synchronization
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Webhook triggreed successfully",
        data: null
    })
})

const getCurrentUsersPaymentHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await paymentService.getCurrentUsersPaymentHistory(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your payment history extracted",
        data: result
    })
})

const getPaymentHistoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const paymentId = req.params.paymentId;
    const result = await paymentService.getPaymentHistoryById(userId as string, paymentId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your payment history extracted",
        data: result
    })
})

export const paymentController = {
    createCechoutSession,
    handleWebhook,
    getCurrentUsersPaymentHistory,
    getPaymentHistoryById
}
