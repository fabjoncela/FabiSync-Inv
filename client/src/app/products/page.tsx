'use client';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon, TrashIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import DeleteProductModal from "./DeleteProductModal";
import AddQuantityModal from "./AddQuantityModal";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  productId: string; // Ensure productId is included
};

// Utility function to get a deterministic image index
const getImageIndex = (productId) => {
  const hash = [...productId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 12) + 1; // Ensure the index is between 1 and 12
};

const Products = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddQuantityModalOpen, setIsAddQuantityModalOpen] = useState(false);
  const [deleteProductName, setDeleteProductName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
    setIsModalOpen(false); // Close the modal after creation
    setCurrentProduct(null); // Reset the current product
  };

  const handleEditProduct = async (productData: ProductFormData) => {
    if (!currentProduct) return;
    await updateProduct({ ...productData, productId: currentProduct.productId });
    setIsModalOpen(false); // Close the modal after editing
    setCurrentProduct(null); // Reset the current product
  };

  const handleDeleteClick = (product: ProductFormData) => {
    setDeleteProductName(product.name);
    setIsDeleteModalOpen(true);
    setCurrentProduct(product);
  };

  const handleConfirmDelete = async (quantity: number) => {
    if (currentProduct) {
      await deleteProduct({ productId: currentProduct.productId, quantity });
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    }
  };

  const handleAddQuantity = async (quantity: number) => {
    if (currentProduct) {
      const newQuantity = currentProduct.stockQuantity + quantity;
      await updateProduct({ ...currentProduct, stockQuantity: newQuantity });
      setIsAddQuantityModalOpen(false); // Close the modal after updating
      setCurrentProduct(null); // Reset the current product
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return <div className="text-center text-red-500 py-4">Failed to fetch products</div>;
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditMode(false); // Set to create mode
            setCurrentProduct(null); // Clear current product
          }}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {products?.map((product) => {
          const imageIndex = getImageIndex(product.productId); // Get deterministic image index
          return (
            <div key={product.productId} className="border shadow rounded-md p-4 max-w-full w-full mx-auto">
              <div className="flex flex-col items-center">
                <Image
                  src={`https://s3-fabi-inv.s3.eu-central-1.amazonaws.com/product${imageIndex}.png`}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-3 rounded-2xl w-36 h-36"
                />
                <h3 className="text-lg text-gray-900 font-semibold">{product.name}</h3>
                <p className="text-gray-800">${product.price.toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">Stock: {product.stockQuantity}</div>
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )}

                {/* Add Quantity Button */}
                <button
                  className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setCurrentProduct(product);
                    setIsAddQuantityModalOpen(true);
                  }}
                >
                  Add Quantity
                </button>

                {/* Edit Button */}
                <button
                  className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={() => {
                    setCurrentProduct(product);
                    setIsModalOpen(true);
                    setIsEditMode(true);
                  }}
                >
                  <PencilIcon className="w-4 h-4 mr-2" /> Edit
                </button>

                {/* Delete Button */}
                <button
                  className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={() => handleDeleteClick(product)} // Open delete modal
                >
                  <TrashIcon className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL for delete confirmation */}
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={deleteProductName}
      />

      {/* MODAL for create/edit product */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={isEditMode ? handleEditProduct : handleCreateProduct}
        initialData={currentProduct ?? undefined}
        isEditMode={isEditMode}
      />

      {/* MODAL for adding quantity */}
      <AddQuantityModal
        isOpen={isAddQuantityModalOpen}
        onClose={() => setIsAddQuantityModalOpen(false)}
        onConfirm={handleAddQuantity}
        productName={currentProduct?.name ?? ""}
      />
    </div>
  );
};

export default Products;
