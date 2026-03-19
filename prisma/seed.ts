import { FlowLevel, PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { clerkId: 'seed_admin_clerk_id' },
    update: {
      email: 'admin@example.com',
      name: 'Sample Admin',
      role: Role.ADMIN,
    },
    create: {
      clerkId: 'seed_admin_clerk_id',
      email: 'admin@example.com',
      name: 'Sample Admin',
      role: Role.ADMIN,
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { clerkId: 'seed_user_clerk_id' },
    update: {
      email: 'user@example.com',
      name: 'Sample User',
      role: Role.USER,
    },
    create: {
      clerkId: 'seed_user_clerk_id',
      email: 'user@example.com',
      name: 'Sample User',
      role: Role.USER,
    },
  })

  await prisma.cycle.deleteMany({
    where: { userId: regularUser.id },
  })

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 12)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 4)

  const cycle = await prisma.cycle.create({
    data: {
      userId: regularUser.id,
      startDate,
      endDate,
      cycleLength: 28,
      periodLength: 5,
      flow: FlowLevel.MEDIUM,
    },
  })

  console.log('Seeded admin user:', adminUser.email)
  console.log('Seeded regular user:', regularUser.email)
  console.log('Seeded sample cycle:', cycle.id)
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
