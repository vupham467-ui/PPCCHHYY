import { apiClient } from "../../constants/api";
import { buildQuery } from "../apiService";

const baseUrl = "/QLTB_DuyetMoKhoaTB";
const routerDuyetTBMoi = "duyetthietbimoi";
const routerDuyetMoKhoa = "duyetmokhoa";

const createDuyetMoKhoaService = (router) => {
  const service = {
    get: async (params = {}) => {
      try {
        // Nếu không có tham số hoặc không có pageSize, gán mặc định pageSize = -1 để lấy dữ liệu không phân trang:
        if (!params || Object.keys(params).length === 0) {
          params = { pageSize: -1 };
        } else if (params.pageSize === undefined) {
          params.pageSize = -1;
        }

        const query = buildQuery(params);
        const url = `${baseUrl}/${router}/get_v2${
          query ? `?${query}` : ""
        }`;
        
        const res = await apiClient.get(url);
        return res?.data;
      } catch (err) {
        console.error("GET error:", err);
        throw err;
      }
    },

    update: async (params) => {
      try {
        const res = await apiClient.put(
          `${baseUrl}/${router}/update`,
          params
        );
        return res?.data;
      } catch (err) {
        console.error("UPDATE error:", err);
        throw err;
      }
    },

    updatemulti: async (params) => {
      try {
        const res = await apiClient.put(
          `${baseUrl}/${router}/updatemulti`,
          params
        );
        return res?.data;
      } catch (err) {
        console.error("UPDATE error:", err);
        throw err;
      }
    },
  }
  return service;
}

//Duyệt thiết bị mới:
export const duyetThietBiMoiService = createDuyetMoKhoaService(routerDuyetTBMoi);
//Duyệt mở khóa thiết bị:
export const duyetMoKhoaService = createDuyetMoKhoaService(routerDuyetMoKhoa);
