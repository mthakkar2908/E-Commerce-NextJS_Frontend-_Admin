/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch } from "@/src/redux/hooks";
import { AddUser, UpdateUser } from "@/src/redux/slices/authSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User } from "./UserPage";
import { X } from "lucide-react";

interface CreateUserProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: string;
  selectedUser: User | null;
  fetchUsersData: () => void;
}

const CreateUserDialog = ({
  open,
  setOpen,
  mode,
  selectedUser,
  fetchUsersData,
}: CreateUserProps) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const intialEditDeatils = () => {
    setName(selectedUser?.name ?? "");
    setEmail(selectedUser?.email ?? "");
  };

  useEffect(() => {
    if (mode === "edit" && selectedUser) {
      intialEditDeatils();
    }
  }, [mode, selectedUser]);

  const addUser = async () => {
    try {
      await dispatch(AddUser({ name, email, password })).unwrap();
      toast.success("User Created");
      fetchUsersData();
      setOpen(false);
    } catch (error) {
      toast.error((error as any) ?? "Failed to create a user");
    }
  };

  const updateUser = async () => {
    try {
      const apiFormData = new FormData();
      apiFormData.append("name", name);
      apiFormData.append("email", email);
      if (image) {
        apiFormData.append("image", image);
      }
      const updatedUser = await dispatch(
        UpdateUser({
          data: apiFormData as any,
          id: selectedUser?._id ?? "",
        }),
      ).unwrap();
      fetchUsersData();
      setOpen(false);
      toast.success(updatedUser.message ?? "Upated Successfully.");
    } catch (error) {
      toast.error((error as any) ?? "Failed  to updated the user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-gray-900">
        <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
          {mode === "edit" ? "Edit User" : "Create User"}
        </DialogTitle>

        <div className="mt-4 space-y-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="h-10 px-3 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              text-gray-800 dark:text-white
              focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="h-10 px-3 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              text-gray-800 dark:text-white
              focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {mode === "create" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Password
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-10 px-3 rounded-lg border
              border-gray-300 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              text-gray-800 dark:text-white
              focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {mode === "edit" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Profile Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
              {preview && (
                <div className="relative w-24 h-24">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              if (mode === "edit") {
                updateUser();
              } else {
                addUser();
              }
            }}
            className="w-full h-10 rounded-lg
            bg-blue-600 hover:bg-blue-700
            text-white font-medium
            transition cursor-pointer"
          >
            {mode === "edit" ? "Update User" : "Add User"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
