import express from 'express';
import { inject, injectable } from 'inversify';
import { Server, createServer } from 'http';
import config from '../config.json';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { IBasicMiddleware } from '../middleware/basic.middleware';
import router from '../api';
// import { BlockRoutes,/ IRoute } from '../api/blockApi';
import { ILoggerService } from './logger.service';

export interface IHttpService {
  httpServer: Server;
  initializeServer(): Promise<void>;
}

@injectable()
export class HttpService implements IHttpService {
  private logger;
  private basicMiddleware;
  // private appRoute;
  // private router;
  public httpServer: Server;
  public app: express.Express;

  constructor(
    @inject(SERVICE_IDENTIFIER.Logger) logger: ILoggerService,
    @inject(SERVICE_IDENTIFIER.BasicMiddleware) basicMiddleware: IBasicMiddleware,
    // @inject(SERVICE_IDENTIFIER.BlockRoutes) route: IRoute
  ) {
    this.logger = logger;
    this.basicMiddleware = basicMiddleware;
    // this.appRoute = route;
  }

  public async initializeServer(): Promise<void> {
    this.app = express();
    // this.router = express.Router();

    this.httpServer = createServer(this.app);
    // registering middleware && routes
    this.basicMiddleware.initializeMiddlewares(this.app);
    router(this.app)
    // this.appRoute.setRoutes(this.router);
  
    const port = process.env.PORT || config.port;
    this.httpServer.setTimeout(300000);

    this.httpServer.keepAliveTimeout = 280000; // ms
    try {
      this.httpServer.listen(port, () => {
        return this.logger.info(`server is listening on ${port}`)
      });
    } catch (err) {
      console.log("err 1 >>> ", err)
      this.logger.error(`err in initializeServer ${err}`);
      // throw err;
    }
  }
}
