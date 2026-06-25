import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany({ include: { _count: { select: { restaurants: true } } } });
  }

  async create(data: { name: string; slug: string }) {
    return this.prisma.organization.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.organization.update({ where: { id }, data });
  }

  async findForUser(userId: string, role: string, email: string) {
    if (role === "SUPER_ADMIN") {
      return this.prisma.organization.findFirst();
    }
    const domain = email.split("@")[1];
    if (domain && domain !== "example.com" && domain !== "foodcourtos.com") {
      const matched = await this.prisma.organization.findFirst({
        where: {
          OR: [
            { email: { endsWith: domain } },
            { domain: { contains: domain } },
            { slug: { contains: domain.split(".")[0] } },
          ],
        },
      });
      if (matched) return matched;
    }
    return this.prisma.organization.findFirst();
  }
}
