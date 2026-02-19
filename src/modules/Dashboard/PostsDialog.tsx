import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React from "react";
interface ViewPostsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PostsDialog: React.FC<ViewPostsProps> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Posts List</DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

export default PostsDialog;
