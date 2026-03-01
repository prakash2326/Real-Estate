const mongoose = require("mongoose");
const initData = require("./data.js");

const Property = require("../models/property.js");


const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err)=>{
    console.log(err);
  });
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Property.deleteMany({});
    initData.data = initData.data.map((obj)=>({
      ...obj,
      owner:"697ae69978785325f16569a9"
    }));
    await Property.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
