import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("Analytics")
@Controller("analytics")
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get("restaurant/:restaurantId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getRestaurantStats(@Param("restaurantId") restaurantId: string) {
    return this.analyticsService.getRestaurantStats(restaurantId);
  }

  @Get("restaurant/:restaurantId/revenue")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getRestaurantRevenue(
    @Param("restaurantId") restaurantId: string,
    @Query("days") days?: string,
  ) {
    return this.analyticsService.getRestaurantRevenue(restaurantId, days ? parseInt(days) : 30);
  }

  @Get("mall/:organizationId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMallStats(@Param("organizationId") organizationId: string) {
    return this.analyticsService.getMallStats(organizationId);
  }

  @Get("super-admin")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getSuperAdminStats() {
    return this.analyticsService.getSuperAdminStats();
  }
}
