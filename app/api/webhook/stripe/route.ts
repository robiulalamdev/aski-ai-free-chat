import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, planSlug, email } = session.metadata || {}

        if (!userId || !planSlug) break

        const sub = await prisma.subscription.findUnique({ where: { slug: planSlug } })
        if (!sub) break

        await prisma.userSubscription.updateMany({
          where: { userId, isActive: true },
          data: { isActive: false, endDate: new Date() },
        })

        await prisma.userSubscription.create({
          data: {
            userId,
            subscriptionId: sub.id,
            stripeCustomerId: (session.customer as string) || null,
            stripeSubscriptionId: (session.subscription as string) || null,
            stripeSessionId: session.id,
            isActive: true,
          },
        })

        await prisma.user.update({
          where: { id: userId },
          data: { plan: planSlug },
        })

        console.log(`✓ Subscription activated: ${email} → ${planSlug}`)
        break
      }

      case "invoice.paid": {
        const rawInvoice = event.data.object as unknown as { subscription?: string | null }
        const subscriptionId = rawInvoice.subscription

        if (subscriptionId) {
          const userSub = await prisma.userSubscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
          })

          if (userSub) {
            await prisma.userSubscription.update({
              where: { id: userSub.id },
              data: { tokensUsedToday: 0, lastResetAt: new Date() },
            })
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object as Stripe.Subscription

        const userSub = await prisma.userSubscription.findFirst({
          where: { stripeSubscriptionId: deletedSub.id },
        })

        if (userSub) {
          await prisma.userSubscription.update({
            where: { id: userSub.id },
            data: { isActive: false, endDate: new Date() },
          })

          await prisma.user.update({
            where: { id: userSub.userId },
            data: { plan: "free" },
          })

          console.log(`✓ Subscription cancelled, reverted to free`)
        }
        break
      }

      case "customer.subscription.updated": {
        const updatedSub = event.data.object as Stripe.Subscription

        const userSub = await prisma.userSubscription.findFirst({
          where: { stripeSubscriptionId: updatedSub.id },
        })

        if (userSub) {
          const periodEnd = (updatedSub as unknown as { current_period_end?: number }).current_period_end
          await prisma.userSubscription.update({
            where: { id: userSub.id },
            data: {
              stripeCurrentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Handler error" }, { status: 500 })
  }
}
