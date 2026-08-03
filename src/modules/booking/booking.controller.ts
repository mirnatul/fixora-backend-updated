import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { bookingService } from "./booking.service";
import { BookingStatus } from "../../../generated/prisma/enums";

const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string
    const result = await bookingService.createBooking(userId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Booking created successfully",
        data: result
    })
})

const getBookingDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string
    const bookingId = req.params.bookingId as string;
    const result = await bookingService.getBookingDetails(userId, bookingId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking details extracted successfully",
        data: result
    })
})


const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await bookingService.getAllBookings();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All bookings extracted",
        data: result
    })
})


const getBookingForUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId as string;
    const authenticateUser = req.user?.id as string;
    const result = await bookingService.getBookingForUser(userId, authenticateUser);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All bookings for user extracted",
        data: result
    })
})


const getBookingForTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.params.technicianId as string;
    const authenticateUser = req.user?.id as string;
    const status = req.query.status as BookingStatus || undefined;
    const result = await bookingService.getBookingForTechnician(technicianId, authenticateUser, status);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All bookings for technician extracted",
        data: result
    })
})


const updateBookingStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const bookingId = req.params.bookingId as string;
    const payload = req.body;

    const result = await bookingService.updateBookingStatus(userId, bookingId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking status updated",
        data: result
    })
})



const cancelBookingByUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const bookingId = req.params.bookingId as string;
    // const payload = req.body;

    const result = await bookingService.cancelBookingByUser(userId, bookingId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking cancelled",
        data: result
    })
})

const availability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.query.technicianId as string;
    const date = req.query.date as string;

    // console.log(technicianId, date);

    const result = await bookingService.availability(technicianId, date);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician availability extracted",
        data: result
    })
})

export const bookingController = {
    createBooking,
    getBookingDetails,
    getAllBookings,
    getBookingForUser,
    getBookingForTechnician,
    updateBookingStatus,
    cancelBookingByUser,
    availability
}