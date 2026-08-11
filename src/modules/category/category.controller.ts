import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from './../../utils/sendResponse';
import httpStatus from 'http-status';
import { categoryService } from "./category.service";
import { Role } from "../../../generated/prisma/enums";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await categoryService.createCategory(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: result
    })
})

const updateCategory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { categoryId } = req.params;
        const payload = req.body;

        const result = await categoryService.updateCategory(categoryId as string, payload);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Category updated successfully",
            data: result,
        });
    }
);

const getAllCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category = await categoryService.getAllCategory(req.user?.role || "CUSTOMER" as Role);

    // console.log(req.user?.role);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category extracted successfully",
        data: category
    })
})


export const categoryController = {
    createCategory,
    getAllCategory,
    updateCategory
}