if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodoverride = require("method-override");
app.use(methodoverride("_method"));
const ejsmate= require("ejs-mate");
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
const expresserror = require("./utils/expresserror.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");

// routes 
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");


const dburl = process.env.ATLASDB_URL;
// connecting to db
async function main(){
    await mongoose.connect(dburl);
}
main().then(()=>{
    console.log("connected to db ... wanderlust");
}).catch((err)=>{
    console.log(err);
})


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
  });
  
  store.on("error", (err) => {
    console.log("SESSION STORE ERROR", err);
  });

const sessionoptions = {
    store:store,
    secret :process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/demouser",async(req,res)=>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"student"
//     });

//     let registereduser = await User.register(fakeuser,"helloworld");
//     res.send(registereduser);
// })



// app.get("/testlisting",async(req,res)=>{
//     let samplelisting = new listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"india",
//     });

//     await samplelisting.save();
//     console.log("sample saved");
//     res.send("success");

// });


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})

// app.get("/",(req,res)=>{
//     res.send("working");
// })

// using routes 
app.use("/listings/:id/reviews",reviews);
app.use("/listings", listings);
app.use("/",user);


app.use((req,res,next)=>{
    next(new expresserror(404,"Page Not Found"));
})
// middleware wrapasync
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let { statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).render("error.ejs", { message });
});

// setting up port using express
app.listen(8080,()=>{
    console.log("app is listning on port 8080");
});
