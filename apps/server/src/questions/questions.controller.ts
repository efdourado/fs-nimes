import { Controller, Get, Param, Post, Req, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestionsService } from './questions.service';

class AnswerDto {
  answer: string | boolean;
}

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('block/:blockId')
  getQuestionsForBlock(@Param('blockId') blockId: string) {
    return this.questionsService.findQuestionsByBlockId(blockId);
  }

  @Post(':questionId/answer')
  submitAnswer(
    @Req() req,
    @Param('questionId') questionId: string,
    @Body() answerDto: AnswerDto,
  ) {
    return this.questionsService.submitAnswer(
      req.user.userId,
      questionId,
      answerDto.answer,
); } }