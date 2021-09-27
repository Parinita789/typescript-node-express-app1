import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { injectable, inject } from 'inversify';
import config from '../config.json';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { ILoggerService } from '../service/logger.service';

import express from 'express';

export interface IBasicMiddleware {
  initializeMiddlewares(app: express.Express): Promise<void>;
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
        limit : config.bodyLimit
      }));
      
      app.use(cors({
        exposedHeaders: config.corsHeaders
      }));
      
      app.use(morgan('dev'));   
    } catch (error) {
      this.logger.error(error);
      console.log("err 111 >>> ", error)
    }
  }
}