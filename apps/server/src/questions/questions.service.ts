import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
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
      },
    });
  }

  async submitAnswer(
    userId: string,
    questionId: string,
    userAnswer: string | boolean,
  ) {
    // 1. Busca a questão e seu bloco associado
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { block: true },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada.');
    }

    // 2. Garante que o usuário tem acesso a este bloco
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId_blockId: { userId, blockId: question.blockId } },
    });

    if (!progress?.unlocked && question.block.order !== 1) {
      throw new UnauthorizedException('Você não tem acesso a este bloco.');
    }

    // 3. [CORREÇÃO] Impede que a mesma questão seja respondida múltiplas vezes
    const existingAnswer = await this.prisma.userAnswer.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });

    if (existingAnswer) {
      throw new ConflictException('Você já respondeu esta questão.');
    }

    // 4. [CORREÇÃO] Valida a resposta do usuário de forma correta
    let isCorrect = false;
    if (question.type === 'CERTO_ERRADO') {
      // Compara a string do frontend com o booleano do banco de dados
      isCorrect = String(userAnswer) === String(question.isCorrect);
    } else if (question.type === 'MULTIPLA_ESCOLHA') {
      const options = question.options as { answer: string };
      isCorrect = userAnswer === options.answer;
    }

    // 5. Registra a resposta individual na tabela UserAnswer
    await this.prisma.userAnswer.create({
      data: {
        userId,
        questionId,
        isCorrect,
      },
    });

    // 6. Atualiza o progresso geral do bloco
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
          },
        },
      },
    });

    // 7. Verifica se o bloco foi concluído e desbloqueia o próximo se necessário
    const totalAnswered = userProgress.correct + userProgress.wrong;
    const totalQuestionsInBlock = userProgress.block._count.questions;

    if (totalAnswered >= totalQuestionsInBlock && !userProgress.completed) {
      const accuracy = userProgress.correct / totalQuestionsInBlock;
      await this.prisma.userProgress.update({
        where: { id: userProgress.id },
        data: { completed: true },
      });

      if (accuracy >= 0.7) { // Critério de aprovação de 70%
        const nextBlock = await this.prisma.studyBlock.findUnique({
          where: { order: userProgress.block.order + 1 },
        });

        if (nextBlock) {
          await this.prisma.userProgress.upsert({
            where: { userId_blockId: { userId, blockId: nextBlock.id } },
            create: { userId, blockId: nextBlock.id, unlocked: true },
            update: { unlocked: true },
          });
        }
      }
    }

    // 8. Retorna o feedback para o frontend
    return {
      correct: isCorrect,
      explanation: question.explanation,
    };
  }
}