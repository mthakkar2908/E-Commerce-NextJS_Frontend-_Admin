/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CreateProductRequest } from "@/src/api/endpoints/interfaces";
import { useAppDispatch } from "@/src/redux/hooks";
import { CreateProduct } from "@/src/redux/slices/productSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ProductDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchProducts: () => void;
}

const ProductDialog = ({
  open,
  setOpen,
  fetchProducts,
}: ProductDialogProps) => {
  const [name, setName] = useState("");
  const [about, setabout] = useState("");
  const [price, setPrice] = useState("");
  const [quan, setQuan] = useState("");

  const dispatch = useAppDispatch();

  const createProduct = async () => {
    try {
      const payload: CreateProductRequest = {
        name,
        about_product: about,
        price: Number(price),
        quan: Number(quan),
      };
      const createResponse = await dispatch(CreateProduct(payload)).unwrap();

      if (createResponse.statusCode === 201) {
        toast.success(
          createResponse.message ?? "Product created successfully.",
        );
        fetchProducts();
        setOpen(false);
      }
    } catch (error) {
      toast.error((error as any) ?? "Failed to create Product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-6">
        <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Create Product
        </DialogTitle>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="product_name"
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Product Name"
              className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800
                   px-3 text-gray-800 dark:text-gray-100
                   focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:focus:ring-blue-400
                   transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="about_product"
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              About Product
            </label>
            <input
              type="text"
              id="about_product"
              placeholder="Enter About Product"
              value={about}
              onChange={(e) => setabout(e.target.value)}
              className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800
                   px-3 text-gray-800 dark:text-gray-100
                   focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:focus:ring-blue-400
                   transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="price"
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              Price
            </label>
            <input
              type="number"
              max="999999"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              placeholder="Enter Price"
              className="no-spinner h-11 rounded-xl border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800
                   px-3 text-gray-800 dark:text-gray-100
                   focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:focus:ring-blue-400
                   transition"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="quan"
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              Quantity
            </label>
            <input
              type="number"
              min={1}
              id="quan"
              value={quan}
              onChange={(e) => setQuan(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              placeholder="Enter Quantity"
              className="no-spinner h-11 rounded-xl border border-gray-300 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800
                   px-3 text-gray-800 dark:text-gray-100
                   focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:focus:ring-blue-400
                   transition"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6">
          <button
            onClick={() => setOpen(false)}
            type="button"
            className="px-4 py-2 rounded-xl border cursor-pointer
               border-gray-300 dark:border-gray-700
               text-gray-600 dark:text-gray-300
               hover:bg-gray-100 dark:hover:bg-gray-800
               transition duration-200"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              createProduct();
              setOpen(false);
            }}
            type="submit"
            className="px-5 py-2.5 rounded-xl cursor-pointer
               bg-blue-600 hover:bg-blue-700
               dark:bg-blue-500 dark:hover:bg-blue-600
               text-white font-medium
               shadow-md hover:shadow-lg
               focus:outline-none focus:ring-2 
               focus:ring-blue-500 focus:ring-offset-2
               dark:focus:ring-offset-gray-900
               transition duration-200"
          >
            Create
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
