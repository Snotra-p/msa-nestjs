import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

import { ErrorOutDto } from '../dto/error-out.dto';
import { getGlobalErrorMap } from '../utils/setup-error';

export const ApiErrorDocs = (errorKeys: string[]): MethodDecorator => {
  const serverErrorMap = getGlobalErrorMap();

  return applyDecorators(
    ...errorKeys.map((errorKey) =>
      ApiResponse({
        status: serverErrorMap[errorKey].statusCode,
        description:
          'code : ' +
          serverErrorMap[errorKey].errorCode +
          ' message : ' +
          serverErrorMap[errorKey].message,
        type: ErrorOutDto,
      }),
    ),
  );
};
