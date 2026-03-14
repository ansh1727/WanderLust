const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require('../models/listing.js');
const {isloggedin, isowner,validatelisting} = require("../middleware.js");

const listingcontroller = require("../controllers/listing.js");

const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage});


//index route
router.get("/",wrapasync(listingcontroller.index));

// create new listing route 
router.get("/new",isloggedin,listingcontroller.rendernewform);

router.post("/",isloggedin,validatelisting,upload.single("listing[image][url]"),wrapasync(listingcontroller.createlisting));


// edit route 
router.get("/:id/edit",isloggedin,isowner,wrapasync(listingcontroller.rendereditform));


router.put("/:id",validatelisting,isowner,upload.single("listing[image][url]"),wrapasync(listingcontroller.editlisting));

router.get("/search", wrapasync(listingcontroller.searchListings));

//show route
router.get("/:id", wrapasync(listingcontroller.showlisting));




// delete route 
router.delete("/:id",isloggedin,isowner,wrapasync(listingcontroller.deletelisting));

module.exports = router;
