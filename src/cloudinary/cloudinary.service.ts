import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
} from "@nestjs/common";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import * as stream from "stream";

export type UploadedAsset = {
  fileName: string;
  url: string;
  publicId: string;
};

@Injectable()
export class CloudinaryService {
  private readonly maxConcurrency = 3;

  async uploadFile(file: Express.Multer.File): Promise<UploadedAsset> {
    const result = await this.uploadViaStream(file);
    return this.mapResultToAsset(file, result);
  }

  async uploadFiles(
    files: Express.Multer.File[],
    concurrency = this.maxConcurrency,
  ): Promise<UploadedAsset[]> {
    if (!Array.isArray(files) || files.length === 0) {
      throw new BadRequestException("At least one file is required.");
    }

    const cappedConcurrency = Math.max(
      1,
      Math.min(concurrency, this.maxConcurrency),
    );

    const results: UploadedAsset[] = new Array(files.length);
    let pointer = 0;

    const worker = async () => {
      while (pointer < files.length) {
        const currentIndex = pointer++;
        const file = files[currentIndex];
        results[currentIndex] = await this.uploadFile(file);
      }
    };

    const workerCount = Math.min(cappedConcurrency, files.length);
    await Promise.all(Array.from({ length: workerCount }, () => worker()));

    return results;
  }

  private uploadViaStream(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException("File payload is missing.");
    }

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: process.env.CLOUDINARY_FOLDER },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(
              new InternalServerErrorException(
                "Cloudinary did not return an upload result.",
              ),
            );
          }

          resolve(result);
        },
      );

      if (file.buffer instanceof Buffer && typeof file.buffer === "object") {
        stream.Readable.from(file.buffer).pipe(uploadStream);
      } else {
        reject(new BadRequestException("File buffer is invalid."));
      }
    });
  }

  private mapResultToAsset(
    file: Express.Multer.File,
    result: UploadApiResponse,
  ): UploadedAsset {
    const url = result.secure_url ?? result.url;
    if (!url) {
      throw new InternalServerErrorException(
        "Cloudinary upload response is missing a URL.",
      );
    }

    return {
      fileName: file.originalname,
      url,
      publicId: result.public_id,
    };
  }
}
