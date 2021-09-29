import { injectable, inject } from 'inversify';
import { ClientOpts, createClient, RedisClient } from 'redis';
import CONFIG from '../config/env.config';
import { CONSTANTS } from '../constants/common.constants';
import { ILoggerService } from '../service/logger.service';
import { SERVICE_IDENTIFIER } from '../constants/identifier.constant';

export interface IRedisService {
  initializeClient(): Promise<void>;
  shutdownClient(): Promise<void>;
  mGetKey(key: string): Promise<string[]>;
  hSetKey(key: string, value: string, expires?: number): Promise<void>;
  setKey(key: string, value: string, expires?: number): Promise<void>;
  getKey(key: string): Promise<string>
  getValueFromHash(hash: string): Promise<string>;
  zadd(pageNumber: number, score: number, key: string): Promise<boolean>;
  zrange(pageNumber: string): Promise<string[]>;
  expireKeyAt(key: string, unixTimestamp: number): Promise<void>;
}

@injectable()
export class RedisService implements IRedisService {
  private logger;
  private redisClient: RedisClient;
  private redisCONFIG: any;

  constructor(@inject(SERVICE_IDENTIFIER.Logger) logger: ILoggerService) {
    this.logger = logger;
    this.redisCONFIG = CONFIG.REDIS;
  }

  /**
  * @publc @async
  * @description Creates redis client connection
  */
  public async initializeClient(): Promise<void> {
    const connectionOptions: ClientOpts = {
      retry_strategy: this.retryStrategy,
      socket_keepalive: true,
    };

    this.redisClient = createClient(this.redisCONFIG.port, this.redisCONFIG.host, connectionOptions);

    this.redisClient.on('connect', () => {
      this.logger.info('Redis connected.');
    });
    this.redisClient.on('ready', () => {
      this.logger.info('Redis connection established.');
    });
    this.redisClient.on('error', (err) => {
      this.logger.error(`Redis Error ${err.message}`);
    });
    this.redisClient.on('reconnecting', () => {
      this.logger.info('Redis client reconnecting to redis server');
    });
    this.redisClient.on('end', () => {
      this.logger.info('Redis disconnected');
    });
  }

  public async shutdownClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.quit((err, obj) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public async setKey(key: string, value: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.redisClient.set(key, value, (err, result) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public async getKey(key: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, result) => {
        if (err) reject(err);
        resolve(JSON.parse(result));
      });
    });
  }

  public async mGetKey(key: string): Promise<string[]> {
    return await new Promise((resolve, reject) => {
      this.redisClient.mget(key, (err, value) => {
        if (err) reject(err);
        return resolve(value);
      });
    });
  }

  public async zadd(pageNumber: number, score: number, key: string): Promise<boolean> {
    try {
      const name = `${CONSTANTS.REDIS_ZADD_NAME_PREFIX}${pageNumber}`;
      return await this.redisClient.zadd(name, score, key);
    } catch (err) {
      throw err;
    }
  }

  public async getValueFromHash(hash: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      this.redisClient.hget('hash', hash, (err, result) => {
        if (err) reject(err);
        return resolve(JSON.parse(result));
      });
    });
  }

  public async hSetKey(key: string, value: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.redisClient.hset('hash', key,  value, (err, result) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public async zrange(pageNumber: string): Promise<string[]> {
    return await new Promise((resolve, reject) => {
      const name = `${CONSTANTS.REDIS_ZADD_NAME_PREFIX}${pageNumber}`;
      this.redisClient.zrange(name, CONSTANTS.PAGE_MIN, CONSTANTS.PAGE_MAX, (err, obj) => {
        if (err) reject(err);
        return resolve(obj);
      });
    });
  }

  public async expireKeyAt(key: string, unixTimestamp: number): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.redisClient.expireat(key, unixTimestamp, (err, obj) => {
        if (err) reject(err);
        return resolve();
      });
    });
  }

  private retryStrategy(options): any {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
}