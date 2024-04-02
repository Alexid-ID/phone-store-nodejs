import ApiInvoiceController from "#root/controllers/api/api.invoice.controller.js";
import express from "express";
import validation from "#root/validator/validationRoutes.js";
import {requireRole} from "#root/middlewares/authjwt.middleware.js";
import {Roles} from "#root/constants/role.js";

const router = express.Router();

router.get("/", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiInvoiceController.getAll);
router.get("/find-invoice-by-product/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiInvoiceController.findInvoiceByProduct);
router.get("/get-invoice-by-customer/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiInvoiceController.getInvoiceByCustomer);
router.get("/get-invoice-by-employee/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiInvoiceController.getInvoiceByEmployee);
router.post("/add", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), validation, ApiInvoiceController.create);
router.get("/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiInvoiceController.getById);
router.put("/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), validation, ApiInvoiceController.update);
router.delete("/", requireRole([Roles.ADMIN]), ApiInvoiceController.deleteAll);
router.delete("/:id", requireRole([Roles.ADMIN]), ApiInvoiceController.delete);

export default router;