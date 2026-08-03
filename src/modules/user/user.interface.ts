import { ActiveStatus, Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    profileImage?: string;
    phone: string;
    address: string;
    city: string;
    role: Role
}

export interface UpdateStatusPayload {
    status: ActiveStatus
}

export interface IUpdateUser {
    name?: string;
    phone?: string;
    profileImage?: string;
    address?: string;
    city?: string;
}