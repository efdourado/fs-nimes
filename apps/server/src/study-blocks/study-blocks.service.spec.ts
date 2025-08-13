import { Test, TestingModule } from '@nestjs/testing';
import { StudyBlocksService } from './study-blocks.service';

describe('StudyBlocksService', () => {
  let service: StudyBlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyBlocksService],
    }).compile();

    service = module.get<StudyBlocksService>(StudyBlocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
