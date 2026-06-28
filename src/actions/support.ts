'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function createTicket(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const priority = (formData.get('priority') as string) || 'MEDIUM';

    if (!subject || !description) {
      throw new Error('Subject and description are required');
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        subject,
        description,
        priority: priority as any,
        messages: {
          create: {
            senderId: session.user.id,
            message: description,
          }
        }
      }
    });

    revalidatePath('/customer/support');
    return { success: true, data: ticket };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMyTickets() {
  try {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { messages: true } }
      }
    });

    return { success: true, data: tickets };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllTickets() {
  try {
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'MALL_ADMIN'].includes(session.user.role)) {
      throw new Error('Unauthorized');
    }

    const tickets = await prisma.supportTicket.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        _count: { select: { messages: true } }
      }
    });

    return { success: true, data: tickets };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTicketDetails(ticketId: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { name: true, role: true, avatarUrl: true }
            }
          }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!ticket) throw new Error('Ticket not found');

    // Security check
    if (ticket.userId !== session.user.id && !['SUPER_ADMIN', 'MALL_ADMIN'].includes(session.user.role)) {
      throw new Error('Unauthorized');
    }

    return { success: true, data: ticket };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addMessage(ticketId: string, message: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) throw new Error('Ticket not found');

    const isAdmin = ['SUPER_ADMIN', 'MALL_ADMIN'].includes(session.user.role);

    if (ticket.userId !== session.user.id && !isAdmin) {
      throw new Error('Unauthorized');
    }

    await prisma.supportMessage.create({
      data: {
        ticketId,
        senderId: session.user.id,
        message,
        isAdmin,
      }
    });

    // Update ticket timestamp and status if admin replies
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        updatedAt: new Date(),
        status: isAdmin && ticket.status === 'OPEN' ? 'IN_PROGRESS' : ticket.status
      }
    });

    revalidatePath('/customer/support');
    revalidatePath('/dashboard/superadmin/support');
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTicketStatus(ticketId: string, status: string) {
  try {
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'MALL_ADMIN'].includes(session.user.role)) {
      throw new Error('Unauthorized');
    }

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: status as any }
    });

    revalidatePath('/dashboard/superadmin/support');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
