import Category from "../models/category.model.js";
import { ErrorMessage } from "../errors/message.js";

class CategoryService {
    async create(data) {
        try {
            const category = new Category(data);
            category.products = [];
            return await category.save();
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getAll() {
        try {
            const categories = await Category.find({}).select({ name: 1, _id: 1 })
            if (!categories) {
                return ErrorMessage(404, "Categories not found");
            }
            return await categories;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getById(id) {
        try {
            const category = await Category.findById(id).populate('products');
            if (!category) {
                return ErrorMessage(404, "Category not found");
            }
            return category;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async delete(id) {
        try {
            const category = await Category.findByIdAndDelete(id);
            if (!category) {
                return ErrorMessage(404, "Category not found");
            }
            return category;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }
}

export default new CategoryService();