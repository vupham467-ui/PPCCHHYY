import React, { useContext, useEffect, useRef, useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { signInfoState } from "../../constants/propGlobal";
import { storageHelper } from "../../utils/storageUtils";
import { QLTB_previewPdf, QLTB_signPdf } from "../../utils/pdfUtils";
import { giaoNhanTBService } from "../../services/quanlythietbi/QLTB_GiaoNhanThietBi";
import { safeGetUsersByUserName } from "../../utils/commonUltil";
import PDFViewerComponent from "../PDFViewer";
import SignatureTimeLine from "../SignatureTimeLine";
import SignButtonQLTB from "./SignButtonQLTB";
import { formatSignDate } from "../../utils/dateUtils";
import { MenuContext } from "../../layout/context/menucontext";

const QLTB_BienBanKiemTraThanhLyViewer = ({
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
    const user = storageHelper.get("user");

    //Hàm ký chung:
    const sign = async (id, cap_ky) => {
        try {
            setIsLoading(true);

            const nguoi_ky = user?.ho_ten || "";
            const signImg = user?.sign_image || "";
            const ma_dviqly = dataBienBan?.ma_dvi_nhan; //Mã đơn vị nhận TB
            const loai_bban = dataBienBan?.loai_bban;
            const loai_nghiepvu = dataBienBan?.loai_nghiepvu;

            // Gọi API ký PDF
            const pdfData = await QLTB_signPdf(
                ma_dviqly,
                cap_ky,
                id,
                loai_bban,
                loai_nghiepvu,
                nguoi_ky,
                signImg
            );

            if (!pdfData.success) {
            showToast("error", pdfData.message || "Ký không thành công!");
            return;
            }

            // Lấy thông tin biên bản
            const bienBanInfo = await giaoNhanTBService.get_by_id(id);

            // Cấu hình cho từng cấp ký
            const config = {
            1: {
                status: "Ký cấp 1",
                user: dataBienBan.ten_nguoi_giao,
                date: bienBanInfo?.ngay_giao,
            },
            2: {
                status: "Ký cấp 2",
                user: dataBienBan.ten_nguoi_nhan,
                date: bienBanInfo?.ngay_nhan,
            },
            };

            const { status, user: actor, date } = config[cap_ky];

            // Cập nhật event
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

            setPdfData(pdfData?.data);
            loadData();
            setIsSigned(true);

            //refresh chờ ký:
            await refreshWaitSign(user?.ten_dang_nhap);
            
            showToast("success", "Ký thành công!");
        } catch (err) {
            showToast("error", "Có lỗi xảy ra!");
            console.log(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getInfoSignUser = async () => {
        try {
            const IdNguoiGiao = dataBienBan?.nguoi_giao || "";
            const IdNguoiNhan = dataBienBan?.nguoi_nhan || "";

            const [nguoiGiaoInfo, nguoiNhanInfo] = await safeGetUsersByUserName(
            IdNguoiGiao,
            IdNguoiNhan
            );

            setEvents((prevEvents) =>
            prevEvents.map((e) => {
                if (e.status === "Ký cấp 1") {
                return {
                    ...e,
                    user: dataBienBan?.ten_nguoi_giao,
                    date: dataBienBan?.ngay_giao,
                    avatarUrl: nguoiGiaoInfo?.anhdaidien,
                };
                }
                if (e.status === "Ký cấp 2") {
                return {
                    ...e,
                    user: dataBienBan?.ten_nguoi_nhan,
                    date: dataBienBan?.ngay_nhan,
                    avatarUrl: nguoiNhanInfo?.anhdaidien,
                };
                }
                return e;
            })
            );
        } catch (err) {
            console.log(err.message);
        }
        };
        getInfoSignUser();
    }, [dataBienBan]);

    //Lấy dữ liệu pdf để view:
    const getPdfData = async () => {
        try {         
        const pdfData = await QLTB_previewPdf(
            dataBienBan?.id,
            dataBienBan?.trang_thai,
            dataBienBan?.loai_bban,
            dataBienBan?.loai_nghiepvu,
            dataBienBan?.ma_dvi_nhan
        );
        if (pdfData.success) {
            setPdfData(pdfData.data);
            setDisabledSignBtn(false);
        }
        return pdfData;
        } catch (err) {
        console.log("====================================");
        console.log(err.message);
        console.log("====================================");
        }
    };

    useEffect(() => {
        getPdfData();
    }, [dataBienBan?.id]);

    const isThanhLyC3 = dataBienBan?.loai_nghiepvu == "TLC3"; 

    return (
        <Dialog
            className="viewer-dialog"
            header="Chi tiết văn bản ký số"
            visible={visible}
            onHide={handleCloseModalViewer}
        >
            <div className="viewer-container">
                <div className="pdf-view">
                {pdfData && <PDFViewerComponent pdfData={pdfData} />}
                </div>
                <div className="info-panel surface-100">
                <div className="info-item">
                    <label>Đơn vị thanh lý:</label>
                    <strong>
                    {(dataBienBan?.ten_dvi_giao || "").toUpperCase()}
                    </strong>
                </div>
                <div className="info-item">
                    <label>Đơn vị kiểm tra:</label>
                    <strong>
                    {(dataBienBan?.ten_phongban_nhan || "").toUpperCase()}
                    </strong>
                </div>
                <div className="info-item">
                    <label>{isThanhLyC3? "Người kiểm tra" : "Đại diện ĐV thanh lý:"}</label>
                    <strong>{dataBienBan?.ten_nguoi_giao}</strong>
                </div>
                <div className="info-item">
                    <label>{isThanhLyC3? "Người xác nhận" : "Đại diện ĐV kiểm tra:"}</label>
                    <span className="select-item">
                    <strong>{dataBienBan?.ten_nguoi_nhan}</strong>
                    </span>
                </div>
                <div className="info-item">
                    <label>Số lượng:</label>
                    <strong>{dataBienBan?.so_luong}</strong>
                </div>

                <SignatureTimeLine
                    events={events}
                    formatSignDate={formatSignDate}
                    title="Tiến trình ký số"
                />
                </div>
            </div>
            <div className="flex justify-content-end" style={{ marginTop: "15px" }}>
                {showSignBtn && (
                    <SignButtonQLTB
                        dataReport={dataBienBan}
                        sign={sign}
                        showToast={showToast}
                        isSigned={isSigned}
                        disabled={disabledSignBtn}
                        loading={isLoading}
                    />
                )}
                <Button
                    label="Đóng"
                    severity="secondary"
                    onClick={handleCloseModalViewer}
                />
            </div>
        </Dialog>
    );
};

export default QLTB_BienBanKiemTraThanhLyViewer;
