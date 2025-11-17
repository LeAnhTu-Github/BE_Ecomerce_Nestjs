import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Request, Response } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, query, body, headers, ip } = request;

    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    // Mask sensitive data
    const maskedHeaders = this.maskSensitiveData(headers);
    const maskedBody = this.maskSensitiveData(body);

    // Log request
    this.logger.log(
      `[REQUEST] ${timestamp} ${method} ${url} - IP: ${ip || "unknown"}`,
    );
    this.logger.debug(`Query: ${JSON.stringify(query)}`);
    this.logger.debug(`Headers: ${JSON.stringify(maskedHeaders)}`);
    this.logger.debug(`Body: ${JSON.stringify(maskedBody)}`);

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Truncate large response data
        const responseData = this.truncateData(data);

        this.logger.log(
          `[RESPONSE] ${timestamp} ${method} ${url} - ${statusCode} - ${responseTime}ms`,
        );
        this.logger.debug(`Response Data: ${JSON.stringify(responseData)}`);
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = error.status || error.statusCode || 500;

        this.logger.error(
          `[ERROR] ${timestamp} ${method} ${url} - ${statusCode} - ${responseTime}ms`,
        );
        this.logger.error(`Error Message: ${error.message || error}`);
        
        if (process.env.NODE_ENV === "development" && error.stack) {
          this.logger.error(`Stack Trace: ${error.stack}`);
        }

        return throwError(() => error);
      }),
    );
  }

  private maskSensitiveData(data: any): any {
    if (!data || typeof data !== "object") {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.maskSensitiveData(item));
    }

    const sensitiveFields = [
      "password",
      "token",
      "authorization",
      "authorization",
      "accessToken",
      "refreshToken",
      "apiKey",
      "secret",
      "creditCard",
      "cvv",
      "ssn",
    ];

    const masked: any = {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();

      if (
        sensitiveFields.some((field) => lowerKey.includes(field)) &&
        typeof value === "string"
      ) {
        masked[key] = "***MASKED***";
      } else if (typeof value === "object" && value !== null) {
        masked[key] = this.maskSensitiveData(value);
      } else {
        masked[key] = value;
      }
    }

    return masked;
  }

  private truncateData(data: any, maxLength: number = 1000): any {
    if (!data) {
      return data;
    }

    const dataString = JSON.stringify(data);

    if (dataString.length <= maxLength) {
      return data;
    }

    return {
      ...data,
      _truncated: true,
      _originalLength: dataString.length,
      _message: `Response data truncated. Original length: ${dataString.length} characters`,
    };
  }
}

