var redis = require('redis'),
  client = redis.createClient(),
  clientAnimals =[
    {
        "hash": "0000000000000000000efcea1cc1a169955e9cf6f039ddeabfdd1da1ac6d9899",
        "height": 603966,
        "time": 1573858343,
        "block_index": 603966
    },
    {
        "hash": "0000000000000000000ee40dc80e8ddd28d6389ba8dd59bb147b48d8f7a87f13",
        "height": 603965,
        "time": 1573857408,
        "block_index": 603965
    },
    {
        "hash": "0000000000000000000cc742f3903cf8960ffd9c51ad17d03182bf471c59f002",
        "height": 603964,
        "time": 1573856957,
        "block_index": 603964
    }
  ];
 
// let importMulti = client.multi();
clientAnimals.forEach(function(anAnimal){
//   importMulti.hmset(anAnimal.hash, anAnimal);
client.zadd('block-set-6', anAnimal.time, anAnimal.hash);
});

  client.zrange('block-set-6', 1, 10);

  // importMulti.exec(function(err,results){
  //   if (err) { throw err; } else {
  //     console.log(results);
  //     client.quit();
  //    }
  // });