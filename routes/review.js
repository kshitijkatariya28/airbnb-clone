const express = require("express")
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js")
const {reviewSchema} = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    console.log(error)
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

//reviews : Post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    await newReview.save();
    console.log(newReview);
    listing.reviews.push(newReview);
    await listing.save();
   res.redirect(`/listings/${req.params.id}`);
}))

//reviews delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}})
   res.redirect(`/listings/${req.params.id}`);
}))

module.exports = router;