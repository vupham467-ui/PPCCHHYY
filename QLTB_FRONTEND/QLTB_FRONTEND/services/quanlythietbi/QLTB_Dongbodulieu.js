import { apiClient } from "../../constants/api";
import { buildQuery } from "../apiService";

const baseUrl = "/QLTB_Dongbodulieu";
const router = "dongbothietbicu"

export const dongBoDuLieuService =  {
    get_thietbi: async (params = {}) => {
        try {
          // Nếu không có tham số hoặc không có pageSize, gán mặc định pageSize = -1 để lấy dữ liệu không phân trang:
          if (!params || Object.keys(params).length === 0) {
            params = { pageSize: -1 };
          } else if (params.pageSize === undefined) {
            params.pageSize = -1;
          }
    
          const query = buildQuery(params);
          const url = `${baseUrl}/${router}/getthietbi${query ? `?${query}` : ""}`;
    
          const res = await apiClient.get(url);
          return res?.data;
        } catch (err) {
          console.error("GET error:", err);
          throw err;
        }
    },
    get_by_id: async (id) => {
        try {
          const url = `${baseUrl}/${router}/get_by_id?id=${id}`;
    
          const res = await apiClient.get(url);
          return res?.data;
        } catch (err) {
          console.error("GET error:", err);
          throw err;
        }
    },
    update: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/update`, params);
        return res?.data;
      } catch (err) {
        console.error("UPDATE error:", err);
        throw err;
      }
    },
    update_doxa_multi: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/update_doxa_multi`, params);
        return res?.data;
      } catch (err) {
        console.error("UPDATE error:", err);
        throw err;
      }
    },
    rollback_doxa_multi: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/rollback_doxa_multi`, params);
        return res?.data;
      } catch (err) {
        console.error("ROLLBACK error:", err);
        throw err;
      }
    },
    sync: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/sync`, params);
        return res?.data;
      } catch (err) {
        console.error("SYNC error:", err);
        throw err;
      }
    },
    sync_multi: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/sync_multi`, params);
        return res?.data;
      } catch (err) {
        console.error("SYNC MULTI error:", err);
        throw err;
      }
    },
}