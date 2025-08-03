const Listing = require("../models/listing");

module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews", 
        populate:{
            path:"author"
        },
    })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exit");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  };


module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exit");
        res.redirect("/listings");
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing= async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
      if (req.file) {
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await updatedListing.save();
    }
    req.flash("success", "Successfully updated listing!");

    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found to update");
    }
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found to delete");
    }
    res.redirect("/listings");
};