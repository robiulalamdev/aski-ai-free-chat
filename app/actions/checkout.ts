"use server"

import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import env from "@/config/env"

export async function createCheckoutSession(slug: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return { error: "You must be logged in" }

    const sub = await prisma.subscription.findUnique({ where: { slug } })
    if (!sub) return { error: "Plan not found" }
    if (sub.price === 0) return { error: "Free plan cannot be purchased" }
    if (!sub.isActive) return { error: "This plan is currently unavailable" }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `NexaChat ${sub.name}`,
              description: sub.description,
              metadata: { planSlug: sub.slug },
            },
            unit_amount: Math.round(sub.price * 100),
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.userId,
        planSlug: sub.slug,
        email: user.email,
      },
      success_url: `${env.SITE_URL}/account/subscription?success=true`,
      cancel_url: `${env.SITE_URL}/account/subscription?canceled=true`,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Checkout error:", error)
    return { error: "Failed to create checkout session" }
  }
}

export async function createPortalSession() {
  try {
    const user = await getCurrentUser()
    if (!user) return { error: "You must be logged in" }

    const sub = await prisma.userSubscription.findFirst({
      where: { userId: user.userId, isActive: true },
      orderBy: { startDate: "desc" },
    })

    if (!sub?.stripeCustomerId) {
      return { error: "No active subscription found" }
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${env.SITE_URL}/account/subscription`,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Portal error:", error)
    return { error: "Failed to create portal session" }
  }
}
