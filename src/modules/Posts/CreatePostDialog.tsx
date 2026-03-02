/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { addPost, updatePost } from "@/src/redux/slices/postSlice";
import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Post } from "./Post";

interface CreatePostProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchOrders: () => void;
  selectedPost: Post | null;
  mode: string;
}

const CreatePostDialog = ({
  open,
  setOpen,
  fetchOrders,
  selectedPost,
  mode,
}: CreatePostProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.adminId;
  const dispatch = useAppDispatch();
  const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
  const initialValues = {
    userId: userId,
    name: "",
    post_description: "",
    email: "",
    image: "",
  };
  const [formData, setFormData] = React.useState(initialValues);
  const [postLoading, setPostLoading] = useState(false);

  const convertImageUrlToFile = async (
    imageUrl: string,
  ): Promise<File | null> => {
    try {
      let absoluteUrl = imageUrl;
      if (imageUrl.startsWith("/")) {
        absoluteUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
      }
      const response = await fetch(absoluteUrl);
      if (!response.ok) {
        console.error("Failed to fetch image:", response.status);
        return null;
      }

      const blob = await response.blob();

      const fileName = imageUrl.split("/").pop() || "image.jpg";

      const file = new File([blob], fileName, {
        type: blob.type || "image/jpeg",
      });

      return file;
    } catch (error) {
      console.error("Error converting image URL to file:", error);
      return null;
    }
  };

  const fillDetails = async () => {
    setFormData({
      userId: selectedPost?.user._id ?? "",
      name: selectedPost?.name ?? "",
      post_description: selectedPost?.post_description ?? "",
      email: selectedPost?.user?.email ?? "",
      image: selectedPost?.imageUrl ?? "",
    });
    if (selectedPost?.imageUrl) {
      const file = await convertImageUrlToFile(selectedPost.imageUrl);
      if (file) {
        setSelectedImages([file]);
      }
    }
  };

  useEffect(() => {
    if (mode === "edit" && selectedPost) {
      fillDetails();
    }
  }, [selectedPost]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    if (files.length + selectedImages.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    const loadingToast = toast.loading(
      `Uploading ${files.length} ${files.length === 1 ? "memory" : "memories"}...`,
      {
        position: "top-center",
        style: { borderRadius: "8px", background: "#333", color: "#fff" },
      },
    );

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
    };

    const uploadPromises = files.map(async (file) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const fileType = file.type.startsWith("image") ? "image" : "video";

      const imageExtensions = ["jpeg", "jpg", "png", "gif"];

      if (fileType === "image" && !imageExtensions.includes(fileExtension!)) {
        results.skipped++;
        toast.error(
          `Invalid image format for ${file.name}. Supported formats: ${imageExtensions.join(
            ", ",
          )}`,
        );
        return null;
      }

      if (fileType === "image" && file.size > 30 * 1024 * 1024) {
        results.skipped++;
        toast.error(
          `Image size exceeds 30MB for ${file.name}. Please select a smaller image.`,
        );
        return null;
      }

      try {
        const combined = [...selectedImages, ...files].slice(0, 5);

        setSelectedImages(combined);
        results.success++;
      } catch {
        results.failed++;
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.dismiss(loadingToast);

      const message =
        files.length === 1
          ? results.success > 0
            ? "Memory uploaded successfully"
            : results.failed > 0
              ? "Memory failed to upload"
              : results.skipped > 0
                ? "Memory skipped due to validation"
                : ""
          : [
              results.success > 0
                ? `${results.success} memories uploaded successfully`
                : "",
              results.failed > 0 ? `${results.failed} memories failed` : "",
              results.skipped > 0
                ? `${results.skipped} memories skipped due to validation`
                : "",
            ]
              .filter(Boolean)
              .join(", ");

      if (results.success > 0) {
        toast.success(message);
      } else if (results.failed > 0 || results.skipped > 0) {
        toast.error(message);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error((error as string) ?? "Upload process failed");
    }

    event.target.value = "";
  };

  const gridCols =
    selectedImages.length <= 1
      ? "grid-cols-1"
      : selectedImages.length <= 4
        ? "grid-cols-2"
        : "grid-cols-3";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEditPost = async () => {
    try {
      setPostLoading(true);
      const apiFormData = new FormData();

      apiFormData.append("userId", userId || "");
      apiFormData.append("name", formData.name);
      apiFormData.append("post_description", formData.post_description);
      apiFormData.append("email", formData.email);

      if (selectedImages[0]) {
        apiFormData.append("image", selectedImages[0]);
      }

      if (mode === "create") {
        await dispatch(addPost(apiFormData as any))
          .unwrap()
          .then(() => {
            setFormData(initialValues);
            setSelectedImages([]);
            setOpen(false);
            fetchOrders();
            toast.success("Post created successfully!");
          });
      } else if (mode === "edit" && selectedPost) {
        await dispatch(
          updatePost({
            formData: apiFormData as any,
            postId: selectedPost?._id,
          }),
        )
          .unwrap()
          .then(() => {
            toast.success("Post updated successfully!");
            fetchOrders();
            setOpen(false);
            setFormData(initialValues);
            setSelectedImages([]);
          });
      }
    } catch (error) {
      toast.error((error as string) ?? "Failed to create Post");
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-150 bg-white dark:bg-black w-full max-h-150 h-auto overflow-auto scrollbar">
        <DialogTitle className="text-black dark:text-white">
          {mode === "edit" ? "Edit Post" : "Create Post"}
        </DialogTitle>

        <div className="h-full flex items-center justify-center rounded-lg">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />

          <label
            htmlFor="file-upload"
            className="flex items-center gap-2.5 cursor-pointer transition-all text-sm py-2 px-5 border group rounded-[7px] bg-primary dark:text-black text-white"
          >
            <Upload className="text-base max-w-4" />
            Upload Images
          </label>
        </div>

        {selectedImages.length > 0 && (
          <div className={`mt-4 grid gap-3 ${gridCols}`}>
            {selectedImages.map((file, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-32 w-full object-cover"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImages((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                  className="absolute cursor-pointer top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inputs */}
        <div className="mx-3">
          <div className="mt-4">
            <Label className="text-black dark:text-white">Post Name</Label>
            <Input
              name="name"
              value={formData?.name}
              onChange={handleInputChange}
              className="mt-2 border-gray-400 dark:border-gray-700"
              placeholder="Post Name"
            />
          </div>

          <div className="mt-4 text-black dark:text-white">
            <Label>Post Description</Label>
            <Input
              name="post_description"
              value={formData.post_description}
              onChange={handleInputChange}
              className="mt-2 border-gray-400 dark:border-gray-700"
              placeholder="Post Description"
            />
          </div>

          <div className="mt-4 text-black dark:text-white">
            <Label>Email</Label>
            <Input
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
              className="mt-2 border-gray-400 dark:border-gray-700"
              type="email"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="flex items-center justify-center mx-3">
          <Button
            className="cursor-pointer hover:bg-transparent border hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white"
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.post_description ||
              postLoading
            }
            onClick={() => {
              handleAddEditPost();
            }}
          >
            {mode === "edit" ? "Update Post" : "Add Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
