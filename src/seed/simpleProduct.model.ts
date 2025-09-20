import mongoose, { Schema } from 'mongoose';

// Simple product schema for seeding without variants
const simpleProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  primaryImage: { type: String, required: true },
  optionalImages: [{ type: String }],
  regularPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  costPrice: { type: Number },
  videoLink: { type: String },
  catagory: [{ type: Schema.Types.ObjectId }],
  color: [{ type: Schema.Types.ObjectId }],
  size: [{ type: Schema.Types.ObjectId }],
  sku: { type: String, required: true, unique: true },
  barcode: { type: String, unique: true, sparse: true },
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, enum: ['cm', 'in'], default: 'cm' },
  },
  inventory: {
    totalStock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },
    availableStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    trackInventory: { type: Boolean, default: true },
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'draft', 'archived'], 
    default: 'active' 
  },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  productType: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'simple_products' // Use simple_products to avoid variants.sku index conflicts
});

// Virtual for discount percentage
simpleProductSchema.virtual('discountPercentage').get(function() {
  if (this.regularPrice > 0) {
    return Math.round(((this.regularPrice - this.discountPrice) / this.regularPrice) * 100);
  }
  return 0;
});

// Virtual for stock status
simpleProductSchema.virtual('stockStatus').get(function() {
  if (!this.inventory.trackInventory) return 'unlimited';
  if (this.inventory.availableStock === 0) return 'out_of_stock';
  if (this.inventory.availableStock <= this.inventory.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Indexes for better performance
simpleProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
simpleProductSchema.index({ status: 1 });
simpleProductSchema.index({ featured: 1 });
simpleProductSchema.index({ regularPrice: 1 });
simpleProductSchema.index({ discountPrice: 1 });
simpleProductSchema.index({ createdAt: -1 });

// Pre-save middleware to update available stock
simpleProductSchema.pre('save', function(next) {
  this.inventory.availableStock = Math.max(0, this.inventory.totalStock - this.inventory.reservedStock);
  this.updatedAt = new Date();
  next();
});

export const SimpleProductModel = mongoose.model('SimpleProduct', simpleProductSchema);
