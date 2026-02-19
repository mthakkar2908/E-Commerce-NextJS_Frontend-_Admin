import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GetAllProductsResponse } from "@/src/api/endpoints/interfaces";
import { useAppDispatch } from "@/src/redux/hooks";
import { getAllProducts } from "@/src/redux/slices/productSlice";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await dispatch(getAllProducts()).unwrap();
        setProducts(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-200">
        <DialogTitle>Products List</DialogTitle>

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
                  <tr key={product._id} className="hover:bg-gray-700">
                    <td className="p-2 border">{product.name}</td>
                    <td className="p-2 border">{product.about_product}</td>
                    <td className="p-2 border">₹ {product.price}</td>
                    <td className="p-2 border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-center">{product.quan}</div>
                        <div className="ml-2 flex">
                          <button className="bg-gray-500 gap-2 flex rounded-3xl px-2 py-1 text-xs cursor-pointer">
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductsDialog;
