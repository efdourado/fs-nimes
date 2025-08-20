import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findQuestionsByBlockId(blockId: string) {
    return this.prisma.question.findMany({
      where: { blockId },
      select: {
        id: true,
        statement: true,
        type: true,
        difficulty: true,
        options: true,
  }, }); }

  async submitAnswer(
    userId: string,
    questionId: string,
    userAnswer: string | boolean,
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { block: true },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada.');
    }

    const progress = await this.prisma.userProgress.findUnique({
      where: { userId_blockId: { userId, blockId: question.blockId } },
    });

    if (!progress?.unlocked && question.block.order !== 1) {
      throw new UnauthorizedException('Você não tem acesso a este bloco.');
    }

    const existingAnswer = await this.prisma.userAnswer.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });

    if (existingAnswer) {
      throw new ConflictException('Você já respondeu esta questão.');
    }

    let isCorrect = false;
    if (question.type === 'CERTO_ERRADO') {
      const userAnswerAsBoolean = userAnswer === 'true';
      isCorrect = userAnswerAsBoolean === question.isCorrect;
    }
    
    else if (question.type === 'MULTIPLA_ESCOLHA') {
      const options = question.options as Prisma.JsonObject;
      isCorrect = userAnswer === options.answer;
    }

    await this.prisma.userAnswer.create({
      data: {
        userId,
        questionId,
        isCorrect,
    }, });

    const userProgress = await this.prisma.userProgress.upsert({
      where: { userId_blockId: { userId, blockId: question.blockId } },
      create: {
        userId,
        blockId: question.blockId,
        unlocked: question.block.order === 1,
        correct: isCorrect ? 1 : 0,
        wrong: !isCorrect ? 1 : 0,
        completed: false,
      },
      update: {
        correct: { increment: isCorrect ? 1 : 0 },
        wrong: { increment: !isCorrect ? 1 : 0 },
      },
      include: {
        block: {
          include: {
            _count: { select: { questions: true } },
    }, }, }, });

    const totalAnswered = userProgress.correct + userProgress.wrong;
    const totalQuestionsInBlock = userProgress.block._count.questions;

    if (totalAnswered >= totalQuestionsInBlock && !userProgress.completed) {
      const accuracy = userProgress.correct / totalQuestionsInBlock;
      await this.prisma.userProgress.update({
        where: { id: userProgress.id },
        data: { completed: true },
      });

      if (accuracy >= 0.7) {
        const nextBlock = await this.prisma.studyBlock.findUnique({
          where: { order: userProgress.block.order + 1 },
        });

        if (nextBlock) {
          await this.prisma.userProgress.upsert({
            where: { userId_blockId: { userId, blockId: nextBlock.id } },
            create: { userId, blockId: nextBlock.id, unlocked: true },
            update: { unlocked: true },
    }); } } }

    return {
      correct: isCorrect,
      explanation: question.explanation,
  }; }

  async create(createQuestionDto: CreateQuestionDto) {
    const { blockId, ...questionData } = createQuestionDto;

    const blockExists = await this.prisma.studyBlock.findUnique({
      where: { id: blockId },
    });
    if (!blockExists) {
      throw new NotFoundException(`Bloco com ID "${blockId}" não encontrado.`);
    }

    return this.prisma.question.create({
      data: {
        ...questionData,
        
        options:
          questionData.options as Prisma.InputJsonValue | undefined,
        block: {
          connect: { id: blockId },
  }, }, }); }

  async update(questionId: string, updateQuestionDto: UpdateQuestionDto) {
    await this.prisma.question.findUniqueOrThrow({
      where: { id: questionId },
    }).catch(() => {
        throw new NotFoundException('Questão não encontrada.');
    });

    return this.prisma.question.update({
      where: { id: questionId },
      data: {
        ...updateQuestionDto,
        options:
          updateQuestionDto.options as Prisma.InputJsonValue | undefined,
  }, }); }

  async remove(questionId: string) {
    await this.prisma.question.findUniqueOrThrow({
        where: { id: questionId },
    }).catch(() => {
        throw new NotFoundException('Questão não encontrada.');
    });

    await this.prisma.question.delete({
      where: { id: questionId },
    });

    return { message: 'Questão removida com sucesso.' };
  } 
  
  async findAll() {
    return this.prisma.question.findMany({
      orderBy: {
        block: {
          order: 'asc',
        },
      },
      include: {
        block: {
          select: {
            title: true,
  }, }, }, }); }

  async findOne(questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new NotFoundException('Questão não encontrada.');
    }
    return question;
} }