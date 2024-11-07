import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCognitoResponseByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest().user;

export const CognitoResponse = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCognitoResponseByContext(context),
);