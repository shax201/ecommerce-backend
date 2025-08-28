import mongoose, { Schema } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  primaryImage: { type: String, required: true },
  optionalImages: { type: [String] },
  regularPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  videoLink: { type: String },
  catagory: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Catagory',
  },
  color: [{ type: Schema.Types.ObjectId, ref: 'Color', required: true }],
  size: [{ type: Schema.Types.ObjectId, ref: 'Size', required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ProductModel = mongoose.model<TProduct>('Product', productSchema);