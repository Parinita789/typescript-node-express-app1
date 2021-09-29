import { Express } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { injectable, inject } from 'inversify';
import { CONSTANTS } from '../constants/common.constants';
import { SERVICE_IDENTIFIER } from '../constants/identifier.constant';
import { ILoggerService } from '../service/logger.service';
import { handleError } from './errorHandler.middleware';

export interface IBasicMiddleware {
  initializeMiddlewares(app: Express): Promise<void>;
}

@injectable()
export class BasicMiddleware { 
  private logger;
  constructor (@inject(SERVICE_IDENTIFIER.Logger) logger: ILoggerService,) {
    this.logger = logger;
  }

  public async initializeMiddlewares(app): Promise<void> {
    try {  
      app.use(bodyParser.json({
        limit : CONSTANTS.BODY_LIMIT
      }));
      
      app.use(cors({
        exposedHeaders: CONSTANTS.CORS_HEADER
      }));
      
      app.use(morgan('dev'));  
      
      app.use(handleError) // handling erorrs

    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}