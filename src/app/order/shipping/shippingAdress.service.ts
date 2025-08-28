import { TShippingAddress } from "./shippingAddress.interface";
import ShippingAddressModel from "./shippingAdress.model";

const createShippingAddress = async (shippingData: TShippingAddress) => {

    if(shippingData.isDefault){
     await ShippingAddressModel.updateMany({}, { isDefault: false });
    };

    const shippingAddress = await ShippingAddressModel.create(shippingData);
    return shippingAddress;
};

const getShippingAddress = async () => {
    const shippingAddress = await ShippingAddressModel.find();
    return shippingAddress;
};

const getShippingAddressById = async (id: string) => {
    const shippingAddress = await ShippingAddressModel.findById(id);
    return shippingAddress;
};

const updateShippingAddress = async (
  id: string,
  updatedData: Partial<TShippingAddress>
) => {
  const updatedAddress = await ShippingAddressModel.findByIdAndUpdate(
    id,
    updatedData,
    { new: true, runValidators: true }
  );
  return updatedAddress;
};

const setDefaultShippingAddress = async (id: string) => {

  await ShippingAddressModel.updateMany({}, { isDefault: false });

  const updatedAddress = await ShippingAddressModel.findByIdAndUpdate(
    id,
    { isDefault: true },
    { new: true }
  );

  return updatedAddress;
};

const deleteShippingAddress = async (id: string) => {
  const deletedAddress = await ShippingAddressModel.findByIdAndDelete(id);
  return deletedAddress;
};




export const ShippingAddressServices = {
    createShippingAddress,
    getShippingAddress,
    getShippingAddressById,
    updateShippingAddress,
    setDefaultShippingAddress,
    deleteShippingAddress
};