import { ICourierAdapter, ICourierOrderData, ICourierResponse, ICourierStatusResponse } from '../courier.types';
import { ISteadfastCredentials } from '../courierCredentials.interface';

export class SteadfastAdapter implements ICourierAdapter {
  private credentials: ISteadfastCredentials;

  constructor(credentials: ISteadfastCredentials) {
    this.credentials = credentials;
  }

  private getAuthHeaders() {
    return {
      'api-key': this.credentials.api_key,
      'secret-key': this.credentials.secret_key,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async createOrder(orderData: ICourierOrderData): Promise<ICourierResponse> {
    try {
      const steadfastOrderData = {
        invoice: orderData.orderNumber,
        recipient_name: orderData.customerName,
        recipient_phone: orderData.customerPhone,
        recipient_address: orderData.customerAddress,
        recipient_city: orderData.customerCity,
        recipient_area: orderData.customerArea,
        recipient_zone: orderData.customerPostCode || '',
        cod_amount: orderData.totalAmount,
        note: orderData.notes || '',
        item_type: orderData.itemType || 'Parcel',
        item_weight: orderData.itemWeight || orderData.items.reduce((sum, item) => sum + item.weight, 0),
        item_quantity: orderData.itemQuantity || orderData.items.length,
        item_description: orderData.items.map(item => `${item.name} (${item.quantity}x)`).join(', '),
        delivery_type: orderData.deliveryType || '48',
        item_category: orderData.itemCategory || 'Ecommerce'
      };

      const response = await fetch(`${this.credentials.base_url}/api/v1/create_order`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(steadfastOrderData)
      });

      const data = await response.json();

      console.log('data', data);

      if (response.status !== 200) {
        return {
          success: false,
          error: data.message || `Order creation failed: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data.data,
        consignmentId: data.consignment.consignment_id,
        trackingNumber: data.consignment.tracking_code,
        deliveryFee: data.consignment.delivery_fee
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
      const steadfastBulkData = {
        orders: orderList.map(orderData => ({
          invoice: orderData.orderNumber,
          recipient_name: orderData.customerName,
          recipient_phone: orderData.customerPhone,
          recipient_address: orderData.customerAddress,
          recipient_city: orderData.customerCity,
          recipient_area: orderData.customerArea,
          recipient_zone: orderData.customerPostCode || '',
          cod_amount: orderData.totalAmount,
          note: orderData.notes || '',
          item_type: orderData.itemType || 'Parcel',
          item_weight: orderData.itemWeight || orderData.items.reduce((sum, item) => sum + item.weight, 0),
          item_quantity: orderData.itemQuantity || orderData.items.length,
          item_description: orderData.items.map(item => `${item.name} (${item.quantity}x)`).join(', '),
          delivery_type: orderData.deliveryType || '48',
          item_category: orderData.itemCategory || 'Ecommerce'
        }))
      };

      const response = await fetch(`${this.credentials.base_url}/create_order/bulk-order`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(steadfastBulkData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
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
      // Try different status endpoints
      const endpoints = [
        `status_by_consignment_id/${consignmentId}`,
        `status_by_invoice/${consignmentId}`,
        `status_by_tracking_code/${consignmentId}`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${this.credentials.base_url}/${endpoint}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
          });

          const data = await response.json();

          if (response.ok && data.success) {
            return {
              success: true,
              status: data.data.status,
              trackingSteps: data.data.tracking_steps || []
            };
          }
        } catch (error) {
          // Continue to next endpoint
          continue;
        }
      }

      return {
        success: false,
        error: 'Unable to find order status with any tracking method'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get order status'
      };
    }
  }
}
