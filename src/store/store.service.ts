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

@Injectable()
export class StoreService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(REQUEST) private readonly request: SessionRequest,
  ) {}

  async create(
    files: { logo: Express.Multer.File[]; banner?: Express.Multer.File[] },
    createStoreDto: CreateStoreDto,
  ): Promise<StoreDto> {
    const { name, address, cityId, countryId } = createStoreDto;
    const { logo, banner } = files;

    let logoUrl: string | undefined, bannerUrl: string | undefined;

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

    const store = await this.prismaService.store.create({
      data: {
        name,
        address,
        countryId: +countryId,
        cityId: +cityId,
        logo: logoUrl as string,
        userId: this.request.user.id,
        ...(banner && { banner: bannerUrl }),
      },
    });

    return plainToInstance(StoreDto, store);
  }

  async findAll(): Promise<StoreDto[]> {
    const stores = await this.prismaService.store.findMany({
      where: {
        userId: this.request.user.id,
      },
    });

    return plainToInstance(StoreDto, stores);
  }

  async findOne(id: number): Promise<StoreDto> {
    const store = await this.prismaService.store.findUnique({
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

  update(id: number, updateStoreDto: UpdateStoreDto) {
    // TODO: implement update store
  }

  async remove(id: number): Promise<StoreDto> {
    const deletedStore = await this.prismaService.store.delete({
      where: {
        id,
        userId: this.request.user.id,
      },
    });

    return plainToInstance(StoreDto, deletedStore);
  }
}
