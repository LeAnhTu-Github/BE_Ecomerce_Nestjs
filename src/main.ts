import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { GlobalExceptionFilter } from "./exception/global-exception.filter";
import { getReasonPhrase } from "http-status-codes";
import { ResponseMappingInterceptor } from "./interceptor/response-mapping.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          error: getReasonPhrase(HttpStatus.UNPROCESSABLE_ENTITY),
          message: errors.reduce(
            (acc, e) => ({
              ...acc,
              [e.property]: Object.values(
                e.constraints as Record<string, string>,
              ),
            }),
            {},
          ),
        });
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));

  app.useGlobalInterceptors(new ResponseMappingInterceptor());

  app.enableShutdownHooks();

  app.enableCors({
    origin: "*",
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Ecommerce API with NestJS")
    .setDescription("API Documentation for Ecommerce API with NestJS")
    .setVersion("1.0")
    .addTag("ecommerce")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "bearer-auth",
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("swagger", app, swaggerDocument);

  await app.listen(4000);
}

bootstrap();
