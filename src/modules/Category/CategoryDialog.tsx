/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/src/redux/hooks";
import { addCategory, UpdateCategory } from "@/src/redux/slices/categorySlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Category } from "./Categories";

interface CategoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchData: () => void;
  mode: string;
  selectedCat: Category | null;
}

const CategoryDialog = ({
  open,
  setOpen,
  fetchData,
  mode,
  selectedCat,
}: CategoryProps) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const intialFetchDetails = () => {
    setName(selectedCat?.name ?? "");
    setDescription(selectedCat?.description ?? "");
    setIsActive(selectedCat?.isActive ?? true);
    setPreviewUrl(
      selectedCat?.image
        ? `${process.env.NEXT_PUBLIC_API_URL}${selectedCat.image}`
        : null,
    );
  };

  useEffect(() => {
    if (mode === "edit" && selectedCat) {
      intialFetchDetails();
    }
  }, [mode, selectedCat]);

  const handleSubmit = async () => {
    if (!name || !description) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("isActive", String(isActive));
      if (mode === "edit") {
        formData.append("id", selectedCat?._id as string);
        if (image) {
          formData.append("image", image);
        } else if (previewUrl) {
          try {
            const res = await fetch(previewUrl);
            const blob = await res.blob();
            const filename = previewUrl.split("/").pop() || "image";
            const file = new File([blob], filename, { type: blob.type });
            formData.append("image", file);
          } catch (e) {
            console.warn("Could not re-fetch existing image:", e);
          }
        }
      }

      if (image && mode === "create") {
        formData.append("image", image);
      }
      if (mode === "create") {
        await dispatch(addCategory(formData as any)).unwrap();

        toast.success("Category created successfully");
        setName("");
        setDescription("");
        setIsActive(true);
        setImage(null);
        setPreviewUrl(null);
        fetchData();
        setOpen(false);
      } else if (mode === "edit" && selectedCat) {
        await dispatch(UpdateCategory(formData as any)).unwrap();
        toast.success("Category updated successfully");
        setName("");
        setDescription("");
        setIsActive(true);
        setImage(null);
        setPreviewUrl(null);
        fetchData();
        setOpen(false);
      }
    } catch (error: any) {
      console.log("Error ", error);
      toast.error(error || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [previewUrl]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-175 bg-white dark:bg-black w-full max-h-150 h-auto overflow-auto scrollbar">
        <DialogTitle className="text-xl text-black dark:text-white">
          {mode === "create" ? "Create Category" : "Edit Category"}
        </DialogTitle>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="mb-2 text-black dark:text-white">Name</Label>
            <Input
              placeholder="Enter Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-500 text-black dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-2 text-black dark:text-white">
              Description
            </Label>
            <Input
              placeholder="Enter Category Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-500 text-black dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-2 text-black dark:text-white">
              Category Image
            </Label>
            {previewUrl && (
              <div className="mb-2">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-32 h-20 object-cover rounded-md mb-2"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setImage(file);
                  const url = URL.createObjectURL(file);
                  setPreviewUrl(url);
                }
              }}
              className="text-black file:text-black dark:file:text-white cursor-pointer dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-2 text-black dark:text-white">
              Enable / Disable
            </Label>
            <select
              value={isActive.toString()}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="h-8 px-2 rounded border text-black dark:text-white bg-gray-200 dark:bg-black focus:border-black dark:focus:border-white"
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 text-lg h-10 w-44 cursor-pointer bg-black dark:bg-white hover:bg-transparent dark:hover:bg-transparent border hover:text-black hover:border-black dark:hover:text-white dark:hover:border-white"
          >
            {loading
              ? "Wait..."
              : mode === "create"
                ? "Add Category"
                : "Update Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
