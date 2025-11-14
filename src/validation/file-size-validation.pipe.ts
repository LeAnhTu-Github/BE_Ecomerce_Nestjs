import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): boolean {
    const twoMegabytes = 2 * 1024 * 1024;
    return value.size < twoMegabytes;
  }
}
