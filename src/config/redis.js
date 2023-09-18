const redis = require('redis')
require('dotenv').config

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect(process.env.REDIS_URI);
  console.log("conexion exitosa a redis");
})();


module.exports = redisClient