import cloudinary from "../../config/cloudinary";

const getCloudinarySignature = async () => {
    const timestamp = Math.round(
        Date.now() / 1000
    );

    const folder = "fixora/categories";

    const signature =
        cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            process.env.CLOUDINARY_API_SECRET!
        );

    return {
        signature,
        timestamp,
        cloudName:
            process.env.CLOUDINARY_CLOUD_NAME,
        apiKey:
            process.env.CLOUDINARY_API_KEY,
        folder,
    };
};

export const cloudinaryService = {
    getCloudinarySignature,
};