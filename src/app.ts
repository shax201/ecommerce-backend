import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { CatagoryRoutes } from './app/products/catagory/catagory.routes';
import { AttributeRoutes } from './app/products/attribute/attribute.routes';
import { ProductRoutes } from './app/products/product/product.routes';
import { OrderRoutes } from './app/order/orderHistory/orderHistory.route';
import { ShippingAddressRoutes } from './app/order/shipping/shippingAdress.route';
import { ClientsRoutes } from './app/user/client/client.route';
import { AdminRoutes } from './app/user/admin/admin.route';
import { CompanyRoutes } from './app/companySetting/companySettings.routes';
import { ContentRoutes } from './app/content/content.routes';

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



//company setting
app.use('/api/v1/company-setting', CompanyRoutes);

//clients
app.use('/api/v1/clients', ClientsRoutes);

//admins
app.use('/api/v1/admins', AdminRoutes);

//content management
app.use('/api/v1/content', ContentRoutes); 



//products
app.use('/api/v1/products', ProductRoutes);
app.use('/api/v1/category', CatagoryRoutes);
app.use('/api/v1/attributes', AttributeRoutes);


//order
app.use('/api/v1/order', OrderRoutes);
app.use('/api/v1/shipping', ShippingAddressRoutes); 





export default app;
