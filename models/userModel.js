const mongoose = require("mongoose")



const userSchema = new mongoose.Schema({
    user : {
        type : String
    },
    password : {
        type : String,
    },
    email : {
        type : String
    },
    verify : {
        type : Boolean
    }
})


const userModel = mongoose.model("user" , userSchema)
module.exports = userModel