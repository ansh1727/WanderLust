const mongoose = require("mongoose");
const schema = mongoose.Schema;
const review = require("./reviews.js");

const listingschema = new schema({
    title:{
       type: String,
       required:true
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage"
        },
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1771926927841-1a81a1094b81?q=80&w=1035"
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:schema.Types.ObjectId,
        ref:"review",
    }],
owner: {
    type: schema.Types.ObjectId,
    ref: "User"
}
});

//mongoose middleware to delete all reviews when listing is deleted 
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id :{$in:listing.reviews}});
    }
    
});

const Listing = mongoose.model("listing",listingschema);

module.exports = Listing;