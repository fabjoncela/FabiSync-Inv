'use client'
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, TrashIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";

type ProductFormData = {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false); // Track delete mode
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null); // For editing or deleting

  const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation(); // For editing
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
    setIsModalOpen(false); // Close modal after create
  };

  const handleEditProduct = async (productData: ProductFormData) => {
    if (!currentProduct) return;

    await updateProduct({ ...productData, productId: currentProduct.productId });
    setIsModalOpen(false); // Close modal after edit
  };

  const handleDeleteProduct = async ({ quantity }: { quantity: number }) => {
    if (!currentProduct) return;

    await deleteProduct({ productId: currentProduct.productId, quantity });
    setIsModalOpen(false); // Close modal after delete
  };

  const openDeleteModal = (product: ProductFormData) => {
    setCurrentProduct(product); // Set current product for deletion
    setIsDeleteMode(true); // Enable delete mode
    setIsEditMode(false); // Disable edit mode
    setIsModalOpen(true); // Open modal
  };

  const openEditModal = (product: ProductFormData) => {
    setCurrentProduct(product); // Set current product for editing
    setIsEditMode(true); // Enable edit mode
    setIsDeleteMode(false); // Disable delete mode
    setIsModalOpen(true); // Open modal
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
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
            setIsDeleteMode(false); // Disable delete mode for creating
            setIsEditMode(false); // Disable edit mode for creating
            setCurrentProduct(null); // Reset current product for create
          }}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
        {products?.map((product) => (
          <div
            key={product.productId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <Image
                src={`https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/product${
                  Math.floor(Math.random() * 3) + 1
                }.png`}
                alt={product.name}
                width={150}
                height={150}
                className="mb-3 rounded-2xl w-36 h-36"
              />
              <h3 className="text-lg text-gray-900 font-semibold">
                {product.name}
              </h3>
              <p className="text-gray-800">${product.price.toFixed(2)}</p>
              <div className="text-sm text-gray-600 mt-1">
                Stock: {product.stockQuantity}
              </div>
              {product.rating && (
                <div className="flex items-center mt-2">
                  <Rating rating={product.rating} />
                </div>
              )}

              {/* Edit Button */}
              <button
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                onClick={() => openEditModal(product)}
              >
                <PencilIcon className="w-4 h-4 mr-2" /> Edit
              </button>

              {/* Delete Button */}
              <button
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                onClick={() => openDeleteModal(product)}
              >
                <TrashIcon className="w-4 h-4 mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={
          isDeleteMode
            ? handleDeleteProduct
            : isEditMode
            ? handleEditProduct
            : handleCreateProduct
        } // Conditionally handle create, edit, or delete
        initialData={currentProduct ?? undefined} // Pass current product for edit or delete
        isDeleteMode={isDeleteMode} // Flag for delete mode
        isEditMode={isEditMode} // Flag for edit mode
      />
    </div>
  );
};

export default Products;
