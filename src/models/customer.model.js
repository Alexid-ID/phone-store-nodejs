import mongoose, {Schema} from 'mongoose';
import Invoice from '../models/invoice.model.js';
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    invoices: [{
        type: Schema.Types.ObjectId,
        ref: 'Invoice'
    }]
},{timestamps: true});

const Customer = mongoose.model("Customer", customerSchema);

Customer.invoice = new Invoice();
export default Customer;