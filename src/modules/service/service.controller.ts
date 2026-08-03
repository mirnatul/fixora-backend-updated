import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { serviceService } from "./service.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { get } from "node:http";
import { IServiceQuery } from "./service.interface";

const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string
    const result = await serviceService.createService(payload, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Service createed successfully",
        data: result
    })
})

const getService = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await serviceService.getService(req.query as IServiceQuery);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Services retrieved successfully",
            data: result,
        });
    }
);

const getServiceForTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const result = await serviceService.getServiceForTechnician(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service extracted successfylly",
        data: result
    })
})




const updateService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;
    const serviceId = req.params.serviceId;
    const result = await serviceService.updateService(userId as string, serviceId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service updated successfylly",
        data: result
    })
})

const deleteService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const serviceId = req.params.serviceId;

    const result = await serviceService.deleteService(
        userId as string,
        serviceId as string
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service deleted successfully",
        data: result
    });
});


const getServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = req.params.serviceId as string;
    const result = await serviceService.getServiceById(serviceId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service extracted successfylly",
        data: result
    })
})

const topServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceService.topServices();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Top services extracted successfylly",
        data: result
    })
})

export const serviceController = {
    createService,
    getService,
    updateService,
    getServiceById,
    getServiceForTechnician,
    topServices,
    deleteService
}