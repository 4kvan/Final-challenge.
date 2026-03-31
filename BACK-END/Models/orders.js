import mongoose from "mongoose";



const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: { 
                type: Number,
                required: true,
                default: 1      
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false  
    },
    paidAt: {   
        type: Date,
        Date: Date.now
    },
    isDelivered: {
        type: Boolean,
        default: false  
    }}, { timestamps: true });


    export default mongoose.model("Order", OrderSchema);