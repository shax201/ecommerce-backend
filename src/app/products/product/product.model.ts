import mongoose, { Schema } from 'mongoose';
import { TProduct } from './product.interface';

const productVariantSchema = new Schema({
  sku: { type: String, required: false }, // Make sku optional to avoid unique constraint issues
  color: { type: Schema.Types.ObjectId, ref: 'Color', required: true },
  size: { type: Schema.Types.ObjectId, ref: 'Size', required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { _id: false });

const productSEOSchema = new Schema({
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  metaKeywords: [{ type: String }],
  slug: { type: String, required: true, unique: true },
  canonicalUrl: { type: String },
}, { _id: false });

const productAnalyticsSchema = new Schema({
  views: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  lastViewed: { type: Date },
  lastPurchased: { type: Date },
}, { _id: false });

const productSchema = new Schema<TProduct>({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 500 },
  primaryImage: { type: String, required: true },
  optionalImages: [{ type: String }],
  regularPrice: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, min: 0 },
  videoLink: { type: String },
  catagory: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Catagory',
  },
  color: [{ type: Schema.Types.ObjectId, ref: 'Color', required: true }],
  size: [{ type: Schema.Types.ObjectId, ref: 'Size', required: true }],
  // variants: [productVariantSchema], // Temporarily disabled due to unique constraint issues
  sku: { type: String, required: true, unique: true },
  barcode: { type: String, unique: true, sparse: true },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    unit: { type: String, enum: ['cm', 'in'], default: 'cm' },
  },
  inventory: {
    totalStock: { type: Number, required: true, min: 0, default: 0 },
    reservedStock: { type: Number, min: 0, default: 0 },
    availableStock: { type: Number, min: 0, default: 0 },
    lowStockThreshold: { type: Number, min: 0, default: 10 },
    trackInventory: { type: Boolean, default: true },
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'draft', 'archived'], 
    default: 'active' 
  },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  seo: productSEOSchema,
  analytics: productAnalyticsSchema,
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.regularPrice > 0) {
    return Math.round(((this.regularPrice - this.discountPrice) / this.regularPrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (!this.inventory.trackInventory) return 'unlimited';
  if (this.inventory.availableStock === 0) return 'out_of_stock';
  if (this.inventory.availableStock <= this.inventory.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Indexes for better performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
// sku, barcode, and seo.slug indexes are automatically created by unique: true
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'analytics.views': -1 });
productSchema.index({ 'analytics.purchases': -1 });
productSchema.index({ 'analytics.averageRating': -1 });
productSchema.index({ regularPrice: 1 });
productSchema.index({ discountPrice: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to update available stock
productSchema.pre('save', function(next) {
  this.inventory.availableStock = Math.max(0, this.inventory.totalStock - this.inventory.reservedStock);
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to generate slug if not provided
productSchema.pre('save', function(next) {
  if (!this.seo?.slug && this.title) {
    if (!this.seo) {
      this.seo = {
        slug: this.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      };
    } else {
      this.seo.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }
  next();
});

export const ProductModel = mongoose.model<TProduct>('Product', productSchema);