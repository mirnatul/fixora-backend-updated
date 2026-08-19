import { Response } from "express";
import config from "../config";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

// Tips: set your NODE_ENV=development; it will automatically will be production in production
const cookieOptions = {
    httpOnly: true,  // true/false
    secure: config.node_env === "production", // http / https
    sameSite:
        config.node_env === "production" ? ("none" as const) : ("lax" as const),
};

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        });
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    console.log("COOKIES SET");
};

export const clearAuthCookie = (res: Response) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
};