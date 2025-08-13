import { Controller, Get, UseGuards, Req, Body, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

class UpdateProfileDto {
  name: string;
  bio: string;
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('me')
  updateProfile(@Req() req, @Body() data: UpdateProfileDto) {
    return this.usersService.update(req.user.userId, data);
} }