import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IBookingPayload } from "./booking.interface"

const createBooking = async (userId: string, payload: IBookingPayload) => {

    // clean up befor today's availabiity
    // ----------------------------------------------------------
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.availability.deleteMany({
        where: {
            date: {
                lt: today,
            },
        },
    });
    // -----------------------------------------------------------


    const service = await prisma.service.findUniqueOrThrow({
        where: { id: payload.serviceId }
    })

    let availability = await prisma.availability.findUnique({
        where: {
            technicianId_date: {
                technicianId: service.technicianId,
                date: new Date(payload.bookingDate)
            }
        }
    })

    // updated
    if (!availability) {
        availability = {
            bookedSlot: [],
        } as any;
    }

    const dbSlot = availability?.bookedSlot as number[];
    const duplicateSlots = payload.slot.filter(slot => dbSlot.includes(slot));
    if (duplicateSlots.length > 0) {
        throw new Error(`These slots are already booked: ${duplicateSlots.join(", ")}`);
    }
    const updatedSlots = [...dbSlot, ...payload.slot];


    if (availability?.id) {
        await prisma.availability.update({
            where: {
                technicianId_date: {
                    technicianId: service.technicianId,
                    date: new Date(payload.bookingDate),
                },
            },
            data: {
                bookedSlot: updatedSlots,
            },
        });
    } else {
        await prisma.availability.create({
            data: {
                technicianId: service.technicianId,
                date: new Date(payload.bookingDate),
                bookedSlot: updatedSlots,
            },
        });
    }
    // ---------

    const booking = await prisma.booking.create({
        data: {
            bookingDate: new Date(payload.bookingDate),
            slot: payload.slot,
            address: payload.address,
            notes: payload.notes,

            totalAmount: service.price * payload.slot.length * 2,
            technicianId: service.technicianId,
            customerId: userId,
            serviceId: service.id,
        }
    })

    return booking;
}

const getBookingDetails = async (userId: string, bookingId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    const profile = await prisma.technicianProfile.findUnique({
        where: { userId }
    })

    const booking = await prisma.booking.findUniqueOrThrow({
        where: { id: bookingId }
    })

    if (booking.customerId === userId || booking.technicianId === profile?.id || user?.role === "ADMIN") {
        return booking;
    }
    else {
        throw new Error("You are not authorized to visit this route")
    }
}

const getAllBookings = async () => {
    return await prisma.booking.findMany();
}

const getBookingForUser = async (userId: string, authenticateUser: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    })
    if (userId !== authenticateUser && user.role !== "ADMIN") {
        throw new Error("This route only accessible by booked user or admin")
    }
    return await prisma.booking.findMany({
        where: { customerId: userId },
        include: {
            payment: {
                select: {
                    status: true
                }
            },
            review: {
                select: {
                    id: true
                }
            }
        }
    }
    )
}

const getBookingForTechnician = async (technicianId: string, authenticateUser: string, status?: BookingStatus) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: authenticateUser }
    })
    const profile = await prisma.technicianProfile.findUniqueOrThrow({
        where: { id: technicianId }
    })
    if (profile.userId !== authenticateUser && user.role !== "ADMIN") {
        throw new Error("You are not that technician or admin")
    }
    // if (userId !== authenticateUser && user.role !== "ADMIN") {
    //     throw new Error("This route only accessible by booked user or admin")
    // }

    return await prisma.booking.findMany({
        where: { technicianId },
        include: {
            payment: {
                select: {
                    status: true
                }
            },
            review: {
                select: {
                    id: true
                }
            }
        }
    })
}

interface IPayload {
    status: BookingStatus
}

const updateBookingStatus = async (userId: string, bookingId: string, payload: IPayload) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    })

    const booking = await prisma.booking.findUniqueOrThrow({
        where: { id: bookingId }
    })

    if (technician.id !== booking.technicianId) {
        throw new Error("This is not your booking...!")
    }

    return await prisma.booking.update({
        where: { id: bookingId },
        data: payload
    })
}

const cancelBookingByUser = async (userId: string, bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    })

    if (booking?.customerId !== userId) {
        throw new Error("You can only cancel your booking!")
    }

    if (booking.status === "PENDING" || booking.status === "ACCEPTED") {
        return await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" }
        })
    }
    else {
        throw new Error("The booking is already in procees or completed you can't cancel now")
    }
}

const availability = async (technicianId: string, date: string) => {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const availabililty = await prisma.availability.findFirst({
        where: {
            technicianId,
            date: {
                gte: start,
                lte: end,
            },
        },
    });
    const bookedSlot = availabililty?.bookedSlot || [];
    // console.log(bookedSlot);
    return bookedSlot;

};


export const bookingService = {
    createBooking,
    getBookingDetails,
    getAllBookings,
    getBookingForUser,
    getBookingForTechnician,
    updateBookingStatus,
    cancelBookingByUser,
    availability
}