import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { initializeApp, cert, App } from "firebase-admin/app";
import { getMessaging, Message } from "firebase-admin/messaging";

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: App | null = null;

  onModuleInit() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey && !projectId.startsWith("your-")) {
      try {
        const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

        this.firebaseApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: formattedPrivateKey,
          }),
        }, "food-court-os");

        this.logger.log("Firebase Admin SDK initialized successfully");
      } catch (err: any) {
        this.logger.error(`Failed to initialize Firebase Admin SDK: ${err.message}`);
      }
    } else {
      this.logger.warn("Firebase credentials not configured – running in simulated mode");
    }
  }

  isReady(): boolean {
    return this.firebaseApp !== null;
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<boolean> {
    if (!this.isReady() || !this.firebaseApp) {
      this.logger.log(`[Simulated Push] To: ${token} | Title: ${title} | Body: ${body}`);
      return true;
    }

    try {
      const message: Message = {
        token,
        notification: {
          title,
          body,
        },
        data: data || {},
      };

      const response = await getMessaging(this.firebaseApp).send(message);
      this.logger.log(`Push notification sent successfully: ${response}`);
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send push notification via FCM: ${err.message}`);
      return false;
    }
  }
}
