import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

@Injectable()
export class StudyBlocksService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    const allBlocks = await this.prisma.studyBlock.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { questions: true },
    }, }, });

    const userProgress = await this.prisma.userProgress.findMany({
      where: { userId },
    });

    const progressMap = new Map(userProgress.map((p) => [p.blockId, p]));

    const result = allBlocks.map((block) => {
      const progress = progressMap.get(block.id);
      const isUnlocked = progress?.unlocked || block.order === 1;
      
      return {
        id: block.id,
        title: block.title,
        description: block.description,
        order: block.order,
        totalQuestions: block._count.questions,

        userStatus: {
          unlocked: isUnlocked,
          completed: progress?.completed || false,
          correctAnswers: progress?.correct || 0,
          wrongAnswers: progress?.wrong || 0,
    }, }; });

    return result;
  }

  async startOrRestartBlock(userId: string, blockId: string) {
    const block = await this.prisma.studyBlock.findUnique({
      where: { id: blockId },
    });

    if (!block) {
      throw new NotFoundException('Bloco de estudo não encontrado.');
    }

    if (block.order > 1) {
      const previousBlock = await this.prisma.studyBlock.findUnique({
        where: { order: block.order - 1 },
      });
      if (previousBlock) {
        const previousProgress = await this.prisma.userProgress.findUnique({
          where: { userId_blockId: { userId, blockId: previousBlock.id } },
        });
        if (!previousProgress?.completed) {
          throw new UnauthorizedException(
            'Você precisa completar o bloco anterior primeiro.',
          );
        }
      }
    }

    await this.prisma.userAnswer.deleteMany({
      where: {
        userId,
        question: {
          blockId,
        },
      },
    });

    await this.prisma.userProgress.upsert({
      where: { userId_blockId: { userId, blockId } },
      create: {
        userId,
        blockId,
        unlocked: true,
        completed: false,
        correct: 0,
        wrong: 0,
      },
      update: {
        completed: false,
        correct: 0,
        wrong: 0,
      },
    });

    return { message: 'Bloco iniciado com sucesso. Você pode começar a responder as questões.' };
} }