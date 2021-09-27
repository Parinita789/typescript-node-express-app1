import { getAllBlocks, getBlockByHash } from '../controller/blockApiController';

module.exports = (router) => {
  router.get('/blocks', getAllBlocks);
  router.get('/block/:hash', getBlockByHash)
};

