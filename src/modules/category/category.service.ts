import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface CategoryData {
    name: string;
    description: string;
    imageUrl: string;
    imagePublicId: string;
}

const createCategory = async (payload: CategoryData) => {
    console.log("🔥 CATEGORY REQUEST BODY:", payload);
    const category = await prisma.category.create({
        data: { ...payload }
    })
    console.log("✅ CATEGORY CREATED:", category);

    return category;
}

const updateCategory = async (
    categoryId: string,
    payload: Partial<CategoryData>
) => {
    const category = await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            ...payload,
        },
    });

    return category;
};

const getAllCategory = async (role: Role) => {
    return await prisma.category.findMany();
}

export const categoryService = {
    createCategory,
    getAllCategory,
    updateCategory
}