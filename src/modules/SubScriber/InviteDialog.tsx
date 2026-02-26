/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { InviteUserRequest } from "@/src/api/endpoints/interfaces";
import { useAppDispatch } from "@/src/redux/hooks";
import { InvitePeopleForAdmin } from "@/src/redux/slices/postSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface inviteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
}

const InviteDialog: React.FC<inviteProps> = ({ open, setOpen, userId }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const InvitePeoples = async () => {
    try {
      setLoading(true);
      const payload: InviteUserRequest = {
        userId: userId,
        email: email,
      };
      const response = await dispatch(InvitePeopleForAdmin(payload)).unwrap();
      setOpen(false);
      toast.success(response.message ?? "Invitation send.");
    } catch (error) {
      toast.error((error as any) ?? "Failed to send Invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg w-full bg-white dark:bg-black">
        <DialogTitle className="text-xl text-black dark:text-white">
          Invite Peoples
        </DialogTitle>

        <div className="flex flex-col gap-5">
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to invite.."
              className="w-full h-10 p-2 text-gray-500 border border-gray-500 text-lg"
            />
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={InvitePeoples}
              disabled={loading}
              className={`bg-blue-500 hover:bg-indigo-700 text-lg p-1 w-36 rounded-2xl ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {loading ? "Sending mail..." : "Invite"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
