"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrdersResponse } from "@/src/api/endpoints/interfaces";
import DeleteDialog from "@/src/common/DeleteDialog";
import useDebounce from "@/src/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  deleteOrder,
  getAllOrders,
  getAllOrdersBySearch,
} from "@/src/redux/slices/orderSlice";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState<getOrdersResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  const debounce = useDebounce(searchTerm, 500);

  const isDark = theme === "dark";
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await dispatch(getAllOrders()).unwrap();
        setOrders(response);
      } catch (error) {
        toast.error((error as any) ?? "Failed to fetch Orders");
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

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId),
      );
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error((error as any) ?? "Failed to delete an order");
    }
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
        <input
          type="text"
          placeholder="Enter Value"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`mb-2 h-10 p-3 ${isDark ? "border border-white" : "border border-gray-400"} rounded-2xl`}
        />
        <div className="overflow-x-auto max-h-125 overflow-y-auto">
          {orders.length > 0 ? (
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-200 text-gray-800 sticky top-0">
                <tr>
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Mobile</th>
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="text-center">
                    <td className="border p-2">{order._id}</td>

                    <td className="border p-2">
                      {order.user_first_name} {order.user_last_name}
                    </td>
                    <td className="border p-2">{order.email}</td>
                    <td className="border p-2">{order.mobile_no}</td>
                    <td className="border p-2">{order.product_id?.name}</td>
                    <td className="border p-2">${order.product_id?.price}</td>
                    <td className="border p-2">{order.product_quan}</td>
                    <td className="border p-2 font-semibold">
                      ${order.total_Price}
                    </td>

                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
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

                    <td className="border p-2">{order.address}</td>
                    <td className="border p-2 cursor-pointer">
                      <DeleteDialog
                        trigger={
                          <button className="flex items-center bg-gray-500 px-3 py-2 gap-2 text-sm rounded-full cursor-pointer text-white hover:bg-gray-600 transition">
                            <Trash2 size={16} /> Delete
                          </button>
                        }
                        title="Delete Order"
                        description="Are you sure you want to delete this order? This action cannot be undone."
                        onConfirm={async () => {
                          await handleDeleteOrder(order._id);
                        }}
                      />{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4">No Orders Found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
