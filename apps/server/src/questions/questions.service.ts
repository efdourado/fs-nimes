import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

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

  async submitAnswer(userId: string, questionId: string, userAnswer: string | boolean) {
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

    let isCorrect = false;
    if (question.type === 'CERTO_ERRADO') {
      isCorrect = userAnswer === question.isCorrect;
    } else if (question.type === 'MULTIPLA_ESCOLHA') {
      const options = question.options as { answer: string };
      isCorrect = userAnswer === options.answer;
    }

    await this.prisma.userProgress.upsert({
      where: { userId_blockId: { userId, blockId: question.blockId } },
      create: {
        userId,
        blockId: question.blockId,
        unlocked: question.block.order === 1,
        correct: isCorrect ? 1 : 0,
        wrong: !isCorrect ? 1 : 0,
      },
      update: {
        correct: { increment: isCorrect ? 1 : 0 },
        wrong: { increment: !isCorrect ? 1 : 0 },
    }, });
    
    // add lógica para desbloquear próximo bloco aqui

    return {
      correct: isCorrect,
      explanation: question.explanation,
}; } }