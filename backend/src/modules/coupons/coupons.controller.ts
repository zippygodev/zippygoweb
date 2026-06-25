import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CouponsService } from "./coupons.service";

@ApiTags("Coupons")
@Controller("coupons")
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post("apply")
  async apply(@Body() body: { code: string; orderTotal: number }) {
    return this.couponsService.apply(body.orderTotal, body.code);
  }
}
