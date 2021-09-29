import { inject, injectable } from 'inversify';
import { SERVICE_IDENTIFIER } from './constants/identifier.constant';
import { ILoggerService } from './service/logger.service';
import { IHttpService } from './service/http.service';
import { IRedisService } from './service/redis.service'

export interface IApplication {
  initializeApplication(): Promise<void>;
}

@injectable()
export class Application implements IApplication { 
  private logger;
  private httpService;
  private redisService;

  constructor(
    @inject(SERVICE_IDENTIFIER.RedisService) redisService: IRedisService,
    @inject(SERVICE_IDENTIFIER.Logger) logger: ILoggerService,
    @inject(SERVICE_IDENTIFIER.HttpService) httpService: IHttpService,
  ) {
    this.redisService = redisService;
    this.logger = logger;
    this.httpService = httpService;
  }

  public async initializeApplication(): Promise<void> {
    try {  
      await this.redisService.initializeClient();
      await this.httpService.initializeServer();
  
      this.logger.info('Application Started');
    } catch (error) {
      this.logger.error(error);
      this.gracefulShutdown(error);
    }
  }

  public gracefulShutdown(error: any): void {
    this.httpService.httpServer.close((serverError) => {
      this.redisService.shutdownClient();
      process.exit(1);
    })
  }
}
