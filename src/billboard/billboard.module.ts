import { Module } from "@nestjs/common";
import { BillboardController } from "./billboard.controller";
import { BillboardService } from "./billboard.service";
import { PrismaService } from "../service/prisma.service";

@Module({
  controllers: [BillboardController],
  providers: [BillboardService, PrismaService],
})
export class BillboardModule {}

