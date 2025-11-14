import { Module } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { PrismaService } from "../service/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Module({
  controllers: [StoreController],
  providers: [StoreService, PrismaService, CloudinaryService],
})
export class StoreModule {}
