import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import { IUpdateUser, RegisterUserPayload, UpdateStatusPayload } from "./user.interface";


const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, profileImage, phone, address, city, role } = payload;
    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })
    if (isUserExist) {
        throw new Error("User with this email already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_round));

    // user create and profile create (only if the user is technician)
    const createdUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, profileImage, phone, address, city, role }
    })
    if (role === Role.TECHNICIAN) {
        await prisma.technicianProfile.create({
            data: { userId: createdUser.id }
        })
    }

    const user = await prisma.user.findUnique({
        where: { id: createdUser.id },
        omit: { password: true }
    })

    return user;
}

// admin only
interface PaginationOptions {
    page?: number;
    limit?: number;
}

interface GetAllUsersOptions {
    page?: number;
    limit?: number;
    searchTerm?: string;
}

const getAllUserFromDB = async ({
    page = 1,
    limit = 10,
    searchTerm = "",
}: GetAllUsersOptions) => {
    const skip = (page - 1) * limit;

    const where = searchTerm
        ? {
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    },
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    },
                },
                {
                    phone: {
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    },
                },
            ],
        }
        : {};

    const [totalUsers, users] = await Promise.all([
        prisma.user.count({
            where,
        }),
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            omit: {
                password: true,
            },
        }),
    ]);

    return {
        data: users,
        meta: {
            page,
            limit,
            total: totalUsers,
            totalPage: Math.ceil(totalUsers / limit),
        },
    };
};

// admin only
interface IUpdateStatusPayload {
    userId: string;
    status: ActiveStatus;
}
const updateUserStatusInDB = async (payload: IUpdateStatusPayload) => {
    const user = await prisma.user.update({
        where: { id: payload.userId },
        data: { status: payload.status },
        omit: { password: true }
    })

    return user;
}



// admin dashboard work
const getDashboardStats = async () => {
    const [
        totalUsers,
        totalTechnicians,
        totalBookings,
        revenue,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.technicianProfile.count(),
        prisma.booking.count(),
        prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: "COMPLETED",
            },
        }),
    ]);

    return {
        totalUsers,
        totalBookings,
        revenue: revenue._sum.amount ?? 0,
        totalTechnicians,
    };
};


export const userService = {
    registerUserIntoDB,
    getAllUserFromDB,
    updateUserStatusInDB,
    getDashboardStats
}