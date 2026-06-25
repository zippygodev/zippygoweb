import { Controller, Get, Post, Patch, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SubscriptionsService } from "./subscriptions.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("Subscriptions")
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get("organization/:organizationId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findByOrganization(@Param("organizationId") organizationId: string) {
    return this.subscriptionsService.findByOrganization(organizationId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  async create(@Body() body: { organizationId: string; plan: string }) {
    return this.subscriptionsService.create(body);
  }

  @Patch(":id/upgrade")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  async upgrade(@Param("id") id: string, @Body("plan") plan: string) {
    return this.subscriptionsService.upgrade(id, plan);
  }
}
