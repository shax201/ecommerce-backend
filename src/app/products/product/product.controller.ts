import { Request, Response } from 'express';
import { ProductServices } from './product.service';
import { TProductPurchase, TProductQuery } from './product.interface';
import { ProductModel } from './product.model';
import { CouponService } from '../../coupon/coupon.service';

const dummyCategoryId = "66c1b4b5a1b2c3d4e5f6a7b8"
const dummyColorIds = [
  "66c1b4b5a1b2c3d4e5f6c111", // e.g., Blue
  "66c1b4b5a1b2c3d4e5f6c112", // e.g., Red
]
const dummySizeIds = [
  "66c1b4b5a1b2c3d4e5f6d221", // e.g., M
  "66c1b4b5a1b2c3d4e5f6d222", // e.g., L
]

export const products = [
  {
    id: 1,
    title: "Casual Cotton T-Shirt",
    description: "A comfortable cotton t-shirt perfect for everyday wear.",
    primaryImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    optionalImages: [
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&crop=center",
    ],
    regularPrice: 1200,
    discountPrice: 950,
    videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    catagory: [dummyCategoryId],
    color: dummyColorIds,
    size: dummySizeIds,
    productType: "top_selling",
  },
  {
    id: 2,
    title: "Slim Fit Jeans",
    description: "Stylish slim-fit jeans made with stretchable denim.",
    primaryImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2500,
    discountPrice: 1990,
    catagory: [dummyCategoryId],
    color: [dummyColorIds[0]], // Blue
    size: [dummySizeIds[0], dummySizeIds[1]], // M, L
    productType: "new_arrival",
  },
  {
    id: 3,
    title: "Classic White Shirt",
    description: "Elegant white dress shirt perfect for formal occasions.",
    primaryImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 1800,
    discountPrice: 1440,
    catagory: [dummyCategoryId],
    color: [dummyColorIds[0]],
    size: dummySizeIds,
    productType: "featured",
  },
  {
    id: 4,
    title: "Denim Jacket",
    description: "Classic denim jacket with a modern fit and vintage wash.",
    primaryImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 3500,
    discountPrice: 2800,
    catagory: [dummyCategoryId],
    color: [dummyColorIds[0]],
    size: dummySizeIds,
    productType: "new_arrival",
  },
  {
    id: 5,
    title: "Cargo Pants",
    description: "Comfortable cargo pants with multiple pockets for utility.",
    primaryImage: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2200,
    discountPrice: 1760,
    catagory: [dummyCategoryId],
    color: [dummyColorIds[1]],
    size: dummySizeIds,
    productType: "top_selling",
  },
  {
    id: 6,
    title: "Hoodie Sweatshirt",
    description: "Cozy hoodie sweatshirt perfect for casual wear.",
    primaryImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2800,
    discountPrice: 2240,
    catagory: [dummyCategoryId],
    color: dummyColorIds,
    size: dummySizeIds,
    productType: "featured",
  },
  {
    id: 7,
    title: "Chino Shorts",
    description: "Comfortable chino shorts ideal for summer wear.",
    primaryImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 1500,
    discountPrice: 1200,
    catagory: [dummyCategoryId],
    color: [dummyColorIds[0]],
    size: dummySizeIds,
    productType: "new_arrival",
  },
  {
    id: 8,
    title: "Polo Shirt",
    description: "Classic polo shirt with a comfortable fit and collar.",
    primaryImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 1600,
    discountPrice: 1280,
    catagory: [dummyCategoryId],
    color: dummyColorIds,
    size: dummySizeIds,
    productType: "top_selling",
  },
  {
    id: 9,
    title: "Track Pants",
    description: "Athletic track pants with side stripes and elastic waist.",
    primaryImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2000,
    discountPrice: 1600,
    catagory: [dummyCategoryId],
    color: [dummyColorIds[1]],
    size: dummySizeIds,
    productType: "featured",
  },
  {
    id: 10,
    title: "Flannel Shirt",
    description: "Warm flannel shirt with classic plaid pattern.",
    primaryImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 2400,
    discountPrice: 1920,
    catagory: [dummyCategoryId],
    color: [dummyColorIds[1]],
    size: dummySizeIds,
    productType: "new_arrival",
  },
  {
    id: 11,
    title: "Leather Jacket",
    description: "Premium leather jacket with a sleek modern design.",
    primaryImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 8000,
    discountPrice: 6400,
    catagory: [dummyCategoryId],
    color: [dummyColorIds[1]],
    size: dummySizeIds,
    productType: "featured",
  },
  {
    id: 12,
    title: "Sweatpants",
    description: "Comfortable sweatpants perfect for lounging and workouts.",
    primaryImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
    optionalImages: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&crop=center"],
    regularPrice: 1800,
    discountPrice: 1440,
    catagory: [dummyCategoryId],
    color: dummyColorIds,
    size: dummySizeIds,
    productType: "top_selling",
  },
]


const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      color,
      size,
      categories,
    } = req.query as Record<string, string | string[]>;

    const parseArray = (v?: string | string[]): string[] | undefined => {
      if (!v) return undefined;
      if (Array.isArray(v)) return v as string[];
      return v.split(',').map((s) => s.trim()).filter(Boolean);
    };

    const numeric = (v?: string) => (v !== undefined ? Number(v) : undefined);

    const query: TProductQuery = {
      page: numeric(page as string),
      limit: numeric(limit as string),
      sortBy: sortBy as TProductQuery['sortBy'],
      sortOrder: sortOrder as TProductQuery['sortOrder'],
      minPrice: numeric(minPrice as string),
      maxPrice: numeric(maxPrice as string),
      color: parseArray(color),
      size: parseArray(size),
      categories: parseArray(categories),
    };

    const result = await ProductServices.getProductsFromDB(query);

    const products = result.data.map((product: any) => ({
      ...product,
      id: product._id?.toString?.(),
      _id: undefined,
      // Ensure analytics field is included with default values if missing
      analytics: product.analytics || {
        views: 0,
        purchases: 0,
        wishlistCount: 0,
        averageRating: 0,
        totalReviews: 0
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      meta: result.meta,
      data: products,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};


const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProductServices.getSingleProductFromDB(id);
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    if (!Array.isArray(productData.catagory)) {
      return res.status(400).json({
        success: false,
        message: 'catagory must be an array of category IDs.',
      });
    }
    if (productData.color && !Array.isArray(productData.color)) {
      return res.status(400).json({
        success: false,
        message: 'color must be an array of color values or IDs.',
      });
    }
    if (productData.size && !Array.isArray(productData.size)) {
      return res.status(400).json({
        success: false,
        message: 'size must be an array of size values or IDs.',
      });
    }
    const result = await ProductServices.createProductIntoDB(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result,
    });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { name: string }).name === 'ValidationError'
    ) {
      const validationError = error as {
        errors: Record<string, { kind?: string }>;
      };
      if (
        validationError.errors &&
        validationError.errors.catagory &&
        validationError.errors.catagory.kind === 'ObjectId'
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID format.',
          error:
            'The provided category ID is not a valid MongoDB ObjectId. Please check the ID and try again.',
        });
      }
    }

    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { name: string }).name === 'MongoServerError' &&
      (error as { code: number }).code === 11000
    ) {
      const field = Object.keys(
        (error as { keyPattern: Record<string, unknown> }).keyPattern,
      )[0];
      const value = (error as { keyValue: Record<string, unknown> }).keyValue[
        field
      ];

      res.status(409).json({
        success: false,
        message: `A product with this ${field} already exists`,
        error: `Duplicate ${field}: ${value}. Please use a different ${field}.`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating product',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const seedProducts = async (req: Request, res: Response) => {
  try {
    const productsData = req.body;
    
    // Clear old data (optional)
    await ProductModel.deleteMany({});

    // Insert products from request body
    const items = await ProductModel.insertMany(productsData);

    console.log("✅ Products inserted:", items.length);
    
    res.status(200).json({
      success: true,
      message: `Successfully seeded ${items.length} products`,
      data: items
    });
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed products",
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let updateProductData = req.body;
    
    console.log('Update Product Request:', {
      id,
      body: updateProductData,
      colorType: typeof updateProductData.color,
      colorValue: updateProductData.color
    });
    
    // Parse color field if it's a stringified array
    if (updateProductData.color && typeof updateProductData.color === 'string') {
      try {
        updateProductData.color = JSON.parse(updateProductData.color);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid color data format. Expected array of color values or IDs.',
        });
      }
    }
    
    // Parse size field if it's a stringified array
    if (updateProductData.size && typeof updateProductData.size === 'string') {
      try {
        updateProductData.size = JSON.parse(updateProductData.size);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid size data format. Expected array of size values or IDs.',
        });
      }
    }
    
    // Parse category field if it's a stringified array
    if (updateProductData.catagory && typeof updateProductData.catagory === 'string') {
      try {
        updateProductData.catagory = JSON.parse(updateProductData.catagory);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category data format. Expected array of category IDs.',
        });
      }
    }
    
    // Validate arrays after parsing
    if (updateProductData.catagory && !Array.isArray(updateProductData.catagory)) {
      return res.status(400).json({
        success: false,
        message: 'catagory must be an array of category IDs.',
      });
    }
    if (updateProductData.color && !Array.isArray(updateProductData.color)) {
      return res.status(400).json({
        success: false,
        message: 'color must be an array of color values or IDs.',
      });
    }
    if (updateProductData.size && !Array.isArray(updateProductData.size)) {
      return res.status(400).json({
        success: false,
        message: 'size must be an array of size values or IDs.',
      });
    }
    
    console.log('Parsed Update Data:', {
      color: updateProductData.color,
      size: updateProductData.size,
      catagory: updateProductData.catagory
    });
    
    const result = await ProductServices.updateProductIntoDB(
      id,
      updateProductData,
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { name: string }).name === 'MongoServerError' &&
      (error as { code: number }).code === 11000
    ) {
      const field = Object.keys(
        (error as { keyPattern: Record<string, unknown> }).keyPattern,
      )[0];
      const value = (error as { keyValue: Record<string, unknown> }).keyValue[
        field
      ];

      res.status(409).json({
        success: false,
        message: `A product with this ${field} already exists`,
        error: `Duplicate ${field}: ${value}. Please use a different ${field}.`,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong while updating product',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProductServices.deleteProductFromDB(id);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting product',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const result = await ProductServices.getProductsByCategoryFromDB(categoryId);

    if (result && result.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully for the category',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'No products found for this category',
        data: [],
      });
    }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      (error as { name: string }).name === 'CastError'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format.',
        error: `The provided category ID '${req.params.categoryId}' is not a valid MongoDB ObjectId.`,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching products by category',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};


const purchaseProduct = async (req: Request, res: Response) => {
  try {
    const productData: TProductPurchase = req.body;
    console.log('productData', productData)
    // Ensure clientID is provided
    if (!productData.user) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required to purchase a product.',
      });
    }
    if(!productData.productID || !Array.isArray(productData.productID)) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required and must be an array of product IDs.'
      });
    }
    
    if (!productData.shipping || typeof productData.shipping !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required and must be an object.'
      });
    }

    // Handle coupon validation and application if coupon code is provided
    let couponData = null;
    if (productData.couponCode) {
      try {
        // Get product details to calculate order value and get category IDs
        const products = await ProductModel.find({ _id: { $in: productData.productID } })
          .populate('catagory', '_id');
        
        const orderValue = products.reduce((sum, product) => {
          return sum + (product.discountPrice || product.regularPrice);
        }, 0);

        const categoryIds = products.flatMap(product => 
          product.catagory.map(cat => cat._id.toString())
        );

        // Validate and apply coupon
        couponData = await CouponService.applyCoupon({
          code: productData.couponCode,
          orderValue,
          userId: productData.user,
          productIds: productData.productID,
          categoryIds
        });

        // Update the total price with discount
        productData.totalPrice = couponData.finalAmount;
        productData.originalPrice = orderValue;
        productData.discountAmount = couponData.discountAmount;
      } catch (couponError) {
        return res.status(400).json({
          success: false,
          message: 'Coupon validation failed',
          error: couponError instanceof Error ? couponError.message : 'Invalid coupon',
        });
      }
    }

    const result = await ProductServices.purchaseProduct(productData, couponData);

    res.status(201).json({
      success: true,
      message: 'Order and shipping address created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order and shipping address',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

const getTopSellingProducts = async (req: Request, res: Response) => {

  const result = await ProductServices.getTopSellingProductsFromDB();

  res.status(200).json({
    success: true,
    message: 'Top selling products fetched successfully',
    data: result,
  });
};

const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { couponCode, productIds, userId } = req.body;

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required',
      });
    }

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs are required and must be an array',
      });
    }

        // Get product details to calculate order value and get category IDs
        const products = await ProductModel.find({ _id: { $in: productIds } })
          .populate('catagory', '_id');
    
    const orderValue = products.reduce((sum, product) => {
      return sum + (product.discountPrice || product.regularPrice);
    }, 0);

    const categoryIds = products.flatMap(product => 
      product.catagory.map(cat => cat._id.toString())
    );

    // Validate coupon
    const validation = await CouponService.validateCoupon({
      code: couponCode,
      orderValue,
      userId,
      productIds,
      categoryIds
    });

    res.status(200).json({
      success: true,
      message: 'Coupon validation successful',
      data: validation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Coupon validation failed',
      error: error instanceof Error ? error.message : 'Invalid coupon',
    });
  }
};


export const ProductControllers = {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  purchaseProduct,
  seedProducts,
  getTopSellingProducts,
  validateCoupon
};