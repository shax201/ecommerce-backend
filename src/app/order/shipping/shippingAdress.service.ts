import { TShippingAddress } from "./shippingAddress.interface";
import ShippingAddressModel from "./shippingAdress.model";

const createShippingAddress = async (shippingData: TShippingAddress) => {
    if(shippingData.isDefault){
        await ShippingAddressModel.updateMany({ user: shippingData.user }, { isDefault: false });
    }

    const shippingAddress = await ShippingAddressModel.create(shippingData);
    return shippingAddress;
};

const getShippingAddress = async (userId?: string) => {
    const query = userId ? { user: userId } : {};
    const shippingAddress = await ShippingAddressModel.find().populate('user', 'firstName lastName email');
    return shippingAddress;
};

const getShippingAddressById = async (id: string) => {
    const shippingAddress = await ShippingAddressModel.findById(id).populate('user', 'firstName lastName email');
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

const setDefaultShippingAddress = async (id: string, userId: string) => {
  // First get the address to find the user
  const address = await ShippingAddressModel.findById(id);
  if (!address) {
    throw new Error('Address not found');
  }

  // Update all addresses for this user to not be default
  await ShippingAddressModel.updateMany({ user: address.user }, { isDefault: false });

  // Set the specified address as default
  const updatedAddress = await ShippingAddressModel.findByIdAndUpdate(
    id,
    { isDefault: true },
    { new: true }
  ).populate('user', 'firstName lastName email');

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