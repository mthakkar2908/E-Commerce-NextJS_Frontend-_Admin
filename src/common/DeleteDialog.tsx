"use client";

import { useState } from "react";

interface DeleteDialogProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
}

export default function DeleteDialog({
  trigger,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg w-150 shadow-lg max-w-full">
            <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
            <p className="text-base text-gray-400 mb-4 whitespace-normal">
              {description}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-md text-white cursor-pointer hover:bg-green-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-800"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
