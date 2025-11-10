import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { StoreService } from "./store.service";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateStoreDto } from "./dto/create-store.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { StoreDto } from "./dto/store.dto";
import {
  StoreResponse,
  StoreResponseWrapper,
  StoreListResponseWrapper,
} from "../model/response.model";

@ApiTags("stores")
@ApiBearerAuth("bearer-auth")
@ApiExtraModels(
  StoreResponse,
  StoreResponseWrapper,
  StoreListResponseWrapper,
)
@Controller("stores")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "logo", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]),
  )
  @ApiConsumes("multipart/form-data")
  @Post()
  @ApiOperation({ summary: "Create a new store" })
  @ApiCreatedResponse({
    description: "Store successfully created",
    type: StoreResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error or file upload error",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "File upload failed",
  })
  create(
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          // new FileTypeValidator({ fileType: /image\/(png|jpg|jpeg|webp)/ }),
        ],
      }),
    )
    files: { logo: Express.Multer.File[]; banner?: Express.Multer.File[] },
  ): Promise<StoreDto> {
    return this.storeService.create(files, createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all stores for current user" })
  @ApiOkResponse({
    description: "Stores successfully retrieved",
    type: StoreListResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  findAll(): Promise<StoreDto[]> {
    return this.storeService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a store by ID" })
  @ApiOkResponse({
    description: "Store successfully retrieved",
    type: StoreResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Store not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<StoreDto> {
    return this.storeService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a store" })
  @ApiOkResponse({
    description: "Store successfully updated",
    type: StoreResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Store not found",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a store" })
  @ApiOkResponse({
    description: "Store successfully deleted",
    type: StoreResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Store not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  remove(@Param("id", ParseIntPipe) id: number): Promise<StoreDto> {
    return this.storeService.remove(id);
  }
}
