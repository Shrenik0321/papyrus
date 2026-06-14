import { ApiProperty } from '@nestjs/swagger';

export class MessageEnvelopeDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}

type OpenApiSchema = Record<string, unknown>;

export function envelopeSchema(
  data: OpenApiSchema,
  messageExample = 'Operation completed successfully',
): { schema: OpenApiSchema } {
  return {
    schema: {
      type: 'object',
      properties: {
        data,
        message: { type: 'string', example: messageExample },
      },
    },
  };
}

export function envelopeRef(
  ref: string,
  options?: { isArray?: boolean; messageExample?: string },
): { schema: OpenApiSchema } {
  const data = options?.isArray
    ? { type: 'array', items: { $ref: ref } }
    : { $ref: ref };

  return envelopeSchema(data, options?.messageExample);
}
