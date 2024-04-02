import Invoice from "#root/models/invoice.model.js";
import {ErrorMessage} from "#root/errors/message.js";

class StatisticService {
    async returnData(invoices) {
        let revenue = 0;
        let productList = [];
        let customerList = [];
        let accountList = [];
        for (const invoice of invoices) {
            revenue += invoice.total;

            const customerInfo = customerList.find(c => c._id.toString() === invoice.customer._id.toString());
            if (!customerInfo) {
                customerList.push(invoice.customer);
            }

            const accountInfo = accountList.find(a => a._id.toString() === invoice.account._id.toString());
            if (!accountInfo) {
                accountList.push(invoice.account);
            }

            for (const product of invoice.products) {
                const productInfo = productList.find(p => p.product._id.toString() === product.product._id.toString());
                if (productInfo) {
                    productInfo.quantity += product.quantity;
                } else {
                    productList.push({
                        product: product.product,
                        quantity: product.quantity
                    })
                }
            }
        }
        return {
            revenue,
            productList,
            customerList,
            accountList,
            invoices
        }
    }

    async getStatisticToday() {
        try {
            const today = new Date();

            const start = new Date(today);
            start.setHours(0, 0, 0, 0);
            const end = new Date(today);
            end.setHours(23, 59, 59, 999);

            const invoices = await Invoice.find({
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            }).populate('products.product').populate('customer').populate('account');
            return this.returnData(invoices);
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getStatisticInRange(fromDate, toDate) {
        try {
            const start = new Date(fromDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);

            let revenue = 0;
            let productList = [];
            const invoices = await Invoice.find({
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            }).populate('products.product').populate('customer').populate('account');
            return this.returnData(invoices);
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getStatisticInMonth() {
        try {
            const currentDate = new Date();
            const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
            const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

            const invoices = await Invoice.find({
                createdAt: {
                    $gte: firstDate,
                    $lte: lastDate
                }
            }).populate('products.product').populate('customer').populate('account');
            return this.returnData(invoices);
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getStatisticLast7Days() {
        try {
            const currentDate = new Date();
            const startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 7);

            const endDate = new Date();

            const invoices = await Invoice.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).populate('products.product').populate('customer').populate('account');

            return this.returnData(invoices);
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }

    async getStatisticYesterday() {
        try {
            const currentDate = new Date();
            const startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(currentDate);
            endDate.setDate(currentDate.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
            console.log("startDate - endDate: ", startDate, endDate);

            const invoices = await Invoice.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).populate('products.product').populate('customer').populate('account');
            return this.returnData(invoices);
        } catch (e) {
            return ErrorMessage(500, e.message);
        }
    }
}

export default new StatisticService();