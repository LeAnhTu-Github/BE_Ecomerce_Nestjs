import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CloudinaryService, UploadedAsset } from "./cloudinary.service";
import {
  MAX_IMAGE_FILE_SIZE_BYTES,
  assertValidImageFiles,
  buildImageValidationPipe,
} from "../validation/image-upload.util";
import {
  UploadImageResponse,
  UploadImageResponseWrapper,
  UploadImagesResponseWrapper,
} from "../model/response.model";

const MULTI_UPLOAD_LIMIT = 10;

@ApiTags("cloudinary")
@ApiExtraModels(
  UploadImageResponse,
  UploadImageResponseWrapper,
  UploadImagesResponseWrapper,
)
@Controller("cloudinary")
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post("upload")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Upload a single image to Cloudinary" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
      required: ["file"],
    },
  })
  @ApiCreatedResponse({
    description: "Image successfully uploaded",
    type: UploadImageResponseWrapper,
  })
  @ApiBadRequestResponse({
    description: "Invalid file uploaded",
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadSingle(
    @UploadedFile(buildImageValidationPipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): Promise<UploadedAsset> {
    return this.cloudinaryService.uploadFile(file);
  }

  @Post("uploads")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Upload multiple images in a single request" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
      required: ["files"],
    },
  })
  @ApiCreatedResponse({
    description: "Images successfully uploaded",
    type: UploadImagesResponseWrapper,
  })
  @ApiBadRequestResponse({
    description: "Invalid file payload",
  })
  @UseInterceptors(FilesInterceptor("files", MULTI_UPLOAD_LIMIT))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadedAsset[]> {
    assertValidImageFiles(files, MAX_IMAGE_FILE_SIZE_BYTES, MULTI_UPLOAD_LIMIT);
    return this.cloudinaryService.uploadFiles(files);
  }
}

