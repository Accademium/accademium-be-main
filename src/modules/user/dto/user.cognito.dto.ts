import { IsString } from 'class-validator';

export class AdminCreateUserRequest {
  @IsString()
  tempPassword: string;

  @IsString()
  email: string;

  @IsString()
  organisationId: string;
}

export class ChangeInitialPasswordRequest {
  @IsString()
  email: string;

  @IsString()
  session: string;

  @IsString()
  newPassword: string;
}

export class AdminAddUserToGroupRequest {
  @IsString()
  userGroup: string;

  @IsString()
  email: string;
}
