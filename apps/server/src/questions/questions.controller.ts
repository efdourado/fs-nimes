import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';

class AnswerDto {
  answer: string | boolean;
}

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get('block/:blockId')
  getQuestionsForBlock(@Param('blockId') blockId: string) {
    return this.questionsService.findQuestionsByBlockId(blockId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
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