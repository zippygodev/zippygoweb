import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token || client.handshake?.query?.token;

    if (!token) {
      throw new WsException("Unauthorized");
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "super-secret-key",
      );
      client.user = payload;
      return true;
    } catch {
      throw new WsException("Invalid token");
    }
  }
}
