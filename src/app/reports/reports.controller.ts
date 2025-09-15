import { Request, Response } from "express";
import { ReportsService } from "./reports.service";
import { ReportGenerationRequest, ReportFilters } from "../../types/report.types";

export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // Get all reports with pagination and filters
  async getReports(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        status,
        search,
      } = req.query;

      const filters = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        type: type as string,
        status: status as string,
        search: search as string,
      };

      const result = await this.reportsService.getReports(filters);

      res.status(200).json({
        success: true,
        data: result.reports,
        pagination: result.pagination,
        message: "Reports retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting reports:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve reports",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get single report by ID
  async getReportById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const report = await this.reportsService.getReportById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      res.status(200).json({
        success: true,
        data: report,
        message: "Report retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve report",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Generate new report
  async generateReport(req: Request, res: Response) {
    try {
      const reportData: ReportGenerationRequest = req.body;
      const result = await this.reportsService.generateReport(reportData);

      res.status(202).json({
        success: true,
        data: {
          reportId: result.reportId,
          status: result.status,
          estimatedTime: result.estimatedTime,
        },
        message: "Report generation started",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate report",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Download report
  async downloadReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const downloadData = await this.reportsService.getDownloadUrl(id);

      if (!downloadData) {
        return res.status(404).json({
          success: false,
          message: "Report not found or not ready for download",
        });
      }

      res.status(200).json({
        success: true,
        data: downloadData,
        message: "Download URL generated successfully",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate download URL",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Delete report
  async deleteReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.reportsService.deleteReport(id);

      res.status(200).json({
        success: true,
        message: "Report deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete report",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get report templates
  async getReportTemplates(req: Request, res: Response) {
    try {
      const templates = await this.reportsService.getReportTemplates();

      res.status(200).json({
        success: true,
        data: templates,
        message: "Report templates retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting report templates:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve report templates",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Create report template
  async createReportTemplate(req: Request, res: Response) {
    try {
      const templateData = req.body;
      const template = await this.reportsService.createReportTemplate(templateData);

      res.status(201).json({
        success: true,
        data: template,
        message: "Report template created successfully",
      });
    } catch (error) {
      console.error("Error creating report template:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create report template",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Update report template
  async updateReportTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const templateData = req.body;
      const template = await this.reportsService.updateReportTemplate(id, templateData);

      res.status(200).json({
        success: true,
        data: template,
        message: "Report template updated successfully",
      });
    } catch (error) {
      console.error("Error updating report template:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update report template",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Delete report template
  async deleteReportTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.reportsService.deleteReportTemplate(id);

      res.status(200).json({
        success: true,
        message: "Report template deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting report template:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete report template",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Export data
  async exportData(req: Request, res: Response) {
    try {
      const exportOptions = req.body;
      const exportData = await this.reportsService.exportData(exportOptions);

      res.status(200).json({
        success: true,
        data: exportData,
        message: "Data exported successfully",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get specific report data
  async getSalesReportData(req: Request, res: Response) {
    try {
      const filters: ReportFilters = req.body;
      const data = await this.reportsService.getSalesReportData(filters);

      res.status(200).json({
        success: true,
        data,
        message: "Sales report data retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting sales report data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve sales report data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getOrdersReportData(req: Request, res: Response) {
    try {
      const filters: ReportFilters = req.body;
      const data = await this.reportsService.getOrdersReportData(filters);

      res.status(200).json({
        success: true,
        data,
        message: "Orders report data retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting orders report data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve orders report data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getProductsReportData(req: Request, res: Response) {
    try {
      const filters: ReportFilters = req.body;
      const data = await this.reportsService.getProductsReportData(filters);

      res.status(200).json({
        success: true,
        data,
        message: "Products report data retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting products report data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve products report data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getCustomersReportData(req: Request, res: Response) {
    try {
      const filters: ReportFilters = req.body;
      const data = await this.reportsService.getCustomersReportData(filters);

      res.status(200).json({
        success: true,
        data,
        message: "Customers report data retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting customers report data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve customers report data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getInventoryReportData(req: Request, res: Response) {
    try {
      const filters: ReportFilters = req.body;
      const data = await this.reportsService.getInventoryReportData(filters);

      res.status(200).json({
        success: true,
        data,
        message: "Inventory report data retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting inventory report data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve inventory report data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getCouponsReportData(req: Request, res: Response) {
    try {
      const filters: ReportFilters = req.body;
      const data = await this.reportsService.getCouponsReportData(filters);

      res.status(200).json({
        success: true,
        data,
        message: "Coupons report data retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting coupons report data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve coupons report data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAnalyticsReportData(req: Request, res: Response) {
    try {
      const filters: ReportFilters = req.body;
      const data = await this.reportsService.getAnalyticsReportData(filters);

      res.status(200).json({
        success: true,
        data,
        message: "Analytics report data retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting analytics report data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve analytics report data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getFinancialReportData(req: Request, res: Response) {
    try {
      const filters: ReportFilters = req.body;
      const data = await this.reportsService.getFinancialReportData(filters);

      res.status(200).json({
        success: true,
        data,
        message: "Financial report data retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting financial report data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve financial report data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Check report generation status
  async checkReportStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const status = await this.reportsService.getReportStatus(id);

      res.status(200).json({
        success: true,
        data: status,
        message: "Report status retrieved successfully",
      });
    } catch (error) {
      console.error("Error checking report status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check report status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Cancel report generation
  async cancelReportGeneration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.reportsService.cancelReportGeneration(id);

      res.status(200).json({
        success: true,
        message: "Report generation cancelled successfully",
      });
    } catch (error) {
      console.error("Error cancelling report generation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel report generation",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Bulk delete reports
  async bulkDeleteReports(req: Request, res: Response) {
    try {
      const { reportIds } = req.body;
      await this.reportsService.bulkDeleteReports(reportIds);

      res.status(200).json({
        success: true,
        message: `${reportIds.length} reports deleted successfully`,
      });
    } catch (error) {
      console.error("Error bulk deleting reports:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete reports",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Bulk generate reports
  async bulkGenerateReports(req: Request, res: Response) {
    try {
      const { reports } = req.body;
      const result = await this.reportsService.bulkGenerateReports(reports);

      res.status(202).json({
        success: true,
        data: result,
        message: "Bulk report generation started",
      });
    } catch (error) {
      console.error("Error bulk generating reports:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate reports",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
