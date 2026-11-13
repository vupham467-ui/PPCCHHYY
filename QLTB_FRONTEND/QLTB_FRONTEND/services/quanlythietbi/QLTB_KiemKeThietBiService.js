import { apiClient } from "../../constants/api";
import { buildQuery } from "../apiService";

const baseUrl = "/QLTB_KiemKeThietBi";
const router = "kiemkethietbi";

export const kiemKeThietBiService = {
  get: async (params = {}) => {
    try {
      if (!params || Object.keys(params).length === 0) {
        params = { pageSize: -1 };
      } else if (params.pageSize === undefined) {
        params.pageSize = -1;
      }
      const query = buildQuery(params);
      const url = `${baseUrl}/${router}/get${query ? `?${query}` : ""}`;
      const res = await apiClient.get(url);
      return res?.data;
    } catch (err) {
      console.error("GET kiemkethietbi error:", err);
      throw err;
    }
  },

  get_by_id: async (id) => {
    try {
      const url = `${baseUrl}/${router}/get_by_id?id=${id}`;
      const res = await apiClient.get(url);
      return res?.data;
    } catch (err) {
      console.error("GET BY ID kiemkethietbi error:", err);
      throw err;
    }
  },

  getthietbi: async (bban_id) => {
    try {
      const url = `${baseUrl}/${router}/getthietbi?bban_id=${bban_id}`;
      const res = await apiClient.get(url);
      return res?.data;
    } catch (err) {
      console.error("GET THIETBI kiemkethietbi error:", err);
      throw err;
    }
  },

  preview_thietbi: async (params = {}) => {
    try {
      const query = buildQuery(params);
      const url = `${baseUrl}/${router}/preview_thietbi${query ? `?${query}` : ""}`;
      const res = await apiClient.get(url);
      return res?.data;
    } catch (err) {
      console.error("PREVIEW THIETBI kiemkethietbi error:", err);
      throw err;
    }
  },

  insert: async (params) => {
    try {
      const res = await apiClient.post(`${baseUrl}/${router}/insert`, params);
      return res?.data;
    } catch (err) {
      console.error("INSERT kiemkethietbi error:", err);
      throw err;
    }
  },

  update: async (params) => {
    try {
      const res = await apiClient.put(`${baseUrl}/${router}/update`, params);
      return res?.data;
    } catch (err) {
      console.error("UPDATE kiemkethietbi error:", err);
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const url = `${baseUrl}/${router}/delete?id=${id}`;
      const res = await apiClient.delete(url);
      return res?.data;
    } catch (err) {
      console.error("DELETE kiemkethietbi error:", err);
      throw err;
    }
  },

  cancel: async (params) => {
    try {
      const res = await apiClient.put(`${baseUrl}/${router}/cancel`, params);
      return res?.data;
    } catch (err) {
      console.error("CANCEL kiemkethietbi error:", err);
      throw err;
    }
  }
};
