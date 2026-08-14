import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IUpdateUser } from "./auth.interface"
import { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


const getMyProfileFromDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: { password: true },
        include: {
            technicianProfile: true
        }
    })

    return user;
}

const updateMyInfo = async (userId: string, payload: IUpdateUser) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });

    if (user.id !== userId) {
        throw new Error("You can only edit your id!")
    }

    return await prisma.user.update({
        where: { id: userId },
        data: payload,
        omit: { password: true }
    });
}

interface IUpdateProfile {
    bio: string;
    experience: number;
}
const updateTechnicianInfo = async (userId: string, payload: IUpdateProfile) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId },
    });

    if (technician.userId !== userId) {
        throw new Error("You can only edit your profile!")
    }

    return await prisma.technicianProfile.update({
        where: { id: userId },
        data: payload
    });
}

const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.error)
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { id }
    })

    if (user.status === "BANNED") {
        throw new Error("User is banned, please contact support!");
    }


    // generate new access token
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const newAccessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    return {
        accessToken: newAccessToken
    }
}


export const authService = {
    getMyProfileFromDB,
    updateMyInfo,
    refreshToken,
    updateTechnicianInfo
}