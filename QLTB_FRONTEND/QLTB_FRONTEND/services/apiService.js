import { apiClient } from "../constants/api";

// Dựng query string cho GET
export const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      query.append(key, val);
    }
  });
  return query.toString();
};

// Tạo CRUD service:
export const createService = (
  baseUrl,
  router,
  hasDeleteMulti = false,
  isThietBi = false
) => {
  const service = {
    //Lấy danh sách
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
  };

  //Nếu có deleteMulti
  if (hasDeleteMulti) {
    service.deleteMulti = async (params) => {
      try {
        const res = await apiClient.post(
          `${baseUrl}/${router}/deletemulti`,
          params
        );
        return res?.data;
      } catch (err) {
        console.error("DELETE MULTI error:", err);
        throw err;
      }
    };
  }

  //Nếu là thietbi:
  if (isThietBi) {
    service.downloadTemplateExcel = async (params) => {
      try {
        const query = buildQuery(params);
        const url = `${baseUrl}/${router}/download-template${
          query ? `?${query}` : ""
        }`;

        const res = await apiClient.get(url, { responseType: "blob" });
        return res;
      } catch (err) {
        console.error("DOWNLOAD TEMPLATE error:", err);
        throw err;
      }
    };

    // Import file Excel
    service.importExcel = async ({ file, ma_dvi, username, duyet_ngay }) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const url = `${baseUrl}/${router}/import?ma_dvi=${encodeURIComponent(
          ma_dvi
        )}&username=${encodeURIComponent(username)}&duyet_ngay=${duyet_ngay}`;

        const res = await apiClient.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return res.data; // { success, totalValid, totalError, errors }
      } catch (err) {
        console.error("IMPORT EXCEL error:", err);
        throw err;
      }
    };

    service.importExcel_v2 = async ({ file, ma_dvi, username, duyet_ngay }) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const url = `${baseUrl}/${router}/import_v2?ma_dvi=${encodeURIComponent(
          ma_dvi
        )}&username=${encodeURIComponent(username)}&duyet_ngay=${duyet_ngay}`;

        const res = await apiClient.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data; // Trả JSON object
      } catch (err) {
        console.error("IMPORT EXCEL error:", err);
        throw err;
      }
    };


    //Lấy danh sách thiết bị có thể giao nhận:
    service.getDSTbiGiaoNhan = async (params= {}) => {
      try {
        if (!params || Object.keys(params).length === 0) {
          params = { pageSize: -1 };
        } else if (params.pageSize === undefined) {
          params.pageSize = -1;
        }

        const query = buildQuery(params);
        const url = `${baseUrl}/${router}/get_giaonhan${query ? `?${query}` : ""}`;

        const res = await apiClient.get(url);
        return res?.data;
      } catch (err) {
        console.error("GET error:", err);
        throw err;
      }
    };

    //Lấy danh sách thiết bị đo xa hoặc CNTT ở kho P4 để thu hồi về Cty hoặc xác nhận cũ hỏng để thanh lý:
    service.getDSTbiTrongKhoC4 = async (params= {}) => {
      try {
        if (!params || Object.keys(params).length === 0) {
          params = { pageSize: -1 };
        } else if (params.pageSize === undefined) {
          params.pageSize = -1;
        }

        const query = buildQuery(params);
        const url = `${baseUrl}/${router}/get_trongkhoC4${query ? `?${query}` : ""}`;

        const res = await apiClient.get(url);
        return res?.data;
      } catch (err) {
        console.error("GET error:", err);
        throw err;
      }
    };
  }

  return service;
};
