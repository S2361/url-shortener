import mongoose, { Schema, mongo } from "mongoose"

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortURL: {
        type: String,
        required: true
    }
})


const URL = mongoose.model("URL", urlSchema)

export default URL
