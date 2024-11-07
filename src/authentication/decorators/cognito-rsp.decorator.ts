import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserFromContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest().user;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserFromContext(context),
);