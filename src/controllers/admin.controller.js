import {default as AccountService} from "../services/account.service.js";
import {default as ProductService} from "../services/product.service.js";
import InvoiceService from "#root/services/invoice.service.js";
import {default as CustomerService} from "../services/customer.service.js";

class AdminController {
    // Account
    async dashboard(req, res) {
        return res.render("layouts/admin/dashboard", {
            title: "Dashboard",
            user: req?.user || null
        });
    }

    async account(req, res) {
        return res.render("layouts/admin/account", {
            title: "Account",
            user: req?.user || null
        });
    }

    async deleteAccount(req, res) {
        const {id} = req.params;
        // find account
        const account = await AccountService.getById(id);
        if (!account) return res.status(404).json({message: "Account not found"});
        // delete account
        const result = await AccountService.delete(id);
        if (!result) return res.status(500).json({message: "Delete account failed"});
        return res.status(200).json({status: "success", message: `Deleted account ${account.fullName} successfully`});
    }

    async profile(req, res) {
        const {id} = req.params;
        // find account
        const account = await AccountService.getById(id);
        const invoices = await InvoiceService.getInvoiceByEmployee(id);
        console.log(account);
        return res.render("layouts/admin/profile-employee", {
            title: "Personal Profile",
            account,
            invoices,
            user: req?.user || null
        });
    }

    async personalProfile(req, res) {
        const id = req?.user?.id;
        const account = await AccountService.getById(id);
        const invoices = await InvoiceService.getInvoiceByEmployee(id);
        console.log(account);
        return res.render("layouts/admin/profile", {
            title: "Personal Profile",
            account,
            invoices,
            user: req?.user || null
        });
    }

    // Product
    async product(req, res) {
        return res.render("layouts/admin/product", {
            title: "Product",
            user: req?.user || null
        });
    }

    async productDetails(req, res) {
        const {id} = req.params;

        const product = await ProductService.getById(id);
        return res.render("layouts/admin/product-details", {
            title: "Product Details",
            product,
            user: req?.user || null
        });
    }

    async addProduct(req, res) {
        return res.render("layouts/admin/add-product", {
            title: "Add Product",
            user: req?.user || null
        });
    }

    async editProduct(req, res) {
        const {id} = req.params;
        const product = await ProductService.getById(id);
        return res.render("layouts/admin/edit-product", {
            title: "Edit Product",
            product,
            user: req?.user || null
        });
    }

    //Customer
    async customer(req, res) {
        return res.render("layouts/admin/customer", {
            title: "Customer",
            user: req?.user || null
        })
    }

    //Invoice
    async invoice(req, res) {
        return res.render("layouts/admin/invoice", {
            title: "Invoice",
            user: req?.user || null
        })
    }

    async invoiceDetail(req, res) {
        const {id} = req.params;
        const invoice = await InvoiceService.getInvoiceById(id);
        return res.render("layouts/admin/invoice-detail", {
            title: "Invoice Detail",
            invoice,
            user: req?.user || null
        });
    }

    async customerProfile(req, res) {
        const {id} = req.params;
        const account = await CustomerService.getCustomerById(id);
        const invoices = await InvoiceService.getInvoiceByCustomer(id);
        return res.render("layouts/admin/customer-detail", {
            title: "Customer Profile",
            account,
            invoices,
            user: req?.user || null
        });
    }
}

export default new AdminController();
