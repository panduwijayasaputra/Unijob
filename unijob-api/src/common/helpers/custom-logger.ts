import { Logger, LoggerService } from '@nestjs/common';
import * as chalk from 'chalk';

export class CustomLogger extends Logger implements LoggerService {
    logSequelize(message: string) {
        super.log(chalk.hex('#b165d0')(message));
    }

    logRequest(message: string) {
        super.log(chalk.blueBright(message));
    }

    logResponse(message: string) {
        super.log(chalk.greenBright(message));
    }
}
