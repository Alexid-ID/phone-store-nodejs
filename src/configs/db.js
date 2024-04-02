import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.set('strictQuery', true);
const { MONGODB_URI } = process.env

async function connect() {
    try {
        console.log(MONGODB_URI)
        await mongoose.connect(MONGODB_URI)
        console.log('Connect database success')
    } catch (err) {
        console.log("Can't connect database", err)
    }
}

export default { connect };