/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  deleteProduct,
  getAllProducts,
  searchProductsByQuery,
  UpdateProductQuantity,
} from "@/src/redux/slices/productSlice";
import {
  ShoppingCart,
  Trash2,
  X,
  Plus,
  Check,
  CircleX,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductDialog from "./ProductDialog";
import { addToCart } from "@/src/redux/slices/orderSlice";
import useDebounce from "@/src/hooks/useDebounce";
import OrderDialog from "./OrderDialog";

export type Product = {
  order: number;
  _id: string;
  name: string;
  about_product: string;
  price: number;
  quan: number;
  category_id: {
    _id: string;
    name: string;
  };
};
const Products = () => {
  const dispatch = useAppDispatch();
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [products, setProducts] = useState<
    {
      order: number;
      _id: string;
      name: string;
      about_product: string;
      price: number;
      quan: number;
      category_id: {
        _id: string;
        name: string;
      };
    }[]
  >();

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.adminId;
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<Product | null>(null);

  const [mode, setMode] = useState<"create" | "edit">("create");

  const debounce = useDebounce(searchTerm, 500);

  const fetchProducts = async () => {
    try {
      if (searchTerm.trim() !== "") {
        const response = await dispatch(
          searchProductsByQuery(debounce),
        ).unwrap();
        setProducts(Array.isArray(response) ? response : [response]);
        return;
      }
      setLoading(true);
      const res = await dispatch(
        getAllProducts({
          page,
          pageSize,
        }),
      ).unwrap();
      setProducts(Array.isArray(res.data) ? res.data : [res.data]);
      setTotal(res.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, debounce]);

  const handleCreateProductOpen = () => {
    setIsProductOpen(true);
    setMode("create");
  };

  const hasOpenEnterValue = (productId: string) => {
    setActiveProductId(productId);
    setQuantity(1);
  };
  const handleAddToCart = async (productId: string) => {
    try {
      const res = await dispatch(
        addToCart({
          userId: userId as string,
          data: {
            items: [
              {
                productId: productId,
                quantity: quantity,
              },
            ],
          },
        }),
      ).unwrap();

      if (res.statusCode === 201) {
        toast.success(res.message ?? "Product added to cart successfully.");
        fetchProducts();
      } else {
        toast.error(res.message ?? "Failed to add product to cart.");
      }
      setActiveProductId(null);
    } catch (error) {
      toast.error((error as any) ?? "Failed to add to cart");
    }
  };

  const handleAddQuantity = async (productId: string) => {
    try {
      const res = await dispatch(
        UpdateProductQuantity({
          productId,
          quantity: newQuantity,
        }),
      ).unwrap();

      toast.success(res.message ?? "Quantity added successfully");
      setEditingProductId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error ?? "Failed to update quantity");
    }
  };

  const handleDeleteClick = (id: string) => {
    toast.dismiss();
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this Product?</p>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              style={{
                cursor: "pointer",
              }}
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="button"
              style={{
                cursor: "pointer",
              }}
              onClick={async () => {
                try {
                  const res = await dispatch(deleteProduct(id)).unwrap();

                  setProducts((prevProducts) =>
                    prevProducts?.filter(
                      (product) => product._id !== res.deleteProduct._id,
                    ),
                  );
                  toast.dismiss(t.id);
                  fetchProducts();
                  toast.success(res.message ?? "product deleted successfully.");
                } catch (error) {
                  toast.dismiss(t.id);
                  toast.error((error as any) ?? "failed to delete Product");
                }
              }}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  const handleCreateOrderClick = (product: Product) => {
    setOpenOrder(true);
    setSelectedProduct(product);
  };

  const handleEditProductClick = (product: Product) => {
    setMode("edit");
    setIsProductOpen(true);
    setSelectedProductForEdit(product);
  };

  return (
    <div className="min-h-screen bg-linear-to-br p-8 text-slate-200">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold tracking-wide mb-6 text-black dark:text-cyan-400">
          Products
        </h1>
        <button
          onClick={handleCreateProductOpen}
          className="text-lg cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-300 p-2 border dark:border-2 dark:border-white border-black rounded-2xl font-semibold tracking-wide mb-6 text-black dark:text-cyan-400"
        >
          Create Product
        </button>
      </div>
      <div className="relative w-100 ml-2 mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your products..."
          className="h-10 w-full p-3 pr-10 rounded-4xl border border-gray-300 text-gray-700 dark:text-white focus:outline-none"
        />
        <CircleX
          onClick={() => setSearchTerm("")}
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer dark:hover:text-white hover:text-black "
        />
      </div>
      <div className="overflow-x-auto scrollbar rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        {products?.length === 0 ? (
          <p className="p-6 text-center text-slate-400">No products found.</p>
        ) : loading ? (
          <p className="flex justify-center items-center mt-2">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-linear-to-r dark:from-cyan-500/20 dark:to-indigo-500/20 bg-gray-400 dark:text-cyan-300 text-black uppercase text-xs tracking-wider">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">About</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Quantity</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-center">Actions</th>
                <th className="px-6 py-4 text-center">Cart</th>
                <th className="px-6 py-4 text-center">Orders</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-white/5 hover:bg-cyan-500/10 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium dark:text-cyan-200 text-gray-700">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 dark:text-slate-300 text-slate-600">
                    {product.about_product}
                  </td>

                  <td className="px-6 py-4 text-emerald-400 font-semibold">
                    ₹ {product.price}
                  </td>

                  <td className="px-6 py-4 text-indigo-400 font-semibold">
                    {product.category_id?.name ?? "N/A"}
                  </td>

                  <td className="px-6 py-4 relative">
                    {editingProductId === product._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newQuantity ? newQuantity : product.quan}
                          onChange={(e) =>
                            setNewQuantity(Number(e.target.value))
                          }
                          className="w-20 p-1 rounded-lg border border-gray-400 text-black"
                          min={1}
                        />

                        <button
                          onClick={() => handleAddQuantity(product._id)}
                          className="text-green-600 hover:text-green-800 cursor-pointer"
                        >
                          <Check size={18} />
                        </button>

                        <button
                          onClick={() => setEditingProductId(null)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative inline-block">
                        <span className="px-3 py-1 rounded-full dark:bg-indigo-500/20 bg-indigo-500/30 dark:text-indigo-300 text-indigo-500 text-xs">
                          {product.quan}
                        </span>

                        <button
                          onClick={() => {
                            setEditingProductId(product._id);
                            setNewQuantity(1);
                          }}
                          className="absolute -top-2 -right-2 
                   bg-white text-black rounded-full p-1 shadow 
                   hover:bg-green-500 hover:text-white cursor-pointer
                   transition"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEditProductClick(product)}
                        className="p-2 rounded-xl bg-blue-500/20 text-blue-400 
      hover:bg-blue-500 hover:text-white 
      transition-all duration-200 
      hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(product._id)}
                        className="p-2 rounded-xl bg-red-500/20 text-red-400 
      hover:bg-red-500 hover:text-white 
      transition-all duration-200 
      hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        disabled={product.quan === 0}
                        onClick={() => hasOpenEnterValue(product._id)}
                        className="disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer dark:bg-amber-100 bg-gray-600 dark:text-gray-700 p-1.5 rounded-2xl flex items-center"
                      >
                        {" "}
                        {activeProductId === product._id ? (
                          <ShoppingCart size={18} />
                        ) : (
                          "Add to cart"
                        )}
                      </button>
                      {activeProductId === product._id && (
                        <div className="relative bg-gray-200 rounded-3xl p-3 inline-block">
                          {/* Close Button */}
                          <button
                            onClick={() => setActiveProductId(null)}
                            className="absolute -top-1 bg-red-500 rounded right-1 
               text-black
               transition cursor-pointer"
                          >
                            <X size={14} />
                          </button>

                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                            placeholder="Enter Quantity"
                            className="p-1 border border-gray-600 text-black rounded-lg w-20"
                            min={1}
                            max={product.quan}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                          />

                          <button
                            onClick={() => handleAddToCart(product._id)}
                            className="ml-2 bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleCreateOrderClick(product)}
                      className="bg-transparent p-2 border border-violet-300 rounded-3xl dark:text-violet-400 text-slate-600 cursor-pointer hover:text-white hover:bg-violet-600 dark:hover:bg-white dark:hover:text-black"
                    >
                      Create Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
      </div>

      {isProductOpen && (
        <ProductDialog
          open={isProductOpen}
          setOpen={setIsProductOpen}
          fetchProducts={fetchProducts}
          selectedProductForEdit={selectedProductForEdit}
          mode={mode}
        />
      )}

      {openOrder && (
        <OrderDialog
          open={openOrder}
          setOpen={setOpenOrder}
          selectedProducts={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </div>
  );
};

export default Products;
