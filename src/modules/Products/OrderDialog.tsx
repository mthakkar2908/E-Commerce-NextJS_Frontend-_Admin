/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { Product } from "./Products";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { CreateOrderRequest } from "@/src/api/endpoints/interfaces";
import toast from "react-hot-toast";
import { CreateOrder } from "@/src/redux/slices/orderSlice";

interface OpenOrderDialog {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProducts: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const OrderDialog = ({
  open,
  setOpen,
  selectedProducts,
  setSelectedProduct,
}: OpenOrderDialog) => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.adminId;
  const [quantity, setQuantity] = React.useState(1);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [status, setStatus] = React.useState("Pending");
  const dispatch = useAppDispatch();

  const totalPrice = selectedProducts ? quantity * selectedProducts.price : 0;
  console.log("Selected :", selectedProducts);

  const handleCreateOrder = async () => {
    try {
      const payload: CreateOrderRequest = {
        user_id: String(userId),
        address: address,
        email: email,
        mobile_no: Number(mobile),
        product_id: String(selectedProducts?._id),
        product_name: String(selectedProducts?.name),
        product_quan: quantity,
        status: status,
        total_price: totalPrice,
        user_first_name: firstName,
        user_last_name: lastName,
      };

      const response = await dispatch(CreateOrder(payload)).unwrap();
      if (response.statusCode === 201) {
        toast.success(response.message ?? "Order Createed!");
        setOpen(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      toast.error((error as any) ?? "Failed To create order");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setSelectedProduct(null);
      }}
    >
      <DialogContent className="bg-gray-200! dark:bg-background! max-w-4xl max-h-150 h-full overflow-auto scrollbar w-full rounded-2xl p-0">
        <div className="px-8 py-5 border-b bg-gray-300 dark:bg-gray-900">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            Create New Order
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Fill in customer details and confirm the order.
          </p>
        </div>

        {!selectedProducts ? (
          <div className="p-10 text-center text-gray-500">
            Please select a product first.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 p-8">
            <div className="space-y-5">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Customer Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-style"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-style"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-style w-full"
                />

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="input-style w-full"
                />

                <textarea
                  placeholder="Full Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-style w-full resize-none"
                  rows={3}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Order Status
                </h3>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-style w-full"
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Quantity
                </h3>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={selectedProducts.quan}
                  className="input-style w-full"
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setQuantity(1);
                      return;
                    }

                    let num = Number(value);

                    if (isNaN(num)) return;

                    if (num < 1) num = 1;
                    if (num > selectedProducts.quan)
                      num = selectedProducts.quan;

                    setQuantity(num);
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-5 h-fit sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span>Product</span>
                  <span className="font-medium">{selectedProducts.name}</span>
                </div>

                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span>Unit Price</span>
                  <span>₹ {selectedProducts.price}</span>
                </div>

                <div className="flex justify-between text-gray-800 dark:text-white">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-base font-semibold text-emerald-500">
                  <span>Total</span>
                  <span>₹ {totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition cursor-pointer"
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
