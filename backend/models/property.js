const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const Review = require("./reviews.js")


const propertySchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
        
    },
    price: Number,
    available: {
        type: Boolean,
        default: true,
    },
    location:  String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        refPath:"ownerModel",
    },
    ownerModel:{
        type:String,
        enum:["Client","Admin"],
        default:"Client",
    },
    categories:{
        type:String,
        enum:["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping","Farms","Arctic"],
    }
});


propertySchema.post("findOneAndDelete",async(property)=>{
    if(property){
        await Review.deleteMany({_id:{$in:property.reviews}});
    }
}, {
    collection: "Properties",
});



const Property = mongoose.model("Property",propertySchema);
module.exports = Property;
