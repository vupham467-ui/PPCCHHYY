import { apiClient } from "../../constants/api";
import { storageHelper } from "../../utils/storageUtils";

export const login_HT_NGUOIDUNG = async (data) => {
  const res = await apiClient.post("/HT_NGUOIDUNG/login", data);
  return res.data;
};

export const ssoLogin = async (data) => {
  const res = await apiClient.post("/HT_NGUOIDUNG/sso-login", data);
  return res.data;
};

export const getUserInfoForLogin = async (code) => {
  const res = await apiClient.get(`/HT_NGUOIDUNG/me?code=${code}`);
  return res.data;
};

export const HT_NGUOIDUNG_Service = {
  async getHT_NGUOIDUNGByMADVIQLY(data) {
    const res = await apiClient.post(
      "/HT_NGUOIDUNG/getHT_NGUOIDUNGByMA_DVIQLY",
      data
    );
    return res.data;
  },
  search: async (data) => {
    const res = await apiClient.post("/HT_NGUOIDUNG/search", {
      ...data,
      ma_dviqly: storageHelper.get("current_MADVIQLY"),
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete("/HT_NGUOIDUNG/delete/" + id);
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/HT_NGUOIDUNG/${id}`);
    return res.data;
  },
  getByUsername: async (username) => {
    const res = await apiClient.get(`/HT_NGUOIDUNG/get_by_username?username=${username}`);
    return res.data;
  },
  create: async (user) => {
    const res = await apiClient.post("/HT_NGUOIDUNG/create", user);
    return res;
  },
  update: async (user) => {
    const res = await apiClient.patch("/HT_NGUOIDUNG/update", user);
    return res;
  },
  lockOrUnlock: async (id, status) => {
    const res = await apiClient.put(
      `/HT_NGUOIDUNG/update_Trangthai/${id}/${status}`
    );
    return res.data;
  },
  resetPassword: async (data) => {
    // console.log(data);
    const res = await apiClient.post("/HT_NGUOIDUNG/resetPassword", data);
    return res.data;
  },
  resetDefaultPassword: async (data) => {
    const res = await apiClient.post("/HT_NGUOIDUNG/resetDefaultPassword", data);
    return res.data;
  },
  getMenuByIdUser: async (idUser) => {
    const res = await apiClient.get(
      `/HT_NGUOIDUNG/get_HT_MENUByIdUser?userId=${idUser}`
    );
    return res.data;
  },
  getMenuWaitSign: async (ten_dang_nhap) => {
    const res = await apiClient.get(
      `/HT_NGUOIDUNG/GET_MENU_WAIT_SIGN?username=${ten_dang_nhap}`
    );
    return res.data;
  },

  getAll: async () => {
    const res = await apiClient.post("/HT_NGUOIDUNG/search", {

        "tranG_THAI": 1,
        "pageIndex": 1,
        "pageSize": 1000000
    });
    return res.data;
},
};
