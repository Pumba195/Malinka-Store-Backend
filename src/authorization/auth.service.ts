import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) { }

  // Registration
  async register(userData: any) {
    const existingUser = await this.userModel.findOne({ email: userData.email });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = new this.userModel({
        ...userData,
        password: hashedPassword,
        verificationCode: code,
        isVerified: false
      });

      await newUser.save();

      await this.sendEmail(userData.email, code);

      return {
        message: 'Registration successful. Please check your email for the verification code.',
        email: userData.email
      };

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error during registration');
    }
  }

  async resendVerificationCode(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = newCode;
    await user.save();

    try {
      await this.sendEmail(user.email, newCode);
      return { message: 'New code sent successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendEmail(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '🍓 Verification code 🍓',
      text: `Your verification code: ${code}`,
      html: `Your verification code:<b> ${code}</b>`,
    });
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    user.isVerified = true;
    user.verificationCode = '';
    await user.save();

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
      user: {
        name: user.name,
        email: user.email
      }
    };
  }

  async checkUserStatus(email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new NotFoundException('User with this email was not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('This email is already verified. Please log in.');
    }

    return {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    };
  }

  // Login
  async login(credentials: any) {
    const { email, password } = credentials;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    if (user.isVerified) return this.generateToken(user);
    else throw new UnauthorizedException('You need to confirm your email address');
  }
}