import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { RestaurantsModule } from "./modules/restaurants/restaurants.module";
import { ProductsModule } from "./modules/products/products.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { CouponsModule } from "./modules/coupons/coupons.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { AiModule } from "./modules/ai/ai.module";
import { RedisModule } from "./modules/redis/redis.module";
import { SearchModule } from "./modules/search/search.module";
import { UploadModule } from "./modules/upload/upload.module";
import { FavoritesModule } from "./modules/favorites/favorites.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/api/uploads",
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    CouponsModule,
    ReviewsModule,
    NotificationsModule,
    AnalyticsModule,
    OrganizationsModule,
    SubscriptionsModule,
    AiModule,
    RedisModule,
    SearchModule,
    UploadModule,
    FavoritesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
