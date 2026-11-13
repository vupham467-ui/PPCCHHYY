import { apiClient } from "../constants/api";
import { storageHelper } from "../utils/storageUtils";


export const test_sign = async (data) => {
    try {
        const res = await apiClient.post(
            "/PDF/test-sign",
            data,
        );
        return res?.data;
    } catch (error) {
        console.error("Error generating PDF:", error.response || error.message);
        return null;
    }
};

export const checkImageExists = async (imagePath) => {
    try {
        const response = await apiClient.get(`/PDF/check-image-exist?imagePath=${encodeURIComponent(imagePath)}`);
        return response.data;
    } catch (err) {
        console.error(err.message);
        return false;
    }
};

//Lấy dữ liệu pdf dạng base64:
export const getPdf = async (filePath) => {
    try {
        const response = await apiClient.get(`/PDF/get-pdf?filepath=${encodeURIComponent(filePath)}`);
        return response.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

//Download pdf:
export const downloadPdf = async (filePath, isView = false) => {
    try {
        const response = await apiClient.get(`/PDF/download-pdf?isview=${isView}&filepath=${encodeURIComponent(filePath)}`, {
            responseType: 'blob',
        });
        return { data: response?.data, error: "" };
    } catch (err) {
        const status = err?.status;
        if (status === 404) {
            return { data: null, error: "Không tìm thấy file!" };
        }
        return { data: null, error: err.message };
    }
};


export const preview = async (data) => {
    try {
        const res = await apiClient.post(
            "/PDF/preview",
            data,
        );
        return res?.data;
    } catch (error) {
        console.error("Error generating PDF:", error.response || error.message);
        return {
            success: false,
            base64: "",
            message: error.response?.data?.message
        }
    }
};

export const digitalSign = async (data) => {
    try {
        const user = storageHelper.get("user");
        const user_id = user?.so_cmnd;
        const serial_number = user?.sign_alias;
        const hinhthucky = user?.sign_type || 6; //Nếu không có hình thức ký mặc định là ký ảnh
        // if (hinhthucky == 1 && (!user_id || !serial_number)) {
        //     return {success: false, base64: "", message: "Chưa thiết lập đủ thông tin ký số!"}
        // }

        const checkTen = !!data?.checkTen;
        const danhSachTen = data?.danhSachTen || [];
        
        const res = await apiClient.post(
            "/PDF/sign",
            {
                ...data, 
                user_id, 
                serial_number, 
                hinhthucky,
                checkTen,
                danhSachTen
            }
        );
        return res?.data;
    } catch (error) {
        console.error("Error generating PDF:", error.response || error.message);
        return {
            success: false,
            base64: "",
            message: error.response?.data?.message
        }
    }
};

export const checkAllSignNamesInFile = async (pdfBase64, signNames) => {
    try {
        const res = await apiClient.post(
            "/PDF/checkSignNamesExist",
            { pdfBase64, signNames },
        )
        return res?.data;
    } catch (error) {
        console.error("Error:", error.response || error.message);
        const message = error?.response?.data || "Error checking sign names";
        return { success: false, message };
    }
}

//QLTB:
export const QLTB_preview = async (data) => {
    try {

        const res = await apiClient.post(
            "/PDF/QLTB_preview",
            data,
        );
        return res?.data;
    } catch (error) {
        console.error("Error generating PDF:", error.response || error.message);
        return {
            success: false,
            base64: "",
            message: error.response?.data?.message
        }
    }
};

export const QLTB_digitalSign = async (data) => {
    try {
        const user = storageHelper.get("user");
        const user_id = user?.so_cmnd;
        const serial_number = user?.sign_alias;
        const hinhthucky = user?.sign_type || 6;
        if (hinhthucky == 1 && (!user_id || !serial_number)) {
            return {success: false, base64: "", message: "Chưa thiết lập đủ thông tin ký số!"}
        }
        const params = {...data, user_id, serial_number, hinhthucky};
        // console.log(params);
        
        const res = await apiClient.post(
            "/PDF/QLTB_sign", params
        );
        return res?.data;
    } catch (error) {
        console.error("Error generating PDF:", error);
        return {
            success: false,
            base64: "",
            message: error.response?.data?.message
        }
    }
};

// Endpoint ký riêng cho biên bản kiểm kê, không dùng chung luồng cập nhật
// trạng thái của biên bản giao nhận/thu hồi/trả lại/thanh lý.
export const QLTB_kiemKeDigitalSign = async (data) => {
    try {
        const user = storageHelper.get("user");
        const user_id = user?.so_cmnd;
        const serial_number = user?.sign_alias;
        const hinhthucky = user?.sign_type || 6;
        if (hinhthucky == 1 && (!user_id || !serial_number)) {
            return {success: false, base64: "", message: "Chưa thiết lập đủ thông tin ký số!"}
        }
        const params = {...data, user_id, serial_number, hinhthucky};

        const res = await apiClient.post(
            "/PDF/QLTB_kiemke_sign", params
        );
        return res?.data;
    } catch (error) {
        console.error("Error signing inventory PDF:", error);
        return {
            success: false,
            base64: "",
            message: error.response?.data?.message
        }
    }
};
