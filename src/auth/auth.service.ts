import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      let user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      const access_token = await this.signToken(user.id, user.email);

      return {
        access_token,
        id: user.id,
        email: user.email,
      };
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ForbiddenException('Email already in use');
      }
      throw err;
    }
  }

  async signin(dto: AuthDto) {
    console.log(dto);
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credentials Invalid');
    }

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    const access_token = await this.signToken(user.id, user.email);

    return {
      access_token,
      id: user.id,
      email: user.email,
    };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return token;
  }
}
