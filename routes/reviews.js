const express = require("express");
const router = express.Router({mergeParams: true});
const wrapasync = require("../utils/wrapasync.js");
const expresserror = require("../utils/expresserror.js");
const Listing = require('../models/listing.js');
const Review = require("../models/reviews.js");
const {validatereview , isloggedin, isReviewOwner} = require("../middleware.js");


const reviewcontroller = require("../controllers/reviews.js");

// review form 
router.post("/",isloggedin,validatereview, wrapasync(reviewcontroller.createreview));

// delete reviews
router.delete("/:reviewId",isReviewOwner,wrapasync(reviewcontroller.deletereview));

module.exports = router;