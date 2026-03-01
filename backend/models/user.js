const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const baseUserFields = {
    email:{
        type:String,
        required:true,
    },
};

const clientSchema = new Schema(baseUserFields);
clientSchema.plugin(passportLocalMongoose);

const adminSchema = new Schema(baseUserFields);
adminSchema.plugin(passportLocalMongoose);

const Client = mongoose.model("Client",clientSchema);
const Admin = mongoose.model("Admin",adminSchema);


module.exports = {
    Client,
    Admin,
};
