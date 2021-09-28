
import { inject, injectable } from 'inversify';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { IRedisService  } from '../service/redis.service';
import CONFIG from '../config/envConfig';
import { CONSTANTS } from '../constants/commonConstants';
import { ERROR_CONSTANTS, ERROR_NAMES } from '../constants/errorConstants';
import { ILoggerService } from '../service/logger.service';
import {
  InternalServerError
} from '../utils/error.utils';
import { IRequestService } from './request.service';
import { convertTypeAcquisitionFromJson } from 'typescript';


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
  tx: ITransaction[]
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
  private requestService;
  private logger;

  constructor (
    @inject(SERVICE_IDENTIFIER.RedisService) redisService: IRedisService,
    @inject(SERVICE_IDENTIFIER.RequestService) requestService: IRequestService,
    @inject(SERVICE_IDENTIFIER.Logger) logger: ILoggerService
    ) {
    this.redisService = redisService;
    this.requestService = requestService;
    this.logger = logger
  }

  /**
  * Returns a list of blocks according to specified page number.
  * @publc @async
  * @param {string} pageNumber.
  * @return {IBlock[]} list of block details.
  */
  public async getAllBlocks(pageNumber: string): Promise<IBlock[]> {
    try {
      let blocks: IBlock[] = [];
      // check data in redis cache aside
      let blockHashSet = await this.redisService.zrange(pageNumber);
      // if found return data from cache otherwise fetch from remote server
      if (blockHashSet?.length > 0) {
        blockHashSet = blockHashSet.map(hash => `block-${hash}`);
        blocks = await this.redisService.mGetKey(blockHashSet);
        // parse response
      } else {
        const url = `${CONFIG.BASE_URL}/blocks/1573858800000?format=json`;
        const blockList = JSON.parse(await this.requestService.makeRequest(url));
        // save data in redis cache
        await this.savePaginatedResponse(blockList);
        blocks  = blockList.splice(Number(pageNumber), Number(pageNumber) + CONSTANTS.PAGE_RANGE);
      }
      return blocks;
    } catch (err) {
      console.log("err >>> ", err)
      this.logger.error(`err in get all blocks details - ${err}`, );
      throw new InternalServerError(ERROR_NAMES.SERVER_ERROR, ERROR_CONSTANTS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
  * Returns block details of by hash.
  * @publc @async
  * @param {string} hash hash of the block.
  * @return {IBlockDetails} block details.
  */
  public async getBlockByHash(hash: string): Promise<IBlockDetails> {
    try {
      let block: IBlockDetails;
      const url = `${CONFIG.BASE_URL}/rawblock/${hash}`;
      // check data in exists redis cache
      let cachedData = await this.redisService.getValueFromHash(hash);
      if (cachedData) {
        return cachedData;
      } else {
        // fetch data from the remote server
        block = await this.requestService.makeRequest(url);
        // save data in redis
        await this.redisService.setKey(hash, block)
        block = this.transformResponse(block);
      }
      return block;
    } catch (err) {
      this.logger.error(`err in get block details by hash - ${err}`);
      throw new InternalServerError(ERROR_NAMES.SERVER_ERROR, ERROR_CONSTANTS.INTERNAL_SERVER_ERROR);
    }
  }

  /**
  * Returns the modified response of block details.
  * @param {object} body detials of the block fetched from the external server.
  * @return {IBlockDetails} block details.
  */
  private transformResponse(block): IBlockDetails {
    let transactions = block?.tx.map(txn => {
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
    const modifiedBolck = {
      size: block.size,
      hash: block.hash,
      blockIndex: block.block_index,
      previousHash: block.prev_block,
      tx: transactions
    }
    return Object.assign({}, modifiedBolck);
  }

  /**
  * Returns a list of blocks according to specified page number.
  * @publc @async
  * @param {IBlock[]} body detials of the block fetched from the external server.
  * @return {IBlock[]} data sliced in equal chunks.
  */
  private getPaginatedBlocks(data: IBlock[]): Array<IBlock[]> {
    const chunk = CONSTANTS.PAGE_RANGE;
    let paginatedArray = [];
    for (let i = 0; i < data.length; i += chunk) {
      paginatedArray.push(data.slice(i, i + chunk));
    }
    return paginatedArray;
  }

  /**
  * Saves data in redis in sorted sets.
  * @publc @async
  * @param {IBlock[]} body detials of the block fetched from the external server.
  */
  private async savePaginatedResponse(data: IBlock[]): Promise<void> {
    const paginatedBlockData = this.getPaginatedBlocks(data);
    for (let [index, blocks] of paginatedBlockData.entries()) {
      for (let block of blocks) {
        await this.redisService.zadd(index, block.time, block.hash);
        await this.redisService.setKey(`block-${block.hash}`, JSON.stringify(block));
      }
    }
    return;
  }
}