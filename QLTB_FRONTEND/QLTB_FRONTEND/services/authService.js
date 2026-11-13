import { urlServer } from "../constants/api";

export const checkLogin = async () => {
    return await fetch(`${urlServer}/APIPCHY/HT_NGUOIDUNG/check-login`, {
        method: 'GET',
        credentials: 'include',
    });
};

export const getAccessTokenByRefreshToken = async () => {
    return await fetch(`${urlServer}/APIPCHY/HT_NGUOIDUNG/refresh-token`, {
        method: 'POST',
        credentials: 'include',
    });
}

export const logOut = async () => {
    return await fetch(`${urlServer}/APIPCHY/HT_NGUOIDUNG/logout`, {
        method: 'POST',
        credentials: 'include',
    });
}