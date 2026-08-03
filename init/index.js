const express=require("express");
const app=express();

const path=require("path");
const methodOverride=require("method-override");
const { error } = require('console');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const mongoose = require('mongoose');
const Listitem=require("../models/list.js");
const initdata=require("./data.js");


main()
.then((data)=>{
    console.log("eveything is fine")
}).catch(err => console.log(err));

async function main() {
      const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Mern";
  await mongoose.connect(dbUrl);

}

let initDB = async () => {
    await Listitem.deleteMany({});

    const data = initdata.data.map((obj) => ({
        ...obj,
        owner: "6a5aec90ed187b2a403c151a", // Client _id
    }));

    const result = await Listitem.insertMany(data);
    console.log(result.length);
};
initDB();