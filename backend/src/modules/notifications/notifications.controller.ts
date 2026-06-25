import { Controller, Get, Patch, Param, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findByUser(@CurrentUser() user: any) {
    return this.notificationsService.findByUser(user.id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { title: string; body: string }, @CurrentUser() user: any) {
    return this.notificationsService.create({ ...body, userId: user.id });
  }

  @Patch(":id/read")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param("id") id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
