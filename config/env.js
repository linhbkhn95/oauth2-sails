/**
 * Environment settings
 * */
module.exports = {
  RABBITMQ_HOST: "192.168.1.93",
  RABBITMQ_PORT: "5672",
  REDIS_HOST: "localhost",
  REDIS_PORT: "6379",
  bpsUrl: "http://192.168.1.92:1333", //link BPSService
  bpsTimeout: 120000,
  port: process.env.PORT || 1347
};
