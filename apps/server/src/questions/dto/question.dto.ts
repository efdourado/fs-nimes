import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsJSON,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, Difficulty } from '@prisma/client';

export class AnswerDto {
  @IsNotEmpty({ message: 'A resposta não pode ser vazia.' })
  answer: string | boolean;
}

class MultipleChoiceOptionsDto {
  @IsNotEmpty()
  @IsString({ each: true })
  options: string[];

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  blockId: string;

  @IsString()
  @IsNotEmpty()
  statement: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MultipleChoiceOptionsDto)
  options?: MultipleChoiceOptionsDto;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;

  @IsString()
  @IsNotEmpty()
  explanation: string;
}

export class UpdateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  statement?: string;

  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MultipleChoiceOptionsDto)
  options?: MultipleChoiceOptionsDto;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  explanation?: string;
}