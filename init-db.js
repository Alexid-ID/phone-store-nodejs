import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Category from './src/models/category.model.js';
import Product from './src/models/product.model.js';
import Account from './src/models/auth.model.js';
dotenv.config();
mongoose.set('strictQuery', false);
const loadDatabase = async () => {
    const rawData = fs.readFileSync('./database.json','utf8');
    const data = JSON.parse(rawData);
    const tables = Object.keys(data);
    // drop collection
    for (const table of tables) {
        await mongoose.connection.dropCollection(table);
    }

    const categories = data.categories.map((category) => {
        return Category.create({...category});
    });

    const accounts = data.accounts.map((account) => {
        return Account.create({...account});
    });

    const products = data.products.map(async (product) => {
        const cate = await Category.findOne({name: product.category});
        product.category = cate._id;
        const p = Product.create({...product});
        cate.products.push(p._id);
        await cate.save();
        return cate;
    });
    await Promise.all([...categories, ...accounts, ...products]);
}

export default loadDatabase;