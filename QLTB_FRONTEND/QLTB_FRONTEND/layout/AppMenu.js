import React, { useState, useEffect, useContext, useMemo } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { useRouter } from "next/router";
import { MenuContext } from "./context/menucontext";
import { HT_NGUOIDUNG_Service } from "../services/quantrihethong/HT_NGUOIDUNGService";
import { storageHelper } from "../utils/storageUtils";

const AppMenu = () => {
  const router = useRouter();

  /* =======================
     1. STATE
  ======================= */

  // codeApp lấy từ query hoặc localStorage
  const [codeApp, setCodeApp] = useState(() => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem("currentAppCode");
    return stored ? stored.trim().toLowerCase() : "";
  });

  // menu gốc từ DB
  const [rawMenus, setRawMenus] = useState([]);

  // map: menuId -> số chờ ký
  const { waitSignMap, setWaitSignMap } = useContext(MenuContext);

  // menu đã build cho PanelMenu
  const [menu, setMenu] = useState([]);

  /* =======================
     2. BẮT codeApp TỪ QUERY
  ======================= */
  useEffect(() => {
    if (router?.query?.code) {
      const normalized = router.query.code.trim().toLowerCase();
      setCodeApp(normalized);
      localStorage.setItem("currentAppCode", normalized);

      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router?.query?.code]);

  /* =======================
     3. LOAD DATA (MENU + WAIT SIGN)
  ======================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = storageHelper.get("user");
        if (!user) return;

        const idUser = user.id;
        const tenDangNhap = user.ten_dang_nhap;

        const [menuRes, waitSignRes] = await Promise.all([
          HT_NGUOIDUNG_Service.getMenuByIdUser(idUser),
          HT_NGUOIDUNG_Service.getMenuWaitSign(tenDangNhap)
        ]);

        /* Map số chờ ký */
        const map = {};
        waitSignRes?.forEach(x => {
          map[x.id] = x.so_cho_ky;
        });

        setWaitSignMap(map);

        /* Map số biên bản QT sắp hết hạn */

        /* Lọc menu theo codeApp */
        let appMenus;

        if (codeApp) {
          appMenus = menuRes.filter(
            m =>
              !m.parent_id &&
              m.ma_menu?.trim().toLowerCase() === codeApp
          );
        } else {
          appMenus = menuRes.filter(
            m =>
              !m.parent_id &&
              m.ma_menu?.trim().toLowerCase() !== "quanlythinghiem"
          );
        }

        /* Thêm menu quản trị nếu là ADMIN */
        const dsQuyen = (user.ds_quyen ?? "")
          .split(",")
          .map(q => q.trim().toUpperCase());

        const isAdmin =
          dsQuyen.includes("ADMIN") || dsQuyen.includes("ADMIN_DL");

        if (isAdmin) {
          const adminMenus = menuRes.filter(
            m =>
              m.ten_menu
                ?.trim()
                .toLowerCase()
                .startsWith("quản trị hệ thống")
          );
          appMenus = [...adminMenus, ...appMenus];
        }

        setRawMenus(appMenus);
      } catch (err) {
        console.error("Lỗi load menu:", err);
      }
    };

    loadData();
  }, [codeApp]);

  /* =======================
      4. TÍNH TỔNG CHỜ KÝ
  ======================= */
  const calcTotalWaitSign = useMemo(() => {
    const cache = {};

    const calc = (item) => {
        if (cache[item.id] !== undefined) return cache[item.id];

        let total = waitSignMap[item.id] ?? 0;

        if (item.children && item.children.length > 0) {
            item.children.forEach(child => {
                total += calc(child);
            });
        }

        cache[item.id] = total;
        return total;
    };

    return calc;
}, [waitSignMap]);


const renderMenuLabel = (text, soChoKy) => (
  <div className="menu-label">
    <span className="menu-label-text">{text}</span>
    <span>
        {soChoKy > 0 && (
      <span className="menu-label-badge">{soChoKy}</span>
      )}
    </span>
  </div>
);

  /* =======================
     4. BUILD MENU
  ======================= */
  useEffect(() => {
    if (!rawMenus.length) return;

    const seenIds = new Set();
    
    const buildMenu = items =>
      items
        .filter(item => {
          if (seenIds.has(item.id)) return false;
          seenIds.add(item.id);
          return true;
        })
        .map(item => {
          const hasChildren =
            item.children && item.children.length > 0;

            const soChoKy = calcTotalWaitSign(item);

          //Log
          // console.log(
          //   `[MENU] ${item.ten_menu} → chờ ký:`,
          //   soChoKy
          // );

          return {
            key: item.id,
            icon: item.icon,
            className: !hasChildren ? "menu-item-no-children" : "",
            label: renderMenuLabel(item.ten_menu, soChoKy),
            items: hasChildren
              ? buildMenu(
                  [...item.children].sort((a, b) => {
                    const sa = a.sap_xep ?? Number.MAX_SAFE_INTEGER;
                    const sb = b.sap_xep ?? Number.MAX_SAFE_INTEGER;
                    if (sa !== sb) return sa - sb;
                    return a.ten_menu.localeCompare(b.ten_menu, "vi");
                  })
                )
              : null,
            command: item.duong_dan
              ? () => router.push(item.duong_dan)
              : undefined
          };
        });

    setMenu(buildMenu(rawMenus));
  }, [rawMenus, waitSignMap]);

  /* =======================
     5. RENDER
  ======================= */
  return (
    <PanelMenu
      model={menu}
      multiple
      onClick={e => {
        localStorage.setItem(
          "currentMenu",
          e.target.textContent
        );
      }}
    />
  );
};

export default AppMenu;
