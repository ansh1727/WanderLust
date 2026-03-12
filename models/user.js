const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

// passport local mongoose will automatically add username and password schema with salting and hashing 

const userSchema = new schema({
    email:{
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);