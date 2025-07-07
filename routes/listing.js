const express = require("express")
const router = express.Router();
const Listing = require("../models/listing.js")
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema} = require("../schema.js")


const validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body)
    console.log("error" + error)
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

//index route
router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({})
    res.render("index.ejs",{allListings})
}))

//new listings route
router.get("/new",(req,res)=>{
    res.render("new.ejs")
})

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested does not exist")
        res.redirect("/listings")
    }
    res.render("show.ejs",{listing})
}))

//post route for new listings
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    let {title,description,image,price,country,location} = req.body
    let newListing = new Listing({
        title : title,
        description : description,
        image : {filename: "listingimage",
              url : image.url
        },
        price : price,
        country : country,
        location : location
    })
    await newListing.save()
    console.log(newListing)
    req.flash("success","New Listing Created")
    res.redirect("/listings")
}))

//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing you requested does not exist")
        res.redirect("/listings")
    }
    res.render("edit.ejs" , {listing})
}))

//update route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const updatedListing = req.body;
    const updatedListings = await Listing.findByIdAndUpdate(id , updatedListing)
    console.log(updatedListings)
    req.flash("success","Listing Updated")
    res.redirect("/listings")
}))


//delete route
router.delete("/:id/delete",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success","Listing Deleted")
    res.redirect("/listings")
}))


module.exports = router;