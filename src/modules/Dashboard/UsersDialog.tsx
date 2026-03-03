/* eslint-disable @next/next/no-img-element */
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getUsersResponse } from "@/src/api/endpoints/interfaces";
import Loading from "@/src/common/Loading";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { deleteUsers, getAllUsers } from "@/src/redux/slices/totalSlice";
import { Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface ViewProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

const UsersDialog: React.FC<ViewProps> = ({
  open,
  setOpen,
  onDeleteSuccess,
}) => {
  const [users, setUsers] = useState<getUsersResponse[]>();
  const [userLoading, setUserLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const dispatch = useAppDispatch();

  useEffect(() => {
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

    fetchUsersData();
  }, [dispatch]);

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
                  onDeleteSuccess();

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

  const filteredUsers = useMemo(() => {
    return users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`max-w-lg w-full ${isDark ? "dark" : "bg-white"}`}
      >
        <DialogTitle className={`${isDark ? "text-white" : "text-black"}`}>
          Users List
        </DialogTitle>
        {userLoading && <Loading />}

        <div>
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`border p-2 rounded w-full mb-3 ${isDark ? "" : "text-gray-600"}`}
          />
        </div>

        <div>
          {users?.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-lg font-semibold">
                No subscribed emails found
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Subscribe with your email to receive the latest arrivals and
                updates.
              </p>
            </div>
          ) : (
            filteredUsers?.map((user) => (
              <div
                key={user._id}
                className="p-2 border-b flex justify-between "
              >
                <div className="flex gap-5">
                  <img
                    src={
                      user.profile_image
                        ? `${process.env.NEXT_PUBLIC_API_URL}${user.profile_image}`
                        : "/images/default_avtar.jpeg"
                    }
                    alt="Profile_image"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-black dark:text-white">{user.name}</p>
                  <p className="text-black dark:text-white">{user.email}</p>
                </div>
                <button
                  className="cursor-pointer text-black dark:text-white"
                  onClick={() => handleDeleteClick(user._id)}
                >
                  <Trash2 />
                </button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsersDialog;
