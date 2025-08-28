import mongoose, { Schema } from 'mongoose';
import { TColor, TSize } from './attribute.interface';

const colorSchema = new Schema<TColor>({
  color: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const sizeSchema = new Schema<TSize>({
  size: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ColorModel = mongoose.model<TColor>('Color', colorSchema);
export const SizeModel = mongoose.model<TSize>('Size', sizeSchema);