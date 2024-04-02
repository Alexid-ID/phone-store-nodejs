import ApiAccountController from "#root/controllers/api/api.account.controller.js";
import multer from "multer";
import express from "express";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/public/uploads/avatars");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadFile = multer({storage: storage});

router.get("/", ApiAccountController.getAll);
router.get("/:id", ApiAccountController.getById);
router.put("/avatar/:id", uploadFile.single('image'), ApiAccountController.changeAva);
router.put("/:id", ApiAccountController.update);
router.delete("/:id", ApiAccountController.deleteOne);
router.delete("/", ApiAccountController.deleteMany);
// set block/unblock
router.put("/block/:id", ApiAccountController.setBlock);

export default router;