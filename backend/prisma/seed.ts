import { BookingStatus, Gender, PrismaClient, UserRole } from '@prisma/client'
import * as process from 'process'
import { hashPassword } from '../src/utils/auth'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.booking.deleteMany()
  await prisma.user.deleteMany()
  await prisma.location.deleteMany()

  // Create locations first
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Main Office',
        address: '123 Business Park, Whitefield',
        latitude: 12.9716,
        longitude: 77.5946,
        distanceFromOffice: 0 // This is the reference point
      }
    }),
    prisma.location.create({
      data: {
        name: 'Tech Park',
        address: '456 Tech Valley, Electronic City',
        latitude: 12.8458,
        longitude: 77.6618,
        distanceFromOffice: 15.2
      }
    }),
    prisma.location.create({
      data: {
        name: 'North Campus',
        address: '789 Innovation Hub, Hebbal',
        latitude: 13.0358,
        longitude: 77.5946,
        distanceFromOffice: 8.5
      }
    }),
    prisma.location.create({
      data: {
        name: 'South Campus',
        address: '321 Digital Zone, HSR Layout',
        latitude: 12.9116,
        longitude: 77.6432,
        distanceFromOffice: 12.3
      }
    }),
    prisma.location.create({
      data: {
        name: 'Downtown Office',
        address: '555 Central Square, MG Road',
        latitude: 12.9767,
        longitude: 77.5713,
        distanceFromOffice: 5.8
      }
    })
  ])

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: await hashPassword('123456'),
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ADMIN,
      gender: Gender.MALE,
      department: 'Administration'
    }
  })

  // Create some employees
  const employee1 = await prisma.user.create({
    data: {
      email: 'employee1@gmail.com',
      password: await hashPassword('123456'),
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.EMPLOYEE,
      gender: Gender.FEMALE,
      department: 'Engineering'
    }
  })

  // Create some bookings
  await prisma.booking.createMany({
    data: [
      {
        userId: employee1.id,
        pickupId: locations[0].id, // Main Office
        dropId: locations[1].id,   // Tech Park
        status: BookingStatus.PENDING,
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        createdAt: new Date(),
        updatedAt: new Date(),
        fare: 250
      },
      {
        userId: employee1.id,
        pickupId: locations[1].id, // Tech Park
        dropId: locations[0].id,   // Main Office
        status: BookingStatus.APPROVED,
        scheduledTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        createdAt: new Date(),
        updatedAt: new Date(),
        fare: 250
      },
      {
        userId: employee1.id,
        pickupId: locations[2].id, // North Campus
        dropId: locations[3].id,   // South Campus
        status: BookingStatus.COMPLETED,
        scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        createdAt: new Date(),
        updatedAt: new Date(),
        fare: 300
      }
    ]
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 