import { prisma } from "../../lib/prisma";

interface IReview {
    rating: number;
    comment: string;
}

const createReview = async (bookingId: string, payload: IReview) => {
    const booking = await prisma.booking.findUniqueOrThrow({
        where: { id: bookingId }
    })

    const checkIfReviewPresentALready = await prisma.review.findUnique({
        where: { bookingId }
    })

    if (checkIfReviewPresentALready) {
        throw new Error("You already reviewed this booking!!")
    }
    else if (booking.status === "COMPLETED") {
        const review = await prisma.review.create({
            data: { ...payload, bookingId }
        })

        // update the technician rating
        await updateRating(booking.technicianId, booking.serviceId);

        return review;
    }
    else {
        throw new Error("You can't review until the booking is completed")
    }
}

// dynamically updating the rating for technician
// const updateRating = async (technicianId: string) => {
//     const stats = await prisma.review.aggregate({
//         where: {
//             booking: {
//                 technicianId
//             }
//         },
//         _avg: {
//             rating: true
//         },
//         _count: {
//             rating: true
//         }
//     });

//     await prisma.technicianProfile.update({
//         where: { id: technicianId },
//         data: {
//             averageRating: stats._avg.rating ?? 0,
//             totalReviews: stats._count.rating
//         }
//     });
// }

const updateRating = async (
    technicianId: string,
    serviceId: string
) => {
    // Update technician rating
    const technicianStats = await prisma.review.aggregate({
        where: {
            booking: {
                technicianId
            }
        },
        _avg: {
            rating: true
        },
        _count: {
            rating: true
        }
    });

    await prisma.technicianProfile.update({
        where: {
            id: technicianId
        },
        data: {
            averageRating: technicianStats._avg.rating ?? 0,
            totalReviews: technicianStats._count.rating
        }
    });


    // Update only the reviewed service rating
    const serviceStats = await prisma.review.aggregate({
        where: {
            booking: {
                serviceId
            }
        },
        _avg: {
            rating: true
        }
    });

    await prisma.service.update({
        where: {
            id: serviceId
        },
        data: {
            rating: serviceStats._avg.rating ?? 0
        }
    });
};

export const reviewService = {
    createReview,
}