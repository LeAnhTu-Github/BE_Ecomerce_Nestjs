import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user/dto/user.dto";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

// Generic wrapper for all responses
export class ApiResponseWrapper<T> {
  @ApiProperty({ description: "Response data" })
  data: T;
}

export class UploadImageResponse {
  @ApiProperty({ example: "banner.png", description: "Original file name" })
  fileName: string;

  @ApiProperty({
    example: "https://res.cloudinary.com/demo/image/upload/v1690000000/banner.png",
    description: "Accessible image URL",
  })
  url: string;

  @ApiProperty({
    example: "ecommerce/banner",
    description: "Cloudinary public identifier",
  })
  publicId: string;
}

export class UploadImageResponseWrapper extends ApiResponseWrapper<UploadImageResponse> {
  @ApiProperty({ type: UploadImageResponse })
  data: UploadImageResponse;
}

export class UploadImagesResponseWrapper extends ApiResponseWrapper<UploadImageResponse[]> {
  @ApiProperty({ type: [UploadImageResponse] })
  data: UploadImageResponse[];
}

// Response models
export class TokenResponse {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  accessToken: string;

  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  refreshToken: string;
}

export class SignInResponse extends TokenResponse {}

export class SignUpResponse extends UserDto {}

export class ConfirmEmailResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "Email confirmed successfully" })
  message: string;
}

// Wrapped responses for Swagger
export class SignInResponseWrapper extends ApiResponseWrapper<SignInResponse> {
  @ApiProperty({ type: SignInResponse })
  data: SignInResponse;
}

export class SignUpResponseWrapper extends ApiResponseWrapper<SignUpResponse> {
  @ApiProperty({ type: SignUpResponse })
  data: SignUpResponse;
}

export class ConfirmEmailResponseWrapper extends ApiResponseWrapper<ConfirmEmailResponse> {
  @ApiProperty({ type: ConfirmEmailResponse })
  data: ConfirmEmailResponse;
}

export class RefreshTokenResponse {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  accessToken: string;
}

export class RefreshTokenResponseWrapper extends ApiResponseWrapper<RefreshTokenResponse> {
  @ApiProperty({ type: RefreshTokenResponse })
  data: RefreshTokenResponse;
}

// Category Response
export class CategoryResponse {
  @ApiProperty({ type: String, description: "Category ID", example: "c6f0..." })
  id: string;

  @ApiProperty({ type: String, description: "Store ID", example: "c6f0..." })
  storeId: string;

  @ApiProperty({ type: String, description: "Billboard ID", example: "c6f0..." })
  billboardId: string;

  @ApiProperty({ type: String, description: "Category name", example: "Electronics" })
  name: string;

  @ApiProperty({ type: Date, description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Last update date" })
  updatedAt: Date;
}

export class CategoryResponseWrapper extends ApiResponseWrapper<CategoryResponse> {
  @ApiProperty({ type: CategoryResponse })
  data: CategoryResponse;
}

export class CategoryListResponseWrapper extends ApiResponseWrapper<CategoryResponse[]> {
  @ApiProperty({ type: [CategoryResponse] })
  data: CategoryResponse[];
}

// Product Response
export class ImageResponse {
  @ApiProperty({ type: String, description: "Image ID", example: "c6f0..." })
  id: string;

  @ApiProperty({ type: String, description: "Image URL", example: "https://example.com/image.jpg" })
  url: string;
}

export class ProductResponse {
  @ApiProperty({ type: String, description: "Product ID", example: "c6f0..." })
  id: string;

  @ApiProperty({ type: String, description: "Store ID", example: "c6f0..." })
  storeId: string;

  @ApiProperty({ type: String, description: "Category ID", example: "c6f0..." })
  categoryId: string;

  @ApiProperty({ type: String, description: "Size ID", example: "c6f0..." })
  sizeId: string;

  @ApiProperty({ type: String, description: "Color ID", example: "c6f0..." })
  colorId: string;

  @ApiProperty({ type: String, description: "Product name", example: "iPhone 15 Pro" })
  name: string;

  @ApiProperty({ type: String, description: "Product description", example: "Latest iPhone...", required: false })
  description?: string;

  @ApiProperty({ type: Number, description: "Product price", example: 999.99 })
  price: number;

  @ApiProperty({ type: Boolean, description: "Is featured", example: false })
  isFeatured: boolean;

  @ApiProperty({ type: Boolean, description: "Is archived", example: false })
  isArchived: boolean;

  @ApiProperty({ type: [ImageResponse], description: "Image gallery" })
  images: ImageResponse[];

  @ApiProperty({ type: Date, description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Last update date" })
  updatedAt: Date;
}

export class ProductResponseWrapper extends ApiResponseWrapper<ProductResponse> {
  @ApiProperty({ type: ProductResponse })
  data: ProductResponse;
}

export class ProductListResponseWrapper extends ApiResponseWrapper<ProductResponse[]> {
  @ApiProperty({ type: [ProductResponse] })
  data: ProductResponse[];
}

// Store Response
export class StoreResponse {
  @ApiProperty({ type: String, description: "Store ID", example: "c6f0..." })
  id: string;

  @ApiProperty({ type: String, description: "Store name", example: "My Store" })
  name: string;

  @ApiProperty({ type: String, description: "Store slug", example: "my-store" })
  slug: string;

  @ApiProperty({ type: String, description: "Store address", example: "123 Main Street", required: false })
  address?: string;

  @ApiProperty({ type: String, description: "Store logo URL", example: "https://example.com/logo.jpg", required: false })
  logo?: string;

  @ApiProperty({ type: String, description: "Store banner URL", example: "https://example.com/banner.jpg", required: false })
  banner?: string | null;

  @ApiProperty({ type: Date, description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Last update date" })
  updatedAt: Date;
}

export class StoreResponseWrapper extends ApiResponseWrapper<StoreResponse> {
  @ApiProperty({ type: StoreResponse })
  data: StoreResponse;
}

export class StoreListResponseWrapper extends ApiResponseWrapper<StoreResponse[]> {
  @ApiProperty({ type: [StoreResponse] })
  data: StoreResponse[];
}


// Size Response
export class SizeResponse {
  @ApiProperty({ type: String, description: "Size ID", example: "c6f0..." })
  id: string;

  @ApiProperty({ type: String, description: "Store ID", example: "c6f0..." })
  storeId: string;

  @ApiProperty({ type: String, description: "Size name", example: "XL" })
  name: string;

  @ApiProperty({ type: String, description: "Size value", example: "extra-large" })
  value: string;

  @ApiProperty({ type: Date, description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Last update date" })
  updatedAt: Date;
}

export class SizeResponseWrapper extends ApiResponseWrapper<SizeResponse> {
  @ApiProperty({ type: SizeResponse })
  data: SizeResponse;
}

export class SizeListResponseWrapper extends ApiResponseWrapper<SizeResponse[]> {
  @ApiProperty({ type: [SizeResponse] })
  data: SizeResponse[];
}

// Color Response
export class ColorResponse {
  @ApiProperty({ type: String, description: "Color ID", example: "c6f0..." })
  id: string;

  @ApiProperty({ type: String, description: "Store ID", example: "c6f0..." })
  storeId: string;

  @ApiProperty({ type: String, description: "Color name", example: "Red" })
  name: string;

  @ApiProperty({ type: String, description: "Color value", example: "#ff0000" })
  value: string;

  @ApiProperty({ type: Date, description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Last update date" })
  updatedAt: Date;
}

export class ColorResponseWrapper extends ApiResponseWrapper<ColorResponse> {
  @ApiProperty({ type: ColorResponse })
  data: ColorResponse;
}

export class ColorListResponseWrapper extends ApiResponseWrapper<ColorResponse[]> {
  @ApiProperty({ type: [ColorResponse] })
  data: ColorResponse[];
}

// Billboard Response
export class BillboardResponse {
  @ApiProperty({ type: String, description: "Billboard ID", example: "c6f0..." })
  id: string;

  @ApiProperty({ type: String, description: "Store ID", example: "c6f0..." })
  storeId: string;

  @ApiProperty({ type: String, description: "Billboard label", example: "Sale" })
  label: string;

  @ApiProperty({ type: String, description: "Image URL", example: "https://example.com/banner.jpg" })
  imageUrl: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class BillboardResponseWrapper extends ApiResponseWrapper<BillboardResponse> {
  @ApiProperty({ type: BillboardResponse })
  data: BillboardResponse;
}

export class BillboardListResponseWrapper extends ApiResponseWrapper<BillboardResponse[]> {
  @ApiProperty({ type: [BillboardResponse] })
  data: BillboardResponse[];
}

// Cart Response
export class CartItemResponse {
  @ApiProperty({ type: String, description: "Cart item ID" })
  id: string;

  @ApiProperty({ type: String, description: "Product ID" })
  productId: string;

  @ApiProperty({ type: Number, description: "Quantity" })
  quantity: number;

  @ApiProperty({ type: ProductResponse, description: "Product details", required: false })
  product?: ProductResponse;
}

export class CartResponse {
  @ApiProperty({ type: String, description: "Cart ID" })
  id: string;

  @ApiProperty({ type: String, description: "Store ID" })
  storeId: string;

  @ApiProperty({ type: [CartItemResponse], description: "Cart items" })
  items: CartItemResponse[];

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class CartResponseWrapper extends ApiResponseWrapper<CartResponse | null> {
  @ApiProperty({ type: CartResponse, nullable: true })
  data: CartResponse | null;
}

// Order Response
export class OrderItemResponse {
  @ApiProperty({ type: String, description: "Order item ID" })
  id: string;

  @ApiProperty({ type: String, description: "Product ID" })
  productId: string;

  @ApiProperty({ type: Number, description: "Quantity" })
  quantity: number;

  @ApiProperty({ type: ProductResponse, description: "Product snapshot", required: false })
  product?: ProductResponse;
}

export class OrderResponse {
  @ApiProperty({ type: String, description: "Order ID" })
  id: string;

  @ApiProperty({ type: String, description: "Store ID" })
  storeId: string;

  @ApiProperty({ type: Boolean, description: "Payment status" })
  isPaid: boolean;

  @ApiProperty({ type: String, description: "Phone number" })
  phone: string;

  @ApiProperty({ type: String, description: "Shipping address" })
  address: string;

  @ApiProperty({ type: [OrderItemResponse], description: "Line items" })
  orderItems: OrderItemResponse[];

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class OrderResponseWrapper extends ApiResponseWrapper<OrderResponse> {
  @ApiProperty({ type: OrderResponse })
  data: OrderResponse;
}

export class OrderListResponseWrapper extends ApiResponseWrapper<OrderResponse[]> {
  @ApiProperty({ type: [OrderResponse] })
  data: OrderResponse[];
}

// User Response (using UserDto)
export class UserResponseWrapper extends ApiResponseWrapper<UserDto> {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
