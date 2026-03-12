const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}

module.exports.rendernewform = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "owner" }
        })
        .populate("owner");
        console.log(listing);

    res.render("listings/show.ejs", { listing });
}


module.exports.createlisting = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..",filename);
    // let {title,description,image,price,country,location} = req.body;
    // console.log({title,description,image,price,country,location});
    // let listing = req.body.listing;

    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","new listing created");
    return res.redirect("/listings");
};


module.exports.rendereditform = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
};

module.exports.editlisting = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {
        $set:req.body.listing
    });
    
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    // const newListing= new Listing(req.body.listing);
    listing.image = {url,filename};
    await listing.save();
    
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async(req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}