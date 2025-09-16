import { Router } from "express";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/permission.middleware";

const router = Router();

// Initialize services and controller
// For now, we'll pass null for services that don't exist yet
// The reports service will handle this gracefully
const reportsService = new ReportsService(null, null, null, null);
const reportsController = new ReportsController(reportsService);

// Main report routes
router.get("/", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getReports.bind(reportsController)
);
router.get("/:id", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getReportById.bind(reportsController)
);
router.post("/generate", 
  authMiddleware, 
  requirePermission('reports', 'create'), 
  reportsController.generateReport.bind(reportsController)
);
router.get("/:id/download", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.downloadReport.bind(reportsController)
);
router.delete("/:id", 
  authMiddleware, 
  requirePermission('reports', 'delete'), 
  reportsController.deleteReport.bind(reportsController)
);

// Report template routes
router.get("/templates", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getReportTemplates.bind(reportsController)
);
router.post("/templates", 
  authMiddleware, 
  requirePermission('reports', 'create'), 
  reportsController.createReportTemplate.bind(reportsController)
);
router.put("/templates/:id", 
  authMiddleware, 
  requirePermission('reports', 'update'), 
  reportsController.updateReportTemplate.bind(reportsController)
);
router.delete("/templates/:id", 
  authMiddleware, 
  requirePermission('reports', 'delete'), 
  reportsController.deleteReportTemplate.bind(reportsController)
);

// Export routes
router.post("/export", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.exportData.bind(reportsController)
);

// Specific report data routes
router.post("/data/sales", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getSalesReportData.bind(reportsController)
);
router.post("/data/orders", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getOrdersReportData.bind(reportsController)
);
router.post("/data/products", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getProductsReportData.bind(reportsController)
);
router.post("/data/customers", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getCustomersReportData.bind(reportsController)
);
router.post("/data/inventory", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getInventoryReportData.bind(reportsController)
);
router.post("/data/coupons", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getCouponsReportData.bind(reportsController)
);
router.post("/data/analytics", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getAnalyticsReportData.bind(reportsController)
);
router.post("/data/financial", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.getFinancialReportData.bind(reportsController)
);

// Report status and control routes
router.get("/:id/status", 
  authMiddleware, 
  requirePermission('reports', 'read'), 
  reportsController.checkReportStatus.bind(reportsController)
);
router.post("/:id/cancel", 
  authMiddleware, 
  requirePermission('reports', 'update'), 
  reportsController.cancelReportGeneration.bind(reportsController)
);

// Bulk operations
router.post("/bulk-delete", 
  authMiddleware, 
  requirePermission('reports', 'delete'), 
  reportsController.bulkDeleteReports.bind(reportsController)
);
router.post("/bulk-generate", 
  authMiddleware, 
  requirePermission('reports', 'create'), 
  reportsController.bulkGenerateReports.bind(reportsController)
);

export default router;
