import { Controller, Get, HttpStatus, Param, ParseIntPipe } from "@nestjs/common";
import { CountryService } from "./country.service";
import { Public } from "../decorator/public-route.decorator";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  CountryResponse,
  CountryResponseWrapper,
  CountryListResponseWrapper,
  CityResponse,
  CityResponseWrapper,
  CityListResponseWrapper,
} from "../model/response.model";

@ApiTags("countries")
@ApiExtraModels(
  CountryResponse,
  CountryResponseWrapper,
  CountryListResponseWrapper,
  CityResponse,
  CityResponseWrapper,
  CityListResponseWrapper,
)
@Controller("countries")
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Get all countries" })
  @ApiOkResponse({
    description: "Countries successfully retrieved",
    type: CountryListResponseWrapper,
  })
  findAllCountries() {
    return this.countryService.findAllCountries();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Get a country by ID" })
  @ApiOkResponse({
    description: "Country successfully retrieved",
    type: CountryResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Country not found",
  })
  findCountryById(@Param("id", ParseIntPipe) id: number) {
    return this.countryService.findCountryById(id);
  }

  @Public()
  @Get(":countryId/cities")
  @ApiOperation({ summary: "Get all cities by country ID" })
  @ApiOkResponse({
    description: "Cities successfully retrieved",
    type: CityListResponseWrapper,
  })
  findCitiesByCountryId(@Param("countryId", ParseIntPipe) countryId: number) {
    return this.countryService.findCitiesByCountryId(countryId);
  }

  @Public()
  @Get(":countryId/cities/:cityId")
  @ApiOperation({ summary: "Get a city by country ID and city ID" })
  @ApiOkResponse({
    description: "City successfully retrieved",
    type: CityResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "City not found",
  })
  findCityByCountryIdAndCityId(
    @Param("countryId", ParseIntPipe) countryId: number,
    @Param("cityId", ParseIntPipe) cityId: number,
  ) {
    return this.countryService.findCityByCountryIdAndCityId(countryId, cityId);
  }
}
