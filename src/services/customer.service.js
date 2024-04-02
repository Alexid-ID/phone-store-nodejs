import Customer from "../models/customer.model.js";
import Invoice from "../models/invoice.model.js";
import {ErrorMessage} from "#root/errors/message.js";

class CustomerService {
    async createCustomer(name, address, phone) {
        if (!phone || !name) {
            return ErrorMessage(400, "Please enter a valid phone number");
        } else {
            try {
                const existingCustomer = await Customer.findOne({phone: phone});
                if (existingCustomer != null) {
                    return ErrorMessage(400, "Phone number already exists");
                }

                const customer = new Customer({
                    name: name,
                    address: address,
                    phone: phone,
                });
                customer.invoices = [];

                console.log("newCustomer", customer);
                return await customer.save();
            } catch (error) {
                return ErrorMessage(500, "Server errors", error.message);
            }
        }
    }

    async updateCustomerName(phone, name) {
        try {
            const existingCustomer = await Customer.findOne({phone: phone});

            if (!existingCustomer) {
                throw new Error("Phone number not found");
            }

            // Update customer name
            existingCustomer.name = name;

            await existingCustomer.save();

            return existingCustomer;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateCustomerAddress(phone, address) {
        try {
            const existingCustomer = await Customer.findOne({phone: phone});

            if (!existingCustomer) {
                throw new Error("Phone number not found");
            }

            // Update customer address
            existingCustomer.address = address;

            await existingCustomer.save();

            return existingCustomer;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateCustomerInvoices(phone, invoices) {
        try {
            const existingCustomer = await Customer.findOne({phone: phone});

            if (!existingCustomer) {
                throw new Error("Phone number not found");
            }

            // Update customer invoices
            existingCustomer.invoices.push(invoices);

            await existingCustomer.save();

            return existingCustomer;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getCustomer(phone) {
        try {
            return await Customer.findOne({phone: phone}).populate("invoices");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getCustomerById(id) {
        try {
            return await Customer.findById(id).populate("invoices");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllCustomer() {
        try {
            return await Customer.find().populate("invoices");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    deleteCustomerbyNumberPhone(phone) {
        return Customer.deleteOne({phone: phone});
    }
}

export default new CustomerService();
