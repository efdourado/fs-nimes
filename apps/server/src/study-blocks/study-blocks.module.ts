import { Module } from '@nestjs/common';
import { StudyBlocksController } from './study-blocks.controller';
import { StudyBlocksService } from './study-blocks.service';

@Module({
  controllers: [StudyBlocksController],
  providers: [StudyBlocksService]
})
export class StudyBlocksModule {}
