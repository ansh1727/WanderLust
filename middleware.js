const Listing = require("./models/listing");
const {listingschema,reviewschema} = require("./schema.js");
const expresserror = require("./utils/expresserror.js");
const Review = require("./models/reviews");

module.exports.isloggedin = (req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in ");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isowner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        return next(new expresserror(400, errMsg));
    } else {
        next();
    }
};

module.exports.validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new expresserror(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewOwner = async (req, res, next) => {

    let { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the owner of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};