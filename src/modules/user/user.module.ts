import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CognitoClientModule } from 'src/aws/cognito/cognito-client.module';

@Module({
  imports: [CognitoClientModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
