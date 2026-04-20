import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ContactFormResponse } from "@/src/api/endpoints/interfaces";
import { useAppDispatch } from "@/src/redux/hooks";
import { getAllContacts } from "@/src/redux/slices/contactSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ContactDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onDeleteSuccess: () => void;
}

const ContactDialog = ({ open, setOpen }: ContactDialogProps) => {
  const dispatch = useAppDispatch();
  const [contactData, setContactData] = useState<ContactFormResponse[]>([]);

  useEffect(() => {
    const fetchContactForms = async () => {
      try {
        const res = await dispatch(
          getAllContacts({ page: 1, pageSize: 100 }),
        ).unwrap();
        setContactData(res.data);
      } catch (error) {
        toast.error((error as string) ?? "Failed to fetch Contact forms data");
      }
    };

    if (open) {
      fetchContactForms();
    }
  }, [open, dispatch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl w-full bg-white dark:bg-black">
        <DialogTitle className="text-2xl font-bold mb-4 text-black dark:text-white">
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
                <tr className="text-black dark:text-white">
                  <th className="px-4 py-3 border-b font-semibold">Name</th>
                  <th className="px-4 py-3 border-b font-semibold">Email</th>
                  <th className="px-4 py-3 border-b font-semibold">Title</th>
                  <th className="px-4 py-3 border-b font-semibold">
                    Description
                  </th>
                  <th className="px-4 py-3 border-b font-semibold">
                    Mobile No
                  </th>
                </tr>
              </thead>

              <tbody>
                {contactData.map((contact, index) => (
                  <tr
                    key={contact._id}
                    className={`transition duration-200 text-black dark:text-white ${
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
