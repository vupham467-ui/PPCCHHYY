import React, { useCallback, useContext, useEffect, useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { signInfoState } from "../../constants/propGlobal";
import { storageHelper } from "../../utils/storageUtils";
import { QLTB_previewPdf, QLTB_signKiemKePdf } from "../../utils/pdfUtils";
import { kiemKeThietBiService } from "../../services/quanlythietbi/QLTB_KiemKeThietBiService";
import { safeGetUsersByUserName } from "../../utils/commonUltil";
import PDFViewerComponent from "../PDFViewer";
import SignatureTimeLine from "../SignatureTimeLine";
import { formatSignDate } from "../../utils/dateUtils";
import { MenuContext } from "../../layout/context/menucontext";

const QLTB_BienBanKiemKeViewer = ({
  dataBienBan,
  visible,
  handleCloseModalViewer,
  showToast,
  loadData,
  showSignBtn = true,
}) => {
  const [events, setEvents] = useState(signInfoState);
  const [pdfData, setPdfData] = useState(null);
  const [isSigned, setIsSigned] = useState(false);
  const [disabledSignBtn, setDisabledSignBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { refreshWaitSign } = useContext(MenuContext);
  const user = storageHelper.get("user") || {};

  const trang_thai = dataBienBan?.trang_thai ?? 0;
  const nguoiC3 = (dataBienBan?.nguoi_daidien_c3 || "").toLowerCase();
  const nguoiDvi = (dataBienBan?.nguoi_daidien_dvi || "").toLowerCase();
  const currentUserLogin = (user?.ten_dang_nhap || user?.username || "").toLowerCase();

  const isC1Signer = currentUserLogin === nguoiC3 && trang_thai === 0;
  const isC2Signer = currentUserLogin === nguoiDvi && trang_thai === 1;

  const showKySoBtn = (isC1Signer || isC2Signer) && !isSigned;

  const sign = async (id, cap_ky) => {
    try {
      setIsLoading(true);

      const nguoi_ky = user?.ho_ten || user?.ten_dang_nhap || "";
      const signImg = user?.sign_image || "";
      const ma_dviqly = dataBienBan?.ma_dvi_kiemke || "";

      // Luồng ký kiểm kê tách riêng, không đi qua cập nhật trạng thái giao nhận.
      const pdfRes = await QLTB_signKiemKePdf(
        ma_dviqly,
        cap_ky,
        id,
        nguoi_ky,
        signImg,
        user?.ten_dang_nhap || user?.username || ""
      );

      if (!pdfRes.success) {
        showToast("error", pdfRes.message || "Ký không thành công!");
        return;
      }

      const bienBanInfo = await kiemKeThietBiService.get_by_id(id);

      const config = {
        1: {
          status: "Ký cấp 1",
          user: dataBienBan?.ten_daidien_c3,
          date: bienBanInfo?.ngay_giao || new Date().toISOString(),
        },
        2: {
          status: "Ký cấp 2",
          user: dataBienBan?.ten_daidien_dvi,
          date: bienBanInfo?.ngay_nhan || new Date().toISOString(),
        },
      };

      const { status, user: actor, date } = config[cap_ky];

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.status === status
            ? {
                ...event,
                user: actor,
                date: date,
              }
            : event
        )
      );

      setPdfData(pdfRes?.data);
      if (loadData) loadData();
      setIsSigned(true);

      if (refreshWaitSign) {
        await refreshWaitSign(user?.ten_dang_nhap);
      }

      showToast("success", "Ký số thành công!");
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi ký số!");
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getInfoSignUser = async () => {
      try {
        const IdNguoiC3 = dataBienBan?.nguoi_daidien_c3 || "";
        const IdNguoiDvi = dataBienBan?.nguoi_daidien_dvi || "";

        const [nguoiC3Info, nguoiDviInfo] = await safeGetUsersByUserName(
          IdNguoiC3,
          IdNguoiDvi
        );

        setEvents((prevEvents) =>
          prevEvents.map((e) => {
            if (e.status === "Ký cấp 1") {
              return {
                ...e,
                user: dataBienBan?.ten_daidien_c3,
                date: dataBienBan?.ngay_giao,
                avatarUrl: nguoiC3Info?.anhdaidien,
              };
            }
            if (e.status === "Ký cấp 2") {
              return {
                ...e,
                user: dataBienBan?.ten_daidien_dvi,
                date: dataBienBan?.ngay_nhan,
                avatarUrl: nguoiDviInfo?.anhdaidien,
              };
            }
            return e;
          })
        );
      } catch (err) {
        console.error(err.message);
      }
    };
    if (dataBienBan) {
      getInfoSignUser();
    }
  }, [dataBienBan]);

  const getPdfData = useCallback(async () => {
    try {
      if (!dataBienBan?.id) return;
      const pdfRes = await QLTB_previewPdf(
        dataBienBan?.id,
        dataBienBan?.trang_thai,
        4,
        "KIEM_KE",
        dataBienBan?.ma_dvi_kiemke
      );
      if (pdfRes.success) {
        setPdfData(pdfRes.data);
        setDisabledSignBtn(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  }, [dataBienBan?.id, dataBienBan?.trang_thai, dataBienBan?.ma_dvi_kiemke]);

  useEffect(() => {
    if (visible && dataBienBan?.id) {
      getPdfData();
    }
  }, [dataBienBan?.id, visible, getPdfData]);

  return (
    <Dialog
      className="viewer-dialog"
      header="Chi tiết biên bản kiểm kê ký số"
      visible={visible}
      style={{ width: "98vw", maxWidth: "1850px" }}
      onHide={handleCloseModalViewer}
    >
      <div className="viewer-container kiemke-landscape-viewer">
        <div className="pdf-view kiemke-landscape-pdf">
          {pdfData && <PDFViewerComponent pdfData={pdfData} className="pdf-viewer-container-qltn" />}
        </div>
        <div className="info-panel kiemke-info-panel surface-100 p-3">
          <div className="info-item mb-2">
            <label className="text-secondary">Loại kiểm kê:</label>
            <strong>{dataBienBan?.loai_kiemke === 3 ? "Phòng ban Công ty" : "Đơn vị cấp 4"}</strong>
          </div>
          <div className="info-item mb-2">
            <label className="text-secondary">Nhóm thiết bị:</label>
            <strong>
              {dataBienBan?.ten_nhom_thietbi
                ? `${dataBienBan.ten_nhom_thietbi}${dataBienBan?.ma_nhom_thietbi ? ` (${dataBienBan.ma_nhom_thietbi})` : ""}`
                : (dataBienBan?.ma_nhom_thietbi || "—")}
            </strong>
          </div>
          <div className="info-item mb-2">
            <label className="text-secondary">Đơn vị sử dụng:</label>
            <strong>{(dataBienBan?.loai_kiemke === 3
                ? (dataBienBan?.ten_phongban_kiemke || dataBienBan?.ten_dvi_kiemke || "")
                : (dataBienBan?.ten_dvi_kiemke || "")).toUpperCase()}</strong>
          </div>
          <div className="info-item mb-2">
            <label className="text-secondary">Đại diện Ban kiểm kê (Ký C1):</label>
            <strong>{dataBienBan?.ten_daidien_c3} ({dataBienBan?.chucvu_daidien_c3 || "Đại diện Ban kiểm kê"})</strong>
          </div>
          <div className="info-item mb-2">
            <label className="text-secondary">Đại diện ĐV sử dụng (Ký C2):</label>
            <strong>{dataBienBan?.ten_daidien_dvi} ({dataBienBan?.chucvu_daidien_dvi || "Đại diện ĐV sử dụng"})</strong>
          </div>
          <div className="info-item mb-2">
            <label className="text-secondary">Người lập biên bản:</label>
            <strong>{dataBienBan?.ten_nguoi_tao} ({dataBienBan?.chucvu_nguoi_tao || "Cán bộ quản lý thiết bị"})</strong>
          </div>
          <div className="info-item mb-2">
            <label className="text-secondary">Ngày kiểm kê:</label>
            <strong>{dataBienBan?.ngay_kiemke || dataBienBan?.ngay_tao || "—"}</strong>
          </div>
          <div className="info-item mb-3">
            <label className="text-secondary">Số lượng thiết bị:</label>
            <strong>{dataBienBan?.so_luong || 0} thiết bị</strong>
          </div>

          <SignatureTimeLine
            events={events}
            formatSignDate={formatSignDate}
            title="Tiến trình ký số"
          />
        </div>
      </div>
      <div className="flex justify-content-end gap-2 mt-3">
        {showSignBtn && showKySoBtn && (
          <Button
            label="Ký số"
            icon="pi pi-check-square"
            severity="success"
            loading={isLoading}
            disabled={disabledSignBtn}
            onClick={() => {
              if (isC1Signer) {
                sign(dataBienBan.id, 1);
              } else if (isC2Signer) {
                sign(dataBienBan.id, 2);
              }
            }}
          />
        )}
        <Button
          label="Đóng"
          icon="pi pi-times"
          severity="secondary"
          onClick={handleCloseModalViewer}
        />
      </div>
    </Dialog>
  );
};

export default QLTB_BienBanKiemKeViewer;
