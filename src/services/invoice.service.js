import Invoice from "#root/models/invoice.model.js";
import {ErrorMessage} from "#root/errors/message.js";
import Product from "#root/models/product.model.js";
import Customer from "#root/models/customer.model.js";
import Account from "#root/models/auth.model.js";

class InvoiceService {
    async create(data) {
        try {
            if (data.products.length === 0) return ErrorMessage(400, "Please choose at least one product");
            let total = 0;
            for (const productInfo of data.products) {
                const p = await Product.findById(productInfo.product);
                if (!p) return ErrorMessage(400, "Product not found");
                if (p.quantity < productInfo.quantity) return ErrorMessage(400, "Quantity of product is not enough");
                total += p.retailPrice * productInfo.quantity;
                p.quantity -= productInfo.quantity;
                p.isDeleted = false;
                await p.save();
            }

            let customerId = "";
            let existCustomer;

            let customer = await Customer.findOne({phone: data.phone});
            if (!customer) {
                const newCustomer = new Customer({
                    name: data.name,
                    phone: data.phone,
                    address: data.address
                });
                await newCustomer.save();
                data.customer = newCustomer._id;
                customerId = newCustomer._id;
            } else {
                existCustomer = customer;
                data.customer = existCustomer._id;
                customerId = existCustomer._id;
            }

            const account = await Account.findById(data.account);
            if (!account) return ErrorMessage(400, "Account not found");

            if (data.moneyGiven < total) return ErrorMessage(400, "Money given is not enough");
            data.total = total;
            data.moneyBack = data.moneyGiven - data.total;

            data = {
                products: data.products,
                total: data.total,
                moneyGiven: data.moneyGiven,
                moneyBack: data.moneyBack,
                customer: customerId,
                account: data.account
            }

            const newInvoice = new Invoice(data);
            await newInvoice.save();
            await Customer.findByIdAndUpdate(data.customer, {$push: {invoices: newInvoice._id}});
            await Account.findByIdAndUpdate(account._id, {$push: {sales: newInvoice._id}})
            return newInvoice;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getAll() {
        try {
            const invoices = await Invoice.find().populate({path: "products", populate: {path: "product"}})
                .populate("customer", "_id name phone address").populate("account", "_id username fullName email");
            if (!invoices) return ErrorMessage(400, "Invoice not found");
            return invoices;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getInvoiceById(id) {
        try {
            const invoice = await Invoice.findById(id)
                .populate({path: "products", populate: {path: "product"}})
                .populate("customer", "_id name phone address")
                .populate("account", "_id username fullName email");
            if (!invoice) return ErrorMessage(400, "Invoice not found");
            return invoice;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getInvoiceByCustomer(id) {
        try {
            const invoices = await Invoice.find({customer: id})
                .populate({path: "products", populate: {path: "product"}})
                .populate("customer", "_id name phone address")
                .populate("account", "_id username fullName email");
            if (!invoices) return ErrorMessage(400, "Invoice not found");
            return invoices;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getInvoiceByEmployee(id) {
        try {
            const invoices = await Invoice.find({account: id})
                .populate({path: "products", populate: {path: "product"}})
                .populate("customer", "_id name phone address")
                .populate("account", "_id username fullName email");
            if (!invoices) return ErrorMessage(400, "Invoice not found");
            return invoices;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async findInvoiceByProduct(id) {
        try {
            const invoices = await Invoice.findOne({products: {$elemMatch: {product: id}}});
            return invoices;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async update(id, data) {
        try {
            let total = 0;
            if (data.products) {
                for (const productInfo of data.products) {
                    const product = await Product.findById(productInfo.product);
                    if (!product) return ErrorMessage(400, "Product not found");
                    if (product.quantity < productInfo.quantity) return ErrorMessage(400, "Quantity of product is not enough");
                    total += product.retailPrice * productInfo.quantity;
                    product.quantity -= productInfo.quantity;
                    product.isDeleted = false;
                    await product.save();
                }
            }
            data.total = total;
            data.moneyBack = data.moneyGiven - data.total;
            const invoice = await Invoice.findByIdAndUpdate(id, {$set: data});
            if (!invoice) return ErrorMessage(400, "Invoice not found");
            return invoice;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async delete(id) {
        try {
            const invoice = await Invoice.findByIdAndDelete(id);
            if (!invoice) return ErrorMessage(400, "Invoice not found");
            return invoice;
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async deleteAll() {
        try {
            await Invoice.deleteMany();
            return "Xóa thành công";
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }
}

export default new InvoiceService();