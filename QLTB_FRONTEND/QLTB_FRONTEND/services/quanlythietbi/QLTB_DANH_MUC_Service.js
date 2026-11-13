import { createService } from "../apiService";

const QLTB_DANH_MUC_BASE = '/QLTB_DANH_MUC';

export const nuocSxService = createService(QLTB_DANH_MUC_BASE, "nuocsx");
export const nhomThietBiService = createService(QLTB_DANH_MUC_BASE, "nhom");
export const chungloaiTBService = createService(QLTB_DANH_MUC_BASE, "chungloai");
export const hangSxTBService = createService(QLTB_DANH_MUC_BASE, "hangsx");
export const trangThaiTBService = createService(QLTB_DANH_MUC_BASE, "trangthai");
export const donViTinhService = createService(QLTB_DANH_MUC_BASE, "donvitinh");
export const khoTBService = createService(QLTB_DANH_MUC_BASE, "kho");
export const thietBiService = createService(QLTB_DANH_MUC_BASE, "thietbi", true, true);
export const loaiNghiepVuService = createService(QLTB_DANH_MUC_BASE, "loai_nghiepvu");
