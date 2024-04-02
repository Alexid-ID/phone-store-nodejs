import ProductService from "../../services/product.service.js";
import InvoiceService from "../../services/invoice.service.js";
import paginate from "#root/utils/paginate.js";
import {default as Category} from "../../models/category.model.js";
import fs from "fs";

class ApiProductControllers {
    async getAll(req, res) {
        try {
            const products = await ProductService.getAll();
            return res.status(200).json(products);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async create(req, res) {
        try {
            // console.log("req.body", req.body);
            // console.log(req.file);
            const product = await ProductService.create(req.body, req.file);
            return res.status(200).json(product);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getById(req, res) {
        try {
            const product = await ProductService.getById(req.params.id);
            return res.status(200).json(product);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getByBarcode(req, res) {
        try {
            const product = await ProductService.getByBarcode(req.params.barcode);
            return res.status(200).json(product);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getByName(req, res) {
        try {
            const product = await ProductService.getByName(req.params.name);
            return res.status(200).json(product);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async search(req, res) {
        try {
            // delete space %
            const value = req.params.value;
            const products = await ProductService.searchProduct(value);
            return res.status(200).json(products);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async update(req, res) {
        try {
            console.log("req.body", req.body);
            console.log("req.file", req.file);
            if (!req.file || req.file === undefined) {
                console.log("updateNoImage");
                const product = await ProductService.updateNoImage(req.params.id, req.body);
                return res.status(200).json(product);
            } else {
                const product = await ProductService.update(req.params.id, req.body, req.file);
                // console.log("product_controller: ", product);
                return res.status(200).json(product);
            }
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async delete(req, res) {
        try {
            const findProduct = await ProductService.getById(req.params.id);
            if (!findProduct) {
                return res.status(404).json("Product not found");
            }

            const invoices = await InvoiceService.findInvoiceByProduct(req.params.id);
            if (invoices) {
                return res.status(400).json("Product has been purchased, it cannot be deleted");
            }
            const product = await ProductService.delete(req.params.id);
            fs.unlinkSync(`src/public${findProduct.image}`);
            return res.status(200).json(product);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

}

export default new ApiProductControllers();
