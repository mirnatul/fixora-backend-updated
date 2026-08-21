import { Role } from "../../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";

interface CategoryData {
    name: string;
    description: string;
    imageUrl?: string;
    imagePublicId?: string;
    categoryServices: string[];
}

// ============================================================
// CREATE CATEGORY
// ============================================================

const createCategory = async (payload: CategoryData) => {

    console.log(payload);
    const category = await prisma.category.create({
        data: {
            name: payload.name,
            description: payload.description,
            imageUrl: payload.imageUrl,
            imagePublicId: payload.imagePublicId,
            categoryServices: payload.categoryServices.join(", "),
        },
    });

    return category;
};

// ============================================================
// UPDATE CATEGORY
// ============================================================

const updateCategory = async (
    categoryId: string,
    payload: Partial<CategoryData>,
) => {
    const category = await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            ...(payload.name !== undefined && {
                name: payload.name,
            }),

            ...(payload.description !== undefined && {
                description: payload.description,
            }),

            ...(payload.imageUrl !== undefined && {
                imageUrl: payload.imageUrl,
            }),

            ...(payload.imagePublicId !== undefined && {
                imagePublicId: payload.imagePublicId,
            }),

            ...(payload.categoryServices !== undefined && {
                categoryServices: payload.categoryServices.join(", "),
            }),
        },
    });

    return category;
};

// ============================================================
// GET ALL CATEGORIES
// ============================================================

const getAllCategory = async (_role: Role) => {
    return await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

// ============================================================
// EXPORT
// ============================================================

export const categoryService = {
    createCategory,
    getAllCategory,
    updateCategory,
};