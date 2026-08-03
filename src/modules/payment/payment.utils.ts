import Stripe from "stripe"
import { prisma } from "../../lib/prisma"

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
    const userId = session.metadata?.userId
    const bookingId = session.metadata?.bookingId
    const stripeCustomerId = session.customer as string

    if (!userId || !bookingId || !stripeCustomerId) {
        throw new Error("Webhook Failed")
    }

    await prisma.payment.create({
        data: {
            transactionId: session.payment_intent as string, // better than session.id
            amount: session.amount_total! / 100,
            status: "COMPLETED",
            customerId: userId,
            bookingId,
        },
    });
}

export const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
    const bookingId = paymentIntent.metadata.bookingId;
    const userId = paymentIntent.metadata.userId;

    if (!bookingId || !userId) {
        throw new Error("Webhook failed");
    }

    await prisma.payment.create({
        data: {
            transactionId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            status: "FAILED",
            customerId: userId,
            bookingId,
        },
    });
};