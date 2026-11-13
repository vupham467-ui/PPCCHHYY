import { apiClient } from "../../constants/api";
import { buildQuery } from "../apiService";

const baseUrl = "QLTB_BAOCAO";

export const apiGet = async (endpoint, params = {}, ignorePageSize = false) => {
    try {
        // Nếu không có tham số hoặc không có pageSize, gán mặc định pageSize = -1 để lấy dữ liệu không phân trang:
        if (!ignorePageSize) {
            if (!params || Object.keys(params).length === 0) {
                params = { pageSize: -1 };
            } else if (params.pageSize === undefined) {
                params.pageSize = -1;
            }
        }

        const query = buildQuery(params);
        const url = `${baseUrl}/${endpoint}${query ? `?${query}` : ""}`;

        const res = await apiClient.get(url);
        return res?.data;
    } catch (err) {
        console.error(`GET ${endpoint} error:`, err);
        throw err;
    }
};

export const baoCaoService = {
    getBaoCaoChiTiet: (params) => apiGet("get_chitietthietbi", params),
    getBaoCaoLichSuGiaoNhan: (params) => apiGet("get_lichsugiaonhanthietbi", params),
    getSLThietBiDashBoard: (params) => apiGet("get_slthietbi_dashboard", params),
    getBaoCaoDongBoThietBiCu: (params) => apiGet("get_baocao_dongbo_thietbicu", params),
    getBaoCaoTongHopThietBi: (params) => apiGet("get_baocao_tonghop_thietbi", params),
    getBaoCaoTongHopTinhTrangGiaoNhan: (params) => apiGet("get_baocao_tonghop_tinhtrang_giaonhan", params),
    getBaoCaoChiTietTinhTrangGiaoNhan: (params) => apiGet("get_baocao_chitiet_tinhtrang_giaonhan", params),
    getBaoCaoTongHopBienBanC4: (params) => apiGet("get_baocao_tonghop_bienban_c4", params),
    getBaoCaoTongHopBienBanC3: (params) => apiGet("get_baocao_tonghop_bienban_c3", params),
};
