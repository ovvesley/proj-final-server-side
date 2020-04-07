/**
 * Configuration module for the connection with mongoDB via mongoose
 * @module config 
 * @author Wesley Ferreira
 */

 /**
  * Port number for the database (mongoDB) 
  * @type {Number}
  */
var dbPort = 27017;

/**
 * The IP address for the host of the database (mongoDB)
 * @type {String|Number}
 */
var dbHost = 'localhost';

/**
 * The database name on mongoDB
 * @type {String}
 */
var dbName = 'hortadb';

/**
 * MongoDB secret key for authentication
 * @type {String}
 */
var secretKey = '12345-67890-09876-54321';

/**
 * The URL for mongodb to access
 * @type {String}
 */
var mongoUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`

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