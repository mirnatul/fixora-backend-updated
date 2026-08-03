import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken
            :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization?.split(" ")[1]
                : req.headers.authorization;

        if (!token) {
            throw new Error("Access token is missing, please login to access this resource!");
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error)
        }

        const { email, name, id, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Forbidden: You are not authorized to access this resource!");
        }

        const user = await prisma.user.findUnique({
            where: { id },
        })
        if (!user) {
            throw new Error("User not found!");
        }
        if (user.status === "BANNED") {
            throw new Error("User is blocked, please contact support!");
        }

        req.user = { email, name, id, role };

        next();
    })
}
