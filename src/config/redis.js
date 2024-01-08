const redis = require('redis')
require('dotenv').config

//redisClient = redis.createClient("redis://localhost:6379");
let redisClient;
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => {
    console.error(`Error al conectar a Redis: ${error.message}`);
    console.error(error.stack);
  });
  await redisClient.connect();
  console.log("conexion exitosa a redis");
})();


module.exports = redisClient