import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ScheduleModule } from "@nestjs/schedule";
import { StoreModule } from "./store/store.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { ColorModule } from "./settings/color/color.module";
import { SizeModule } from "./settings/size/size.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./auth/constants";
import { ProductModule } from "./product/product.module";
import { CategoryModule } from "./category/category.module";
import { BillboardModule } from "./billboard/billboard.module";
import { CartModule } from "./cart/cart.module";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        algorithm: "HS256",
        expiresIn: jwtConstants.expiresIn,
      },
    }),
    AuthModule,
    UserModule,
    ScheduleModule.forRoot(),
    StoreModule,
    CloudinaryModule,
    ColorModule,
    SizeModule,
    ProductModule,
    CategoryModule,
    BillboardModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
