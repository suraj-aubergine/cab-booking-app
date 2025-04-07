import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserRole() {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: 'suraj@example.com'
      },
      data: {
        role: 'ADMIN'  // Make sure this matches your enum in schema
      }
    });
    
    console.log('User role updated successfully:', updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole(); 