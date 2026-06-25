import { Controller, Post, Get, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { restaurantId: string; rating: number; comment?: string }, @CurrentUser() user: any) {
    return this.reviewsService.create({ ...body, userId: user.id });
  }

  @Get("restaurant/:restaurantId")
  async findByRestaurant(@Param("restaurantId") restaurantId: string) {
    return this.reviewsService.findByRestaurant(restaurantId);
  }
}
