const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1734545294150-3d6c417c5cfb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
      set: (v) =>
        v === ""
          ? "https://plus.unsplash.com/premium_photo-1734545294150-3d6c417c5cfb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Review"
  }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
