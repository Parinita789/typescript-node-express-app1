const request = require('request');
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { container } from '../diContainer';

import { ILoggerService } from '../service/logger.service';
import { IRedisService  } from '../service/redis.service';
const proxyUrl = 'https://blockchain.info';

export async function getAllBlocks (req, res) {
  const redisService: IRedisService = container.get(SERVICE_IDENTIFIER.RedisService);
  const logger: ILoggerService = container.get(SERVICE_IDENTIFIER.Logger);
  try {
    const pageNumber = req.query?.page_number ? req.query.page_number : 12;
    // check data in redis cache aside
    const blockHashSet = await redisService.zrange(pageNumber.toString(), 0, 10);

    let blocks = [];

    if (blockHashSet?.length > 0) {
      for (let hash of blockHashSet) {
        const block = await redisService.getValueFromHash(hash);
        blocks.push(block);
      }
      res.send({ blocks });
    } else {
      let options = {
        url: `${proxyUrl}/blocks/${req.params.time}?format=json`,
      };
      request(options, (err, body) => {
        if (err) {
          // handle error
          throw err;
        } else {
          // res.send({body: body})
          // store data in redis in sets
          // console.log("body length >>> ", body.length)
          // let sets = this.getSetRange();
          // for (let i = 0; i < sets.length; i++) {

          // }
          res.send({result: 'OK'})
        }
      });
    }
  } catch (err) {
    console.log("err >>>> ", err)
    // implement handel error function
    logger.error(err);
    // throw err;
  }
}

function getSetRange(blockCount: number): string[] {
  const sets = [];
  const range = 10;
  let setsCount = blockCount / range;
  let rem = blockCount % range;
  if (rem > 0) {
    setsCount++;
  }
  for (let i = 0; i < setsCount; i++) {
    sets.push(`block-set-${i}`);
  }
  return sets;
}

export function getBlockByHash (req, res) {
  try {
    let options = {
      url: `${proxyUrl}/rawblock/${req.params.hash}`,
    };
    request(options).pipe(res);
  } catch (err) {
    this.logger.error(err);
    throw err;
  }
}