import { CreateFontGroup, UpdateFontGroup } from "../interfaces";
import api from "../lib/axios";

const fetchFonts = async ({ queryKey }: { queryKey: any }) => {
  const [_key, page] = queryKey;
  const res = await api.get(`/font?page=${page}&limit=5`);
  return res.data;
};

const uploadFont = async (file: File) => {
  const formData = new FormData();
  formData.append("font", file);
  const res = await api.post("/font", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const deleteFont = async (id: string) => {
  const res = await api.delete(`/font/${id}`);
  return res.data;
};

const fetchFontGroups = async () => {
  const res = await api.get("/font-group");
  return res.data;
};

const createFontGroup = async (payload:CreateFontGroup) => {
  const res = await api.post("/font-group", payload);
  return res.data;
};

const deleteFontGroup = async (id:string) => {
  const res = await api.delete(`/font-group/${id}`);
  return res.data;
};

const updateFontGroup = async (payload:UpdateFontGroup) => {
  const {_id,...data}=payload
  const res = await api.put(`/font-group/${_id}`, data);
  return res.data;
};
export {
  fetchFonts,
  uploadFont,
  deleteFont,
  fetchFontGroups,
  createFontGroup,
  deleteFontGroup,
  updateFontGroup
};
