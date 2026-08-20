import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';


const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login successfull",
        data: { accessToken, refreshToken }
    })
})

const googleLogin = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await authService.googleLogin(payload);
	const { accessToken, refreshToken } = result;

    // we have to set cookie from frontend

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User logged in successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
});


const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const profile = await authService.getMyProfileFromDB(req.user?.id as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: { profile }
    })
})

const updateMyInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedUserInfo = await authService.updateMyInfo(userId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User info updated successfully",
        data: { updatedUserInfo }
    })
})

const updateTechnicianInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedUserInfo = await authService.updateTechnicianInfo(userId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician info updated successfully",
        data: { updatedUserInfo }
    })
})

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    })


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Token refreshed successfully",
        data: { accessToken }
    })

})

export const authController = {
    loginUser,
    getMyProfile,
    updateMyInfo,
    refreshToken,
    updateTechnicianInfo,
    googleLogin
}