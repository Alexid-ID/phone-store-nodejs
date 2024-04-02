import CustomerService from "#root/services/customer.service.js";

class ApiCustomerController {
	async getAllCustomer(req, res) {
		try {
			const customers = await CustomerService.getAllCustomer();
			return res.status(200).json(customers);
		} catch (e) {
			return res.status(500).json(e.message);
		}
	}

	async getCustomerByPhoneNumber(req, res) {
		try {
			const { phone } = req.params;
			const customer = await CustomerService.getCustomer(phone);
			return res.status(200).json(customer);
		} catch (e) {
			return res.status(500).json(e.message);
		}
	}

	async createCustomer(req, res) {
		try {
			const { name, address, phone, invoices } = req.body;
			const customer = await CustomerService.createCustomer(name, address, phone, invoices);
			res.status(200).json(customer);
		} catch (e) {
			res.status(500).json(e.message);
		}
	}

	async deleteCustomerByPhoneNumber(req, res) {
		try {
			const { phone } = req.params;
			const [customer] = await Promise.all([CustomerService.deleteCustomerbyNumberPhone(phone)]);
			res.status(200).json(customer);
		} catch (e) {
			res.status(500).json(e.message);
		}
	}
}
export default new ApiCustomerController();
