import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user/dto/user.dto";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

// Generic wrapper for all responses
export class ApiResponseWrapper<T> {
  @ApiProperty({ description: "Response data" })
  data: T;
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
  @ApiProperty({ type: Number, description: "Category ID", example: 1 })
  id: number;

  @ApiProperty({ type: String, description: "Category name", example: "Electronics" })
  name: string;

  @ApiProperty({ type: String, description: "Category slug", example: "electronics" })
  slug: string;

  @ApiProperty({ type: Number, description: "Parent category ID", example: null, required: false })
  parentId: number | null;

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
export class ProductResponse {
  @ApiProperty({ type: Number, description: "Product ID", example: 1 })
  id: number;

  @ApiProperty({ type: String, description: "Product title", example: "iPhone 15 Pro" })
  title: string;

  @ApiProperty({ type: String, description: "Product description", example: "Latest iPhone with advanced features" })
  description: string;

  @ApiProperty({ type: String, description: "Product slug", example: "iphone-15-pro" })
  slug: string;

  @ApiProperty({ type: Number, description: "Product price", example: 999.99 })
  price: number;

  @ApiProperty({ type: Number, description: "Product discount", example: 50.00, required: false })
  discount: number | null;

  @ApiProperty({ type: Number, description: "Store ID", example: 1 })
  storeId: number;

  @ApiProperty({ type: String, description: "Main image URL", example: "https://example.com/image.jpg" })
  mainImage: string;

  @ApiProperty({ type: Boolean, description: "Is product published", example: true, required: false })
  isPublished: boolean | null;

  @ApiProperty({ type: Number, description: "Category ID", example: 1, required: false })
  categoryId: number | null;

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
  @ApiProperty({ type: Number, description: "Store ID", example: 1 })
  id: number;

  @ApiProperty({ type: String, description: "Store name", example: "My Store" })
  name: string;

  @ApiProperty({ type: String, description: "Store slug", example: "my-store" })
  slug: string;

  @ApiProperty({ type: String, description: "Store address", example: "123 Main Street" })
  address: string;

  @ApiProperty({ type: String, description: "Store logo URL", example: "https://example.com/logo.jpg" })
  logo: string;

  @ApiProperty({ type: String, description: "Store banner URL", example: "https://example.com/banner.jpg", required: false })
  banner: string | null;

  @ApiProperty({ type: Number, description: "City ID", example: 1 })
  cityId: number;

  @ApiProperty({ type: Number, description: "Country ID", example: 1 })
  countryId: number;

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

// Country Response
export class CountryResponse {
  @ApiProperty({ type: Number, description: "Country ID", example: 1 })
  id: number;

  @ApiProperty({ type: String, description: "Country name", example: "United States" })
  name: string;

  @ApiProperty({ type: String, description: "Country code", example: "US" })
  countryCode: string;

  @ApiProperty({ type: Date, description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Last update date" })
  updatedAt: Date;
}

export class CountryResponseWrapper extends ApiResponseWrapper<CountryResponse> {
  @ApiProperty({ type: CountryResponse })
  data: CountryResponse;
}

export class CountryListResponseWrapper extends ApiResponseWrapper<CountryResponse[]> {
  @ApiProperty({ type: [CountryResponse] })
  data: CountryResponse[];
}

// City Response
export class CityResponse {
  @ApiProperty({ type: Number, description: "City ID", example: 1 })
  id: number;

  @ApiProperty({ type: String, description: "City name", example: "New York" })
  name: string;

  @ApiProperty({ type: Number, description: "Country ID", example: 1 })
  countryId: number;

  @ApiProperty({ type: Date, description: "Creation date" })
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Last update date" })
  updatedAt: Date;
}

export class CityResponseWrapper extends ApiResponseWrapper<CityResponse> {
  @ApiProperty({ type: CityResponse })
  data: CityResponse;
}

export class CityListResponseWrapper extends ApiResponseWrapper<CityResponse[]> {
  @ApiProperty({ type: [CityResponse] })
  data: CityResponse[];
}

// Size Response
export class SizeResponse {
  @ApiProperty({ type: Number, description: "Size ID", example: 1 })
  id: number;

  @ApiProperty({ type: String, description: "Size name", example: "XL" })
  name: string;

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
  @ApiProperty({ type: Number, description: "Color ID", example: 1 })
  id: number;

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

// User Response (using UserDto)
export class UserResponseWrapper extends ApiResponseWrapper<UserDto> {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
