import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async findByOrganization(organizationId: string) {
    return this.prisma.subscription.findMany({ where: { organizationId } });
  }

  async create(data: { organizationId: string; plan: string }) {
    return this.prisma.subscription.create({ data });
  }

  async upgrade(id: string, plan: string) {
    return this.prisma.subscription.update({ where: { id }, data: { plan } });
  }
}
