import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: any,
    @CurrentUser() user: { id: string },
  ) {
    return this.ordersService.create({ ...body, userId: user.id });
  }

  @Get("my")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async myOrders(@CurrentUser() user: { id: string }) {
    return this.ordersService.findByUser(user.id);
  }

  @Get("restaurant/:restaurantId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async restaurantOrders(
    @Param("restaurantId") restaurantId: string,
    @Query("status") status?: string,
  ) {
    return this.ordersService.findByRestaurant(restaurantId, status);
  }

  @Patch(":id/status")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: string,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
