// Imports
import { injectable } from 'inversify';
import { createLogger, format, Logger, transports } from 'winston';

export interface ILoggerService {
  debug(message: string, metadata?: any): void;
  info(message: string, metadata?: any): void;
  warn(message: string, metadata?: any): void;
  error(message, metadata?: any): void;
}

@injectable()
export class LoggerService implements ILoggerService {  
  private winston: Logger;

  constructor () {
    this.winston = createLogger({
      transports: [
        new transports.Console({
          level: 'info',
          format: format.combine(
            format.timestamp(),
            format.json(),
          ),
          handleExceptions: true,
        }),
      ],
      exitOnError: false,
    });
  }
  
  public silly(message: string): void {
    this.winston.silly(message);
  }

  public debug(message: string): void {
    this.winston.debug(message);
  }

  public verbose(message: string): void {
    this.winston.verbose(message);
  }

  public info(message: string): void {
    this.winston.info(message);
  }

  public warn(message: string): void {
    this.winston.warn(message);
  }

  public error(message): void {
    this.winston.error(message);
  }
}
