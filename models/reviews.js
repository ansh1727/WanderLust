const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewschema = new schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    owner: {
        type: schema.Types.ObjectId,
        ref: "User"
    }

})
module.exports = mongoose.model("review",reviewschema);