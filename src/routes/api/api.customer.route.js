import express from 'express';
import ApiCustomerController from "#root/controllers/api/api.customer.controller.js";
import {requireRole} from "#root/middlewares/authjwt.middleware.js";
import {Roles} from "#root/constants/role.js";


const router = express.Router();

router.get('/', requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiCustomerController.getAllCustomer);
router.get('/:phone', requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiCustomerController.getCustomerByPhoneNumber);
router.post('/add', requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiCustomerController.createCustomer);
export default router;