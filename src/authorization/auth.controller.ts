import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @Post('verify')
  async verify(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmail(body.email, body.code);
  }

  @Post('resend-code')
  async resendCode(@Body('email') email: string) {
    return this.authService.resendVerificationCode(email);
  }

  @Post('check-status')
  async checkStatus(@Body('email') email: string) {
    return this.authService.checkUserStatus(email);
  }

  @Post('login')
  async login(@Body() credentials: any) {
    return this.authService.login(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-name')
  async updateName(@Request() req: any, @Body('name') name: string) {
    return this.authService.updateName(req.user.sub, name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-email-change')
  async requestEmailChange(@Request() req: any, @Body('newEmail') newEmail: string) {
    return this.authService.requestEmailChange(req.user.sub, newEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-email-change-code')
  async resendEmailChangeCode(@Request() req: any) {
    return this.authService.resendEmailChangeCode(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email-change')
  async verifyEmailChange(@Request() req: any, @Body('code') code: string) {
    return this.authService.verifyEmailChange(req.user.sub, code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req: any, @Body() changeData: any) {
    return this.authService.changePassword(req.user.sub, changeData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-password-reset')
  async requestPasswordReset(@Request() req: any) {
    return this.authService.requestPasswordResetCode(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@Request() req: any, @Body() resetData: any) {
    return this.authService.resetPasswordWithCode(req.user.sub, resetData);
  }
}