import { Prisma } from "../../../generated/prisma/client"
import { ServiceWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { IService, IServiceQuery, IUpdateService } from "./service.interface"

const createService = async (payload: IService, userId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    })

    const service = await prisma.service.create({
        data: { ...payload, technicianId: technician.id }
    })

    return service;
}

const updateService = async (userId: string, serviceId: string, payload: IUpdateService) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    })

    const service = await prisma.service.findUnique({
        where: { id: serviceId, technicianId: technician.id }
    })
    if (!service) {
        throw new Error("This service is not yours!!")
    }

    const updatedService = await prisma.service.update({
        where: {
            id: serviceId, technicianId: technician.id
        },
        data: payload
    });

    return updatedService;
}

const deleteService = async (userId: string, serviceId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    });

    const service = await prisma.service.findUnique({
        where: {
            id: serviceId,
            technicianId: technician.id
        }
    });

    if (!service) {
        throw new Error("This service is not yours!!");
    }

    const deletedService = await prisma.service.delete({
        where: {
            id: serviceId
        }
    });

    return deletedService;
};

// get service with filter (type/category, location, rating)
const getService = async (query: IServiceQuery) => {
    // console.log("FILTER VERSION: NEW CODE");
    const andCondition: ServiceWhereInput[] = [];

    const page = Number(query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    if (query.searchTerm) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    location: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    if (query.categoryName) {
        andCondition.push({
            category: {
                name: {
                    equals: query.categoryName,
                    mode: "insensitive",
                },
            },
        });
    }

    if (query.location) {
        andCondition.push({
            location: {
                contains: query.location,
                mode: "insensitive",
            },
        });
    }

    if (query.minPrice || query.maxPrice) {
        andCondition.push({
            price: {
                ...(query.minPrice && {
                    gte: Number(query.minPrice),
                }),
                ...(query.maxPrice && {
                    lte: Number(query.maxPrice),
                }),
            },
        });
    }

    if (query.rating) {
        andCondition.push({
            rating: {
                gte: Number(query.rating),
            },
        });
    }

    if (query.active !== undefined) {
        andCondition.push({
            active: query.active === "true",
        });
    }

    // Public services should only show active services
    andCondition.push({
        active: true,
    });

    const where: ServiceWhereInput = {
        AND: andCondition,
    };

    let orderBy: Prisma.ServiceOrderByWithRelationInput = {
        createdAt: "desc",
    };

    if (query.sort) {
        orderBy = {
            [query.sort]: query.order === "asc" ? "asc" : "desc",
        };
    }

    const [services, total] = await Promise.all([
        prisma.service.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                category: true,
            },
        }),

        prisma.service.count({
            where,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        services,
    };
};

const getServiceForTechnician = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    })

    const services = await prisma.service.findMany({
        where: { technicianId: technician.id },
        include: {
            category: true,
        },
    });


    return services || [];
}

const getServiceById = async (serviceId: string) => {
    const service = await prisma.service.findUniqueOrThrow({
        where: { id: serviceId },
        include: {
            category: true,
        },
    })

    return service;
}



const topServices = async () => {
    const services = await prisma.service.findMany({
        orderBy: {
            rating: "desc"
        },
        take: 4,
        include: {
            category: true,
        },
    })

    return services;
}


export const serviceService = {
    createService,
    getService,
    updateService,
    getServiceById,
    getServiceForTechnician,
    topServices,
    deleteService
}