import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private prisma: PrismaService) {}

  private getBaseUrl(): string {
    return process.env.AI_SERVICE_URL || "http://localhost:8000";
  }

  async chat(userId: string, message: string, history: ChatMessage[]) {
    // Store conversation in DB
    await this.prisma.aIConversation.create({
      data: {
        userId,
        message,
        response: "", // will update after response
        metadata: { history: history.slice(-10) } as any,
      },
    });

    let response = "";
    let useFallback = true;

    // Try Python AI microservice first
    try {
      const baseUrl = this.getBaseUrl();
      const responseStream = await fetch(`${baseUrl}/api/v1/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message,
          conversation_id: null,
        }),
      });

      if (responseStream.ok) {
        const data = await responseStream.json();
        if (data && data.reply) {
          response = data.reply;
          useFallback = false;
          this.logger.log("Chat response retrieved from AI service");
        }
      }
    } catch (err: any) {
      this.logger.error(`AI service chat failed: ${err.message}. Falling back to internal engine.`);
    }

    // Fallback to internal keyword-based engine
    if (useFallback) {
      response = await this.generateSmartResponse(userId, message, history);
    }

    // Update stored conversation with actual response
    await this.prisma.aIConversation
      .findFirst({ where: { userId, message }, orderBy: { createdAt: "desc" } })
      .then(async (conv) => {
        if (conv) {
          await this.prisma.aIConversation.update({
            where: { id: conv.id },
            data: { response },
          });
        }
      });

    return { response };
  }

  private async generateSmartResponse(
    userId: string,
    message: string,
    history: ChatMessage[],
  ): Promise<string> {
    const msg = message.toLowerCase();

    // Fetch live data from DB to provide contextual responses
    const [restaurants, popularProducts, userOrders] = await Promise.all([
      this.prisma.restaurant.findMany({
        where: { isActive: true, deletedAt: null },
        select: { name: true, cuisine: true, rating: true, deliveryTime: true, priceRange: true },
        take: 6,
      }),
      this.prisma.product.findMany({
        where: { isPopular: true, isActive: true, deletedAt: null },
        include: { restaurant: { select: { name: true } } },
        take: 5,
      }),
      this.prisma.order.findMany({
        where: { userId },
        include: { restaurant: { select: { name: true } }, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    // Contextual logic
    if (msg.includes("popular") || msg.includes("trending") || msg.includes("best")) {
      if (popularProducts.length > 0) {
        const list = popularProducts
          .map((p, i) => `${i + 1}. **${p.name}** from ${p.restaurant.name} – ₹${p.price}`)
          .join("\n");
        return `Here are our most popular items right now:\n\n${list}\n\nWould you like to order any of these? 🍽️`;
      }
    }

    if (msg.includes("restaurant") || msg.includes("where") || msg.includes("options")) {
      if (restaurants.length > 0) {
        const list = restaurants
          .map((r) => `• **${r.name}** – ${r.cuisine || "Multi-cuisine"} | ⭐ ${r.rating.toFixed(1)} | ⏱ ${r.deliveryTime} min`)
          .join("\n");
        return `Here are the restaurants currently open:\n\n${list}\n\nLet me know if you'd like to explore any of them! 🏪`;
      }
    }

    if (msg.includes("order again") || msg.includes("last order") || msg.includes("reorder")) {
      if (userOrders.length > 0) {
        const last = userOrders[0];
        const items = last.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ");
        return `Your last order was from **${last.restaurant.name}**: ${items}.\n\nWould you like me to add it to your cart? 🛒`;
      }
      return "You don't have any previous orders yet. Let me help you discover something new! What are you in the mood for?";
    }

    if (msg.includes("healthy") || msg.includes("diet") || msg.includes("salad") || msg.includes("vegetarian") || msg.includes("vegan")) {
      const healthyItems = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: "salad", mode: "insensitive" } },
            { name: { contains: "healthy", mode: "insensitive" } },
            { name: { contains: "bowl", mode: "insensitive" } },
          ],
          isActive: true,
        },
        include: { restaurant: { select: { name: true } } },
        take: 4,
      });

      if (healthyItems.length > 0) {
        const list = healthyItems.map((p, i) => `${i + 1}. **${p.name}** at ${p.restaurant.name} – ₹${p.price}`).join("\n");
        return `Great choice for healthy eating! Here are some nutritious options:\n\n${list}\n\nStaying healthy never tasted so good! 🥗`;
      }
      return "Looking for something healthy? I'd recommend exploring our Green Bowl and salad options. They're fresh, nutritious, and delicious! 🥗";
    }

    if (msg.includes("cheap") || msg.includes("budget") || msg.includes("affordable")) {
      const budget = await this.prisma.product.findMany({
        where: { isActive: true, price: { lte: 200 } },
        include: { restaurant: { select: { name: true } } },
        orderBy: { price: "asc" },
        take: 5,
      });

      if (budget.length > 0) {
        const list = budget.map((p, i) => `${i + 1}. **${p.name}** – ₹${p.price} at ${p.restaurant.name}`).join("\n");
        return `Here are our most affordable options:\n\n${list}\n\nGreat food doesn't have to break the bank! 💰`;
      }
    }

    if (msg.includes("recommendation") || msg.includes("suggest") || msg.includes("recommend")) {
      const rand = restaurants[Math.floor(Math.random() * restaurants.length)];
      if (rand) {
        return `I'd personally recommend **${rand.name}**! It's a fantastic ${rand.cuisine || "restaurant"} with a ${rand.rating.toFixed(1)}⭐ rating. Their estimated delivery time is ${rand.deliveryTime} minutes. Would you like to browse their menu?`;
      }
    }

    if (msg.includes("help") || msg.includes("what can you do")) {
      return `I'm your FoodCourtOS AI assistant! Here's what I can help you with:\n\n🍽️ **Find restaurants** – Ask about available options\n⭐ **Get recommendations** – I'll suggest the best dishes\n🏥 **Healthy choices** – Find nutritious meals\n💰 **Budget meals** – Discover affordable options\n🔄 **Reorder** – Quickly repeat past orders\n📊 **Popular items** – See what's trending\n\nWhat would you like to explore today?`;
    }

    // Default smart response
    const restaurantList = restaurants.slice(0, 3).map((r) => r.name).join(", ");
    return `I'd be happy to help with "${message}"! We have a great selection of restaurants including **${restaurantList}** and more. \n\nCould you tell me more about what you're looking for? Are you craving a specific cuisine, have a budget in mind, or looking for something healthy? 🤔`;
  }

  async getRecommendations(userId: string) {
    // Check user order history for personalization
    const userOrders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: { include: { category: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Extract preferred categories from order history
    const categoryFreq: Record<string, number> = {};
    userOrders.forEach((order) => {
      order.items.forEach((item) => {
        const cat = item.product.category?.name;
        if (cat) categoryFreq[cat] = (categoryFreq[cat] || 0) + 1;
      });
    });

    const topCategories = Object.keys(categoryFreq)
      .sort((a, b) => categoryFreq[b] - categoryFreq[a])
      .slice(0, 3);

    // Recommend based on top categories, or fall back to popular items
    let recommendations: any[] = [];
    if (topCategories.length > 0) {
      recommendations = await this.prisma.product.findMany({
        where: {
          isActive: true,
          category: { name: { in: topCategories } },
        },
        include: {
          restaurant: { select: { name: true, slug: true, logo: true, rating: true } },
          category: { select: { name: true } },
        },
        take: 8,
      });
    }

    if (recommendations.length < 4) {
      const popular = await this.prisma.product.findMany({
        where: { isPopular: true, isActive: true },
        include: {
          restaurant: { select: { name: true, slug: true, logo: true, rating: true } },
          category: { select: { name: true } },
        },
        take: 8,
      });
      recommendations = [...recommendations, ...popular].slice(0, 8);
    }

    return {
      recommendations,
      basedOn: topCategories.length > 0 ? "order_history" : "popularity",
      userHasHistory: userOrders.length > 0,
    };
  }

  async getTrending() {
    const trending = await this.prisma.product.findMany({
      where: { isPopular: true, isActive: true },
      include: {
        restaurant: { select: { name: true, slug: true, logo: true } },
        category: { select: { name: true } },
      },
      take: 10,
    });

    return { trending };
  }

  async analyzeSentiment(restaurantId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { restaurantId, isActive: true },
      select: { rating: true, comment: true },
      take: 50,
    });

    if (reviews.length === 0) {
      return { sentiment: "neutral", score: 0, reviewCount: 0, insights: [] };
    }

    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const positiveCount = reviews.filter((r) => r.rating >= 4).length;
    const negativeCount = reviews.filter((r) => r.rating <= 2).length;

    const sentiment = avgRating >= 4 ? "positive" : avgRating >= 3 ? "neutral" : "negative";

    const insights = [];
    if (positiveCount > reviews.length * 0.7) insights.push("Strong customer satisfaction");
    if (negativeCount > reviews.length * 0.3) insights.push("Service improvements needed");
    if (avgRating >= 4.5) insights.push("Excellent reputation – consider premium pricing");
    if (avgRating < 3) insights.push("Urgent attention required – prioritize quality");

    return {
      sentiment,
      score: parseFloat(avgRating.toFixed(2)),
      reviewCount: reviews.length,
      positivePercent: Math.round((positiveCount / reviews.length) * 100),
      negativePercent: Math.round((negativeCount / reviews.length) * 100),
      insights,
    };
  }

  async getDemandForecast(restaurantId: string) {
    let useFallback = true;
    let forecastData: any = null;

    // Try to fetch forecast from AI microservice
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/analytics/demand-prediction/${restaurantId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.predictions) {
          const preds = data.predictions;
          forecastData = {
            peakDay: "Calculated Peak",
            peakHour: preds[0]?.peak_hours?.join(", ") || "Lunch/Dinner",
            totalOrdersAnalyzed: "AI prediction model active",
            forecast: `Predicted orders: ${preds.map((p: any) => `${p.date}: ${p.predicted_orders}`).join(", ")}`,
            suggestions: [
              "AI: Optimization and demand prediction active",
              "Schedule staff according to predicted demand peaks",
            ],
          };
          useFallback = false;
        }
      }
    } catch (err: any) {
      this.logger.error(`AI service demand forecast failed: ${err.message}. Falling back to internal engine.`);
    }

    if (useFallback) {
      // Simple demand forecast based on historical order patterns
      const orders = await this.prisma.order.findMany({
        where: { restaurantId },
        select: { createdAt: true, total: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      const dayOfWeekCounts: Record<number, number> = {};
      const hourCounts: Record<number, number> = {};

      orders.forEach((order) => {
        const d = new Date(order.createdAt);
        const dow = d.getDay();
        const hour = d.getHours();
        dayOfWeekCounts[dow] = (dayOfWeekCounts[dow] || 0) + 1;
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const peakDay = Object.keys(dayOfWeekCounts).reduce((a, b) =>
        dayOfWeekCounts[Number(a)] > dayOfWeekCounts[Number(b)] ? a : b,
        "5",
      );
      const peakHour = Object.keys(hourCounts).reduce((a, b) =>
        hourCounts[Number(a)] > hourCounts[Number(b)] ? a : b,
        "12",
      );

      forecastData = {
        peakDay: days[Number(peakDay)],
        peakHour: `${peakHour}:00 - ${Number(peakHour) + 1}:00`,
        totalOrdersAnalyzed: orders.length,
        forecast: "Based on historical patterns, expect higher demand on weekends and lunch hours.",
        suggestions: [
          "Stock up inventory before peak hours",
          "Schedule extra staff on peak days",
          "Consider time-based promotions during off-peak hours",
        ],
      };
    }

    return forecastData;
  }
}
