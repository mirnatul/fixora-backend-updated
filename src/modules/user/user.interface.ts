import { ActiveStatus, Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    imageUrl?: string;
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
    imageUrl?: string;
    address?: string;
    city?: string;
}