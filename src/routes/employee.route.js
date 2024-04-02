import express from "express";

const router = express.Router();
import EmployeeController from "../controllers/employee.controller.js";
import AdminController from "#root/controllers/admin.controller.js";

router.get("/", EmployeeController.dashboard);
router.get("/product", EmployeeController.product);
router.get("/product-details/:id", EmployeeController.productDetails);
router.get("/invoice", EmployeeController.invoice);
router.get("/customer", EmployeeController.customer);
router.get("/customer/profile/:id", EmployeeController.customerProfile);
router.get("/profile/", EmployeeController.profile);
router.get("/checkout", EmployeeController.checkout);
router.get("/invoice/invoice-detail/:id", EmployeeController.invoiceDetail);

export default router;
