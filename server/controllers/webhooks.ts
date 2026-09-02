import { request, Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-08-26.dahlia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeWebhook = async (req: Request, res: Response) => {
  let event: Stripe.Event;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature as string,
        endpointSecret,
      );
    } catch (err: unknown) {
      console.log(
        `⚠️  Webhook signature verification failed.`,
        (err as Error).message,
      );
      return res.sendStatus(400);
    }
  } else {
    event = JSON.parse(req.body.toString()) as Stripe.Event;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const paymentIntentId = paymentIntent.id;

      const session = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });

      const { orderId } = session.data[0].metadata as {
        orderId: string;
        userEmail: string;
      };

      // Mark payment as Paid
      const paidOrder = await prisma.order.update({
        where: { id: orderId },
        data: { isPaid: true },
      });

      // Atualiza o estoque de cada produto após criar o pedido
      const orderItems = (
        Array.isArray(paidOrder.items) ? paidOrder.items : []
      ) as { productId: string; quantity: number }[];

      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (paidOrder) {
        await inngest.send({
          name: "order/placed",
          data: {
            data: { orderId },
          },
        });
      }
      // Send stock update events for each product in the order
      for (const item of orderItems) {
        await inngest.send({
          name: "inventory/stock.updated",
          data: { productId: item.productId, quantity: item.quantity },
        });
      }

      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_intent.canceled":

    case "payment_intent.payment_failed": {
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;

      const pymentIntentIdFailedId = paymentIntentFailed.id;

      // List the checkout sessions associated with the failed payment intent
      const sessionFailed = await stripe.checkout.sessions.list({
        payment_intent: pymentIntentIdFailedId,
        limit: 1,
      });

      const failureOrderId = sessionFailed.data[0].metadata as {
        orderId: string;
        userEmail: string;
      };

      await prisma.order.delete({
        where: { id: failureOrderId.orderId },
      });

      console.log(`PaymentIntent for ${paymentIntentFailed.amount} failed.`);

      break;
    }
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
