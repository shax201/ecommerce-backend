import { ICourierAdapter, ICourierOrderData, ICourierResponse, ICourierStatusResponse, ICourierPriceResponse } from '../courier.types';
import { IPathaoCredentials } from '../courierCredentials.interface';

export class PathaoAdapter implements ICourierAdapter {
  private credentials: IPathaoCredentials;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(credentials: IPathaoCredentials) {
    this.credentials = credentials;
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // If we have a refresh token, try to refresh
    if (this.credentials.refresh_token) {
      try {
        const refreshResponse = await this.refreshToken();
        if (refreshResponse.success) {
          return this.accessToken!;
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }

    // Get new token using client credentials
    return await this.issueNewToken();
  }

  private async issueNewToken(): Promise<string> {
    const response = await fetch(`${this.credentials.base_url}/issue-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: this.credentials.client_id,
        client_secret: this.credentials.client_secret,
        username: this.credentials.username,
        password: this.credentials.password,
        grant_type: 'password'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.type || data.type !== 'success') {
      throw new Error(`Token request failed: ${data.message || 'Unknown error'}`);
    }

    this.accessToken = data.data.access_token;
    this.tokenExpiry = Date.now() + (data.data.expires_in * 1000);
    
    // Update credentials with new token info
    this.credentials.access_token = this.accessToken || undefined;
    this.credentials.refresh_token = data.data.refresh_token;
    this.credentials.expires_in = data.data.expires_in;

    return this.accessToken!;
  }

  private async refreshToken(): Promise<ICourierResponse> {
    const response = await fetch(`${this.credentials.base_url}/issue-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: this.credentials.client_id,
        client_secret: this.credentials.client_secret,
        refresh_token: this.credentials.refresh_token,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to refresh token: ${response.statusText}`
      };
    }

    const data = await response.json();
    
    if (data.type !== 'success') {
      return {
        success: false,
        error: `Token refresh failed: ${data.message || 'Unknown error'}`
      };
    }

    this.accessToken = data.data.access_token;
    this.tokenExpiry = Date.now() + (data.data.expires_in * 1000);
    
    // Update credentials
    this.credentials.access_token = this.accessToken || undefined;
    this.credentials.refresh_token = data.data.refresh_token;
    this.credentials.expires_in = data.data.expires_in;

    return { success: true };
  }

  async createOrder(orderData: ICourierOrderData): Promise<ICourierResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const pathaoOrderData = {
        store_id: 1, // This should be configurable
        merchant_order_id: orderData.orderNumber,
        recipient_name: orderData.customerName,
        recipient_phone: orderData.customerPhone,
        recipient_address: orderData.customerAddress,
        recipient_city: orderData.customerCity,
        recipient_zone: orderData.customerArea,
        delivery_type: orderData.deliveryType || 48, // 48 hours delivery
        item_type: orderData.itemType || 2, // 2 = Parcel
        item_quantity: orderData.itemQuantity || orderData.items.length,
        item_weight: orderData.itemWeight || orderData.items.reduce((sum, item) => sum + item.weight, 0),
        item_price: orderData.itemPrice || orderData.totalAmount,
        item_category: orderData.itemCategory || 'Ecommerce',
        item_sub_category: orderData.itemSubCategory || 'General',
        special_instruction: orderData.notes || '',
        item_merchant_id: orderData.merchantOrderId || orderData.orderNumber
      };

      const response = await fetch(`${this.credentials.base_url}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pathaoOrderData)
      });

      const data = await response.json();

      if (!response.ok || data.type !== 'success') {
        return {
          success: false,
          error: data.message || `Order creation failed: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data.data,
        consignmentId: data.data.consignment_id,
        trackingNumber: data.data.invoice_id,
        deliveryFee: data.data.delivery_fee
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    }
  }

  async bulkOrder(orderList: ICourierOrderData[]): Promise<ICourierResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const pathaoBulkData = {
        orders: orderList.map(orderData => ({
          store_id: 1,
          merchant_order_id: orderData.orderNumber,
          recipient_name: orderData.customerName,
          recipient_phone: orderData.customerPhone,
          recipient_address: orderData.customerAddress,
          recipient_city: orderData.customerCity,
          recipient_zone: orderData.customerArea,
          delivery_type: orderData.deliveryType || 48,
          item_type: orderData.itemType || 2,
          item_quantity: orderData.itemQuantity || orderData.items.length,
          item_weight: orderData.itemWeight || orderData.items.reduce((sum, item) => sum + item.weight, 0),
          item_price: orderData.itemPrice || orderData.totalAmount,
          item_category: orderData.itemCategory || 'Ecommerce',
          item_sub_category: orderData.itemSubCategory || 'General',
          special_instruction: orderData.notes || '',
          item_merchant_id: orderData.merchantOrderId || orderData.orderNumber
        }))
      };

      const response = await fetch(`${this.credentials.base_url}/orders/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pathaoBulkData)
      });

      const data = await response.json();

      if (!response.ok || data.type !== 'success') {
        return {
          success: false,
          error: data.message || `Bulk order creation failed: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create bulk orders'
      };
    }
  }

  async getStatus(consignmentId: string): Promise<ICourierStatusResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.credentials.base_url}/orders/track/${consignmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok || data.type !== 'success') {
        return {
          success: false,
          error: data.message || `Status check failed: ${response.statusText}`
        };
      }

      return {
        success: true,
        status: data.data.status,
        trackingSteps: data.data.tracking_steps || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get order status'
      };
    }
  }

  async calculatePrice(params: any): Promise<ICourierPriceResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.credentials.base_url}/orders/price-calculation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok || data.type !== 'success') {
        return {
          success: false,
          error: data.message || `Price calculation failed: ${response.statusText}`
        };
      }

      return {
        success: true,
        deliveryFee: data.data.delivery_fee,
        estimatedDeliveryTime: data.data.estimated_delivery_time
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to calculate price'
      };
    }
  }
}
