import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { StudyBlocksModule } from './study-blocks/study-blocks.module';
import { PrismaModule } from './core/prisma.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudyBlocksModule,
    QuestionsModule,
  ],
  controllers: [],
  providers: [], 
})

export class AppModule {}