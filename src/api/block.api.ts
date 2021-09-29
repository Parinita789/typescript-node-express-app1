import { BlockController } from '../controller/blockApi.controller';

const blockController = new BlockController()

module.exports = (router) => {
  router.get('/blocks', blockController.getAllBlocks);
  router.get('/block/:hash', blockController.getBlockByHash)
};

