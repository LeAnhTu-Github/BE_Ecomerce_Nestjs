import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleGuard } from "../role/role.guard";
import { Role } from "@prisma/client";
import { Roles } from "../role/role.decorator";
import { BillboardService } from "./billboard.service";
import { CreateBillboardDto } from "./dto/create-billboard.dto";
import { UpdateBillboardDto } from "./dto/update-billboard.dto";
import {
  BillboardListResponseWrapper,
  BillboardResponse,
  BillboardResponseWrapper,
} from "../model/response.model";

@ApiTags("billboards")
@UseGuards(RoleGuard)
@ApiBearerAuth("bearer-auth")
@ApiExtraModels(
  BillboardResponse,
  BillboardResponseWrapper,
  BillboardListResponseWrapper,
)
@Controller("billboards")
export class BillboardController {
  constructor(private readonly billboardService: BillboardService) {}

  @Roles([Role.ADMIN])
  @Post()
  @ApiOperation({ summary: "Create a new billboard" })
  @ApiCreatedResponse({
    description: "Billboard successfully created",
    type: BillboardResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  create(@Body() createBillboardDto: CreateBillboardDto) {
    return this.billboardService.create(createBillboardDto);
  }

  @Roles([Role.ADMIN])
  @Get()
  @ApiOperation({ summary: "Get all billboards for a store" })
  @ApiOkResponse({
    description: "Billboards successfully retrieved",
    type: BillboardListResponseWrapper,
  })
  findAll(@Query("storeId", new ParseUUIDPipe()) storeId: string) {
    return this.billboardService.findAll(storeId);
  }

  @Roles([Role.ADMIN])
  @Get(":id")
  @ApiOperation({ summary: "Get a billboard by ID" })
  @ApiOkResponse({
    description: "Billboard successfully retrieved",
    type: BillboardResponseWrapper,
  })
  findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("storeId", new ParseUUIDPipe()) storeId: string,
  ) {
    return this.billboardService.findOne(id, storeId);
  }

  @Roles([Role.ADMIN])
  @Patch(":id")
  @ApiOperation({ summary: "Update a billboard" })
  @ApiOkResponse({
    description: "Billboard successfully updated",
    type: BillboardResponseWrapper,
  })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("storeId", new ParseUUIDPipe()) storeId: string,
    @Body() updateBillboardDto: UpdateBillboardDto,
  ) {
    return this.billboardService.update(id, storeId, updateBillboardDto);
  }

  @Roles([Role.ADMIN])
  @Delete(":id")
  @ApiOperation({ summary: "Delete a billboard" })
  @ApiOkResponse({
    description: "Billboard successfully deleted",
    type: BillboardResponseWrapper,
  })
  remove(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("storeId", new ParseUUIDPipe()) storeId: string,
  ) {
    return this.billboardService.remove(id, storeId);
  }
}

