import { BlockController } from '../controller/blockApiController';

const blockController = new BlockController()

module.exports = (router) => {
  router.get('/blocks', blockController.getAllBlocks);
  router.get('/block/:hash', blockController.getBlockByHash)
};

