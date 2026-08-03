import { NextFunction, Request, Response } from "express";
import HttpStatus from 'http-status';
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log(err);
    let statusCode;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "InternalServerError";

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = HttpStatus.BAD_REQUEST;
        errorMessage = err.message || "Validation error";
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = HttpStatus.BAD_REQUEST;
            errorMessage = "Duplicate Key Error"
        }
        else if (err.code === 'P2003') {
            statusCode = HttpStatus.BAD_REQUEST;
            errorMessage = "Foreign Key Constraint Error"
        }
        else if (err.code === 'P2025') {
            statusCode = HttpStatus.NOT_FOUND;
            errorMessage = "Record not found"
        }
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === 'P1000') {
            statusCode = HttpStatus.UNAUTHORIZED;
            errorMessage = "Database connection error"
        }
        else if (err.errorCode === 'P1001') {
            statusCode = HttpStatus.UNAUTHORIZED;
            errorMessage = "can't reach database server"
        }
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Unknown error occurred"
    }


    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: err.code || "INTERNAL_SERVER_ERROR",
        name: errorName,
        message: errorMessage,
        error: err.stack
    });
}
