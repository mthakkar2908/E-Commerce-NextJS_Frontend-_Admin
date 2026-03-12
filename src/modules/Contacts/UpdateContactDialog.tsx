/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import React, { useEffect, useState } from "react";
import { Contact } from "./Contact";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { updateContactRequest } from "@/src/api/endpoints/interfaces";
import { useAppDispatch } from "@/src/redux/hooks";
import { UpdateContact } from "@/src/redux/slices/contactSlice";
import toast from "react-hot-toast";

interface ContactProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedContact: Contact | null;
  fetchContactForms: () => void;
}

const UpdateContactDialog = ({
  open,
  setOpen,
  selectedContact,
  fetchContactForms,
}: ContactProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const dispatch = useAppDispatch();

  const fillDetails = () => {
    setName(selectedContact?.name.toString() ?? "");
    setEmail(selectedContact?.email ?? "");
    setTitle(selectedContact?.title ?? "");
    setDescription(selectedContact?.description ?? "");
    setMobile(selectedContact?.mobile_no ?? "");
  };
  useEffect(() => {
    if (selectedContact) {
      fillDetails();
    }
  }, [selectedContact]);

  const handleUpdateContact = async () => {
    try {
      setContactLoading(true);

      const updateContactPayload: updateContactRequest = {
        id: selectedContact?._id?.toString() ?? "",
        name,
        email,
        title,
        description,
        mobile_no: mobile,
      };

      const updateContact = await dispatch(
        UpdateContact(updateContactPayload),
      ).unwrap();
      fetchContactForms();
      setOpen(false);
      toast.success(updateContact.message ?? "Contact updated successfully");
    } catch (error) {
      toast.error((error as any) ?? "Failed to update contact.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl bg-white dark:bg-black w-full max-h-125 h-auto overflow-auto scrollbar rounded-2xl border border-gray-200 shadow-2xl p-6">
        <DialogTitle className="text-2xl font-semibold text-blue-400 mb-4">
          Update Contact
        </DialogTitle>

        <div className="space-y-4 mx-3">
          <div className="flex flex-col gap-2">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-400">
              Name
            </Label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 text-black dark:text-gray-300 rounded-xl border border-gray-300 px-4 text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-400">
              Email
            </Label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 text-black dark:text-gray-300 rounded-xl border border-gray-300 px-4 text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-400">
              Title
            </Label>
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 text-black dark:text-gray-300 rounded-xl border border-gray-300 px-4 text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-400">
              Description
            </Label>
            <textarea
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-22.5 text-black dark:text-gray-300 rounded-xl border border-gray-300 px-4 py-3 text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-400">
              Mobile
            </Label>

            <input
              type="tel"
              placeholder="Enter Mobile no."
              value={mobile}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                setMobile(onlyNumbers);
              }}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              className="h-11 text-black dark:text-gray-300 rounded-xl border border-gray-300 px-4 text-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 mx-3">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-700 dark:border-gray-300 text-black dark:text-white
             hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-black transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateContact}
            disabled={
              contactLoading ||
              !name ||
              !email ||
              !title ||
              !description ||
              !mobile
            }
            className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white 
            bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg 
            transition-all duration-200 cursor-pointer disabled:cursor-not-allowed`}
          >
            {contactLoading ? "Updating..." : "Update Contact"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateContactDialog;
