import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../service/prisma.service";
import { ENTITY_NOT_FOUND } from "../lib/error-messages";

@Injectable()
export class CountryService {
  constructor(private readonly prismaService: PrismaService) {}

  findAllCountries() {
    return this.prismaService.country.findMany();
  }

  async findCountryById(id: number) {
    const country = await this.prismaService.country.findUnique({
      where: {
        id,
      },
    });

    if (!country) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Country", "id"));
    }

    return country;
  }

  findCitiesByCountryId(countryId: number) {
    return this.prismaService.city.findMany({
      where: {
        countryId,
      },
    });
  }

  findCityByCountryIdAndCityId(countryId: number, cityId: number) {
    return this.prismaService.city.findUnique({
      where: {
        id: cityId,
        countryId,
      },
    });
  }
}
