import mongoose, { Schema } from 'mongoose';
import { TCatagory } from './catagory.interface';

const catagorySchema = new Schema<TCatagory>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Catagory',
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
);

catagorySchema.virtual('subCatagories', {
  ref: 'Catagory',
  localField: '_id',
  foreignField: 'parent',
});

export const CatagoryModel = mongoose.model<TCatagory>(
  'Catagory',
  catagorySchema,
);