const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
    Comment :{
        type : String
    },
    rating : {
        type : Number,
        min : 0,
        max : 0
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("Review",reviewSchema);