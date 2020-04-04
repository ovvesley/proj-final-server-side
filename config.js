var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'hortadb';

var secretKey = '12345-67890-09876-54321';
var mongoUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`

module.exports = {
    'secretKey': secretKey,
    'mongoUrl': mongoUrl
}