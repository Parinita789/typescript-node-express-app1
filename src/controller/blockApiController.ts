
import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { container } from '../diContainer';
import { SERVICE_IDENTIFIER } from '../constants/identifier';
import { IBlockService } from '../service/block.service';
import { BadRequestError } from '../utils/error.utils';
import { ERROR_CONSTANTS, ERROR_NAMES } from '../constants/errorConstants';
import { RESPONSE_CONSTANTS, RESPONSE_MESSAGE } from '../constants/responseConstants'

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

      res.send({ 
        status: RESPONSE_CONSTANTS.OK,
        message: RESPONSE_MESSAGE.BLOCk_DETAILS_FETCHED_SUCCESSFULLY, 
        data: blocks 
      });
    } catch (err) {
      next(err)
    }
  }

  public async getBlockByHash (req, res, next) {
    try {
      const blockService = container.get<IBlockService>(SERVICE_IDENTIFIER.BlockService);
      const hash = req.params?.hash;
      if (!hash) {
        throw new BadRequestError(ERROR_NAMES.VALIDATION_ERROR, ERROR_CONSTANTS.HASHID_REQUIRED);
      }

      const block = await blockService.getBlockByHash(hash);

      res.send({ 
        status: RESPONSE_CONSTANTS.OK,
        message: RESPONSE_MESSAGE.BLOCKS_FETCHED_SUCCESSFULLY, 
        data: block 
      });
    } catch (err) {
      next(err);
    }
  }
}
