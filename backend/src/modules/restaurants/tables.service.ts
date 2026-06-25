import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as crypto from "crypto";

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async findByRestaurant(restaurantId: string) {
    return this.prisma.table.findMany({
      where: { restaurantId },
      orderBy: { number: "asc" },
    });
  }

  async create(restaurantId: string, data: { number: number; capacity?: number }) {
    const qrCode = this.generateQRData(restaurantId, data.number);
    return this.prisma.table.create({
      data: {
        restaurantId,
        number: data.number,
        capacity: data.capacity || 4,
        qrCode,
      },
    });
  }

  async updateStatus(id: string, isOccupied: boolean) {
    return this.prisma.table.update({
      where: { id },
      data: { isOccupied },
    });
  }

  async delete(id: string) {
    return this.prisma.table.delete({ where: { id } });
  }

  async getQRCode(restaurantId: string, tableNumber: number) {
    const table = await this.prisma.table.findUnique({
      where: { restaurantId_number: { restaurantId, number: tableNumber } },
    });

    if (!table) throw new NotFoundException("Table not found");

    return {
      tableId: table.id,
      tableNumber: table.number,
      restaurantId,
      qrData: table.qrCode || this.generateQRData(restaurantId, tableNumber),
      qrUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/menu?table=${tableNumber}&restaurant=${restaurantId}`,
    };
  }

  private generateQRData(restaurantId: string, tableNumber: number): string {
    const payload = JSON.stringify({ restaurantId, tableNumber, ts: Date.now() });
    const hash = crypto.createHash("sha256").update(payload).digest("hex").slice(0, 16);
    return `FCQR-${restaurantId.slice(-6).toUpperCase()}-T${tableNumber}-${hash}`;
  }
}
