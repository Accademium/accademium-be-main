import { IsEmail, IsString } from 'class-validator';

export class RegistrationRequest {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  organisationId: string;
}

export class CreateB2BUserRequest {
  @IsEmail()
  email: string;
  @IsString()
  organisationId: string;
  @IsString()
  userGroup: string;
}

export class LoginRequest {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class VerifyUserRequest {
  @IsEmail()
  email: string;
  @IsString()
  code: string;
}

export class ChangePasswordRequest {
  @IsString()
  cognitoAccessToken: string;
  @IsString()
  currentPassword: string;
  @IsString()
  newPassword: string;
}

export class UserDto {
  @IsString()
  userId: string;
  @IsString()
  email: string;
  @IsString()
  groups: string;
  @IsString()
  organisationId: string;
}
