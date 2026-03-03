/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { ContactFormResponse } from "@/src/api/endpoints/interfaces";
import useDebounce from "@/src/hooks/useDebounce";
import { useAppDispatch } from "@/src/redux/hooks";
import {
  deleteConact,
  getAllContacts,
  searchContacts,
} from "@/src/redux/slices/contactSlice";
import { CircleX, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UpdateContactDialog from "./UpdateContactDialog";

export type Contact = {
  _id: string;
  name: string;
  email: string;
  title: string;
  mobile_no: string;
  description: string;
};

const Contact = () => {
  const [contactData, setContactData] = useState<ContactFormResponse[]>([]);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [openContact, setOpenContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);

  const debounce = useDebounce(searchTerm, 500);

  const fetchContactForms = async () => {
    try {
      if (debounce) {
        const res = await dispatch(
          searchContacts({ q: debounce, page, pageSize }),
        ).unwrap();
        setContactData(res.data);
        setTotal(res.total ?? 0);
        setPage(res.page ?? page);
        setPageSize(res.pageSize ?? pageSize);
        return;
      }
      const res = await dispatch(getAllContacts({ page, pageSize })).unwrap();
      setContactData(res.data);
      setTotal(res.total ?? 0);
      setPage(res.page ?? page);
      setPageSize(res.pageSize ?? pageSize);
    } catch (error) {
      toast.error((error as string) ?? "Failed to fetch Contact forms data");
    }
  };
  useEffect(() => {
    fetchContactForms();
  }, [dispatch, debounce, page, pageSize]);

  const handleDeleteClick = (id: string) => {
    toast.dismiss();
    toast(
      (t) => (
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
      ),
      {
        duration: Infinity,
      },
    );
  };

  const handleEditContactClick = (contact: Contact) => {
    setOpenContact(true);
    setSelectedContact(contact);
  };

  return (
    <div className="min-h-screen bg-linear-to-br p-8 text-slate-200">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold tracking-wide mb-6 text-black dark:text-cyan-400">
          Contact Forms
        </h1>
      </div>
      <div className="relative w-100 ml-2 mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your products..."
          className="h-10 w-full p-3 pr-10 rounded-4xl border border-gray-300 focus:outline-none"
        />
        <CircleX
          onClick={() => setSearchTerm("")}
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer dark:hover:text-white hover:text-black "
        />
      </div>
      <div className="rounded-2xl overflow-x-auto scrollbar backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl overflow-hidden">
        <div className="p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-black dark:text-white">Rows:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-8 px-2 rounded border text-black dark:text-white bg-gray-200 dark:bg-black focus:border-black dark:focus:border-white "
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="text-sm text-slate-400">
            {total > 0 && (
              <span>
                Showing {Math.min(total, (page - 1) * pageSize + 1)} -{" "}
                {Math.min(total, page * pageSize)} of {total}
              </span>
            )}
          </div>
        </div>

        {contactData.length === 0 ? (
          <p className="p-6 text-center text-slate-400">
            No Contact Data found.
          </p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-linear-to-r dark:from-cyan-400/20 dark:to-indigo-400/20 bg-gray-400 dark:text-cyan-300 text-black uppercase text-xs tracking-wider">
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Mobile No.</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactData.map((contact) => (
                  <tr
                    key={contact._id}
                    className="border-t border-white/5 hover:bg-cyan-500/10 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-medium dark:text-cyan-200 text-gray-700">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 dark:text-slate-300 text-slate-600">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 dark:text-emerald-400 font-medium text-slate-600">
                      {contact.title}
                    </td>
                    <td className="px-6 py-4 dark:text-indigo-400 font-medium text-slate-600">
                      {contact.mobile_no}
                    </td>
                    <td className="px-6 py-4 dark:text-blue-400 font-medium text-slate-600">
                      {contact.description}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEditContactClick(contact)}
                          className="p-2 rounded-xl bg-blue-500/20 text-blue-400 
      hover:bg-blue-500 hover:text-white 
      transition-all duration-200 
      hover:scale-110 active:scale-95 cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(contact._id)}
                          className="p-2 rounded-xl bg-red-500/20 text-red-400 
      hover:bg-red-500 hover:text-white 
      transition-all duration-200 
      hover:scale-110 active:scale-95 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between p-3">
              <div className="text-sm text-slate-400">
                Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 bg-gray-900 dark:bg-gray-200 text-white dark:text-black rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(Math.max(1, Math.ceil(total / pageSize)), p + 1),
                    )
                  }
                  disabled={page >= Math.max(1, Math.ceil(total / pageSize))}
                  className="px-3 py-1 bg-gray-900 dark:bg-gray-200 text-white dark:text-black rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {openContact && (
        <UpdateContactDialog
          open={openContact}
          setOpen={setOpenContact}
          selectedContact={selectedContact}
          fetchContactForms={fetchContactForms}
        />
      )}
    </div>
  );
};

export default Contact;
