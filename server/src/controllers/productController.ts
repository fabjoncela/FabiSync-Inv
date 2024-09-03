import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};


export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body; // Get the quantity to delete

    // Ensure that productId and quantity are provided
    if (!productId || !quantity) {
      res.status(400).json({ message: "Product ID and quantity are required" });
      return;
    }

    // Fetch the product to check the current stock quantity
    const product = await prisma.products.findUnique({
      where: { productId },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // If the stock quantity after deletion is zero or less, delete the product
    if (product.stockQuantity <= quantity) {
      const deletedProduct = await prisma.products.delete({
        where: { productId },
      });
      res.json({ message: "Product deleted", deletedProduct });
    } else {
      // Otherwise, just reduce the stock quantity
      const updatedProduct = await prisma.products.update({
        where: { productId },
        data: {
          stockQuantity: product.stockQuantity - quantity,
        },
      });
      res.json({ message: "Stock updated", updatedProduct });
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
};


export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { name, price, stockQuantity, rating } = req.body;

    const updatedProduct = await prisma.products.update({
      where: { productId },
      data: {
        name,
        price,
        stockQuantity,
        rating,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};