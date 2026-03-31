import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true
    },
    description: {  
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true  

    },
    category: {
        type: String,
        required: true
    },
    stock :{
        type: Number,
        required: true
    },
    image :{
        type: String,
        required: false
    },
    tastes: [
    {
        name: { type: String },
        image: { type: String },
         description: {type: String,}
    }
    ],

     video: {
      type: String,
      default: ''
      },
      isFeatured: {
     type: Boolean,
      default: false
     }
}, { timestamps: true });


export default mongoose.model("Product", productSchema);