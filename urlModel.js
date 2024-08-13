const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    }
})


const URL = mongoose.model("URL", urlSchema)

module.exports = URL
