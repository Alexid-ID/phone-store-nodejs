import InvoiceService from "#root/services/invoice.service.js";
import paginate from "#root/utils/paginate.js";

class ApiInvoiceController {
    async getAll(req, res) {
        try {
            const page = req.query || 1;
            const invoices = await InvoiceService.getAll();
            return res.status(200).json(invoices);
            // return res.status(200).json(paginate(invoices, page, 10));
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async findInvoiceByProduct(req, res) {
        try {
            const invoices = await InvoiceService.findInvoiceByProduct(req.params.id);
            return res.status(200).json(invoices);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async create(req, res) {
        try {
            const invoice = await InvoiceService.create(req.body);
            return res.status(200).json(invoice);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getById(req, res) {
        try {
            const invoice = await InvoiceService.getInvoiceById(req.params.id);
            return res.status(200).json(invoice);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async update(req, res) {
        try {
            const invoice = await InvoiceService.update(req.params.id, req.body);
            return res.status(200).json(invoice);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async delete(req, res) {
        try {
            const invoice = await InvoiceService.delete(req.params.id);
            return res.status(200).json(invoice);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async deleteAll(req, res) {
        try {
            const invoices = await InvoiceService.deleteAll();
            return res.status(200).json(invoices);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getInvoiceByCustomer(req, res) {
        try {
            const invoices = await InvoiceService.getInvoiceByCustomer(req.params.id);
            return res.status(200).json(invoices);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getInvoiceByEmployee(req, res) {
        try {
            const invoices = await InvoiceService.getInvoiceByEmployee(req.params.id);
            return res.status(200).json(invoices);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
}

export default new ApiInvoiceController();