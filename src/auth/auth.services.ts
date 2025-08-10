import { Injectable, ForbiddenException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async generateToken(userId: number, email: string, role: Role) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
        access_token: at,
        refresh_token: rt,
    }
  }
  
  //signup 
  async signup(dto: SignupDto): Promise<Tokens> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    })
    if (existingUser){
      throw new Error('User already exists');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email)) {
          throw new Error('Invalid email format');
      }

    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        username: dto.userName,
        email: dto.email,
        hash: hash,
        role: dto.role || Role.USER,
      },
    });

    const tokens = await this.generateToken(newUser.id, newUser.email, newUser.role);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string){
    const hash = await this.hashData(rt)
    await this.prisma.user.update({
        where: {
            id: userId
        },
        data: {
            hashedRt: hash,
        }
    })
  }


  //login
  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
        where: {
            email: dto.email
        }
    })

    if (!user) throw new ForbiddenException("Access Denied");

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException("Access Denied. Password Incorrect!");
    
    const tokens = await this.generateToken(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  //logout
  async logout(userId: number) {
    await this.prisma.user.updateMany({
        where: {
            id: userId,
            //get user that has refresh token, which means its logged in 
            hashedRt: {
                not: null,
            }
        },
        data: {
            //And make it null, so it doesnt have access
            hashedRt: null,
        }
    })
}

  async refreshToken(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
        where: {
            id: userId
        } 
    })
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateToken(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
