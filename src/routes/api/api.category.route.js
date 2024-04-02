import apiCategoryController from "#root/controllers/api/api.category.controller.js";
import { Router } from "express";
import validation from "#root/validator/validationRoutes.js";
import {requireRole} from "#root/middlewares/authjwt.middleware.js";
import {Roles} from "#root/constants/role.js";
const router = Router();

router.get("/", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), apiCategoryController.getAll);
router.post("/", requireRole([Roles.ADMIN]), validation, apiCategoryController.create);
router.get("/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), apiCategoryController.getById);
router.delete("/:id", requireRole([Roles.ADMIN]), apiCategoryController.delete);

export default router;