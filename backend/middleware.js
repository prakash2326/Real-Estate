const Property = require("./models/property");
const Review = require("./models/reviews");
const  ExpressError = require("./utils/ExpressError.js");
const {propertySchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");

function isApiRequest(req) {
    return req.originalUrl.startsWith("/api/");
}

function normalizePropertyBody(req) {
    if (req.body?.property) {
        return;
    }

    const property = {};
    Object.keys(req.body || {}).forEach((key) => {
        const match = key.match(/^property\[(.+)\]$/);
        if (match) {
            property[match[1]] = req.body[key];
        }
    });

    if (Object.keys(property).length) {
        req.body.property = property;
    }
}

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        if (isApiRequest(req)) {
            return res.status(401).json({ error: "Authentication required" });
        }
        req.flash("error","you must be logged in to continue.");
        return res.redirect("/app/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isClient = (req,res,next)=>{
    if(!req.user || req.user.constructor.modelName !== "Client"){
        if (isApiRequest(req)) {
            return res.status(403).json({ error: "Only client accounts can perform this action." });
        }
        req.flash("error","Only client accounts can book Properties.");
        return res.redirect("/app");
    }
    next();
};

module.exports.isAdmin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        if (isApiRequest(req)) {
            return res.status(401).json({ error: "Admin authentication required" });
        }
        req.flash("error","you must be logged in as admin!");
        return res.redirect("/app/login");
    }

    if(!req.user || req.user.constructor.modelName !== "Admin"){
        if (isApiRequest(req)) {
            return res.status(403).json({ error: "Only admin accounts can add, edit, or delete properties." });
        }
        req.flash("error","Only admin accounts can add, edit, or delete properties.");
        return res.redirect("/app");
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let property = await Property.findById(id);
    if(!property){
        return res.status(404).json({ error: "Property not found" });
    }
    if(!res.locals.currUser || !property.owner || !property.owner.equals(res.locals.currUser._id)){
        if (isApiRequest(req)) {
            return res.status(403).json({ error: "You are not the owner of this listing." });
        }
        req.flash("error","You are not the owenr of this lsitings");
        return res.redirect(`/app/properties/${id}`);
    }
    next();
};

module.exports.validateProperty =(req,res,next)=>{
    normalizePropertyBody(req);

    if (req.body?.property && typeof req.body.property.available !== "undefined") {
        const rawAvailable = req.body.property.available;

        if (Array.isArray(rawAvailable)) {
            req.body.property.available = rawAvailable[rawAvailable.length - 1] === "true";
        } else if (typeof rawAvailable === "string") {
            req.body.property.available = rawAvailable === "true";
        }
    }

    let {error} = propertySchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
};
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review){
        return res.status(404).json({ error: "Review not found" });
    }
    if(!res.locals.currUser || !review.author.equals(res.locals.currUser._id)){
        if (isApiRequest(req)) {
            return res.status(403).json({ error: "You did not create this review." });
        }
        req.flash("error","You did not create this review");
        return res.redirect(`/app/properties/${id}`);
    }
    next();
};

