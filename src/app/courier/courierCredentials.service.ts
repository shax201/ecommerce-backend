import CourierCredentialsModel from './courierCredentials.model';
import { ICourierCredentials, ICreateCourierCredentials, IUpdateCourierCredentials } from './courierCredentials.interface';

export class CourierCredentialsService {
  async createCredentials(data: ICreateCourierCredentials): Promise<ICourierCredentials> {
    // Check if credentials for this courier already exist
    const existingCredentials = await CourierCredentialsModel.findOne({ 
      courier: data.courier 
    });
    
    if (existingCredentials) {
      throw new Error(`Credentials for ${data.courier} already exist. Use update instead.`);
    }

    const credentials = new CourierCredentialsModel(data);
    const savedCredentials = await credentials.save();
    return savedCredentials.toObject() as ICourierCredentials;
  }

  async getCredentialsByCourier(courier: 'pathao' | 'steadfast'): Promise<ICourierCredentials | null> {
    return await CourierCredentialsModel.findOne({ 
      courier, 
      isActive: true 
    });
  }

  async getAllCredentials(): Promise<ICourierCredentials[]> {
    const credentials = await CourierCredentialsModel.find().sort({ createdAt: -1 });
    return credentials.map(cred => cred.toObject() as ICourierCredentials);
  }

  async updateCredentials(courier: 'pathao' | 'steadfast', data: IUpdateCourierCredentials): Promise<ICourierCredentials | null> {
    return await CourierCredentialsModel.findOneAndUpdate(
      { courier },
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async deleteCredentials(courier: 'pathao' | 'steadfast'): Promise<boolean> {
    const result = await CourierCredentialsModel.findOneAndDelete({ courier });
    return !!result;
  }

  async deactivateCredentials(courier: 'pathao' | 'steadfast'): Promise<ICourierCredentials | null> {
    return await CourierCredentialsModel.findOneAndUpdate(
      { courier },
      { $set: { isActive: false } },
      { new: true }
    );
  }

  async activateCredentials(courier: 'pathao' | 'steadfast'): Promise<ICourierCredentials | null> {
    return await CourierCredentialsModel.findOneAndUpdate(
      { courier },
      { $set: { isActive: true } },
      { new: true }
    );
  }

  async getActiveCouriers(): Promise<string[]> {
    const credentials = await CourierCredentialsModel.find({ isActive: true }).select('courier');
    return credentials.map(cred => cred.courier);
  }
}
