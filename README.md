Express & Typescript App
==================================
- Tech stack used - node.js, typescript, express, redis.
- Used redis for caching data.
- Used inversify framework for dependency injection.
- Used Winston npm for logging.
- Used Request npm for fetching block details from the remote server.
- API GET Block detials: Check for the block data in the redis cache if exists returns the paginated data according to the page number from the cache if not exists then fetches the data from the remote server and saves it in the redis in sorted set using zrange.
- Not using TTL for updating data in the redis since the data fetched from the external server will reamin same. If the data was same then the TTL can be considered for 10 mins.
- API GET block details by hash: Check if the data for the hash exist in the cache if exist return from the cache if not then store data hash and block detials pair in redis.

Getting Started
---------------

```sh
# clone it
git clone git@github.com:parinita789/typescript-node-express-app1.git
cd typescript-node-express-app1.git

# Install dependencies
npm install

# Start dev server:
npm start
`

License
-------

MIT
