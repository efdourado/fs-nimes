import { Controller, Get, UseGuards, Req, Body, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto, UpdateAvatarDto } from './dto/user.dto';

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
  }

  @Put('me/avatar')
  @HttpCode(HttpStatus.OK)
  updateAvatar(@Req() req, @Body() data: UpdateAvatarDto) {
    return this.usersService.updateAvatar(req.user.userId, data.profileImage);
} }