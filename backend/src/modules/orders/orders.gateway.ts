import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  namespace: "/orders",
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrdersGateway.name);
  private restaurantRooms = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up room mappings
    this.restaurantRooms.forEach((clients, restaurantId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.restaurantRooms.delete(restaurantId);
        }
      }
    });
  }

  @SubscribeMessage("joinRestaurant")
  handleJoinRestaurant(client: Socket, restaurantId: string) {
    const room = `restaurant:${restaurantId}`;
    client.join(room);

    if (!this.restaurantRooms.has(restaurantId)) {
      this.restaurantRooms.set(restaurantId, new Set());
    }
    this.restaurantRooms.get(restaurantId)?.add(client.id);

    this.logger.log(`Client ${client.id} joined restaurant ${restaurantId}`);
    return { event: "joined", data: { restaurantId } };
  }

  @SubscribeMessage("leaveRestaurant")
  handleLeaveRestaurant(client: Socket, restaurantId: string) {
    const room = `restaurant:${restaurantId}`;
    client.leave(room);

    this.restaurantRooms.get(restaurantId)?.delete(client.id);
    this.logger.log(`Client ${client.id} left restaurant ${restaurantId}`);
  }

  // Emit new order to restaurant staff
  sendNewOrder(restaurantId: string, order: any) {
    this.server.to(`restaurant:${restaurantId}`).emit("newOrder", order);
    this.logger.log(`New order emitted to restaurant ${restaurantId}`);
  }

  // Emit order status update
  sendOrderStatusUpdate(restaurantId: string, orderId: string, status: string) {
    this.server
      .to(`restaurant:${restaurantId}`)
      .emit("orderStatusUpdate", { orderId, status });
  }

  // Emit order status update to a specific user
  sendUserOrderUpdate(userId: string, order: any) {
    this.server.to(`user:${userId}`).emit("orderUpdate", order);
  }

  @SubscribeMessage("joinUser")
  handleJoinUser(client: Socket, userId: string) {
    client.join(`user:${userId}`);
    return { event: "joined", data: { userId } };
  }
}
