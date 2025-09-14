import { TProduct, TProductPurchase, TProductQuery } from './product.interface';
import { ProductModel } from './product.model';
import { ColorModel, SizeModel } from '../attribute/attribute.model';
import { CatagoryModel } from '../catagory/catagory.model';
import { Types, PipelineStage } from 'mongoose';
import { OrderServices } from '../../order/orderHistory/orderHistory.service';
import { ShippingAddressServices } from '../../order/shipping/shippingAdress.service';
import OrderHistoryModel from '../../order/orderHistory/orderHistory.model';

// Helper function to transform product data to include variants
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformProductData = (product: any) => {
  const base: Record<string, any> =
    product && typeof product.toObject === 'function' ? product.toObject() : { ...product };

  const transformed: Record<string, any> = {
    ...base,
    variants: {
      color:
        (base.color as Array<{ color: string; name?: string; code?: string }> | undefined)?.map(
          (c) => ({ name: c.name ?? c.color, code: c.code ?? c.color }),
        ) || [],
      size: (base.size as Array<{ size: string }> | undefined)?.map((s) => s.size) || [],
    },
  };



  // Remove the original color and size fields
  delete transformed.color;
  delete transformed.size;

  return transformed;
};

const getProductsFromDB = async (query: TProductQuery = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    minPrice,
    maxPrice,
    color,
    size,
    categories,
  } = query;

  const match: Record<string, unknown> = {};

  // Price range (use discountPrice as effective price)
  if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
    const priceCond: Record<string, number> = {};
    if (typeof minPrice === 'number') priceCond.$gte = minPrice;
    if (typeof maxPrice === 'number') priceCond.$lte = maxPrice;
    match.discountPrice = priceCond;
  }

  // Categories filter
  if (categories && categories.length > 0) {
    match.catagory = { $in: categories };
  }


  // Colors filter: accept ObjectId strings or color codes
  if (color && color.length > 0) {
    const colorObjectIds: Types.ObjectId[] = [];
    const colorCodes: string[] = [];
    for (const c of color) {
      if (Types.ObjectId.isValid(c)) {
        colorObjectIds.push(new Types.ObjectId(c));
      } else {
        colorCodes.push(c);
      }
    }
    if (colorCodes.length > 0) {
      const colorDocs = await ColorModel.find({ color: { $in: colorCodes } }).select('_id');
      for (const doc of colorDocs) {
        colorObjectIds.push(doc._id as Types.ObjectId);
      }
    }
    if (colorObjectIds.length > 0) {
      match.color = { $in: colorObjectIds };
    }
  }

  // Sizes filter: accept ObjectId strings or size values
  if (size && size.length > 0) {
    const sizeObjectIds: Types.ObjectId[] = [];
    const sizeValues: string[] = [];
    for (const s of size) {
      if (Types.ObjectId.isValid(s)) {
        sizeObjectIds.push(new Types.ObjectId(s));
      } else {
        sizeValues.push(s);
      }
    }
    if (sizeValues.length > 0) {
      const sizeDocs = await SizeModel.find({ size: { $in: sizeValues } }).select('_id');
      for (const doc of sizeDocs) {
        sizeObjectIds.push(doc._id as Types.ObjectId);
      }
    }
    if (sizeObjectIds.length > 0) {
      match.size = { $in: sizeObjectIds };
    }
  }

  const sort: Record<string, 1 | -1> = {};
  if (sortBy === 'price') {
    sort.discountPrice = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'updatedAt') {
    sort.updatedAt = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = sortOrder === 'asc' ? 1 : -1;
  }

  const numericLimit = Math.max(1, Math.min(100, limit));
  const numericPage = Math.max(1, page);
  const skip = (numericPage - 1) * numericLimit;

  const [total, docs] = await Promise.all([
    ProductModel.countDocuments(match),
    ProductModel.find(match)
      .sort(sort)
      .skip(skip)
      .limit(numericLimit)
      .populate({
        path: 'catagory',
        model: 'Catagory',
        populate: {
          path: 'parent',
          model: 'Catagory',
        },
      })
      .populate({ path: 'color', model: 'Color', select: 'color -_id' })
      .populate({ path: 'size', model: 'Size', select: 'size -_id' }),
  ]);

  const items = docs.map(transformProductData);
  const totalPages = Math.max(1, Math.ceil(total / numericLimit));

  return {
    meta: {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages,
    },
    data: items,
  };
};

const createProductIntoDB = async (payload: TProduct) => {
  const existingProduct = await ProductModel.findOne({ title: payload.title });

  if (existingProduct) {
    throw new Error('Product with this title already exists.');
  }

  // Ensure catagory is an array
  if (!Array.isArray(payload.catagory)) {
    throw new Error('catagory must be an array of category IDs.');
  }

  // Handle color
  let colorIds: (Types.ObjectId)[] = [];
  if (payload.color && Array.isArray(payload.color)) {
    colorIds = await Promise.all(
      payload.color.map(async (color: string | Types.ObjectId) => {
        if (typeof color === 'string') {
          // Try to find existing color by value
          let colorDoc = await ColorModel.findOne({ color });
          if (!colorDoc) {
            colorDoc = await ColorModel.create({ color });
          }
          return colorDoc._id as Types.ObjectId;
        } else {
          // Assume it's an ObjectId
          return color;
        }
      })
    );
  }

  // Handle size
  let sizeIds: (Types.ObjectId)[] = [];
  if (payload.size && Array.isArray(payload.size)) {
    sizeIds = await Promise.all(
      payload.size.map(async (size: string | Types.ObjectId) => {
        if (typeof size === 'string') {
          let sizeDoc = await SizeModel.findOne({ size });
          if (!sizeDoc) {
            sizeDoc = await SizeModel.create({ size });
          }
          return sizeDoc._id as Types.ObjectId;
        } else {
          return size;
        }
      })
    );
  }

  const result = await ProductModel.create({
    ...payload,
    color: colorIds,
    size: sizeIds,
  });
  
  // Populate the created product and transform it
  const populatedResult = await ProductModel.findById(result._id)
    .populate({ path: 'color', model: 'Color', select: 'color -_id' })
    .populate({ path: 'size', model: 'Size', select: 'size -_id' })
    .populate({
      path: 'catagory',
      model: 'Catagory',
      populate: {
        path: 'parent',
        model: 'Catagory',
      },
    });
  
  return transformProductData(populatedResult);
};

const getSingleProductFromDB = async (id: string) => {
  const result = await ProductModel.findById(id)
    .populate({
      path: 'catagory',
      model: 'Catagory',
      populate: {
        path: 'parent',
        model: 'Catagory',
      },
    })
    .populate({ path: 'color', model: 'Color', select: 'color -_id' })
    .populate({ path: 'size', model: 'Size', select: 'size -_id' });
  
  return result ? transformProductData(result) : null;
};

const updateProductIntoDB = async (id: string, payload: Partial<TProduct>) => {
  if (payload.catagory && !Array.isArray(payload.catagory)) {
    throw new Error('catagory must be an array of category IDs.');
  }

  // Handle color
  let colorIds: Types.ObjectId[] | undefined = undefined;
  if (payload.color && Array.isArray(payload.color)) {
    colorIds = await Promise.all(
      payload.color.map(async (color: string | Types.ObjectId) => {
        if (typeof color === 'string') {
          let colorDoc = await ColorModel.findOne({ color });
          if (!colorDoc) {
            colorDoc = await ColorModel.create({ color });
          }
          return colorDoc._id as Types.ObjectId;
        } else {
          return color;
        }
      })
    );
  }

  // Handle size
  let sizeIds: Types.ObjectId[] | undefined = undefined;
  if (payload.size && Array.isArray(payload.size)) {
    sizeIds = await Promise.all(
      payload.size.map(async (size: string | Types.ObjectId) => {
        if (typeof size === 'string') {
          let sizeDoc = await SizeModel.findOne({ size });
          if (!sizeDoc) {
            sizeDoc = await SizeModel.create({ size });
          }
          return sizeDoc._id as Types.ObjectId;
        } else {
          return size;
        }
      })
    );
  }

  const updatePayload = {
    ...payload,
    updatedAt: new Date(),
    ...(colorIds !== undefined ? { color: colorIds } : {}),
    ...(sizeIds !== undefined ? { size: sizeIds } : {}),
  };

  const result = await ProductModel.findByIdAndUpdate(
    id,
    updatePayload,
    { new: true },
  )
    .populate({
      path: 'catagory',
      model: 'Catagory',
      populate: {
        path: 'parent',
        model: 'Catagory',
      },
    })
    .populate({ path: 'color', model: 'Color', select: 'color -_id' })
    .populate({ path: 'size', model: 'Size', select: 'size -_id' });

  if (!result) {
    throw new Error('Product not found.');
  }

  return transformProductData(result);
};

const deleteProductFromDB = async (id: string) => {
  const result = await ProductModel.findByIdAndDelete(id);
  return result;
};

// Helper function to recursively get all sub-category IDs
const getAllSubCategoryIds = async (categoryId: string): Promise<string[]> => {
  const subCategories = await CatagoryModel.find({ parent: categoryId }).select(
    '_id',
  );
  const subCategoryIds = subCategories.map((c) => c._id.toString());

  let descendantIds: string[] = [...subCategoryIds];

  for (const subId of subCategoryIds) {
    const ids = await getAllSubCategoryIds(subId);
    descendantIds = [...descendantIds, ...ids];
  }

  return descendantIds;
};

const getProductsByCategoryFromDB = async (categoryId: string) => {
  // Find all descendant sub-categories for the given categoryId
  const allDescendantIds = await getAllSubCategoryIds(categoryId);

  // Create an array of IDs including the parent category and all sub-categories
  const allCategoryIds = [categoryId, ...allDescendantIds];

  const result = await ProductModel.find({
    catagory: { $in: allCategoryIds },
  })
    .populate({
      path: 'catagory',
      model: 'Catagory',
      populate: {
        path: 'parent',
        model: 'Catagory',
      },
    })
    .populate({ path: 'color', model: 'Color', select: 'color -_id' })
    .populate({ path: 'size', model: 'Size', select: 'size -_id' });
  
  return result.map(transformProductData);
};


const purchaseProduct = async (payload: TProductPurchase) => {
  const productData:any = payload;

  // Generate a 7-digit order number
  const orderNumber = Math.floor(1000000 + Math.random() * 9000000).toString();

  let shippingAddress:any;

  if(!productData.shipping._id){
    shippingAddress = await ShippingAddressServices.createShippingAddress(productData.shipping);
  }else{
    shippingAddress = await ShippingAddressServices.updateShippingAddress(productData.shipping._id, productData.shipping);
  }
    const orderHistoryData = {
      ...productData,
      orderNumber,
      shipping: shippingAddress._id,
      productID: productData.productID.map((id:string) => new Types.ObjectId(id)),
      clientID: new Types.ObjectId(productData.user),
    };
  
    const orderHistory = await OrderServices.createOrderHistory(orderHistoryData);
    return orderHistory;
};

const getTopSellingProductsFromDB = async () => {
  // First try to get products from actual sales data
  const pipeline: PipelineStage[] = [
    // Unwind the productID array to get individual product entries
    { $unwind: '$productID' },
    // Group by product ID and count sales
    {
      $group: {
        _id: '$productID',
        salesCount: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        lastSold: { $max: '$createdAt' }
      }
    },
    // Sort by sales count descending
    { $sort: { salesCount: -1 } },
    // Limit to top 10 products
    { $limit: 10 },
    // Lookup product details
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    // Unwind product details
    { $unwind: '$productDetails' },
    // Lookup categories
    {
      $lookup: {
        from: 'catagories',
        localField: 'productDetails.catagory',
        foreignField: '_id',
        as: 'categories'
      }
    },
    // Lookup colors
    {
      $lookup: {
        from: 'colors',
        localField: 'productDetails.color',
        foreignField: '_id',
        as: 'colors'
      }
    },
    // Lookup sizes
    {
      $lookup: {
        from: 'sizes',
        localField: 'productDetails.size',
        foreignField: '_id',
        as: 'sizes'
      }
    },
    // Project the final shape
    {
      $project: {
        _id: '$productDetails._id',
        title: '$productDetails.title',
        description: '$productDetails.description',
        primaryImage: '$productDetails.primaryImage',
        optionalImages: '$productDetails.optionalImages',
        regularPrice: '$productDetails.regularPrice',
        discountPrice: '$productDetails.discountPrice',
        videoLink: '$productDetails.videoLink',
        catagory: '$categories',
        color: '$colors',
        size: '$sizes',
        salesCount: 1,
        totalRevenue: 1,
        lastSold: 1,
        createdAt: '$productDetails.createdAt',
        updatedAt: '$productDetails.updatedAt'
      }
    }
  ];

  const salesData = await OrderHistoryModel.aggregate(pipeline);

  // If we have sales data, return it
  if (salesData && salesData.length > 0) {
    return salesData.map((item: any) => {
      const base = { ...item };
      const transformed: Record<string, any> = {
        ...base,
        variants: {
          color: (base.color || []).map((c: any) => ({ name: c.color ?? c.name ?? '', code: c.code ?? c.color ?? '' })),
          size: (base.size || []).map((s: any) => s.size ?? '')
        }
      };

      // Remove the original color and size fields
      delete transformed.color;
      delete transformed.size;

      return transformed;
    });
  }

  // Fallback: Get products marked as "top_selling" from the productType field
  const fallbackProducts = await ProductModel.find({ productType: 'top_selling' })
    .populate({
      path: 'catagory',
      model: 'Catagory',
      populate: {
        path: 'parent',
        model: 'Catagory',
      },
    })
    .populate({ path: 'color', model: 'Color', select: 'color -_id' })
    .populate({ path: 'size', model: 'Size', select: 'size -_id' })
    .limit(10);

  return fallbackProducts.map(transformProductData);
};

export const ProductServices = {
  createProductIntoDB,
  getProductsFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
  getProductsByCategoryFromDB,
  purchaseProduct,
  getTopSellingProductsFromDB
};