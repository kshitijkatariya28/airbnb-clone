const express = require("express")
const app = express()
const mongoose = require("mongoose")
const initializeData = require("./data.js")
const listing = require("../models/listing.js")

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

main()
.then(res => {
    console.log("Database Connected")
})
.catch(err =>{
    console.log(err)
})

let initDb = async ()=> {
   await listing.deleteMany({});
   await listing.insertMany(initializeData.data)
   console.log("Data saved successfully")
}

initDb();

app.get("/",(req,res)=>{
    console.log("successful")
})

app.listen(8080,()=>{
    console.log("server started running")
})