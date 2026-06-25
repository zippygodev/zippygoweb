import { Controller, Get, Post, Patch, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { OrganizationsService } from "./organizations.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Organizations")
@Controller("organizations")
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get("my")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findMyOrganization(@CurrentUser() user: any) {
    return this.organizationsService.findForUser(user.sub || user.id, user.role, user.email);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  async create(@Body() body: { name: string; slug: string }) {
    return this.organizationsService.create(body);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() body: any) {
    return this.organizationsService.update(id, body);
  }
}
