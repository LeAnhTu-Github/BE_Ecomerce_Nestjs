import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response } from "express";
import { prismaClientQueryEngineErrorCodesMap } from "../static/primsa-client-query-engine";
import { getReasonPhrase } from "http-status-codes";
import { Prisma } from "@prisma/client";

// this regex is used to extract the error message from the Prisma error
const PRISMA_EXCEPTION_FORMAT_REGEX = /[^]*\n([^]*)$/;

const createResponseFactory =
  (statusCode: number) => (message: string, path: string) => ({
    statusCode,
    error: getReasonPhrase(statusCode),
    message,
    path,
    timestamp: new Date().toISOString(),
  });

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const path = request.url;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      let message = exception.message.replaceAll(/\n/g, "");

      const prismaException = exception.message.match(
        PRISMA_EXCEPTION_FORMAT_REGEX,
      );

      if (prismaException && prismaException[1]) {
        message = prismaException[1].trim();
      }

      const exceptionCode =
        exception.code as keyof typeof prismaClientQueryEngineErrorCodesMap;

      const statusCode =
        prismaClientQueryEngineErrorCodesMap[exceptionCode] ??
        HttpStatus.INTERNAL_SERVER_ERROR;

      response
        .status(statusCode)
        .json(createResponseFactory(statusCode)(message, path));
    } else {
      let statusCode =
        exception.statusCode ??
        exception.code ??
        HttpStatus.INTERNAL_SERVER_ERROR;

      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
      }

      const exceptionMessage = exception.response?.message ?? exception.message;
      response
        .status(statusCode)
        .json(createResponseFactory(statusCode)(exceptionMessage, path));
    }
  }
}
