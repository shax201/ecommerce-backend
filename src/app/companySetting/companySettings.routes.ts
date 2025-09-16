import { Router } from "express";
import { CompanySettingsController } from "./companySettings.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/permission.middleware";

const router = Router();

router.post("/", 
  authMiddleware, 
  requirePermission('company-settings', 'create'), 
  CompanySettingsController.create
);

router.put("/:id", 
  authMiddleware, 
  requirePermission('company-settings', 'update'), 
  CompanySettingsController.update
);

router.get("/get-setting", CompanySettingsController.getCompanySetting); // Public route
router.get("/:id", 
  authMiddleware, 
  requirePermission('company-settings', 'read'), 
  CompanySettingsController.getById
);



export const CompanyRoutes = router;