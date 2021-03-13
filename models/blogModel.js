const mongoose = require("mongoose")


const blogSchema = new mongoose.Schema({
    email : {
        type : String
    },
    userName : {
        type : String
    },
    question : {
        type : String,
        
    },
    reply : {
        type : Array,
       
    },
    date : {
        type : String,
     
    }
})

const blogModel = mongoose.model("blog" , blogSchema)
module.exports = blogModel