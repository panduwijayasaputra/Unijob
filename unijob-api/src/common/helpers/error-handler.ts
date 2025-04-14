import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    ServiceUnavailableException,
    GatewayTimeoutException,
    RequestTimeoutException,
  } from '@nestjs/common';
  import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

  /**
   * A custom error handler function that catches any exceptions thrown by the
   * controller or service layer and rethrows them as a specific type of
   * NestJS exception, or if no other exception is thrown, it throws an
   * InternalServerErrorException.
   *
   * @param error - The error object that has been thrown.
   */
  export const errorHandler = (error: any) => {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestException('Reset token has expired');
    } else if (error instanceof JsonWebTokenError) {
      throw new BadRequestException('Invalid token');
    } else if (
      error instanceof Error ||
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof UnauthorizedException ||
      error instanceof ForbiddenException ||
      error instanceof ServiceUnavailableException ||
      error instanceof GatewayTimeoutException ||
      error instanceof RequestTimeoutException
    ) {
      throw error; // rethrow the original exception
    } else if (error instanceof SyntaxError) {
      throw new BadRequestException('Invalid syntax');
    } else if (error instanceof TypeError) {
      throw new InternalServerErrorException('Type error occurred');
    } else if (error instanceof RangeError) {
      throw new BadRequestException('Range error occurred');
    } else if (error instanceof ReferenceError) {
      throw new InternalServerErrorException('Reference error occurred');
    } else {
      throw new InternalServerErrorException();
    }
  };
