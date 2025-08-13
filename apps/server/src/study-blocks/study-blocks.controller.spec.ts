import { Test, TestingModule } from '@nestjs/testing';
import { StudyBlocksController } from './study-blocks.controller';

describe('StudyBlocksController', () => {
  let controller: StudyBlocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyBlocksController],
    }).compile();

    controller = module.get<StudyBlocksController>(StudyBlocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
