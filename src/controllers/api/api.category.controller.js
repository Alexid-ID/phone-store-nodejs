import CategorySevice from '../../services/category.service.js';

class CategoryController {
    async getAll(req, res) {
        try {
            const categories = await CategorySevice.getAll();
            return res.status(200).json(categories);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async create(req, res) {
        try {
            const category = await CategorySevice.create(req.body);
            return res.status(200).json(category);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getById(req, res) {
        try {
            const category = await CategorySevice.getById(req.params.id);
            return res.status(200).json(category);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async delete(req, res) {
        try {
            const category = await CategorySevice.delete(req.params.id);
            return res.status(200).json(category);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
}

export default new CategoryController();