import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ApiErrorDocs } from './api-error-docs.decorator';
import { ResponseEntity } from '../dto/response-entity';

type ApiResponseDocsOptions = {
  type?: Type;
  summary?: string;
  isArray?: boolean;
  errors?: string[];
};

export const ApiResponseDocs = (
  options: ApiResponseDocsOptions,
): MethodDecorator => {
  const { type, summary, isArray, errors } = options ?? {};

  const decorators = [
    ApiOperation({ summary: summary }),
    ApiExtraModels(ResponseEntity),
  ];

  if (errors) {
    decorators.push(ApiErrorDocs(errors));
  }

  if (!type) {
    decorators.push(ApiOkResponse({ type: ApiResponse }));
    return applyDecorators(...decorators);
  }

  decorators.push(ApiExtraModels(type));

  const baseResponseSchema: ReferenceObject = {
    $ref: getSchemaPath(ResponseEntity),
  };

  const properties = isArray
    ? {
        data: { type: 'array', items: { $ref: getSchemaPath(type) } },
      }
    : { data: { $ref: getSchemaPath(type) } };

  const customTypeSchema: SchemaObject = { properties };

  const combineSchema: (ReferenceObject | SchemaObject)[] = [
    baseResponseSchema,
    customTypeSchema,
  ];

  decorators.push(
    ApiOkResponse({
      schema: {
        allOf: combineSchema,
      },
    }),
  );

  return applyDecorators(...decorators);
};
