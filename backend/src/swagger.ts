import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function isSwaggerEnabled(): boolean {
  return (
    process.env.SWAGGER_ENABLED !== 'false' &&
    (process.env.SWAGGER_ENABLED === 'true' ||
      process.env.NODE_ENV !== 'production')
  );
}

export function setupSwagger(app: INestApplication): void {
  if (!isSwaggerEnabled()) {
    return;
  }

  const port = Number(process.env.PORT) || 8000;
  const config = new DocumentBuilder()
    .setTitle('Papyrus API')
    .setDescription(
      [
        'NestJS API for the fullstack template.',
        '',
        '**Testing protected User routes in Swagger UI**',
        '',
        '1. Run `POST /api/auth/login` (Try it out) with a seeded account, e.g. `admin@papyrus.io` / `Admin123!@#`.',
        '2. The response sets `authToken` and `refreshToken` cookies in your browser (same origin as this page).',
        '3. Call `GET /api/user/me` — cookies are sent automatically when `withCredentials` is enabled.',
        '',
        '**If User routes still return 401**, use **Bearer** auth instead of the cookie fields:',
        '- DevTools → Application → Cookies → `http://localhost:8000` → copy the `authToken` value (the JWT string).',
        '- Click **Authorize** → **bearer (http, Bearer)** → paste the JWT → Authorize.',
        '',
        'Note: `refreshToken` is only for `POST /api/auth/refresh`. User routes require `authToken` (or Bearer with that JWT).',
        'Typing a cookie value in Authorize does not set browser cookies; login via Try it out or use Bearer.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addTag('App')
    .addTag('Auth')
    .addTag('User')
    .addTag('OAuth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Paste the authToken JWT from login (cookie value). Used by User routes when cookies are not sent.',
      },
      'bearer',
    )
    .addCookieAuth('authToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'authToken',
      description: 'Set automatically by POST /api/auth/login when using Try it out on this host.',
    })
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
      description: 'Only required for POST /api/auth/refresh.',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
      requestInterceptor: (req: { credentials?: string }) => {
        req.credentials = 'include';
        return req;
      },
    },
  });

  console.log(`Swagger UI: http://localhost:${port}/docs`);
}
