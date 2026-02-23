import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ContactFormResponse } from "@/src/api/endpoints/interfaces";
import DeleteDialog from "@/src/common/DeleteDialog";
import { useAppDispatch } from "@/src/redux/hooks";
import { deleteConact, getAllContacts } from "@/src/redux/slices/contactSlice";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ContactDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onDeleteSuccess: () => void;
}

const ContactDialog = ({
  open,
  setOpen,
  onDeleteSuccess,
}: ContactDialogProps) => {
  const dispatch = useAppDispatch();
  const [contactData, setContactData] = useState<ContactFormResponse[]>([]);

  useEffect(() => {
    const fetchContactForms = async () => {
      try {
        const res = await dispatch(getAllContacts()).unwrap();
        setContactData(res);
      } catch (error) {
        toast.error((error as string) ?? "Failed to fetch Contact forms data");
      }
    };

    if (open) {
      fetchContactForms();
    }
  }, [dispatch, open]);

  const handleDeleteClick = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this contact?</p>

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
                const res = await dispatch(deleteConact(id)).unwrap();
                setContactData((prevData) =>
                  prevData.filter(
                    (contact) => contact._id !== res.deletedContact._id,
                  ),
                );
                onDeleteSuccess();
                setOpen(false);
                toast.success(res.message);
                toast.dismiss(t.id);
              } catch {
                toast.dismiss(t.id);
                toast.error("Failed to delete contact");
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl w-full">
        <DialogTitle className="text-2xl font-bold mb-4">
          Contact Forms
        </DialogTitle>

        <div className="overflow-x-auto max-h-125 overflow-y-auto rounded-lg border">
          {contactData.length === 0 ? (
            <p className="text-center py-6 text-gray-500">
              No Contact Data Found.
            </p>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 border-b font-semibold">Name</th>
                  <th className="px-4 py-3 border-b font-semibold">Email</th>
                  <th className="px-4 py-3 border-b font-semibold">Title</th>
                  <th className="px-4 py-3 border-b font-semibold">
                    Description
                  </th>
                  <th className="px-4 py-3 border-b font-semibold">
                    Mobile No
                  </th>
                  <th className="px-4 py-3 border-b font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {contactData.map((contact, index) => (
                  <tr
                    key={contact._id}
                    className={`transition duration-200 ${
                      index % 2 === 0 ? "" : ""
                    }`}
                  >
                    <td className="px-4 py-3 border-b">{contact.name}</td>
                    <td className="px-4 py-3 border-b text-blue-600">
                      {contact.email}
                    </td>
                    <td className="px-4 py-3 border-b">{contact.title}</td>
                    <td className="px-4 py-3 border-b max-w-xs truncate">
                      {contact.description}
                    </td>
                    <td className="px-4 py-3 border-b">{contact.mobile_no}</td>
                    <td className="px-4 py-3 border-b">
                      <button
                        className="cursor-pointer"
                        onClick={() => handleDeleteClick(contact._id)}
                      >
                        <Trash2 />
                      </button>
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

export default ContactDialog;
