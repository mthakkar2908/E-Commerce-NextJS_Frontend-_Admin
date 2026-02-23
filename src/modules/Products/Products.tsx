/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppDispatch } from "@/src/redux/hooks";
import { deleteProduct, getAllProducts } from "@/src/redux/slices/productSlice";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Products = () => {
  const dispatch = useAppDispatch();
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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await dispatch(getAllProducts()).unwrap();
        console.log("REsponse is :", res);
        setProducts(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await dispatch(deleteProduct(id)).unwrap();
      setProducts((prevProducts) =>
        prevProducts?.filter(
          (product) => product._id !== res.deleteProduct._id,
        ),
      );
      toast.success(res.message ?? "product deleted successfully.");
    } catch (error) {
      toast.error((error as any) ?? "failed to delete Product");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] p-8 text-slate-200">
      <h1 className="text-3xl font-semibold tracking-wide mb-6 text-cyan-400">
        Products
      </h1>

      <div className="rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        {products?.length === 0 ? (
          <p className="p-6 text-center text-slate-400">No products found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-linear-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 uppercase text-xs tracking-wider">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">About</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Quantity</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-white/5 hover:bg-cyan-500/10 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium text-cyan-200">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {product.about_product}
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    ₹ {product.price}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
                      {product.quan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 rounded-xl bg-red-500/20 text-red-400 
               hover:bg-red-500 hover:text-white 
               transition-all duration-200 
               hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
