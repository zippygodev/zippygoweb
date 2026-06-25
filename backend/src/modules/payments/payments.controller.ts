import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseGuards,
  RawBodyRequest,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post("create-order")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() body: { orderId: string; amount: number }) {
    return this.paymentsService.createOrder(body.orderId, body.amount);
  }

  @Post("verify")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async verifyPayment(
    @Body()
    body: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      orderId: string;
    },
  ) {
    return this.paymentsService.verifyPayment(body);
  }

  @Post("webhook")
  async webhook(
    @Body() payload: any,
    @Headers("x-razorpay-signature") signature: string,
  ) {
    return this.paymentsService.handleWebhook(payload, signature || "");
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { orderId: string; amount: number; method: string; provider: string }) {
    return this.paymentsService.create(body);
  }

  @Get("order/:orderId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findByOrder(@Param("orderId") orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  @Post(":orderId/refund")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async refund(@Param("orderId") orderId: string) {
    return this.paymentsService.refund(orderId);
  }

  @Get("history")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getHistory(@CurrentUser() user: { id: string }) {
    return this.paymentsService.getHistory(user.id);
  }
}
