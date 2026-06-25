import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("AI")
@Controller("ai")
export class AiController {
  constructor(private aiService: AiService) {}

  @Post("chat")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async chat(
    @CurrentUser() user: { id: string },
    @Body() body: { message: string; history?: Array<{ role: "user" | "assistant"; content: string }> },
  ) {
    return this.aiService.chat(user.id, body.message, body.history || []);
  }

  @Get("recommendations")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@CurrentUser() user: { id: string }) {
    return this.aiService.getRecommendations(user.id);
  }

  @Get("trending")
  async getTrending() {
    return this.aiService.getTrending();
  }

  @Get("sentiment/:restaurantId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async analyzeSentiment(@Param("restaurantId") restaurantId: string) {
    return this.aiService.analyzeSentiment(restaurantId);
  }

  @Get("forecast/:restaurantId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getDemandForecast(@Param("restaurantId") restaurantId: string) {
    return this.aiService.getDemandForecast(restaurantId);
  }
}
