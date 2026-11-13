import { apiClient } from "../../constants/api";
import { storageHelper } from "../../utils/storageUtils";

export const viewDM_DONVI = async () => {
  const res = await apiClient.post("");
};

export const getDM_DONVI_ByID = async (id) => {
  const res = await apiClient.get("/DM_DONVI/get_DM_DONVI_ByID?id=" + id);
  return res.data;
};

export const search_DM_DONVI = async (data) => {
  const res = await apiClient.post("/DM_DONVI/search_DM_DONVI", {
    ...data,
    ma_dviqly: storageHelper.get("current_MADVIQLY"),
  });
  return res.data;
};

export const get_DM_DONVI_ROOT = async (ma_dviqly) => {
  const res = await apiClient.get("/DM_DONVI/get_DM_DONVI_ROOT?ma_dviqly=" + ma_dviqly);
  return res?.data;
};

export const insert_DM_DONVI = async (data) => {
  const res = await apiClient.post("/DM_DONVI/insert_DM_DONVI", data);
  return res;
};

export const update_DM_DONVI = async (data) => {
  const res = await apiClient.put("/DM_DONVI/update_DM_DONVI", data);
  return res;
};

export const delete_DM_DONVI = async (id) => {
  const res = await apiClient.delete("/DM_DONVI/delete_DM_DONVI?id=" + id);
  return res;
};

export const get_All_DM_DONVI = async (getAll = false) => {
  const ma_dviqly = getAll ? "PA23" : storageHelper.get("current_MADVIQLY");
  const res = await apiClient.get("/DM_DONVI/get_All_DM_DONVI?ma_dviqly=" + ma_dviqly);
  return res.data;
};
