import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

@Injectable()
export class StudyBlocksService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    // Busca todos os blocos em ordem
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
} }