import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from 'http-status';
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { prisma } from "../../lib/prisma";


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully!",
        data: user
    })
})

// admin
interface GetAllUsersOptions {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

const getAllUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchTerm = (req.query.searchTerm as string) || "";

        const result = await userService.getAllUserFromDB({
            page,
            limit,
            searchTerm,
        });

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Users retrieved successfully",
            data: result.data,
            meta: result.meta,
        });
    }
);

// update user status
const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await userService.updateUserStatusInDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully extract all user",
        data: result
    })

})



const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getDashboardStats();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard statistics retrieved successfully",
        data: result,
    });
});



export const userController = {
    registerUser,
    getAllUser,
    updateUserStatus,
    getDashboardStats
}
