import Stripe from "stripe"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { handleCheckoutCompleted, handlePaymentFailed } from "./payment.utils"



const createCheckoutSession = async (bookingId: string, userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUniqueOrThrow({
            where: { id: bookingId },
            include: { service: true, payment: true }
        })
        const user = await tx.user.findUniqueOrThrow({
            where: { id: userId }
        })

        if (booking.status === "PENDING") {
            throw new Error("Technician is not accept this order yet")
        }

        if (booking.payment?.status === "COMPLETED") {
            throw new Error("Payment already completed for this booking")
        }

        // customer id
        let stripeCustomerId = user.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            })

            stripeCustomerId = customer.id
        }

        // putting customer id in users field
        await prisma.user.update({
            where: { id: userId },
            data: {
                stripeCustomerId,
            },
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `${booking.service.title}`,
                            description: `Booking #${booking.service.description}`,
                        },
                        unit_amount: Math.round(Number(booking.totalAmount) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/paymentSuccessPage`,
            cancel_url: `${config.app_url}/paymentFailedPage`,
            metadata: {
                userId: user.id,
                bookingId: booking.id
            }
        })
        return session.url
    })


    return {
        paymentUrl: transactionResult
    }
}

const handleWebhook = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.stripe_webhook_secret;

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );

    // switch case
    switch (event.type) {
        case 'checkout.session.completed':
            // occurs when a checkout session has been successfully completed
            await handleCheckoutCompleted(event.data.object);
            console.log("LOCAL WEBHOOK RECEIVED");
            break;
        case 'payment_intent.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;
        default:
            // Unexpected event type
            console.log(`No event match, Unhandled event type ${event.type}.`);
            break;
    }
}

const getCurrentUsersPaymentHistory = async (userId: string) => {
    return await prisma.payment.findMany({
        where: { customerId: userId },
        include: {
            booking: {
                select: {
                    service: {
                        select: { title: true }
                    }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })
}

const getPaymentHistoryById = async (userId: string, paymentId: string) => {
    const payment = await prisma.payment.findUniqueOrThrow({
        where: { id: paymentId }
    })

    if (payment.customerId !== userId) {
        throw new Error("You can't see a payment history which is not yours")
    }
    return payment
}


export const paymentService = {
    createCheckoutSession,
    handleWebhook,
    getCurrentUsersPaymentHistory,
    getPaymentHistoryById
}