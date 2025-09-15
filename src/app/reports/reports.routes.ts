import { Router } from "express";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

const router = Router();

// Initialize services and controller
// For now, we'll pass null for services that don't exist yet
// The reports service will handle this gracefully
const reportsService = new ReportsService(null, null, null, null);
const reportsController = new ReportsController(reportsService);

// Main report routes
router.get("/", reportsController.getReports.bind(reportsController));
router.get("/:id", reportsController.getReportById.bind(reportsController));
router.post("/generate", reportsController.generateReport.bind(reportsController));
router.get("/:id/download", reportsController.downloadReport.bind(reportsController));
router.delete("/:id", reportsController.deleteReport.bind(reportsController));

// Report template routes
router.get("/templates", reportsController.getReportTemplates.bind(reportsController));
router.post("/templates", reportsController.createReportTemplate.bind(reportsController));
router.put("/templates/:id", reportsController.updateReportTemplate.bind(reportsController));
router.delete("/templates/:id", reportsController.deleteReportTemplate.bind(reportsController));

// Export routes
router.post("/export", reportsController.exportData.bind(reportsController));

// Specific report data routes
router.post("/data/sales", reportsController.getSalesReportData.bind(reportsController));
router.post("/data/orders", reportsController.getOrdersReportData.bind(reportsController));
router.post("/data/products", reportsController.getProductsReportData.bind(reportsController));
router.post("/data/customers", reportsController.getCustomersReportData.bind(reportsController));
router.post("/data/inventory", reportsController.getInventoryReportData.bind(reportsController));
router.post("/data/coupons", reportsController.getCouponsReportData.bind(reportsController));
router.post("/data/analytics", reportsController.getAnalyticsReportData.bind(reportsController));
router.post("/data/financial", reportsController.getFinancialReportData.bind(reportsController));

// Report status and control routes
router.get("/:id/status", reportsController.checkReportStatus.bind(reportsController));
router.post("/:id/cancel", reportsController.cancelReportGeneration.bind(reportsController));

// Bulk operations
router.post("/bulk-delete", reportsController.bulkDeleteReports.bind(reportsController));
router.post("/bulk-generate", reportsController.bulkGenerateReports.bind(reportsController));

export default router;
