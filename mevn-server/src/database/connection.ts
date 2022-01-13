const mongoose = require('mongoose');

/**
 * Connects via Mongoose to the MongoDB Database
 * @returns {Promise<void>}
 */
const connectToDB = async ():Promise<void> => {
  try {
    await mongoose.connect(`${process.env.DBCONNECTION}`);
    console.log('connected to MongoDB')
  }
  catch (err) {
    console.log(err)
  }
}

module.exports = connectToDB;