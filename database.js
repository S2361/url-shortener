const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/url_shortener')
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log("Unable to connect to MongoDB: ", error))

module.exports = mongoose