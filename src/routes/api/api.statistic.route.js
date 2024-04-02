import ApiStatisticController from "#root/controllers/api/api.statistic.controller.js";
import {Router} from "express";

const router = Router();

router.post("/in-range", ApiStatisticController.getStatisticInRange);
router.get("/today", ApiStatisticController.getStatisticToday);
router.get("/month", ApiStatisticController.getStatisticInThisMonth);
router.get("/7-days", ApiStatisticController.getStatisticWithin7Days);
router.get("/yesterday", ApiStatisticController.getStatisticYesterday);

export default router;