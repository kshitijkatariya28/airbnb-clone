const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")

const reviews = require("./routes/review.js")
const listings = require("./routes/listing.js")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"./views/listing"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

const sessionOptions = {
    secret : "mysupersecrestcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true //used for cross-scripting attacks
    }
}
app.use(session(sessionOptions));
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)

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

app.listen(8080,()=>{
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