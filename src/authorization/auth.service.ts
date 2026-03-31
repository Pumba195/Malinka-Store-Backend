import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  // Registration
  async register(userData: any) {

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    
    const savedUser = await newUser.save();

    return this.login({ 
      email: savedUser.email, 
      password: userData.password
    });
  }

  // Login
  async login(credentials: any) {
    const { email, password } = credentials;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    const payload = { email: user.email, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
      user: {
        name: user.name,
        email: user.email
      }
    };
  }
}