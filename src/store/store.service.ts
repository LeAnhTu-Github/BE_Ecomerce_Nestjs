import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { PrismaService } from "../service/prisma.service";
import { REQUEST } from "@nestjs/core";
import { SessionRequest } from "../model/request.model";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { plainToInstance } from "class-transformer";
import { StoreDto } from "./dto/store.dto";
import { ENTITY_NOT_FOUND } from "../lib/error-messages";
import { randomUUID } from "crypto";

@Injectable()
export class StoreService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(REQUEST) private readonly request: SessionRequest,
  ) {}

  private sanitizeSlug(name: string): string {
    const normalized = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    return normalized || randomUUID();
  }

  private async generateUniqueSlug(base: string): Promise<string> {
    let slug = base;
    let attempt = 1;

    while (true) {
      const existing = await this.prismaService.store.findUnique({
        where: { slug },
      });

      if (!existing) {
        return slug;
      }

      slug = `${base}-${attempt}`;
      attempt += 1;
    }
  }

  async create(
    files: { logo: Express.Multer.File[]; banner?: Express.Multer.File[] },
    createStoreDto: CreateStoreDto,
  ): Promise<StoreDto> {
    const { name, address } = createStoreDto;
    const { logo, banner } = files;

    let logoUrl: string | undefined;
    let bannerUrl: string | undefined;

    try {
      const logoUploadResponse = await this.cloudinaryService.uploadFile(
        logo[0],
      );
      logoUrl = logoUploadResponse.url;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (banner && banner[0]) {
      try {
        const bannerUploadResponse = await this.cloudinaryService.uploadFile(
          banner[0],
        );
        bannerUrl = bannerUploadResponse.url;
      } catch (e) {
        throw new InternalServerErrorException(e.message);
      }
    }

    const slug = await this.generateUniqueSlug(this.sanitizeSlug(name));

    const store = await this.prismaService.store.create({
      data: {
        name,
        address,
        slug,
        logo: logoUrl as string,
        userId: this.request.user.id,
        ...(bannerUrl && { banner: bannerUrl }),
      },
    });

    return plainToInstance(StoreDto, store);
  }

  async findAll(): Promise<StoreDto[]> {
    const stores = await this.prismaService.store.findMany({
      where: {
        userId: this.request.user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return plainToInstance(StoreDto, stores);
  }

  async findOne(id: string): Promise<StoreDto> {
    const store = await this.prismaService.store.findFirst({
      where: {
        id,
        userId: this.request.user.id,
      },
    });

    if (!store) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Store", "id"));
    }

    return plainToInstance(StoreDto, store);
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<StoreDto> {
    const store = await this.findOne(id);
    const data: Record<string, unknown> = {
      ...updateStoreDto,
    };

    if (updateStoreDto.name && updateStoreDto.name !== store.name) {
      const slug = await this.generateUniqueSlug(
        this.sanitizeSlug(updateStoreDto.name),
      );
      data.slug = slug;
    }

    const updated = await this.prismaService.store.update({
      where: { id },
      data,
    });

    return plainToInstance(StoreDto, updated);
  }

  async remove(id: string): Promise<StoreDto> {
    await this.findOne(id);

    const deletedStore = await this.prismaService.store.delete({
      where: {
        id,
      },
    });

    return plainToInstance(StoreDto, deletedStore);
  }
}
