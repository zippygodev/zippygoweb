import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { FirebaseService } from "./firebase.service";

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseService,
  ) {}

  async create(data: { userId: string; title: string; body: string; type?: string; fcmToken?: string }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        body: data.body,
        type: data.type || "info",
      },
    });

    if (data.fcmToken) {
      await this.firebaseService.sendPushNotification(data.fcmToken, data.title, data.body);
    }

    return notification;
  }

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }
}
