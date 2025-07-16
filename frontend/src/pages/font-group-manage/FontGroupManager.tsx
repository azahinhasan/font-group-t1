import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateFontGroup,
  createFontGroup,
  deleteFontGroup,
  fetchFontGroups,
  fetchFonts,
} from "../apis";
import { AxiosError } from "axios";
import { FontGroup, UpdateFontGroup } from "../../interfaces";

export default function FontGroupManager() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [fontRows, setFontRows] = useState([""]);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<FontGroup | null>(null);
  const [page, setPage] = useState(1);

  const { data: fontGroups = {}, isLoading } = useQuery({
    queryKey: ["fontGroups", page],
    queryFn: fetchFontGroups,
  });
  const { data: fonts = [] } = useQuery({
    queryKey: ["fonts"],
    queryFn: fetchFonts,
  });

  const createMutation = useMutation({
    mutationFn: createFontGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fontGroups"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFontGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fontGroups"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFontGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fontGroups"] });
      setDeleteTarget(null);
    },
  });

  const handleAddRow = () => {
    setFontRows([...fontRows, ""]);
  };

  const handleFontChange = (index: number, value: string) => {
    const updated = [...fontRows];
    updated[index] = value;
    setFontRows(updated);
  };

  const handleSubmit = () => {
    const uniqueFonts = [...new Set(fontRows.filter(Boolean))];
    if (!groupName.trim()) return setError("Group name is required.");
    if (uniqueFonts.length < 2)
      return setError("At least two unique fonts are required.");
    setError("");
    if (editTarget) {
      updateMutation.mutate({
        _id: editTarget._id,
        name: groupName,
        fonts: uniqueFonts,
      });
    } else {
      createMutation.mutate({ name: groupName, fonts: uniqueFonts });
    }
  };

  const resetForm = () => {
    setModalOpen(false);
    setGroupName("");
    setFontRows([""]);
    setEditTarget(null);
  };

  const fontGroupList = fontGroups?.data || [];
  const totalPages = fontGroups?.totalPages || 1;

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Font Groups</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Group
        </button>
      </div>
      {isLoading ? (
        <p>Loading font groups...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Group Name</th>
                <th className="p-3">Fonts</th>
                <th className="p-3">Count</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fontGroupList.map((group: FontGroup) => (
                <tr key={group._id} className="border-t text-left">
                  <td className="p-3 font-medium">{group.name}</td>
                  <td className="p-3 text-sm">
                    {(() => {
                      const fontNames = group.fonts
                        .map((f) => f.name)
                        .join(", ");
                      return fontNames.length > 40
                        ? fontNames.slice(0, 40) + "..."
                        : fontNames;
                    })()}
                  </td>
                  <td className="p-3">{group.fonts.length}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => {
                        setGroupName(group.name);
                        setFontRows(group.fonts.map((f) => f._id));
                        setEditTarget(group);
                        setModalOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(group._id)}
                      className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {fontGroupList.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No groups found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-[500px] relative">
            <button
              onClick={resetForm}
              className="absolute top-2 right-3 text-gray-400 hover:text-black"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">
              {editTarget ? "Edit Font Group" : "Create Font Group"}
            </h3>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            {fontRows.map((row, index) => (
              <select
                key={index}
                value={row}
                onChange={(e) => handleFontChange(index, e.target.value)}
                className="w-full mb-2 px-3 py-2 border rounded"
              >
                <option value="">Select Font</option>
                {fonts?.data?.map((font: UpdateFontGroup) => (
                  <option
                    key={font._id}
                    value={font._id}
                    disabled={fontRows.includes(font._id) && row !== font._id}
                  >
                    {font.name}
                  </option>
                ))}
              </select>
            ))}

            <button
              onClick={handleAddRow}
              className="text-blue-600 hover:underline text-sm mb-4"
            >
              + Add Font
            </button>

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editTarget ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80 relative">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this group?
            </h3>

            {deleteMutation.isError && (
              <p className="text-red-600 text-sm mb-2">
                {(deleteMutation.error as AxiosError<{ message: string }>)
                  ?.response?.data?.message ||
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
