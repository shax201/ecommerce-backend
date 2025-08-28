import { CompanySettings } from "./companySettings.model";

export const CompanySettingsService = {
  async create(data: any) {
    const settings = new CompanySettings(data);
    return await settings.save();
  },

  async update (data: any) {
    return await CompanySettings.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
    });
  },

  async getById(id: string) {
    return await CompanySettings.findById(id);
  },

 async getCompanySetting() {
    return await CompanySettings.findOne({});
  },
};
