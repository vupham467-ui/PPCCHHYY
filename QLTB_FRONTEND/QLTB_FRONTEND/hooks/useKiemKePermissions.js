import { useMemo } from "react";
import { storageHelper } from "../utils/storageUtils";

export const useKiemKePermissions = () => {
  const user = storageHelper.get("user") || {};
  return useMemo(() => {
    const roles = String(user?.ds_quyen || "").split(",").map((x) => x.trim()).filter(Boolean);
    const isAdmin = user?.is_admin === "Y" || roles.includes("ADMIN");
    const isEquipmentManager = roles.includes("QLTB_QLP10");
    const username = String(user?.ten_dang_nhap || user?.username || "").toLowerCase();
    const owns = (record) => username && username === String(record?.nguoi_tao || "").toLowerCase();
    return {
      username,
      // ADMIN hoặc cán bộ quản lý thiết bị VTCNTT/C3 được lập biên bản.
      canCreate: isAdmin || isEquipmentManager,
      canViewAll: isAdmin || isEquipmentManager,
      canEdit: (record) => record?.trang_thai === 0 && (isAdmin || owns(record)),
      canDelete: (record) => record?.trang_thai === 0 && (isAdmin || owns(record)),
      // Sau khi C1 ký, chỉ chính người lập biên bản được phép hủy.
      canCancel: (record) => record?.trang_thai === 1 && owns(record),
    };
  }, [user?.ds_quyen, user?.is_admin, user?.ten_dang_nhap, user?.username]);
};
