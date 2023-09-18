const redisClient = require('./config/redis')
console.log(redisClient);

(async () => {
    redisClient.set('texto', 'valor para texto');
    const data = await redisClient.get('texto');
    console.log(data);
})();
//del y HDEL para eliminar
//redisClient.del('texto')
//redisClient.HDEL('productos', 'key3')
(async () => {
    redisClient.HSET('usuarios', 'key1', 'valor para key1');
    redisClient.HSET('usuarios', 'key2', 'valor para key2');
    redisClient.HSET('usuarios', 'key3', 'valor para key3');
    redisClient.HSET('productos', 'key1', 'valor para key1');
    redisClient.HSET('productos', 'key2', 'valor para key2');
    redisClient.HSET('productos', 'key3', 'valor para key3');
    const data2 = await redisClient.HGET('usuarios', 'key3');
    console.log(data2);
})();

