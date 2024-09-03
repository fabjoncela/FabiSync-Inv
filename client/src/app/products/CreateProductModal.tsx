import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ProductFormData | { quantity: number }) => void;
  initialData?: ProductFormData; // Optional for edit/delete modes
  isEditMode?: boolean; // To differentiate between create and edit mode
  isDeleteMode?: boolean; // To show delete-specific modal content
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
  isDeleteMode = false,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
  });

  const [quantityToDelete, setQuantityToDelete] = useState<number>(0);

  // Update form data when editing a product or deleting
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleDeleteSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (quantityToDelete > 0 && quantityToDelete <= formData.stockQuantity) {
      onSubmit({ quantity: quantityToDelete });
      onClose();
    } else {
      alert("Please enter a valid quantity to delete.");
    }
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name={isDeleteMode ? "Delete Product" : isEditMode ? "Edit Product" : "Create New Product"} />
        {isDeleteMode ? (
          // Delete Confirmation Mode
          <form onSubmit={handleDeleteSubmit} className="mt-5">
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <strong>{formData.name}</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Current stock quantity: <strong>{formData.stockQuantity}</strong>
            </p>
            <label htmlFor="quantityToDelete" className={labelCssStyles}>
              Quantity to delete
            </label>
            <input
              type="number"
              name="quantityToDelete"
              placeholder="Enter quantity"
              value={quantityToDelete}
              onChange={(e) => setQuantityToDelete(parseInt(e.target.value, 10))}
              className={inputCssStyles}
              required
            />
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Confirm Delete
            </button>
            <button
              onClick={onClose}
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </form>
        ) : (
          // Create/Edit Mode (existing logic)
          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
            onClose();
          }} className="mt-5">
            <label htmlFor="productName" className={labelCssStyles}>
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
              className={inputCssStyles}
              required
            />

            <label htmlFor="productPrice" className={labelCssStyles}>
              Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              value={formData.price}
              className={inputCssStyles}
              required
            />

            <label htmlFor="stockQuantity" className={labelCssStyles}>
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock Quantity"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, stockQuantity: parseInt(e.target.value, 10) })
              }
              value={formData.stockQuantity}
              className={inputCssStyles}
              required
            />

            <label htmlFor="rating" className={labelCssStyles}>
              Rating
            </label>
            <input
              type="number"
              name="rating"
              placeholder="Rating"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, rating: parseInt(e.target.value, 10) })
              }
              value={formData.rating}
              className={inputCssStyles}
              required
            />

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {isEditMode ? "Update" : "Create"}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateProductModal;
