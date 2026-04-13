import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AtStrategy,RtStrategy } from './strategies';
import { JwtSignService,JwtVerifyService } from './jwt';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UserModule,PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService,AtStrategy,RtStrategy,JwtSignService,JwtVerifyService]
})
export class AuthModule {}
