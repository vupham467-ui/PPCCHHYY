import { apiClient } from "../../constants/api";
import { buildQuery } from "../apiService";

const baseUrl = "/QLTB_DangKyLuanChuyenTB";
const router = "dangkyluanchuyen";

export const dangKyLuanChuyenTBService =  {
    get: async (params = {}) => {
        try {
          // Nếu không có tham số hoặc không có pageSize, gán mặc định pageSize = -1 để lấy dữ liệu không phân trang:
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
          console.error("GET error:", err);
          throw err;
        }
    },

    //Đăng ký mở khóa:
    insert: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/insert`, params);
        return res?.data;
      } catch (err) {
        console.error("INSERT error:", err);
        throw err;
      }
    },
    insertmulti: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/insertmulti`, params);
        return res?.data;
      } catch (err) {
        console.error("INSERT MULTI error:", err);
        throw err;
      }
    },

    //Hủy Đăng Ký:
    delete: async (id) => {
      try {
        const res = await apiClient.delete(`${baseUrl}/${router}/delete/${id}`);
        return res?.data;
      } catch (err) {
        console.error("DELETE error:", err);
        throw err;
      }
    },

    deletemulti: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/deletemulti`, params);
        return res?.data;
      } catch (err) {
        console.error("DELETE MULTI error:", err);
        throw err;
      }
    },
}