import { apiClient } from "../../constants/api";
import { buildQuery } from "../apiService";

const baseUrl = "/QLTB_KiemTraTB";
const router = "kiemtrathietbi";

export const kiemTraTBService =  {
    get: async (params = {}) => {
        try {
          // Nếu không có tham số hoặc không có pageSize, gán mặc định pageSize = -1 để lấy dữ liệu không phân trang:
          if (!params || Object.keys(params).length === 0) {
            params = { pageSize: -1 };
          } else if (params.pageSize === undefined) {
            params.pageSize = -1;
          }
    
          const query = buildQuery(params);
          const url = `${baseUrl}/${router}/get_v2${query ? `?${query}` : ""}`;
    
          const res = await apiClient.get(url);
          return res?.data;
        } catch (err) {
          console.error("GET error:", err);
          throw err;
        }
    },

    getLichSu: async (params = {}) => {
        try {
          // Nếu không có tham số hoặc không có pageSize, gán mặc định pageSize = -1 để lấy dữ liệu không phân trang:
          if (!params || Object.keys(params).length === 0) {
            params = { pageSize: -1 };
          } else if (params.pageSize === undefined) {
            params.pageSize = -1;
          }
    
          const query = buildQuery(params);
          const url = `${baseUrl}/${router}/get_lichsu${query ? `?${query}` : ""}`;
    
          const res = await apiClient.get(url);
          return res?.data;
        } catch (err) {
          console.error("GET error:", err);
          throw err;
        }
    },

    //Thêm thông tin kiểm tra:
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
}