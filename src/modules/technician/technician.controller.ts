import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status';
import { technicianService } from "./technician.service";


const getAllTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await technicianService.getAllTechnician(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Technician data extracted",
        data: result
    })
})


const getTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string

    const result = await technicianService.getTechnicianProfile(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully extract the technician profile",
        data: result
    })
})

const updateTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string

    const result = await technicianService.updateTechnicianProfile(userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully",
        data: result
    })
})

const updateAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string
    const payload = req.body;
    const result = await technicianService.updateAvailability(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Availability updated successfully",
        data: result
    })
})

const getTechnicianProfileWithReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.params.technicianId as string;
    const result = await technicianService.getTechnicianProfileWithReview(technicianId);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician profile with review extracted",
        data: result
    })
})

const getTechnicianDashboardStats = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id as string;

        const result = await technicianService.getTechnicianDashboardStats(userId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Technician dashboard statistics retrieved successfully",
            data: result,
        });
    }
);

const topTechnicians = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await technicianService.topTechnicians();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Top technicians retrieved successfully",
        data: result
    })
})


export const technicianController = {
    getAllTechnician,
    getTechnicianProfile,
    updateTechnicianProfile,
    updateAvailability,
    getTechnicianProfileWithReview,
    getTechnicianDashboardStats,
    topTechnicians
}