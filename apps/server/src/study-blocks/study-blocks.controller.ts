import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StudyBlocksService } from './study-blocks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('study-blocks')
export class StudyBlocksController {
  constructor(private readonly studyBlocksService: StudyBlocksService) {}

  @Get()
  findAllForUser(@Req() req) {
    return this.studyBlocksService.findAllForUser(req.user.userId);
} }