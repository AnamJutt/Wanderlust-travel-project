const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing=require("../models/listing.js");

const MONG0_URL= "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONG0_URL);
}

main().then(() =>{
    console.log("Connected to DB");
}).catch((err) =>{
    console.log(err);
});

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) => ({...obj, owner: "6885dd05a876d58367b6208b"})); // Assuming the owner ID is known
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();