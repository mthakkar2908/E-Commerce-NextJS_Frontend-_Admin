"use client";

import { ContactFormResponse } from "@/src/api/endpoints/interfaces";
import useDebounce from "@/src/hooks/useDebounce";
import { useAppDispatch } from "@/src/redux/hooks";
import {
  deleteConact,
  getAllContacts,
  searchContacts,
} from "@/src/redux/slices/contactSlice";
import { CircleX, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [contactData, setContactData] = useState<ContactFormResponse[]>([]);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const debounce = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchContactForms = async () => {
      try {
        if (debounce) {
          const res = await dispatch(searchContacts(debounce)).unwrap();
          setContactData(res);
          return;
        }
        const res = await dispatch(getAllContacts()).unwrap();
        setContactData(res);
      } catch (error) {
        toast.error((error as string) ?? "Failed to fetch Contact forms data");
      }
    };

    fetchContactForms();
  }, [dispatch, debounce]);

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
      <div className="rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl overflow-hidden">
        {contactData.length === 0 ? (
          <p className="p-6 text-center text-slate-400">
            No Contact Data found.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-linear-to-r dark:from-cyan-400/20 dark:to-indigo-400/20 bg-gray-400 dark:text-cyan-300 text-black uppercase text-xs tracking-wider">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Mobile No.</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Delete</th>
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
                    <button
                      onClick={() => handleDeleteClick(contact._id)}
                      className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Contact;
