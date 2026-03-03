/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { FolderX, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryDialog from "./CategoryDialog";
import {
  deleteCategories,
  GetCategories,
} from "@/src/redux/slices/categorySlice";
import toast from "react-hot-toast";
import { GetCategoriesDataResponse } from "@/src/api/endpoints/interfaces";

export type Category = {
  _id: string;
  image: string | null;
  name: string;
  description: string;
  isActive: boolean;
};

const Categories = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const [categories, setCategories] = useState<GetCategoriesDataResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    try {
      const res = await dispatch(GetCategories({ page, pageSize })).unwrap();
      setCategories(res.data);
      setTotal(res.total);
      setPage(res.page);
      setPageSize(res.pageSize);
    } catch (error) {
      toast.error((error as any) ?? "Failed to fetch the categories data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, page, pageSize]);

  const handleClickOpenCategory = () => {
    setOpenCreateCategory(true);
    setMode("create");
  };
  const handleEditPostClick = (category: Category) => {
    setMode("edit");
    setOpenCreateCategory(true);
    setSelectedCat(category);
  };

  const handleDeleteClick = (id: string) => {
    toast.dismiss();
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this Category?</p>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                toast.dismiss(t.id);
              }}
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
                  const res = await dispatch(deleteCategories(id)).unwrap();
                  fetchData();
                  toast.success(res.message ?? "Category Deleted Successfully");
                  toast.dismiss(t.id);
                } catch (error) {
                  toast.dismiss(t.id);
                  toast.error((error as any) ?? "Failed to delete a Category");
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
        <div className="flex justify-between">
          <h1
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-blue-400" : "text-gray-800"
            }`}
          >
            Category List
          </h1>{" "}
          {categories.length > 0 && (
            <button
              onClick={handleClickOpenCategory}
              className="flex items-center text-base cursor-pointer justify-center gap-2 border border-black dark:border-white hover:bg-blue-400 mb-2 px-3 rounded-3xl"
            >
              {" "}
              <Plus size={18} /> Create Cateogry
            </button>
          )}
        </div>

        <div>
          {categories.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div
                className="relative w-full max-w-md p-10 rounded-3xl 
                    bg-white/10 dark:bg-white/5 
                    backdrop-blur-2xl 
                    border border-white/20 
                    shadow-2xl 
                    text-center 
                    transition-all duration-500 
                    hover:scale-105"
              >
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="flex justify-center mb-6">
                  <div className="p-5 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 shadow-lg">
                    <FolderX size={32} className="text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                  No Categories Found
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  You haven’t created any categories yet. Start organizing your
                  products by adding one.
                </p>

                <button
                  onClick={handleClickOpenCategory}
                  className="px-6 py-2 rounded-xl 
                   bg-black dark:bg-white 
                   text-white dark:text-black 
                   hover:bg-transparent hover:text-black 
                   dark:hover:text-white 
                   dark:hover:bg-transparent
                   cursor-pointer
                   border border-black dark:border-white 
                   transition-all duration-300"
                >
                  + Create Category
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${cat.image}`}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent transition-all duration-500" />

                  <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 translate-x-6 group-hover:translate-x-0 transition-all duration-500 z-20">
                    <button
                      onClick={() => handleEditPostClick(cat)}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-blue-500 transition-all duration-300"
                    >
                      <Pencil size={16} className="text-white" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(cat._id)}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-red-500 transition-all duration-300"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6">
                    <h2 className="text-2xl font-bold mb-2 group-hover:-translate-y-6 transition-all duration-500">
                      {cat.name}
                    </h2>

                    <div className="opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <p className="text-sm mb-2">{cat.description}</p>
                      <p
                        className={`text-xs px-3 py-1 rounded-full inline-block ${
                          cat.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {cat.isActive ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {openCreateCategory && (
        <CategoryDialog
          open={openCreateCategory}
          setOpen={setOpenCreateCategory}
          fetchData={fetchData}
          mode={mode}
          selectedCat={selectedCat}
        />
      )}
    </div>
  );
};

export default Categories;
