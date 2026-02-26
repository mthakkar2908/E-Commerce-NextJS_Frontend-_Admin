import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useDebounce from "@/src/hooks/useDebounce";
import { useAppDispatch } from "@/src/redux/hooks";
import {
  deleteProduct,
  getAllProducts,
  searchProductsByQuery,
} from "@/src/redux/slices/productSlice";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ViewProductsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

const ProductsDialog: React.FC<ViewProductsProps> = ({
  open,
  setOpen,
  onDeleteSuccess,
}) => {
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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await dispatch(
          getAllProducts({ page: 1, pageSize: 10 }),
        ).unwrap();
        setProducts(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-200 bg-white dark:bg-black">
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
      </DialogContent>
    </Dialog>
  );
};

export default ProductsDialog;
