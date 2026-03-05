/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { getUsersResponse } from "@/src/api/endpoints/interfaces";
import Loader from "@/src/common/Loader";
import { useAppDispatch } from "@/src/redux/hooks";
import { deleteUsers, getAllUsers } from "@/src/redux/slices/totalSlice";
import { Edit2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CreateUserDialog from "./CreateUserDialog";

export type User = {
  _id: string;
  name: string;
  email: string;
  profile_image: string;
};

const UserPage = () => {
  const [users, setUsers] = useState<getUsersResponse[]>();
  const [userLoading, setUserLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const dispatch = useAppDispatch();

  const fetchUsersData = async () => {
    setUserLoading(true);
    try {
      const response = await dispatch(getAllUsers());
      setUsers(response.payload as getUsersResponse[]);
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  };
  useEffect(() => {
    fetchUsersData();
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);
  const handleDeleteClick = (id: string) => {
    toast.dismiss();
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this user?</p>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              style={{ cursor: "pointer" }}
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="button"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                try {
                  await dispatch(deleteUsers(id)).unwrap();

                  setUsers((prev) => prev?.filter((user) => user._id !== id));
                  toast.dismiss(t.id);
                  toast.success("User Deleted Successfully.");
                } catch {
                  toast.dismiss(t.id);
                  toast.error("Failed to delete user");
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

  const handleOpen = () => {
    setMode("create");
    setOpenCreateUser(true);
  };

  const handleEditOpen = async (user: User) => {
    setOpenCreateUser(true);
    setSelectedUser(user);
    setMode("edit");
  };

  if (userLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Users
        </h1>
        <div>
          <Button onClick={handleOpen} className="flex cursor-pointer">
            {" "}
            <Plus /> Create User
          </Button>
        </div>
      </div>
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border 
          border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900
          text-gray-700 dark:text-white
          focus:ring-2 focus:ring-blue-500 outline-none
          transition"
        />
      </div>

      <div
        className="rounded-xl border border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
      >
        {filteredUsers?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No Users Found
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Users will appear here when they register.
            </p>
          </div>
        ) : (
          filteredUsers?.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between
              px-5 py-3 border-b border-gray-200 dark:border-gray-800
              hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    user.profile_image
                      ? `${process.env.NEXT_PUBLIC_API_URL}${user.profile_image}`
                      : "/images/default_avtar.jpeg"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border"
                />

                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="gap-2">
                <button
                  onClick={() => handleEditOpen(user)}
                  className="p-2 rounded-lg 
                text-blue-500 hover:bg-blue-100
                dark:hover:bg-blue-900/30
                transition cursor-pointer"
                >
                  <Edit2 size={18} />
                </button>

                <button
                  onClick={() => handleDeleteClick(user._id)}
                  className="p-2 rounded-lg 
                text-red-500 hover:bg-red-100
                dark:hover:bg-red-900/30
                transition cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {openCreateUser && (
        <CreateUserDialog
          open={openCreateUser}
          setOpen={setOpenCreateUser}
          mode={mode}
          selectedUser={selectedUser}
          fetchUsersData={fetchUsersData}
        />
      )}
    </div>
  );
};

export default UserPage;
