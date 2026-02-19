/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GetAllPostResponse } from "@/src/api/endpoints/interfaces";
import { useAppDispatch } from "@/src/redux/hooks";
import { deletePost, getAllPosts } from "@/src/redux/slices/postSlice";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ViewPostsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

const PostsDialog: React.FC<ViewPostsProps> = ({
  open,
  setOpen,
  onDeleteSuccess,
}) => {
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

  const handleDeletePost = async (id: string) => {
    try {
      const res = await dispatch(deletePost(id)).unwrap();
      onDeleteSuccess();
      setOpen(false);
      toast.success(res.message ?? "Post Deleted Successfully");
    } catch (error) {
      toast.error((error as any) ?? "Failed to Delete Posts");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-200 w-full">
        <DialogTitle>Posts List</DialogTitle>

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
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {posts?.map((post) => (
                  <tr key={post?._id} className="hover:bg-gray-700">
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
                    <td className="p-2 border">
                      <Trash2
                        onClick={() => handleDeletePost(post?._id)}
                        className="ml-3 cursor-pointer"
                      />
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

export default PostsDialog;
