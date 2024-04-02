import express from "express";

const router = express.Router();
import AdminController from "../controllers/admin.controller.js";
// Page
router.get("/", AdminController.dashboard);

// Account
router.get("/account", AdminController.account);
router.get("/profile", AdminController.personalProfile);

router.get("/employee/profile/:id", AdminController.profile);
router.get("/customer/profile/:id", AdminController.customerProfile);
router.delete("/account/:id", AdminController.deleteAccount);

//Product 
router.get("/product", AdminController.product);
router.get("/product-details/:id", AdminController.productDetails);
router.get("/add-product", AdminController.addProduct);
router.get("/edit-product/:id", AdminController.editProduct);

//Customer
router.get("/customer", AdminController.customer);

//Invoice
router.get("/invoice", AdminController.invoice);
router.get("/invoice/invoice-detail/:id", AdminController.invoiceDetail);
export default router;
