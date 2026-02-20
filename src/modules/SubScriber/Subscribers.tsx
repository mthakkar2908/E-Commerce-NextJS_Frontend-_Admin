"use client";

import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import {
  getSubscriberData,
  unSubscribeChannel,
} from "@/src/redux/slices/postSlice";
import {
  GetAllSubscriberData,
  UnsubscribeChannelRequest,
} from "@/src/api/endpoints/interfaces";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import DeleteDialog from "@/src/common/DeleteDialog";
import InviteDialog from "./InviteDialog";

export function Subscribers() {
  const theme = useAppSelector((state) => state.theme.mode);
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.adminId;

  const isDark = theme === "dark";
  const dispatch = useAppDispatch();

  const [subData, setSubData] = useState<GetAllSubscriberData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [inviteUsers, setInviteUsers] = useState(false);

  useEffect(() => {
    const fetchSubscribersData = async () => {
      try {
        const res = await dispatch(getSubscriberData()).unwrap();
        setSubData(res);
      } catch (error) {
        toast.error((error as string) ?? "Failed to fetch Subscriber data");
      }
    };

    fetchSubscribersData();
  }, [dispatch]);

  const filteredSubscribers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return subData.filter(
      (sub) =>
        sub.userId.name.toLowerCase().includes(lowerSearch) ||
        sub.userId.email.toLowerCase().includes(lowerSearch) ||
        sub.email.toLowerCase().includes(lowerSearch),
    );
  }, [subData, searchTerm]);

  const handleDeleteSubscriber = async (email: string) => {
    try {
      const payload: UnsubscribeChannelRequest = {
        userId: userId as string,
        email: email,
      };

      const response = await dispatch(unSubscribeChannel(payload)).unwrap();

      setSubData((prev) => prev.filter((sub) => sub.email !== email));

      toast.success(response.message ?? "Successfully Deleted");
    } catch (error) {
      toast.error((error as string) ?? "Failed to delete");
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl">
        <h1
          className={`text-3xl font-bold mb-4 ${
            isDark ? "text-blue-400" : "text-gray-800"
          }`}
        >
          Subscribe List
        </h1>
        <div className="flex justify-between gap-2 items-center">
          <input
            type="text"
            placeholder="Search Subscriber..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={() => setInviteUsers(true)}
            className="flex justify-center w-40 items-center bg-blue-400 hover:bg-indigo-700 text-white cursor-pointer p-2 mb-3 gap-2 rounded-xl"
          >
            <Plus size={20} /> Invite User
          </button>
        </div>

        <div
          className={`rounded-md border ${
            isDark ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Registered</TableHead>
                <TableHead>Registered By (Name)</TableHead>
                <TableHead>Registered By (Email)</TableHead>
                <TableHead className="text-center">Delete Subscriber</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber._id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>{subscriber.userId.name}</TableCell>
                    <TableCell>{subscriber.userId.email}</TableCell>
                    <TableCell className="flex justify-center">
                      <DeleteDialog
                        trigger={
                          <button className="flex items-center bg-gray-500 px-3 py-2 gap-2 text-sm rounded-full cursor-pointer text-white hover:bg-gray-600 transition">
                            <Trash2 size={16} /> Delete
                          </button>
                        }
                        title="Delete Subscriber"
                        description="Are you sure you want to delete this subscriber? This action cannot be undone."
                        onConfirm={async () => {
                          await handleDeleteSubscriber(subscriber.email);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {inviteUsers && (
        <InviteDialog
          open={inviteUsers}
          setOpen={setInviteUsers}
          userId={userId as string}
        />
      )}
    </div>
  );
}
