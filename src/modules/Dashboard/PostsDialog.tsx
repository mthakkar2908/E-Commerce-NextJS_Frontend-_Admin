/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GetAllPostResponse } from "@/src/api/endpoints/interfaces";
import { useAppDispatch } from "@/src/redux/hooks";
import { getAllPosts } from "@/src/redux/slices/postSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ViewPostsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

const PostsDialog: React.FC<ViewPostsProps> = ({ open, setOpen }) => {
  const [posts, setPosts] = useState<GetAllPostResponse[]>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const res = await dispatch(getAllPosts()).unwrap();
        setPosts(res);
      } catch (error) {
        toast.error((error as any) ?? "failed to fetch Post Data");
      }
    };
    if (open) {
      fetchPostsData();
    }
  }, [dispatch, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-210 w-full max-h-150 h-auto overflow-y-auto bg-white dark:bg-black">
        <DialogTitle className="text-black dark:text-white">
          Posts List
        </DialogTitle>

        <div className="overflow-x-auto mt-4">
          {posts?.length === 0 ? (
            <div>No products available right now</div>
          ) : (
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="p-2 border">Post Image </th>
                  <th className="p-2 border">Post Name</th>
                  <th className="p-2 border">Post Description</th>
                  <th className="p-2 border">Post email</th>
                  <th className="p-2 border">User name</th>
                  <th className="p-2 border">User email</th>
                </tr>
              </thead>
              <tbody>
                {posts?.map((post) => (
                  <tr
                    key={post?._id}
                    className="hover:bg-gray-400 dark:hover:bg-gray-700 text-black dark:text-white"
                  >
                    <td className="p-2 border">
                      {post.imageUrl ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`}
                          alt="post_image"
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="p-2 border">{post?.name}</td>
                    <td className="p-2 border">{post?.post_description}</td>
                    <td className="p-2 border">{post?.email}</td>
                    <td className="p-2 border">{post?.user?.name}</td>
                    <td className="p-2 border">{post?.user?.email}</td>
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

export default PostsDialog;
