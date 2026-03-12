const mongoose = require("mongoose");
const data = require("./data.js");
const listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connected to db ... wanderlust");
}).catch((err)=>{
    console.log(err);
})

const initdb = async ()=>{
    await listing.deleteMany({});
    data.data = data.data.map((obj)=>({...obj,owner:'69ad590ed3beea27079ef84d'}));
    await listing.insertMany(data.data);
    console.log("data was initialized");
}
initdb();