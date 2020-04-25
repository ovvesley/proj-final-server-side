require('dotenv').config()

/**
 * Configuration module for the connection with mongoDB via mongoose
 * @module config 
 * @author Wesley Ferreira
 */

 /**
  * Port number for the database (mongoDB) 
  * @type {Number}
  */
 var dbPort = process.env.DB_INTEGRATION_TEST_PORT;

 /**
  * The IP address for the host of the database (mongoDB)
  * @type {String|Number}
  */
 var dbHost = process.env.DB_INTEGRATION_TEST_HOST;
 
 /**
  * The database name on mongoDB
  * @type {String}
  */
 var dbName = process.env.DB_INTEGRATION_TEST_NAME;
 
 /**
  * MongoDB secret key for authentication
  * @type {String}
  */
 var secretKey = process.env.DB_INTEGRATION_TEST_SECRET_KEY;
 
 /**
  * The URL for mongodb to access
  * @type {String}
  */
 var mongoUrl = process.env.DB_INTEGRATION_TEST_MONGO_URL || `mongodb://${dbHost}:${dbPort}/${dbName}` 
 
 /**
  * Configuration Object mongoose-mongoDB 
  * @typedef {Object} DbConfiguration
  * @property {String} secretKey - Secret key for authentication 
  * @property {String} mongoUrl - URL for mongodb to acess
  */
 module.exports = {
     'secretKey': secretKey,
     'mongoUrl': mongoUrl
 }