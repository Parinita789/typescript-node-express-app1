import express from 'express';
import { inject, injectable } from 'inversify';
import { Server, createServer } from 'http';
import CONFIG from '../CONFIG/envCONFIG';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { IBasicMiddleware } from '../middleware/basic.middleware';
import router from '../api';
import { ILoggerService } from './logger.service';
import { InternalServerError } from '../utils/error.utils';
 
export interface IHttpService {
  httpServer: Server;
  initializeServer(): Promise<void>;
}

@injectable()
export class HttpService implements IHttpService {
  private logger;
  private basicMiddleware;
  public httpServer: Server;
  public app: express.Express;

  constructor(
    @inject(SERVICE_IDENTIFIER.Logger) logger: ILoggerService,
    @inject(SERVICE_IDENTIFIER.BasicMiddleware) basicMiddleware: IBasicMiddleware,
  ) {
    this.logger = logger;
    this.basicMiddleware = basicMiddleware;
  }

  public async initializeServer(): Promise<void> {
    this.app = express();

    this.httpServer = createServer(this.app);
    router(this.app); // registering routes
    this.basicMiddleware.initializeMiddlewares(this.app); // registering middlewares
    this.httpServer.setTimeout(CONFIG.SERVER_TIMEOUT);

    this.httpServer.keepAliveTimeout = CONFIG.KEEP_ALIVE_TIMEOUT; // ms
    try {
      this.httpServer.listen(CONFIG.PORT, () => {
        return this.logger.info(`server is listening on ${CONFIG.PORT}`)
      });
    } catch (err) {
      this.logger.error(`err in initializeServer ${err}`);
      throw new InternalServerError('err in initializeServer', err);
    }
  }
}
