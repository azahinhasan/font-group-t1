import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFont, fetchFonts, uploadFont } from "../apis";

export default function FontManager() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: fonts, isLoading } = useQuery({
    queryKey: ["fonts", page],
    queryFn: fetchFonts,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadFont,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fonts"] });
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFont,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fonts"] });
      setDeleteTarget(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".ttf")) {
      alert("Only .ttf files are allowed!");
      return;
    }
    uploadMutation.mutate(file);
  };

  const fontsList = fonts?.data || [];
  const totalPages = fonts?.totalPages || 1;

  return (
    <div className="p-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Font List</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Font
        </button>
      </div>

      {/* Font Table */}
      {isLoading ? (
        <p>Loading fonts...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Preview</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fontsList.map((font: any) => (
                <tr key={font._id} className="border-t text-left">
                  <td className="p-3">{font.name}</td>
                  <td className="p-3">
                    <span style={{ fontFamily: font.name }} className="text-lg">
                      Example Style
                    </span>
                    <style>
                      {`@font-face {
                          font-family: '${font.name}';
                          src: url(${import.meta.env.VITE_API_FILE_URL}${
                        font.path
                      });
                        }`}
                    </style>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setDeleteTarget(font._id)}
                      className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {fontsList.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">
                    No fonts uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 py-1">{`Page ${page} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-120 relative">
            <button
              onClick={() => {
                setModalOpen(false);
                uploadMutation.reset();
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Upload New Font</h3>
            <label className="block cursor-pointer border-2 border-dashed border-gray-400 p-6 text-center rounded hover:border-blue-400">
              <input
                type="file"
                accept=".ttf"
                onChange={handleFileChange}
                className="hidden"
              />
              <p>Click or drag a .ttf file here</p>
            </label>
            {uploadMutation.isError && (
              <p className="mt-4 text-red-600 text-sm">
                {(uploadMutation.error as any)?.response?.data?.message ||
                  "Upload failed. Please try again."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80 relative">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this font?
            </h3>

            {deleteMutation.isError && (
              <p className="text-red-600 text-sm mb-2">
                {(deleteMutation.error as any)?.response?.data?.message ||
                  "Something went wrong while deleting."}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  deleteMutation.reset();
                  setDeleteTarget(null);
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
