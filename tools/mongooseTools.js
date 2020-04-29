const mongoose = require("mongoose");

function isConnected() {
  return mongoose.connection.readyState === 1;
}

async function clearMongooseDataBase() {
  const collections = await mongoose.connection.db.collections();
  try {
    for (let collection of collections) {
      await collection.deleteOne();
    }
    
    return true;
  } catch (systemError) {
    let error = new Error();
    let msgerror = "Ocorreu um problema na limpeza das colecoes do db. Verifique mongooseTools.js";

    error.message = msgerror;
    error.status = 500;
    error.systemError = systemError;

    throw error;
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
