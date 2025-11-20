import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { RoleGuard } from "../role/role.guard";
import { Role } from "@prisma/client";
import { Roles } from "../role/role.decorator";
import {
  OrderListResponseWrapper,
  OrderResponse,
  OrderResponseWrapper,
} from "../model/response.model";

@ApiTags("orders")
@ApiBearerAuth("bearer-auth")
@ApiExtraModels(
  OrderResponse,
  OrderResponseWrapper,
  OrderListResponseWrapper,
)
@UseGuards(RoleGuard)
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: "Create a new order from the current cart" })
  @ApiCreatedResponse({
    description: "Order created successfully",
    type: OrderResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Cart not found or empty",
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Roles([Role.ADMIN, Role.SELLER])
  @Get()
  @ApiOperation({ summary: "List orders for a store" })
  @ApiOkResponse({
    description: "Orders retrieved",
    type: OrderListResponseWrapper,
  })
  findStoreOrders(@Query("storeId", new ParseUUIDPipe()) storeId: string) {
    return this.orderService.findStoreOrders(storeId);
  }

  @Get("me")
  @ApiOperation({ summary: "List orders for current user" })
  @ApiOkResponse({
    description: "User orders retrieved",
    type: OrderListResponseWrapper,
  })
  findMyOrders() {
    return this.orderService.findMyOrders();
  }

  @Roles([Role.ADMIN, Role.SELLER])
  @Patch(":id/pay")
  @ApiOperation({ summary: "Update paid status for an order" })
  @ApiOkResponse({
    description: "Order status updated",
    type: OrderResponseWrapper,
  })
  updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("storeId", new ParseUUIDPipe()) storeId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, storeId, updateOrderStatusDto);
  }
}

