import {default as AccountService} from "../services/account.service.js";
import {default as ProductService} from "../services/product.service.js";
import {default as CustomerService} from "../services/customer.service.js";
import InvoiceService from "#root/services/invoice.service.js";

class EmployeeController {
    async dashboard(req, res) {
        return res.render("layouts/employee/dashboard", {
            title: "Dashboard",
            user: req?.user || null
        });
    }

    async product(req, res) {
        return res.render("layouts/employee/product", {
            title: "Product",
            user: req?.user || null
        });
    }

    async invoice(req, res) {
        return res.render("layouts/employee/invoice", {
            title: "Invoice",
            user: req?.user || null
        });
    }

    async customer(req, res) {
        return res.render("layouts/employee/customer", {
            title: "Customer",
            user: req?.user || null
        });
    }

    async profile(req, res) {
        const id = req?.user?.id;
        const account = await AccountService.getById(id);
        const invoices = await InvoiceService.getInvoiceByEmployee(id);
        console.log(account);
        return res.render("layouts/employee/profile", {
            title: "Personal Profile",
            account,
            invoices,
            user: req?.user || null
        });
    }

    async checkout(req, res) {
        return res.render("layouts/employee/checkout", {
            title: "Checkout",
            user: req?.user || null
        });
    }

    async invoiceDetail(req, res) {
        const {id} = req.params;
        const invoice = await InvoiceService.getInvoiceById(id);
        return res.render("layouts/employee/invoice-detail", {
            title: "Invoice Detail",
            invoice,
            user: req?.user || null
        });
    }

    async customerProfile(req, res) {
        const {id} = req.params;
        const account = await CustomerService.getCustomerById(id);
        const invoices = await InvoiceService.getInvoiceByCustomer(id);
        return res.render("layouts/employee/customer-detail", {
            title: "Customer Profile",
            account,
            invoices,
            user: req?.user || null
        });
    }

    async productDetails(req, res) {
        const {id} = req.params;

        const product = await ProductService.getById(id);
        return res.render("layouts/employee/product-detail", {
            title: "Product Details",
            product,
            user: req?.user || null
        });
    }

}

export default new EmployeeController();