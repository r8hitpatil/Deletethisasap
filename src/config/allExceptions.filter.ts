import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Response } from "express";

@Catch()
export class AllExceptionFilter implements ExceptionFilter{
    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        // NestJs Exceptions
        if(exception.getStatus){
            status = exception.getStatus();
            message = exception.message || message;
        }

        // Prisma error
        if(
            exception instanceof PrismaClientKnownRequestError && 
            exception.code === 'P2002'
        ){
            status = HttpStatus.CONFLICT;
            message = 'Creds already exists'
        }
        return response.status(status).json({
            statusCode : status,
            message,
        });
    }
}