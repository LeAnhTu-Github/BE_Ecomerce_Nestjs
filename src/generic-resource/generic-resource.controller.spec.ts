// @ts-nocheck
import { Test, TestingModule } from "@nestjs/testing";
import { GenericResourceController } from "./generic-resource.controller";
import { GenericResourceService } from "./generic-resource.service";

describe("GenericResourceController", () => {
  let controller: GenericResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenericResourceController],
      providers: [GenericResourceService],
    }).compile();

    controller = module.get<GenericResourceController<any>>(
      GenericResourceController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
