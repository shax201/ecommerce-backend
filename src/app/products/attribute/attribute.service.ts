import { TColor, TSize, TColorPayload, TSizePayload } from './attribute.interface';
import { ColorModel, SizeModel } from './attribute.model';

// Color operations
const getColorsFromDB = async () => {
  const result = await ColorModel.find({});
  return result;
};

const getSingleColorFromDB = async (id: string) => {
  const result = await ColorModel.findById(id);
  return result;
};

const createColorIntoDB = async (payload: TColorPayload) => {
  const { color, colors } = payload;

  // Handle single color
  if (color && !colors) {
    const existingColor = await ColorModel.findOne({ color });
    if (existingColor) {
      throw new Error('Color with this value already exists.');
    }
    const result = await ColorModel.create({ color });
    return [result]; // Return as array for consistency
  }

  // Handle multiple colors
  if (colors && !color) {
    if (!Array.isArray(colors) || colors.length === 0) {
      throw new Error('Colors array is required and must not be empty.');
    }

    // Check for existing colors to avoid duplicates
    const existingColors = await ColorModel.find({
      color: { $in: colors }
    });

    if (existingColors.length > 0) {
      const existingColorValues = existingColors.map(c => c.color);
      throw new Error(`Colors already exist: ${existingColorValues.join(', ')}`);
    }

    // Create all colors
    const colorDocuments = colors.map(colorValue => ({ color: colorValue }));
    const result = await ColorModel.insertMany(colorDocuments);
    return result;
  }

  // Handle both single and multiple (prioritize single)
  if (color && colors) {
    const allColors = [color, ...colors];
    const uniqueColors = [...new Set(allColors)]; // Remove duplicates

    // Check for existing colors
    const existingColors = await ColorModel.find({
      color: { $in: uniqueColors }
    });

    if (existingColors.length > 0) {
      const existingColorValues = existingColors.map(c => c.color);
      throw new Error(`Colors already exist: ${existingColorValues.join(', ')}`);
    }

    // Create all colors
    const colorDocuments = uniqueColors.map(colorValue => ({ color: colorValue }));
    const result = await ColorModel.insertMany(colorDocuments);
    return result;
  }

  throw new Error('Either color or colors must be provided.');
};

const updateColorIntoDB = async (id: string, payload: Partial<TColor>) => {
  const result = await ColorModel.findByIdAndUpdate(
    id,
    { ...payload, updatedAt: new Date() },
    { new: true },
  );

  if (!result) {
    throw new Error('No color document found with that ID.');
  }

  return result;
};

const deleteColorFromDB = async (id: string) => {
  const result = await ColorModel.findByIdAndDelete(id);
  return result;
};

// Size operations
const getSizesFromDB = async () => {
  const result = await SizeModel.find({});
  return result;
};

const getSingleSizeFromDB = async (id: string) => {
  const result = await SizeModel.findById(id);
  return result;
};

const createSizeIntoDB = async (payload: TSizePayload) => {
  const { size, sizes } = payload;

  // Handle single size
  if (size && !sizes) {
    const existingSize = await SizeModel.findOne({ size });
    if (existingSize) {
      throw new Error('Size with this value already exists.');
    }
    const result = await SizeModel.create({ size });
    return [result]; // Return as array for consistency
  }

  // Handle multiple sizes
  if (sizes && !size) {
    if (!Array.isArray(sizes) || sizes.length === 0) {
      throw new Error('Sizes array is required and must not be empty.');
    }

    // Check for existing sizes to avoid duplicates
    const existingSizes = await SizeModel.find({
      size: { $in: sizes }
    });

    if (existingSizes.length > 0) {
      const existingSizeValues = existingSizes.map(s => s.size);
      throw new Error(`Sizes already exist: ${existingSizeValues.join(', ')}`);
    }

    // Create all sizes
    const sizeDocuments = sizes.map(sizeValue => ({ size: sizeValue }));
    const result = await SizeModel.insertMany(sizeDocuments);
    return result;
  }

  // Handle both single and multiple (prioritize single)
  if (size && sizes) {
    const allSizes = [size, ...sizes];
    const uniqueSizes = [...new Set(allSizes)]; // Remove duplicates

    // Check for existing sizes
    const existingSizes = await SizeModel.find({
      size: { $in: uniqueSizes }
    });

    if (existingSizes.length > 0) {
      const existingSizeValues = existingSizes.map(s => s.size);
      throw new Error(`Sizes already exist: ${existingSizeValues.join(', ')}`);
    }

    // Create all sizes
    const sizeDocuments = uniqueSizes.map(sizeValue => ({ size: sizeValue }));
    const result = await SizeModel.insertMany(sizeDocuments);
    return result;
  }

  throw new Error('Either size or sizes must be provided.');
};

const updateSizeIntoDB = async (id: string, payload: Partial<TSize>) => {
  const result = await SizeModel.findByIdAndUpdate(
    id,
    { ...payload, updatedAt: new Date() },
    { new: true },
  );

  if (!result) {
    throw new Error('No size document found with that ID.');
  }

  return result;
};

const deleteSizeFromDB = async (id: string) => {
  const result = await SizeModel.findByIdAndDelete(id);
  return result;
};

export const ColorServices = {
  createColorIntoDB,
  getColorsFromDB,
  getSingleColorFromDB,
  updateColorIntoDB,
  deleteColorFromDB,
};

export const SizeServices = {
  createSizeIntoDB,
  getSizesFromDB,
  getSingleSizeFromDB,
  updateSizeIntoDB,
  deleteSizeFromDB,
};
