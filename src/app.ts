import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { CatagoryRoutes } from './app/products/catagory/catagory.routes';
import { AttributeRoutes } from './app/products/attribute/attribute.routes';
import { ProductRoutes } from './app/products/product/product.routes';
import { OrderRoutes } from './app/order/orderHistory/orderHistory.route';
import { OrdersRoutes } from './app/order/orders.route';
import { ShippingAddressRoutes } from './app/order/shipping/shippingAdress.route';
import { OrderTrackingRoutes } from './app/order/orderTracking.route';
import { OrderAnalyticsRoutes } from './app/order/orderAnalytics.route';
import { ClientsRoutes } from './app/user/client/client.route';
import { AdminRoutes } from './app/user/admin/admin.route';
import { UserManagementRoutes } from './app/user/userManagement/userManagement.routes';
import { UserSettingsRoutes } from './app/user/userSettings/userSettings.routes';
import { CompanyRoutes } from './app/companySetting/companySettings.routes';
import { ContentRoutes } from './app/content/content.routes';
import { CouponRoutes } from './app/coupon/coupon.routes';
import ReportsRoutes from './app/reports/reports.routes';
import { PermissionRoutes } from './app/permission/permission.routes';
import { CourierCredentialsRoutes, CourierOperationsRoutes, CourierOrderRoutes, CourierStatsRoutes } from './app/courier';


const app: Application = express();

app.use(express.json());
const allowedOrigins = ['http://localhost:3000'];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));

app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Test endpoint for courier selection (temporary - no auth required)
app.get('/api/v1/test/couriers', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: ['pathao', 'steadfast']
    });
});



//company setting
app.use('/api/v1/company-setting', CompanyRoutes);

//clients
app.use('/api/v1/clients', ClientsRoutes);

//admins
app.use('/api/v1/admins', AdminRoutes);

//user management
app.use('/api/v1/user-management', UserManagementRoutes);

//user settings (for users to manage their own profile)
app.use('/api/v1/user-settings', UserSettingsRoutes);

//content management
app.use('/api/v1/content', ContentRoutes);

//coupon management
app.use('/api/v1/coupons', CouponRoutes);

//reports management
app.use('/api/v1/reports', ReportsRoutes);

//permission management
app.use('/api/v1/permissions', PermissionRoutes);

//courier management
app.use('/api/v1/courier/credentials', CourierCredentialsRoutes);
app.use('/api/v1/courier/orders', CourierOrderRoutes);
app.use('/api/v1/courier/operations', CourierOperationsRoutes);
app.use('/api/v1/courier', CourierStatsRoutes);




//products
app.use('/api/v1/products', ProductRoutes);
app.use('/api/v1/category', CatagoryRoutes);
app.use('/api/v1/attributes', AttributeRoutes);


//order
app.use('/api/v1/order', OrderRoutes);
app.use('/api/v1/orders', OrdersRoutes);
app.use('/api/v1/shipping', ShippingAddressRoutes);
app.use('/api/v1/tracking', OrderTrackingRoutes);
app.use('/api/v1/analytics', OrderAnalyticsRoutes); 





export default app;
