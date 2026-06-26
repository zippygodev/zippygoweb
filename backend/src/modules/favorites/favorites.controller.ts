import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FavoritesService } from "./favorites.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Favorites")
@Controller("favorites")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@CurrentUser() user: { id: string }) {
    return this.favoritesService.findAll(user.id);
  }

  @Post("toggle")
  async toggleFavorite(
    @CurrentUser() user: { id: string },
    @Body("restaurantId") restaurantId: string,
  ) {
    return this.favoritesService.toggle(user.id, restaurantId);
  }

  @Get("status/:restaurantId")
  async checkFavoriteStatus(
    @CurrentUser() user: { id: string },
    @Param("restaurantId") restaurantId: string,
  ) {
    return this.favoritesService.isFavorited(user.id, restaurantId);
  }
}
