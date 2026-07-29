import { PrismaClient } from "../database/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const packages = [
  {
    name: "Free",
    slug: "free",
    description: "For casual users",
    price: 0,
    currency: "USD",
    maxTokensPerDay: 50000,
    features: JSON.stringify(["Advanced AI model", "Streaming responses", "Markdown support", "50K tokens/day"]),
  },
  {
    name: "Pro",
    slug: "pro",
    description: "For power users",
    price: 9.99,
    currency: "USD",
    maxTokensPerDay: 500000,
    features: JSON.stringify(["Faster models", "500K tokens/day", "All tools", "Custom prompts", "Priority support"]),
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "For teams and businesses",
    price: 29.99,
    currency: "USD",
    maxTokensPerDay: 2000000,
    features: JSON.stringify(["Unlimited models", "2M tokens/day", "API access", "Team management", "Dedicated support", "Custom integrations"]),
  },
]

async function main() {
  // Seed subscriptions
  for (const pkg of packages) {
    await prisma.subscription.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    })
    console.log(`✓ ${pkg.name} package ready`)
  }

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nexachat.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123"
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  })
  console.log(`✓ Admin user ready (${adminEmail})`)

  console.log("\nSeed complete!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
