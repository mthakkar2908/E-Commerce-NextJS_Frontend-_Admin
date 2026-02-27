"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrdersResponse } from "@/src/api/endpoints/interfaces";
import useDebounce from "@/src/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  deleteOrder,
  getAllOrders,
  getAllOrdersBySearch,
} from "@/src/redux/slices/orderSlice";
import { CircleX, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState<getOrdersResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [orderLoading, setOrderLoading] = useState(false);

  const debounce = useDebounce(searchTerm, 500);

  const isDark = theme === "dark";
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrderLoading(true);
        const response = await dispatch(getAllOrders()).unwrap();
        setOrders(response);
      } catch (error) {
        toast.error((error as any) ?? "Failed to fetch Orders");
      } finally {
        setOrderLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await dispatch(
          getAllOrdersBySearch(debounce),
        ).unwrap();
        setOrders(response);
      } catch (error) {
        toast.error((error as any) ?? "Failed to fetch Orders");
      }
    };

    fetchOrders();
  }, [dispatch, debounce]);

  const handleDeleteClick = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this Order?</p>

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
                  await dispatch(deleteOrder(id)).unwrap();

                  setOrders((prevOrders) =>
                    prevOrders.filter((order) => order._id !== id),
                  );
                  toast.dismiss(t.id);
                  toast.success("Order deleted successfully");
                } catch (error) {
                  toast.dismiss(t.id);
                  toast.error((error as any) ?? "Failed to delete an order");
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

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h1
          className={`text-3xl font-bold mb-4 ${
            isDark ? "text-blue-400" : "text-gray-800"
          }`}
        >
          Orders List
        </h1>{" "}
        <div className="relative md:w-100 w-50  ml-2 mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your orders..."
            className="h-10 w-full p-3 pr-10 rounded-4xl border border-gray-300 focus:outline-none"
          />
          <CircleX
            onClick={() => setSearchTerm("")}
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer dark:hover:text-white hover:text-black "
          />
        </div>
        <div className="overflow-x-auto  rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
          {orders.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-linear-to-r dark:from-cyan-500/20 dark:to-indigo-500/20 bg-gray-400 dark:text-cyan-300 text-black uppercase text-xs tracking-wider">
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Mobile</th>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Quantity</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Address</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-white/5 hover:bg-cyan-500/10 transition-all duration-200"
                  >
                    <td className="px-6 py-4 dark:text-slate-300 text-slate-600 font-medium">
                      {order._id}
                    </td>

                    <td className="px-6 py-4 dark:text-cyan-200 text-slate-600 font-medium">
                      {order.user_first_name} {order.user_last_name}
                    </td>
                    <td className="px-6 py-4 dark:text-emerald-400 text-slate-600 font-medium">
                      {order.email}
                    </td>
                    <td className="px-6 py-4 dark:text-blue-400 text-slate-600 font-medium">
                      {order.mobile_no}
                    </td>
                    <td className="px-6 py-4 dark:text-fuchsia-400 text-slate-600 font-medium">
                      {order.product_id?.name}
                    </td>
                    <td className="px-6 py-4 dark:text-green-300 text-slate-600 font-medium">
                      ${order.product_id?.price}
                    </td>
                    <td className="px-6 py-4 dark:text-violet-400 text-slate-600 font-medium">
                      {order.product_quan}
                    </td>
                    <td className="px-6 py-4 dark:text-zinc-500 text-slate-600 font-medium">
                      ${order.total_price}
                    </td>

                    <td className="border p-2">
                      <span
                        className={`px-6 py-2 rounded text-white text-sm ${
                          order.status === "Delivered"
                            ? "bg-green-500"
                            : order.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 dark:text-amber-200 text-slate-600 font-medium">
                      {order.address}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteClick(order._id)}
                        className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : orderLoading ? (
            <p className="flex justify-center items-center mt-3 mb-3">
              Loading...
            </p>
          ) : (
            <p className="text-center py-4">No Orders Found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
