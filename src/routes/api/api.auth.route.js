import express from "express";
import ApiAuthControllers from "../../controllers/api/api.auth.controller.js";
import validation from "../../validator/validationRoutes.js";
import {requireRole} from "#root/middlewares/authjwt.middleware.js";
import {Roles} from "#root/constants/role.js";

const router = express.Router();

// Handle
router.get("/active", validation, ApiAuthControllers.setActive);

router.post("/register", requireRole([Roles.ADMIN]), validation, ApiAuthControllers.register);

router.post("/resend", requireRole([Roles.ADMIN]), validation, ApiAuthControllers.resendMail);

router.post("/reset-password/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), validation, ApiAuthControllers.resetPassword);

router.post("/login", validation, ApiAuthControllers.login);

router.get("/logout/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), validation, ApiAuthControllers.logout);
export default router;
