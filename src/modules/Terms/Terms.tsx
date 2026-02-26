/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useAppDispatch } from "@/src/redux/hooks";
import {
  AddOrUpdateTerms,
  deleteTerms,
  getTermsText,
} from "@/src/redux/slices/productSlice";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { formats, modules } from "@/src/utils/helper";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

export interface TermsResponse {
  _id: string;
  TermsConditionsText: string;
}

const Terms = () => {
  const dispatch = useAppDispatch();

  const [termsData, setTermsData] = useState("");
  const [termsLoading, setTermsLoading] = useState(true);
  const [termsId, setTermsId] = useState("");

  const [hasExistingTerms, setHasExistingTerms] = useState(false);

  useEffect(() => {
    const fetchTermsData = async () => {
      try {
        setTermsLoading(true);
        const response = await dispatch(getTermsText()).unwrap();

        const conditions = response?.[0];

        if (conditions) {
          setTermsData(conditions.TermsConditionsText);
          setTermsId(conditions._id);
          setHasExistingTerms(true);
        } else {
          setTermsData("");
          setHasExistingTerms(false);
        }
      } catch (error: any) {
        toast.error(error ?? "Failed to fetch terms & conditions.");
      } finally {
        setTermsLoading(false);
      }
    };

    fetchTermsData();
  }, [dispatch]);

  const handleAddTermsText = async () => {
    try {
      const response = await dispatch(AddOrUpdateTerms(termsData)).unwrap();
      setTermsId(response?.data?._id);

      setHasExistingTerms(true);

      toast.success(response.message ?? "Terms & conditions saved.");
    } catch (error: any) {
      toast.error(error ?? "Failed to save terms & conditions data");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTerms(termsId)).unwrap();

      setTermsData("");
      setHasExistingTerms(false);

      toast.success("Terms & conditions deleted successfully.");
    } catch (error: any) {
      toast.error(error ?? "Failed to delete terms & conditions");
    }
  };

  const plainText = termsData
    ?.replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();

  const isEditorEmpty = !plainText;

  if (termsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto my-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Terms & Conditions
      </h1>

      <div className="bg-gray-500 p-6 rounded-lg shadow-md">
        <ReactQuill
          theme="snow"
          placeholder="Write a text to add a terms & conditions"
          value={termsData}
          onChange={setTermsData}
          modules={modules}
          formats={formats}
        />

        <div className="flex justify-between">
          <button
            onClick={handleAddTermsText}
            disabled={isEditorEmpty}
            className={`mt-6 bg-black text-white px-6 py-2 rounded-md hover:opacity-90 transition ${
              isEditorEmpty ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {hasExistingTerms
              ? "Save Terms & Conditions"
              : "Add Terms & Conditions"}
          </button>

          {hasExistingTerms && (
            <button
              onClick={handleDelete}
              className="mt-6 bg-red-600 flex gap-2 text-white px-6 py-2 rounded-md hover:opacity-90 cursor-pointer transition"
            >
              <Trash2 size={18} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terms;
