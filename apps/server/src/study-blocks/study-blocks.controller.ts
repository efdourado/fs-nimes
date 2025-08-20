import { Controller, Get, Post, Param, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { StudyBlocksService } from './study-blocks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('study-blocks')
export class StudyBlocksController {
  constructor(private readonly studyBlocksService: StudyBlocksService) {}

  @Get()
  findAllForUser(@Req() req) {
    return this.studyBlocksService.findAllForUser(req.user.userId);
  }

  @Post(':blockId/start')
  @HttpCode(HttpStatus.OK)
  startOrRestartBlock(@Req() req, @Param('blockId') blockId: string) {
    return this.studyBlocksService.startOrRestartBlock(req.user.userId, blockId);
} }