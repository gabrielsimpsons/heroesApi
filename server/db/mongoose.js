var mongoose = require('mongoose')
let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heroes'
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, {useMongoClient: true})

module.exports = {mongoose}
