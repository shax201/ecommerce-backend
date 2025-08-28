import { TCatagory } from './catagory.interface';
import { CatagoryModel } from './catagory.model';

const getCatagoryFromDB = async () => {
  // Return all categories as a flat list without population
  const result = await CatagoryModel.find({});
  return result;
};

const getSingleCatagoryFromDB = async (id: string) => {
  // Return single category without population
  const result = await CatagoryModel.findById(id);
  return result;
};

const createCatagoryIntoDB = async (payload: TCatagory) => {
  // Check if a catagory with the same unique fields as payload already exists
  // Adjust the filter fields as per your schema's unique constraints
  const existingCatagory = await CatagoryModel.findOne({
    title: payload.title,
  });

  if (existingCatagory) {
    throw new Error('Catagory with this title already exists.');
  }

  // If no such catagory exists, create new
  const result = await CatagoryModel.create(payload);
  return result;
};

const updateCatagoryIntoDB = async (
  id: string,
  payload: Partial<TCatagory>,
) => {
  const result = await CatagoryModel.findByIdAndUpdate(
    id,
    { ...payload, updatedAt: new Date() },
    { new: true },
  );

  // If no document exists, throw an error
  if (!result) {
    throw new Error('No catagory document found with that ID.');
  }

  return result;
};

const deleteCatagoryFromDB = async (id: string) => {
  // Check if the category has any sub-categories
  const subCatagories = await CatagoryModel.find({ parent: id });
  if (subCatagories.length > 0) {
    throw new Error('Cannot delete a category that has sub-categories.');
  }

  const result = await CatagoryModel.findByIdAndDelete(id);
  return result;
};

export const CatagoryServices = {
  createCatagoryIntoDB,
  getCatagoryFromDB,
  getSingleCatagoryFromDB,
  updateCatagoryIntoDB,
  deleteCatagoryFromDB,
};
