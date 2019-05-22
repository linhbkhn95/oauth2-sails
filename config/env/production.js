/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }
  oauth: {
    tokenLife: 360000
  },
  rabit: {
    RABBITMQ_HOST: "192.168.1.93",
    RABBITMQ_PORT: "5672",
  },


  bpsUrl: "http://192.168.1.92:1333", //link BPSService
  bpsTimeout: 120000,
  port: process.env.PORT || 1347,
  redis: {
    REDIS_HOST: "redis://cache",
    REDIS_PORT: "6379",
  },
  redisUrl: 'redis://redis:6379',
};
