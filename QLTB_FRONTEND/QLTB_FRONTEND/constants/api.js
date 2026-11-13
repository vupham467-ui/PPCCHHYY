// Đảm bảo khai báo urlServer trước khi sử dụng nó
export const urlServer = process.env.NEXT_PUBLIC_API_URL; //API backend

export const urlPCHYUrl = process.env.NEXT_PUBLIC_API_PCHY; //APIPCHY

export const token = process.env.NEXT_PUBLIC_TOKEN;
export const config = { headers: { Authorization: "Bearer " + token } };

// Khai báo apiClient sau khi urlServer đã được định nghĩa
import axios from "axios";
import { setupInterceptors } from "../utils/setupInterceptors";

export const apiClient = axios.create({
  baseURL: urlServer + "/APIPCHY", // Sử dụng urlServer đã được khai báo
  timeout: 1000 * 60 * 30 * 3,
  withCredentials: true
});

// Xử lý token:
setupInterceptors(apiClient);

//API lấy dữ liệu qua APIPCHY
export const apiPCHY = axios.create({
  baseURL: urlPCHYUrl + "/APIPCHY",
  timeout: 1000 * 60 * 30 * 3,
});


