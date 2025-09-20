import { CourierCredentialsService } from './courierCredentials.service';
import { PathaoAdapter } from './adapters/PathaoAdapter';
import { SteadfastAdapter } from './adapters/SteadfastAdapter';
import { ICourierAdapter, ICourierOrderData, ICourierResponse, ICourierStatusResponse, ICourierPriceResponse, CourierType } from './courier.types';
import { IPathaoCredentials, ISteadfastCredentials } from './courierCredentials.interface';

export class CourierService {
  private credentialsService: CourierCredentialsService;

  constructor() {
    this.credentialsService = new CourierCredentialsService();
  }

  private getCourierAdapter(courierName: CourierType): ICourierAdapter {
    switch (courierName) {
      case 'pathao':
        return new PathaoAdapter(this.getPathaoCredentials());
      case 'steadfast':
        return new SteadfastAdapter(this.getSteadfastCredentials());
      default:
        throw new Error(`Courier ${courierName} not supported`);
    }
  }

  private getPathaoCredentials(): IPathaoCredentials {
    // This should be fetched from database in real implementation
    // For now, we'll throw an error to indicate credentials need to be set
    throw new Error('Pathao credentials not configured. Please set up credentials first.');
  }

  private getSteadfastCredentials(): ISteadfastCredentials {
    // This should be fetched from database in real implementation
    // For now, we'll throw an error to indicate credentials need to be set
    throw new Error('Steadfast credentials not configured. Please set up credentials first.');
  }

  private async getCourierAdapterWithCredentials(courierName: CourierType): Promise<ICourierAdapter> {
    const credentials = await this.credentialsService.getCredentialsByCourier(courierName);
    
    if (!credentials) {
      throw new Error(`No active credentials found for ${courierName}`);
    }

    if (!credentials.isActive) {
      throw new Error(`Credentials for ${courierName} are inactive`);
    }

    switch (courierName) {
      case 'pathao':
        return new PathaoAdapter(credentials.credentials as IPathaoCredentials);
      case 'steadfast':
        return new SteadfastAdapter(credentials.credentials as ISteadfastCredentials);
      default:
        throw new Error(`Courier ${courierName} not supported`);
    }
  }

  async createOrder(courier: CourierType, orderData: ICourierOrderData): Promise<ICourierResponse> {
    try {
      const adapter = await this.getCourierAdapterWithCredentials(courier);
      console.log('adapter', adapter)
      return await adapter.createOrder(orderData);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || `Failed to create order with ${courier}`
      };
    }
  }

  async bulkOrder(courier: CourierType, orderList: ICourierOrderData[]): Promise<ICourierResponse> {
    try {
      const adapter = await this.getCourierAdapterWithCredentials(courier);
      return await adapter.bulkOrder(orderList);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || `Failed to create bulk orders with ${courier}`
      };
    }
  }

  async getStatus(courier: CourierType, consignmentId: string): Promise<ICourierStatusResponse> {
    try {
      const adapter = await this.getCourierAdapterWithCredentials(courier);
      return await adapter.getStatus(consignmentId);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || `Failed to get status from ${courier}`
      };
    }
  }

  async calculatePrice(courier: CourierType, params: any): Promise<ICourierPriceResponse> {
    try {
      const adapter = await this.getCourierAdapterWithCredentials(courier);
      
      if (!adapter.calculatePrice) {
        return {
          success: false,
          error: `Price calculation not supported for ${courier}`
        };
      }

      return await adapter.calculatePrice(params);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || `Failed to calculate price with ${courier}`
      };
    }
  }

  async getAvailableCouriers(): Promise<CourierType[]> {
    try {
      // First try to get active couriers from credentials
      const activeCouriers = await this.credentialsService.getActiveCouriers() as CourierType[];
      
      // If we have active couriers, return them
      if (activeCouriers.length > 0) {
        return activeCouriers;
      }
      
      // If no active couriers, return all supported courier types
      // This allows users to see available couriers even before setting up credentials
      console.log('No active couriers found, returning default couriers');
      return ['pathao', 'steadfast'];
    } catch (error: any) {
      console.error('Failed to get available couriers:', error);
      // Fallback to all supported courier types
      console.log('Error getting couriers, returning default couriers');
      return ['pathao', 'steadfast'];
    }
  }

  // Helper method to validate courier credentials
  async validateCourierCredentials(courier: CourierType): Promise<boolean> {
    try {
      const credentials = await this.credentialsService.getCredentialsByCourier(courier);
      return !!(credentials && credentials.isActive);
    } catch (error) {
      return false;
    }
  }
}
