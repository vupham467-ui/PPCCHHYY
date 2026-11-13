import { apiClient } from "../../constants/api";
import { buildQuery } from "../apiService";

const baseUrl = "/QLTB_DuyetLuanChuyenTB";
const router = "duyetluanchuyen";

export const duyetLuanChuyenTBService =  {
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

    //Duyệt luân chuyển:
    update: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/update`, params);
        return res?.data;
      } catch (err) {
        console.error("UPDATE error:", err);
        throw err;
      }
    },
    updatemulti: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/updatemulti`, params);
        return res?.data;
      } catch (err) {
        console.error("UPDATE MULTI error:", err);
        throw err;
      }
    },
    getchitiet: async (params = {}) => {
      try {
        // Nếu không có tham số hoặc không có pageSize, gán mặc định pageSize = -1 để lấy dữ liệu không phân trang:
        if (!params || Object.keys(params).length === 0) {
          params = { pageSize: -1 };
        } else if (params.pageSize === undefined) {
          params.pageSize = -1;
        }
  
        const query = buildQuery(params);
        const url = `${baseUrl}/${router}/getchitiet${query ? `?${query}` : ""}`;
  
        const res = await apiClient.get(url);
        return res?.data;
      } catch (err) {
        console.error("GET error:", err);
        throw err;
      }
    },
}