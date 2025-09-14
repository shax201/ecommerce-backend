import mongoose, { Schema } from 'mongoose';

export interface TProductWishlist {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  addedAt: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}

const productWishlistSchema = new Schema<TProductWishlist>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  addedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time since added
productWishlistSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInMs = now.getTime() - this.addedAt.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
});

// Compound indexes for better performance
productWishlistSchema.index({ userId: 1, productId: 1 }, { unique: true }); // One wishlist entry per user per product
productWishlistSchema.index({ userId: 1, isActive: 1, addedAt: -1 });
productWishlistSchema.index({ productId: 1, isActive: 1 });
productWishlistSchema.index({ priority: 1, isActive: 1 });
productWishlistSchema.index({ addedAt: -1 });

export const ProductWishlistModel = mongoose.model<TProductWishlist>('ProductWishlist', productWishlistSchema);
