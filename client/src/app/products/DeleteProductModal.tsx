// DeleteProductModal.tsx
import React, { useState } from 'react';

type DeleteProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  productName: string;
};

const DeleteProductModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: DeleteProductModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (quantity > 0) {
      onConfirm(quantity);
      onClose();
    } else {
      alert("Please enter a valid quantity.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-lg font-semibold">Delete Product</h2>
        <p>Are you sure you want to delete {productName}? Please specify the quantity to delete:</p>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          className="border p-2 rounded mt-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 bg-gray-500 text-white py-1 px-3 rounded">Cancel</button>
          <button onClick={handleConfirm} className="bg-red-500 text-white py-1 px-3 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
