import { Request, Response } from "express";
import { companySettingsSchema } from "./companySettings.validation";
import { CompanySettingsService } from "./companySettings.service";

export const CompanySettingsController = {
  async create(req: Request, res: Response) {
    try {
      const validated = companySettingsSchema.parse(req.body);

      const existCompnaySetting = await CompanySettingsService.getCompanySetting();

      if(existCompnaySetting){
         const updated = await CompanySettingsService.update(validated);
         return  res.json({ success: true, data: updated });
      }

      const created = await CompanySettingsService.create(validated);
      res.status(201).json({ success: true, data: created });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.errors || err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validated = companySettingsSchema.parse(req.body);
      const updated = await CompanySettingsService.update(validated);
      if (!updated) {
        return res.status(404).json({ success: false, error: "Not found" });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.errors || err.message });
    }
  },

  async getCompanySetting(req: Request, res: Response) {

    try {
    
      const setting = await CompanySettingsService.getCompanySetting();
      if (!setting) {
        return res.status(404).json({ success: false, error: "Not found" });
      }
      res.json({ success: true, data: setting });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

    async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const settings = await CompanySettingsService.getById(id);
      if (!settings) {
        return res.status(404).json({ success: false, error: "Not found" });
      }
      res.json({ success: true, data: settings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

};
