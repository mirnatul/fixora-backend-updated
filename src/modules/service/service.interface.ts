import { ServiceWhereInput } from "../../../generated/prisma/models";

export interface IService {
    title: string;
    description: string;
    price: number;
    duration: number;
    location: string;
    categoryId: string;  // in frontend dropdown
    imageUrl: string;
}

export interface IServiceQuery {
    categoryId?: string;
    location?: string;
    price?: number;
    rating?: number;
    active?: string;
}

export interface IUpdateService {
    title?: string;
    description?: string;
    price?: number;
    duration?: number;
    location?: string;
    active?: boolean;
    imageUrl?: string;
}


export interface IServiceQuery {
    page?: string;
    limit?: string;
    sort?: string;
    order?: "asc" | "desc";
    searchTerm?: string;
    categoryName?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: number;
    active?: string;
}