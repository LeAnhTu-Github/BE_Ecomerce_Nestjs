import { Test, TestingModule } from '@nestjs/testing';
import { GenericResourceService } from './generic-resource.service';

describe('GenericResourceService', () => {
  let service: GenericResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenericResourceService],
    }).compile();

    service = module.get<GenericResourceService>(GenericResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
