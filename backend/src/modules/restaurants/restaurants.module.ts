import { Module } from "@nestjs/common";
import { RestaurantsController } from "./restaurants.controller";
import { RestaurantsService } from "./restaurants.service";
import { TablesService } from "./tables.service";

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, TablesService],
  exports: [RestaurantsService, TablesService],
})
export class RestaurantsModule {}
