import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // if (data) {
    //   console.log(data);
    //   return request.user[data];
    // }

    return request.user;
  },
);
