const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment :{
        type : String
    },
    rating : {
        type : Number,
        min : 0,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("Review",reviewSchema);