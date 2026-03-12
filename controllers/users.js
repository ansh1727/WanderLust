const User = require("../models/user");


module.exports.rendersignupform = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let {username,password,email} = req.body;
        const newuser = new User({email,username});
        const registereduser = await User.register(newuser,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");

        })
      
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}


module.exports.renderloginform = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    
        res.redirect(redirectUrl);
    }


module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out ");
        res.redirect("/listings");
    });
}