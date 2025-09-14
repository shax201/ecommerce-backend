import mongoose, { Schema } from 'mongoose';

export interface TProductReview {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: {
    response: string;
    respondedBy: mongoose.Types.ObjectId;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const productReviewSchema = new Schema<TProductReview>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true,
    maxlength: 100
  },
  userEmail: {
    type: String,
    required: true,
    maxlength: 255
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  comment: {
    type: String,
    required: true,
    maxlength: 2000
  },
  images: [{
    type: String,
    maxlength: 500
  }],
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },
  notHelpful: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  adminResponse: {
    response: {
      type: String,
      maxlength: 1000
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    },
    respondedAt: {
      type: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for helpful percentage
productReviewSchema.virtual('helpfulPercentage').get(function() {
  const total = this.helpful + this.notHelpful;
  if (total === 0) return 0;
  return Math.round((this.helpful / total) * 100);
});

// Virtual for time since review
productReviewSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInMs = now.getTime() - this.createdAt.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
});

// Indexes for better performance
productReviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
productReviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // One review per user per product
productReviewSchema.index({ rating: 1, status: 1 });
productReviewSchema.index({ verified: 1, status: 1 });
productReviewSchema.index({ helpful: -1 });
productReviewSchema.index({ createdAt: -1 });

// Pre-save middleware to update updatedAt
productReviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const ProductReviewModel = mongoose.model<TProductReview>('ProductReview', productReviewSchema);
