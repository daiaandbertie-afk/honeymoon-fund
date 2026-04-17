import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, guestName, message, experience } = await req.json();

    // Validate
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: "Minimum contribution is $1" },
        { status: 400 }
      );
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: experience || "Honeymoon Fund",
              description: `From ${guestName}`,
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?name=${encodeURIComponent(guestName)}&experience=${encodeURIComponent(experience || "our honeymoon")}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      metadata: {
        guest_name: guestName,
        message: message || "",
        experience: experience || "General Honeymoon Fund",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
