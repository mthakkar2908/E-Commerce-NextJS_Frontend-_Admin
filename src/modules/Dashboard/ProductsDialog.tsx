/* eslint-disable react-hooks/exhaustive-deps */

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useDebounce from "@/src/hooks/useDebounce";
import { useAppDispatch } from "@/src/redux/hooks";
import {
  getAllProducts,
  searchProductsByQuery,
} from "@/src/redux/slices/productSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ViewProductsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProductsDialog: React.FC<ViewProductsProps> = ({ open, setOpen }) => {
  const [products, setProducts] = useState<
    {
      order: number;
      _id: string;
      name: string;
      about_product: string;
      price: number;
      quan: number;
    }[]
  >();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const debounce = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchFiltredData() {
      try {
        const response = await dispatch(
          searchProductsByQuery(debounce),
        ).unwrap();
        setProducts(Array.isArray(response) ? response : [response]);
      } catch (error) {
        toast.error((error as string) ?? "Failed to fetch filtered products");
      }
    }

    fetchFiltredData();
  }, [debounce, dispatch]);

  const fetchProducts = async () => {
    try {
      const res = await dispatch(getAllProducts({ page, pageSize })).unwrap();
      setProducts(Array.isArray(res.data) ? res.data : [res.data]);
      setTotal(res.total);
    } catch (error) {
      console.error(error);
    }
  };
  const totalPages = Math.ceil(total / pageSize);
  useEffect(() => {
    fetchProducts();
  }, [page, pageSize]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-200 max-h-150 overflow-auto scrollbar  bg-white dark:bg-black">
        <DialogTitle className="text-black dark:text-white">
          Products List
        </DialogTitle>

        <div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full text-gray-600 dark:text-gray-400"
          />
        </div>

        <div className="overflow-x-auto mt-4">
          {products?.length === 0 ? (
            <div>No products available right now</div>
          ) : (
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">About</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr
                    key={product?._id}
                    className="hover:bg-gray-400 dark:hover:bg-gray-700 text-black dark:text-white"
                  >
                    <td className="p-2 border">{product?.name}</td>
                    <td className="p-2 border">{product?.about_product}</td>
                    <td className="p-2 border">₹ {product?.price}</td>
                    <td className="p-2 border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-center">
                          {product?.quan}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div
          className="flex flex-col md:flex-row 
                 md:items-center md:justify-between 
                 gap-4 mt-6 px-4 py-3 
                 border-t dark:border-gray-800"
        >
          {/* Showing Info Section */}
          <div
            className="text-sm text-gray-600 dark:text-gray-300 
                   flex flex-col sm:flex-row 
                   sm:items-center gap-2"
          >
            <span>
              Showing{" "}
              <span className="font-semibold">{(page - 1) * pageSize + 1}</span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(page * pageSize, total)}
              </span>{" "}
              of <span className="font-semibold">{total}</span> results
            </span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border
                     border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-900
                     text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 
                     focus:ring-blue-500
                     w-20 sm:w-auto transition-all"
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center md:justify-end gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-1.5 rounded-lg border
                     border-gray-300 dark:border-gray-700
                     text-black dark:text-white
                     disabled:opacity-50 
                     disabled:cursor-not-allowed
                     hover:bg-gray-100 
                     dark:hover:bg-gray-800
                     transition-all duration-200"
            >
              Prev
            </button>

            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-1.5 rounded-lg border
                     border-gray-300 dark:border-gray-700
                     text-black dark:text-white
                     disabled:opacity-50 
                     disabled:cursor-not-allowed
                     hover:bg-gray-100 
                     dark:hover:bg-gray-800
                     transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductsDialog;
