const Review= require("../models/review.js");
const Listing = require("../models/listing.js");


// Create new reviews
module.exports.createReview=async (req, res) => {
  let { id } = req.params;

  let listing= await Listing.findById(id);
  let newReview= new Review(req.body.review);
  newReview.author= res.locals.currUser._id; //set the author of the review to the current user
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully created new Review!");

    res.redirect(`/listings/${id}`);
};

// Destroy reviews
module.exports.destroyReview= async (req, res) => {
    const { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");

    res.redirect(`/listings/${id}`);
  };