import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { RestaurantsService } from "./restaurants.service";
import { TablesService } from "./tables.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("Restaurants")
@Controller("restaurants")
export class RestaurantsController {
  constructor(
    private restaurantsService: RestaurantsService,
    private tablesService: TablesService,
  ) {}

  @Get()
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("cuisine") cuisine?: string,
    @Query("isOpen") isOpen?: string,
  ) {
    return this.restaurantsService.findAll({
      page,
      limit,
      cuisine,
      isOpen: isOpen === "true" ? true : isOpen === "false" ? false : undefined,
    });
  }

  @Get(":slug")
  async findBySlug(@Param("slug") slug: string) {
    return this.restaurantsService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("RESTAURANT_OWNER", "MALL_ADMIN", "SUPER_ADMIN")
  async create(@Body() body: any) {
    return this.restaurantsService.create(body);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() body: any) {
    return this.restaurantsService.update(id, body);
  }

  // Table Management
  @Get(":id/tables")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getTables(@Param("id") id: string) {
    return this.tablesService.findByRestaurant(id);
  }

  @Post(":id/tables")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createTable(@Param("id") id: string, @Body() body: { number: number; capacity?: number }) {
    return this.tablesService.create(id, body);
  }

  @Patch(":id/tables/:tableId/status")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateTableStatus(@Param("tableId") tableId: string, @Body() body: { isOccupied: boolean }) {
    return this.tablesService.updateStatus(tableId, body.isOccupied);
  }

  @Delete(":id/tables/:tableId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteTable(@Param("tableId") tableId: string) {
    return this.tablesService.delete(tableId);
  }

  @Get(":id/tables/:tableNumber/qr")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getTableQR(@Param("id") id: string, @Param("tableNumber") tableNumber: string) {
    return this.tablesService.getQRCode(id, parseInt(tableNumber));
  }
}
