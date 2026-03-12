/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { getProducutsByCategoryId } from "@/src/api/endpoints/interfaces";
import { useAppDispatch } from "@/src/redux/hooks";
import { getProductsByCatId } from "@/src/redux/slices/productSlice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductDialog from "../Products/ProductDialog";

export default function InsideCategory() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const categoryId = params.slug as string;
  const [products, setProducts] = useState<getProducutsByCategoryId[]>([]);
  const [openAddProduct, setOpenAddProduct] = useState(false);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await dispatch(
        getProductsByCatId(categoryId),
      ).unwrap();
      setProducts(fetchedProducts);
    } catch (error) {
      toast.error((error as any) || "Failed to fetch the products");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [dispatch, categoryId]);

  const handleOpen = () => {
    setOpenAddProduct(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Category: {products?.[0]?.category_id?.name}
        </h2>
        <div>
          <Button className="cursor-pointer" onClick={handleOpen}>
            Create Product
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Id</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">About Product</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            {products?.map((prod) => (
              <tr
                key={prod._id}
                className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">{prod._id}</td>
                <td className="px-4 py-3">{prod.name}</td>
                <td className="px-4 py-3">{prod.about_product}</td>
                <td className="px-4 py-3">{prod.price}</td>
                <td className="px-4 py-3">{prod.quan}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No products found in this category.
          </div>
        )}
      </div>

      {openAddProduct && (
        <ProductDialog
          open={openAddProduct}
          setOpen={setOpenAddProduct}
          fetchProducts={fetchProducts}
          mode="create"
          from={products?.[0]?.category_id?._id}
        />
      )}
    </div>
  );
}
