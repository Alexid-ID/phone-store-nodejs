import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    products : [{
        _id: false,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity:{
            type: Number,
            default: 0
        }
    }],
    total: {
        type: Number,
        default: 0
    },
    moneyGiven: {
        type: Number,
        default: 0
    },
    moneyBack: {
        type: Number,
        default: 0
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;