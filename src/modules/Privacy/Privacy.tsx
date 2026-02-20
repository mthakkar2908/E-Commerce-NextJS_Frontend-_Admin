/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useAppDispatch } from "@/src/redux/hooks";
import {
  AddOrUpdatePrivacy,
  deletePrivacy,
  getPrivacyText,
} from "@/src/redux/slices/productSlice";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

export interface PrivacyResponse {
  _id: string;
  PrivacyPolicyText: string;
}

const PrivacyPolicy = () => {
  const dispatch = useAppDispatch();

  const [privacyData, setPrivacyData] = useState("");
  const [privacyLoading, setPrivacyLoading] = useState(true);
  const [privacyId, setPrivacyId] = useState("");

  const [hasExistingPolicy, setHasExistingPolicy] = useState(false);

  useEffect(() => {
    const fetchPrivacyData = async () => {
      try {
        setPrivacyLoading(true);
        const response = await dispatch(getPrivacyText()).unwrap();

        const policy = response?.[0];

        if (policy) {
          setPrivacyData(policy.PrivacyPolicyText);
          setPrivacyId(policy._id);
          setHasExistingPolicy(true);
        } else {
          setPrivacyData("");
          setHasExistingPolicy(false);
        }
      } catch (error: any) {
        toast.error(error ?? "Failed to fetch privacy policy.");
      } finally {
        setPrivacyLoading(false);
      }
    };

    fetchPrivacyData();
  }, [dispatch]);

  const handleAddPrivacyText = async () => {
    try {
      const response = await dispatch(AddOrUpdatePrivacy(privacyData)).unwrap();
      setPrivacyId(response?.data?._id);

      setHasExistingPolicy(true);

      toast.success(response.message ?? "Privacy policy saved.");
    } catch (error: any) {
      toast.error(error ?? "Failed to save privacy data");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePrivacy(privacyId)).unwrap();

      setPrivacyData("");
      setHasExistingPolicy(false);

      toast.success("Privacy policy deleted successfully.");
    } catch (error: any) {
      toast.error(error ?? "Failed to delete privacy policy");
    }
  };

  const plainText = privacyData
    ?.replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();

  const isEditorEmpty = !plainText;

  if (privacyLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto my-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Privacy Policy</h1>

      <div className="bg-gray-500 p-6 rounded-lg shadow-md">
        <ReactQuill
          theme="snow"
          placeholder="Write a text to add a privacy policy"
          value={privacyData}
          onChange={setPrivacyData}
        />

        <div className="flex justify-between">
          <button
            onClick={handleAddPrivacyText}
            disabled={isEditorEmpty}
            className={`mt-6 bg-black text-white px-6 py-2 rounded-md hover:opacity-90 transition ${
              isEditorEmpty ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {hasExistingPolicy ? "Save Privacy Policy" : "Add Privacy Policy"}
          </button>

          {hasExistingPolicy && (
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

export default PrivacyPolicy;
