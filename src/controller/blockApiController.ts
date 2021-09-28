
import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { container } from '../diContainer';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { IBlockService } from '../service/block.service';
import {
  InternalServerError,
  BadRequestError
} from '../utils/error.utils';
export interface IBlockController {
  getAllBlocks(req: Request, res: Response, next: NextFunction): Promise<void>;
  getBlockByHash(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class BlockController {
  
  public async getAllBlocks (req, res, next) {
    try {
      const blockService = container.get<IBlockService>(SERVICE_IDENTIFIER.BlockService);
      const pageNumber = req.query?.page_number ? req.query?.page_number : 1;
      const blocks = await blockService.getAllBlocks(pageNumber);
      res.send({ blocks });
    } catch (err) {
      console.log(" errr 444 >>> ", err)
      next(err)
    }
  }

  public async getBlockByHash (req, res, next) {
    try {
      const blockService = container.get<IBlockService>(SERVICE_IDENTIFIER.BlockService);
      const hash = req.params?.hash;
      if (!hash) {
        next(new BadRequestError('Bad Request: ', 'Hash id required'))
      }
      const block = await blockService.getBlockByHash(hash);
      res.send({ block })
    } catch (err) {
      console.log(" errr get block by hash >>> ", err)
      next(err);
    }
  }   

}



// const request = require('request');
// import { SERVICE_IDENTIFIER } from '../constants/identifier';
// import { container } from '../diContainer';
// import { ILoggerService } from '../service/logger.service';
// import { IRedisService  } from '../service/redis.service';
// import CONFIG from '../config/envConfig';
// import {
//   InternalServerError,
//   BadRequestError
// } from '../utils/error.utils';

// export async function getAllBlocks (req, res, next) {
//   const redisService: IRedisService = container.get(SERVICE_IDENTIFIER.RedisService);
//   const logger: ILoggerService = container.get(SERVICE_IDENTIFIER.Logger);
//   try {
//     const pageNumber = req.query?.page_number ? req.query.page_number : 1;
//     // check data in redis cache aside
//     const blockHashSet = await redisService.zrange(pageNumber.toString());

//     let blocks = [];

//     if (blockHashSet?.length > 0) {
//       for (let hash of blockHashSet) {
//         const block = await redisService.getValueFromHash(hash);
//         blocks.push(block);
//       }
//       res.send({ blocks });
//     } else {
//       let options = {
//         url: `${CONFIG.BASE_URL}/blocks/${req.params.time}?format=json`,
//       };
//       request(options, (err, body) => {
//         if (err) {
//           // handle error
//           throw new InternalServerError('err 1', err);
//         } else {
//           // res.send({body: body})
//           // store data in redis in sets
//           // console.log("body length >>> ", body.length)
//           // let sets = this.getSetRange();
//           // for (let i = 0; i < sets.length; i++) {

//           // }
//           res.send({result: 'OK'})
//         }
//       });
//     }
//   } catch (err) {
//     logger.error('err in get all blocks API: ', err);
//     next(err);
//   }
// }

// function getSetRange(blockCount: number): string[] {
//   const sets = [];
//   const range = 10;
//   let setsCount = blockCount / range;
//   let rem = blockCount % range;
//   if (rem > 0) {
//     setsCount++;
//   }
//   for (let i = 0; i < setsCount; i++) {
//     sets.push(`block-set-${i}`);
//   }
//   return sets;
// }

// export function getBlockByHash (req, res, next) {
//   try {
//     const hash = req.params?.hash;
//     if (!hash) {
//       next(new BadRequestError('Bad Request: ', 'Hash id required'))
//     }
//     let options = {
//       url: `${CONFIG.BASE_URL}/rawblock/${req.params.hash}`,
//     };
//     request(options).pipe(res);
//   } catch (err) {
//     this.logger.error(err);
//     const error = new InternalServerError('Server Error: ', 'Error in get block by hash');
//     next(error);
//   }
// }