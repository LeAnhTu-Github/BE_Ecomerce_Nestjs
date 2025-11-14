import { Injectable } from "@nestjs/common";
import { CloudinaryResponse } from "../model/response.model";
import { v2 as cloudinary } from "cloudinary";
import * as stream from "stream";

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Something went wrong with cloudinary"));
          }

          resolve(result);
        },
      );

      if (file.buffer instanceof Buffer && typeof file.buffer === "object") {
        stream.Readable.from(file.buffer).pipe(uploadStream);
      } else {
        return reject(new Error("File buffer is not a buffer"));
      }
    });
  }
}
