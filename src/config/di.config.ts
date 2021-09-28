import { Container } from 'inversify';
import 'reflect-metadata';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { RedisService, IRedisService } from '../service/redis.service';
import { HttpService, IHttpService } from '../service/http.service';
import { Application, IApplication } from '../app';
import { BasicMiddleware, IBasicMiddleware } from '../middleware/basic.middleware';
import { LoggerService, ILoggerService } from '../service/logger.service';
import { BlockService, IBlockService } from '../service/block.service';
import { BlockController, IBlockController } from '../controller/blockApiController';
import { RequestService, IRequestService } from '../service/request.service';

export function register(diContainer: Container) {
  /**
   * service binding
   */
  diContainer.bind<IRedisService>(SERVICE_IDENTIFIER.RedisService).to(RedisService).inSingletonScope();
  diContainer.bind<IHttpService>(SERVICE_IDENTIFIER.HttpService).to(HttpService).inSingletonScope();
  diContainer.bind<ILoggerService>(SERVICE_IDENTIFIER.Logger).to(LoggerService).inSingletonScope();
  diContainer.bind<IBlockService>(SERVICE_IDENTIFIER.BlockService).to(BlockService).inSingletonScope();
  diContainer.bind<IRequestService>(SERVICE_IDENTIFIER.RequestService).to(RequestService).inSingletonScope();

  /**
  * middleware binding
  */ 
  diContainer.bind<IBasicMiddleware>(SERVICE_IDENTIFIER.BasicMiddleware).to(BasicMiddleware).inSingletonScope();

  /**
  * controller binding
  */ 
  diContainer.bind<IBlockController>(SERVICE_IDENTIFIER.BlockController).to(BlockController).inSingletonScope();
  diContainer.bind<IApplication>(SERVICE_IDENTIFIER.Application).to(Application).inSingletonScope();


}