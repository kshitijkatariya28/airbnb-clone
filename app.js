const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const wrapAsync = require("./utils/wrapAsync.js")
const {listingSchema} = require("./schema.js")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"./views/listing"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


main()
.then((res)=>{
    console.log("Connected to database")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//delete route
app.delete("/listings/:id/delete",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    console.log("hello")
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

//update route
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const updatedListing = req.body;
    await Listing.findByIdAndUpdate(id , updatedListing)
    res.redirect("/listings")
}))

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    res.render("edit.ejs" , {listing})
}))

//post route for new listings
app.post("/listings",wrapAsync(async(req,res)=>{
    const result = listingSchema.validate(req.body)
    console.log(result)
    if(result.error){
        throw new ExpressError(400,result.error)
    }
    let {title,description,image,price,country,location} = req.body
    let newListing = new Listing({
        title : title,
        description : description,
        image : image,
        price : price,
        country : country,
        location : location
    })
    await newListing.save()
    console.log(newListing)
    res.redirect("/listings")
}))

//new listings route
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs")
})

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id)
    res.render("show.ejs",{listing})
}))

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({})
    res.render("index.ejs",{allListings})
}))

//home route
app.get("/",async (req,res)=>{
   res.send("successful")
})

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong" } = err;
    res.status(status).render("../errors/error.ejs",{ err })
})

app.listen("8080",()=>{
   console.log("listening to server")
})

// //test route
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new listing({
//         title : "My new Villa",
//         description : "By the beach",
//         price : 1600,
//         location : "Bandstand Mumbai",
//         country : "India"
//     })

//     let sampleData = await sampleListing.save()
//     console.log(sampleData)
//     res.send("sample data saved")
// })