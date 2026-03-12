/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { GetAllPostResponse } from "@/src/api/endpoints/interfaces";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { deletePost, getAllPosts } from "@/src/redux/slices/postSlice";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreatePostDialog from "./CreatePostDialog";

export type Post = {
  _id: string;
  imageUrl: string | null;
  name: string;
  post_description: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
};

const Posts = () => {
  const [posts, setPosts] = useState<GetAllPostResponse[]>([]);
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [postLoading, setPostLoading] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const isDark = theme === "dark";
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);

  const fetchOrders = async () => {
    try {
      setPostLoading(true);
      const response = await dispatch(getAllPosts({ page, pageSize })).unwrap();
      setPosts(response.data);
      setTotal(response.total ?? 0);
      setPage(response.page ?? page);
      setPageSize(response.pageSize ?? pageSize);
    } catch (error) {
      toast.error((error as any) ?? "Failed to fetch Posts");
    } finally {
      setPostLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [page, pageSize]);

  const handleDeleteClick = (id: string) => {
    toast.dismiss();
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this Post?</p>

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
                  const res = await dispatch(deletePost(id)).unwrap();
                  setPosts((prevPosts) =>
                    prevPosts.filter((post) => post._id !== id),
                  );
                  toast.success(res.message ?? "Post Deleted Successfully");
                  toast.dismiss(t.id);
                } catch (error) {
                  toast.dismiss(t.id);
                  toast.error((error as any) ?? "Failed to delete a Post");
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

  const handleEditPostClick = (post: Post) => {
    setMode("edit");
    setOpenCreatePost(true);
    setSelectedPost(post);
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
            Post List
          </h1>{" "}
          <button
            onClick={() => {
              setOpenCreatePost(true);
              setMode("create");
            }}
            className="flex items-center text-base cursor-pointer justify-center gap-2 border border-black dark:border-white hover:bg-blue-400 mb-2 px-3 rounded-3xl"
          >
            {" "}
            <Plus size={18} /> Create Post
          </button>
        </div>
        <div className="overflow-x-auto scrollbar rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-black dark:text-white">
                Rows:
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 px-2 rounded border text-black dark:text-white bg-gray-200 dark:bg-black focus:border-black dark:focus:border-white "
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="text-sm text-slate-400">
              {total > 0 && (
                <span>
                  Showing {Math.min(total, (page - 1) * pageSize + 1)} -{" "}
                  {Math.min(total, page * pageSize)} of {total}
                </span>
              )}
            </div>
          </div>

          {posts.length > 0 ? (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-linear-to-r dark:from-cyan-500/20 dark:to-indigo-500/20 bg-gray-400 dark:text-cyan-300 text-black uppercase text-xs tracking-wider">
                    <th className="px-6 py-4 text-left">Post Image</th>
                    <th className="px-6 py-4 text-left">Post Name</th>
                    <th className="px-6 py-4 text-left">Post Description</th>
                    <th className="px-6 py-4 text-left">Post Email</th>
                    <th className="px-6 py-4 text-left">User/Admin Name</th>
                    <th className="px-6 py-4 text-left">User/Admin Email</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post._id}
                      className="border-t border-white/5 hover:bg-cyan-500/10 transition-all duration-200"
                    >
                      <td className="px-6 py-4 dark:text-cyan-200 text-slate-600 font-medium">
                        {post.imageUrl ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`}
                            alt="post_image"
                            className="h-15 w-15 rounded-full object-cover"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td className="px-6 py-4 dark:text-emerald-400 text-slate-600 font-medium">
                        {post.name}
                      </td>
                      <td className="px-6 py-4 dark:text-blue-400 text-slate-600 font-medium">
                        {post.post_description}
                      </td>
                      <td className="px-6 py-4 dark:text-fuchsia-400 text-slate-600 font-medium">
                        {post.email}
                      </td>
                      <td className="px-6 py-4 dark:text-green-300 text-slate-600 font-medium">
                        {post?.user?.name}
                      </td>
                      <td className="px-6 py-4 dark:text-violet-400 text-slate-600 font-medium">
                        {post?.user?.email}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEditPostClick(post)}
                            className="p-2 rounded-xl bg-blue-500/20 text-blue-400 
      hover:bg-blue-500 hover:text-white 
      transition-all duration-200 
      hover:scale-110 active:scale-95 cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(post._id)}
                            className="p-2 rounded-xl bg-red-500/20 text-red-400 
      hover:bg-red-500 hover:text-white 
      transition-all duration-200 
      hover:scale-110 active:scale-95 cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between p-3">
                <div className="text-sm text-slate-400">
                  Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 bg-gray-900 dark:bg-gray-200 text-white dark:text-black rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          Math.max(1, Math.ceil(total / pageSize)),
                          p + 1,
                        ),
                      )
                    }
                    disabled={page >= Math.max(1, Math.ceil(total / pageSize))}
                    className="px-3 py-1 bg-gray-900 dark:bg-gray-200 text-white dark:text-black rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : postLoading ? (
            <p className="flex justify-center items-center mt-3 mb-3">
              Loading...
            </p>
          ) : (
            <p className="text-center py-4">No Posts Found.</p>
          )}
        </div>
      </div>
      {openCreatePost && (
        <CreatePostDialog
          open={openCreatePost}
          setOpen={setOpenCreatePost}
          fetchOrders={fetchOrders}
          selectedPost={selectedPost}
          mode={mode}
        />
      )}
    </div>
  );
};

export default Posts;
