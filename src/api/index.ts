import { Router } from 'express';

const router: Router = Router();

// This is ping-pong route
router.get('/ping', (req, res) => {
  res.send('pong');
});

require('./blockApi')(router);


/**
 * Mounting respective paths.
 * @param {object} app Express instance
 */
 export default (app) => {
    app.use('/api/v1', router);
  };
  