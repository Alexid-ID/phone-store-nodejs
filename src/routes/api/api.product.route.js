import express from "express";
import multer from "multer";
import ApiProductControllers from "../../controllers/api/api.product.controller.js";
import validataion from "../../validator/validationRoutes.js";
import {requireRole} from "#root/middlewares/authjwt.middleware.js";
import {Roles} from "#root/constants/role.js";
import upload from "../../middlewares/upload.middleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/public/uploads/products");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadFile = multer({storage: storage});

router.get("/", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiProductControllers.getAll);
// router.get("/category", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiProductControllers.getAllCategory);
router.post("/add", validataion, requireRole([Roles.ADMIN]), uploadFile.single("image"), ApiProductControllers.create);
router.get("/search/:value", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiProductControllers.search);

router.get("/barcode/:barcode", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiProductControllers.getByBarcode);
router.get("/name/:name", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiProductControllers.getByName);
router.get("/:id", requireRole([Roles.ADMIN, Roles.EMPLOYEE]), ApiProductControllers.getById);
router.put("/:id", validataion, requireRole([Roles.ADMIN]), uploadFile.single("image"), ApiProductControllers.update);
router.delete("/:id", requireRole([Roles.ADMIN]), ApiProductControllers.delete);

export default router;
