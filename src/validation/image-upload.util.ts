import {
  BadRequestException,
  ParseFileOptions,
  ParseFilePipeBuilder,
} from "@nestjs/common";

export const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
];

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const escapeMimeForRegex = (mime: string): string =>
  mime.replace("/", "\\/");

export const isSupportedImageMimeType = (mime: string): boolean =>
  SUPPORTED_IMAGE_MIME_TYPES.includes(mime);

export const isWithinImageSizeLimit = (
  size: number,
  maxSize = MAX_IMAGE_FILE_SIZE_BYTES,
): boolean => size <= maxSize;

export const assertValidImageFile = (
  file: Express.Multer.File,
  maxSize = MAX_IMAGE_FILE_SIZE_BYTES,
) => {
  if (!file) {
    throw new BadRequestException("File is required.");
  }

  if (!isSupportedImageMimeType(file.mimetype)) {
    throw new BadRequestException(
      `Unsupported file type: ${file.mimetype}. Allowed: ${SUPPORTED_IMAGE_MIME_TYPES.join(
        ", ",
      )}`,
    );
  }

  if (!isWithinImageSizeLimit(file.size, maxSize)) {
    throw new BadRequestException(
      `File size exceeds limit of ${Math.round(maxSize / (1024 * 1024))}MB.`,
    );
  }
};

export const assertValidImageFiles = (
  files: Express.Multer.File[],
  maxSize = MAX_IMAGE_FILE_SIZE_BYTES,
  maxCount = 10,
) => {
  if (!files || files.length === 0) {
    throw new BadRequestException("At least one image file is required.");
  }

  if (files.length > maxCount) {
    throw new BadRequestException(
      `You can upload up to ${maxCount} images per request.`,
    );
  }

  files.forEach((file) => assertValidImageFile(file, maxSize));
};

export const buildImageValidationPipe = (
  options: ParseFileOptions = { fileIsRequired: true },
  maxSize = MAX_IMAGE_FILE_SIZE_BYTES,
) => {
  const fileTypePattern = new RegExp(
    `^(${SUPPORTED_IMAGE_MIME_TYPES.map(escapeMimeForRegex).join("|")})$`,
  );

  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: fileTypePattern,
    })
    .addMaxSizeValidator({
      maxSize,
    })
    .build(options);
};

