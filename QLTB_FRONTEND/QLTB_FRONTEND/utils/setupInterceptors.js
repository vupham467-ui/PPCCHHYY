import { getAccessTokenByRefreshToken, logOut } from "../services/authService";

// utils/setupInterceptors.js
export function setupInterceptors(apiClient) {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve();
            }
        });
        failedQueue = [];
    };

    let hasShownSessionExpired = false; //goi alert 1 lần

    const refreshToken = async () => {
        try {
            const res = await getAccessTokenByRefreshToken();
            if (!res?.ok) throw new Error('Refresh token hết hạn');
            return res?.ok;
        } catch (err) {
            console.error("Refresh token lỗi:", err.message);
            if (!hasShownSessionExpired) {
                hasShownSessionExpired = true;
                localStorage.clear();
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                // Redirect sau khi logout xong
                window.location.href = '/auth/login';
            }
            return null;
        }
    };

    apiClient.interceptors.request.use((config) => {
        // const token = storageHelper.get('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        // Gắn thêm menuPath
        try {
            const currentPath = window.location.pathname;
            config.headers["X-Menu-Path"] = currentPath;
        } catch (e) {
            console.warn("Không lấy được path hiện tại", e);
        }
        return config;
    }, (error) => Promise.reject(error));

    apiClient.interceptors.response.use(
        response => response,
        async (error) => {
            const originalRequest = error.config;

            // if (error.response?.status === 403) {
            //     window.location.href = "/403";
            //     return Promise.reject(error);
            // }

            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url.includes("/login")
            ) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => {
                            return apiClient(originalRequest);
                        })
                        .catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const refreshSuccess = await refreshToken();
                    if (refreshSuccess) {
                        processQueue(null);
                        return apiClient(originalRequest);
                    }
                } catch (err) {
                    processQueue(err);
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
}
