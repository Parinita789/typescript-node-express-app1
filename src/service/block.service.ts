
const request = require('request');
import { inject, injectable } from 'inversify';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { IRedisService  } from '../service/redis.service';
import CONFIG from '../config/envConfig';
import {
  InternalServerError
} from '../utils/error.utils';

export interface IBlock {
  hash: string,
  height: number,
  time: number,
  block_index: number
}

export interface IBlockDetails {
  size: string,
  blockIndex: number,
  previousHash: string,
  transactions: ITransaction[]
}

export interface ITransaction {
  hash: string,
  size: number,
  weight: number,
  txIndex: number,
  time: number,
  blockIndex: number,
  blockHeight: number,
}

export interface IBlockService {
  getAllBlocks(pageNumber: string): Promise<IBlock[]>;
  getBlockByHash(hash: string): Promise<IBlockDetails>;
}

@injectable()
export class BlockService implements IBlockService {
  private redisService;

  constructor (@inject(SERVICE_IDENTIFIER.RedisService) redisService: IRedisService) {
    this.redisService = redisService;
  }

  public async getAllBlocks(pageNumber: string): Promise<IBlock[]> {
    try {
      let blocks = [];
      // check data in redis cache aside
      const blockHashSet = await this.redisService.zrange(pageNumber);
      // if found return data from cache otherwise fetch from remote server
      if (blockHashSet?.length > 0) {
        for (let hash of blockHashSet) {
          const block = await this.redisService.getValueFromHash(hash);
          blocks.push(block);
        }
      } else {
        let options = {
          url: `${CONFIG.BASE_URL}/blocks/1573858800000?format=json`,
        };
        request(options, (err, body) => {
          if (err) {
            throw new InternalServerError('err 1', err);
          } else {
            blocks = body;
            // store data in redis;
          }
        });
      }
      return blocks;
    } catch (err) {
      console.log("eher >>> ", err)
      throw err;
    }
  }

  public async getBlockByHash(hash: string): Promise<IBlockDetails> {
    try {
      let block: IBlockDetails;
      let options = {
        url: `${CONFIG.BASE_URL}/rawblock/${hash}`,
      };
      // check data in redis cache aside
      // if exist return record from there
      request(options, (err, body) => {
        if (err) {
          throw new InternalServerError('err 1', err);
        } else {
          block = this.transformResponse(body);
          // store data in redis;
        }
      });
      return block;
    } catch (err) {
      throw err;
    }
  }

  private transformResponse(body): IBlockDetails {
    let transactions = body?.tx.map(txn => {
      let txnObj = {
        hash: txn.hash,
        size: txn.size,
        weight: txn.weight,
        time: txn.time,
        txIndex: txn.tx_index,
        blockIndex: txn.block_index,
        blockHeight: txn.block_height
      }
      return Object.assign({}, txnObj);
    })
    const bolck = {
      size: body.size,
      hash: body.hash,
      blockIndex: body.block_index,
      previousHash: body.prev_block,
      transactions: transactions
    }
    let finalObj = Object.assign({}, bolck);
    console.log("final obj >>> ", finalObj)
    return finalObj;
  }
      
}