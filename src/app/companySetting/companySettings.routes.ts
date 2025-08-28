import { Router } from "express";
import { CompanySettingsController } from "./companySettings.controller";

const router = Router();

router.post("/", CompanySettingsController.create);
router.put("/:id", CompanySettingsController.update);
router.get("/get-setting", CompanySettingsController.getCompanySetting);
router.get("/:id", CompanySettingsController.getById);



export const CompanyRoutes = router;