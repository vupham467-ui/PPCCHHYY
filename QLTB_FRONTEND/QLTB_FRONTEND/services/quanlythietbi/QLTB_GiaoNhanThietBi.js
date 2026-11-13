import { apiClient } from "../../constants/api";
import { buildQuery } from "../apiService";

const baseUrl = "/QLTB_GiaoNhanThietBi";
const router = "giaonhanthietbi";

export const giaoNhanTBService =  {
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

      getBienBanKiemTraThanhLy: async (params = {}) => {
        try {
          // Nếu không có tham số hoặc không có pageSize, gán mặc định pageSize = -1 để lấy dữ liệu không phân trang:
          if (!params || Object.keys(params).length === 0) {
            params = { pageSize: -1 };
          } else if (params.pageSize === undefined) {
            params.pageSize = -1;
          }
    
          const query = buildQuery(params);
          const url = `${baseUrl}/${router}/get_bbkiemtrathanhly${query ? `?${query}` : ""}`;
    
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


    getThongTinDuyetThanhLy: async (id) => {
        try {
          const url = `${baseUrl}/${router}/get_thongtin_duyetthanhly?id=${id}`;
    
          const res = await apiClient.get(url);
          return res?.data;
        } catch (err) {
          console.error("GET error:", err);
          throw err;
        }
    },

    getthietbi: async (bban_id) => {
        try {
          const url = `${baseUrl}/${router}/getthietbi?bban_id=${bban_id}`;
    
          const res = await apiClient.get(url);
          return res?.data;
        } catch (err) {
          console.error("GET error:", err);
          throw err;
        }
    },

    //Thêm mới
    insert: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/insert`, params);
        return res?.data;
      } catch (err) {
        console.error("INSERT error:", err);
        throw err;
      }
    },
    insertBienBanKiemTraThanhLy: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/insert_bbkiemtrathanhly`, params);
        return res?.data;
      } catch (err) {
        console.error("INSERT error:", err);
        throw err;
      }
    },
    insertThongTinDuyetThanhLy: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/insert_thongtin_duyetthanhly`, params);
        return res?.data;
      } catch (err) {
        console.error("INSERT error:", err);
        throw err;
      }
    },
    //Cập nhật
    update: async (params) => {
      try {
        const res = await apiClient.put(`${baseUrl}/${router}/update`, params);
        return res?.data;
      } catch (err) {
        console.error("UPDATE error:", err);
        throw err;
      }
    },

    updateBienBanKiemTraThanhLy: async (params) => {
      try {
        const res = await apiClient.put(`${baseUrl}/${router}/update_bbkiemtrathanhly`, params);
        return res?.data;
      } catch (err) {
        console.error("UPDATE error:", err);
        throw err;
      }
    },
    updateThongTinDuyetThanhLy: async (params) => {
      try {
        const res = await apiClient.put(`${baseUrl}/${router}/update_thongtin_duyetthanhly`, params);
        return res?.data;
      } catch (err) {
        console.error("UPDATE error:", err);
        throw err;
      }
    },
    duyetThanhLy: async (params) => {
      try {
        const res = await apiClient.post(`${baseUrl}/${router}/duyet_thanhly`, params);
        return res?.data;
      } catch (err) {
        console.error("CONFIRM error:", err);
        throw err;
      }
    },
    

    //Xóa 1 bản ghi
    delete: async (id) => {
      try {
        const res = await apiClient.delete(`${baseUrl}/${router}/delete/${id}`);
        return res?.data;
      } catch (err) {
        console.error("DELETE error:", err);
        throw err;
      }
    },

    //Hủy biên bản
    cancel: async (params) => {
      try {
        
        const res = await apiClient.post(`${baseUrl}/${router}/cancel`, params);
        return res?.data;
      } catch (err) {
        console.error("CANCEL error:", err);
        throw err;
      }
    },
}