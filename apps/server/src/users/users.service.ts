import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImage: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async update(userId: string, data: { name?: string; bio?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImage: true,
  }, }); }

  async updateAvatar(userId: string, profileImage: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { profileImage },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImage: true,
  }, }); }
  
  async getUserStats(userId: string) {
    const totalAnswers = await this.prisma.userAnswer.count({
      where: { userId },
    });
    const correctAnswers = await this.prisma.userAnswer.count({
      where: { userId, isCorrect: true },
    });
    const totalBlocks = await this.prisma.studyBlock.count();
    const completedBlocks = await this.prisma.userProgress.count({
      where: { userId, completed: true },
    });

    const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

    const lastStudiedBlock = await this.prisma.userProgress.findFirst({
      where: { userId },
      orderBy: { block: { order: 'desc' } },
      select: {
        block: {
          select: {
            id: true,
            title: true,
    }, }, }, });

    return {
      accuracy: parseFloat(accuracy.toFixed(2)),
      totalAnswers,
      correctAnswers,
      completedBlocks,
      totalBlocks,
      lastStudiedBlock: lastStudiedBlock?.block || null,
}; } }