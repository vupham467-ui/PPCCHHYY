import { apiClient } from "../../constants/api";

export const genQRService = {
    genQR: async (params) => {
        try {
        const res = await apiClient.post(
            `QLTB_GenQR/gen_qr`,
            params
        );
        return res?.data;
        } catch (err) {
        console.error("error:", err);
        throw err;
        }
    }
}