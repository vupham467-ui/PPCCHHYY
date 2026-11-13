// hooks/useAuthGuard.ts
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { storageHelper } from '../utils/storageUtils';

const PROTECTED_PREFIXES = [
    "/quanlykimchi/",
    "/quantrihethong/",
    "/quanlythinghiem/",
    "/quanlyvanhanh/",
    "/quanlythietbi/",
    "/danhgiagdv/",
    "/quanlypmis/"
];

const PUBLIC_PATHS = [
    "/auth/login",
];
const useMenuGuard = () => {
    const router = useRouter();
    const hasRedirected = useRef(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!router.isReady) return; // router chưa sẵn sàng
        if (hasRedirected.current) return;

        const fullPath = router.asPath || "";

        // Truong hop nay la check rieng cho truong hop trang da ky so
        if (fullPath == "/quanlythinghiem/kyso/?status=3") {
            setLoading(false);
            return;
        }

        const path = fullPath.split('?')[0];

        if (path === '/' || PUBLIC_PATHS.some(p => path === p || path.startsWith(p))) {
            setLoading(false);
            return;
        }

        //Check riêng cho trường hợp Trang chi tiết QT chì:
        if (path.startsWith("/quanlykimchi/chitietquyettoanchi") || path.startsWith("/quanlykimchi/chitietquyettoanTND")) {
            const id_giaonhan_temchi = router.query?.id_giaonhan_temchi;
            if (!id_giaonhan_temchi) {
                router.replace('/404').finally(() => setLoading(false));
                return;
            } else {
                setLoading(false);
                return;
            }
        }

        // Chỉ check quyền nếu path thuộc các prefix cần bảo vệ
        if (!PROTECTED_PREFIXES.some(prefix => path.startsWith(prefix))) {
            setLoading(false);
            return; // để Next.js tự xử lý → 404
        }

        // const allowedMenusCookie = decodeURIComponent(
        //     document.cookie.split('; ').find(row => row.startsWith('allowedMenus='))?.split('=')[1] || '[]'
        // );

        // let allowedMenus = [];
        // try {
        //     allowedMenus = JSON.parse(allowedMenusCookie)
        //         .filter(Boolean)
        //         .map((m) => m.trim().replace(/\/$/, ''));
        // } catch (err) {
        //     console.error('Parse allowedMenus lỗi:', err);
        // }

        const user = storageHelper.get("user");
        const allowedMenus = user?.allowedMenus || [];
        
        const normalizedPath = path.replace(/\/$/, '');
        const normalizedFullPath =
            normalizedPath + (router.asPath.includes('?') ? router.asPath.substring(router.asPath.indexOf('?')) : '');

        const isAllowed =
            allowedMenus.some(m => m.toLowerCase() === normalizedPath.toLowerCase()) ||
            allowedMenus.some(m => m.toLowerCase() === normalizedFullPath.toLowerCase());

        if (!isAllowed && router.pathname !== '/404') {
            hasRedirected.current = true;
            router.replace('/404').finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [router]);

    return loading;
}

export default useMenuGuard;
