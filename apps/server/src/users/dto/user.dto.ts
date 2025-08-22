import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  @MinLength(3, { message: 'O nome precisa ter no mínimo 3 caracteres.'})
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(150, { message: 'A bio deve ter no máximo 150 caracteres.' })
  bio?: string;
}

export class UpdateAvatarDto {
  @IsUrl({}, { message: 'Por favor, insira uma URL válida.' })
  @IsNotEmpty({ message: 'A URL da imagem não pode ser vazia.' })
  profileImage: string;
}