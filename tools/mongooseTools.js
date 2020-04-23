const mongoose = require("mongoose");

function isConnected() {
  return mongoose.connection.readyState === 1;
}

function clearMongooseDataBase() {
  for (let i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany(function () {});
  }
}

function disconnectMongoose() {
  return mongoose.disconnect();
}

function dropDataBaseMongoose() {
  return mongoose.connection.db.dropDatabase();
}

module.exports = {
  isConnected: isConnected,
  clearMongooseDataBase: clearMongooseDataBase,
  disconnectMongoose: disconnectMongoose,
  dropDataBaseMongoose: dropDataBaseMongoose,
};
