import { Container } from 'inversify';
import 'reflect-metadata';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { RedisService, IRedisService } from '../service/redis.service';
import { HttpService, IHttpService } from '../service/http.service';
import { Application, IApplication } from '../app';
import { BasicMiddleware, IBasicMiddleware } from '../middleware/basic.middleware';
import { LoggerService, ILoggerService } from '../service/logger.service';

export function register(diContainer: Container) {
  diContainer.bind<IRedisService>(SERVICE_IDENTIFIER.RedisService).to(RedisService).inSingletonScope();
  diContainer.bind<IHttpService>(SERVICE_IDENTIFIER.HttpService).to(HttpService).inSingletonScope();
  diContainer.bind<IApplication>(SERVICE_IDENTIFIER.Application).to(Application).inSingletonScope();
  diContainer.bind<IBasicMiddleware>(SERVICE_IDENTIFIER.BasicMiddleware).to(BasicMiddleware).inSingletonScope();
  diContainer.bind<ILoggerService>(SERVICE_IDENTIFIER.Logger).to(LoggerService).inSingletonScope();
}