import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import {
  CartResponseWrapper,
  CartResponse,
} from "../model/response.model";

@ApiTags("cart")
@ApiBearerAuth("bearer-auth")
@ApiExtraModels(CartResponse, CartResponseWrapper)
@ApiOkResponse({ type: CartResponseWrapper })
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get current user's cart for a store" })
  getCart(@Query("storeId", new ParseUUIDPipe()) storeId: string) {
    return this.cartService.getCart(storeId);
  }

  @Post("items")
  @ApiOperation({ summary: "Add an item to the cart" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Item added to cart",
    type: CartResponse,
  })
  addItem(@Body() addCartItemDto: AddCartItemDto) {
    return this.cartService.addItem(addCartItemDto);
  }

  @Patch("items/:itemId")
  @ApiOperation({ summary: "Update a cart item quantity" })
  updateItem(
    @Param("itemId", ParseUUIDPipe) itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(itemId, updateCartItemDto);
  }

  @Delete("items/:itemId")
  @ApiOperation({ summary: "Remove an item from the cart" })
  removeItem(@Param("itemId", ParseUUIDPipe) itemId: string) {
    return this.cartService.removeItem(itemId);
  }
}

