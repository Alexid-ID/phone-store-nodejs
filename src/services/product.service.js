import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Resize from "../configs/upload.config.js";
import mongoose from "mongoose";
import {ErrorMessage} from "../errors/message.js";
import fs from "fs";

import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductService {
    async create(data, files) {
        try {
            if (files) {
                const image = files.filename;
                const slug = data.name.replace(/ /g, "-");
                const extension = image.split(".").pop();
                const newImage = slug + "." + extension;
                data.image = "/uploads/products/" + newImage;
                fs.renameSync(files.path, `src/public/uploads/products/${newImage}`);
            } else {
                data.image = "/images/no-image-available.png";
            }
            const product = new Product(data);
            await product.save();
            const category = await Category.findById(product.category);
            category.products.push(product._id);
            await category.save();
            return product;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getAll() {
        try {
            const products = await Product.find({}).select("name image importPrice retailPrice quantity category createdAt");
            const categories = await Category.find({});
            const productInfos = products.map((product) => {
                const category = categories.find((category) => category._id.toString() === product.category.toString());
                return {
                    _id: product._id,
                    name: product.name,
                    image: product.image,
                    importPrice: product.importPrice,
                    retailPrice: product.retailPrice,
                    quantity: product.quantity,
                    category: category.name,
                    createdAt: product.createdAt,
                };
            });

            return productInfos;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getById(id) {
        try {
            const product = await Product.findById(id).populate("category");
            if (!product) {
                return ErrorMessage(404, "Product not found");
            }
            return product;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getByBarcode(barcode) {
        try {
            if (mongoose.Types.ObjectId.isValid(barcode)) {
                const product = await Product.findById(barcode).select("name image retailPrice ");
                if (!product) {
                    return ErrorMessage(404, "Product not found");
                }
                return product;
            } else {
                return ErrorMessage(404, "Product not found");
            }
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getByName(name) {
        try {
            const product = await Product.find({name: name}).populate("category");
            if (!product) {
                return ErrorMessage(404, "Product not found");
            }
            return product;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async searchProduct(valueInput) {
        try {
            //delete space %20
            const key = valueInput.toString().replace(/%20/g, " ");
            if (mongoose.Types.ObjectId.isValid(key)) {
                const product = await Product.findById(key).populate('category');
                if (!product) {
                    return ErrorMessage(404, 'Product not found');
                }
                return product;
            } else {
                const products = await Product.findOne({name: key}).populate('category');
                if (!products) {
                    return ErrorMessage(404, 'Product not found');
                }
                return products;
            }
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async update(id, data, files) {
        try {
            const findProduct = await Product.findById(id);
            if (!findProduct) {
                return ErrorMessage(404, "Product not found");
            } else {
                if (findProduct.image != "") {
                    fs.unlinkSync(`src/public${findProduct.image}`);
                }

                // data.image = "/uploads/products/" + files.filename;
                const image = files.filename;
                const slug = data.name.replace(/ /g, "-");
                const extension = image.split(".").pop();
                const newImage = slug + "." + extension;
                data.image = "/uploads/products/" + newImage;
                fs.renameSync(files.path, `src/public/uploads/products/${newImage}`);
                const product = await Product.findOneAndUpdate({_id: id}, {$set: data}, {new: true});
                return product;
            }
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async updateNoImage(id, data) {
        try {
            // const product = Product.findByIdAndUpdate(id, {$set: data});
            const product = await Product.findByIdAndUpdate(
                id,
                {
                    $set: {
                        name: data.name,
                        importPrice: data.importPrice,
                        retailPrice: data.retailPrice,
                        quantity: data.quantity,
                        description: data.description,
                        category: data.category
                    }
                }
            );

            return await product;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async delete(id) {
        try {
            const product = await Product.findOneAndDelete({_id: id, isDeleted: true});
            if (!product) {
                return ErrorMessage(400, "Product can't delete");
            }
            return "Delete product success";
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getAllCategory() {
        try {
            const products = await Product.find().distinct("category");
            if (!products) {
                return ErrorMessage(404, "Products not found");
            }
            return await products;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }
}

export default new ProductService();
