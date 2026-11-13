import React, { useState } from "react";
import { Button } from "primereact/button";
import { headerStyleColumn } from "../../constants/propGlobal";

const loaiNghiepVuColors = {
    BGC3: "bg-blue-500 text-white",
    BGC4: "bg-cyan-500 text-white",
    THC3: "bg-orange-500 text-white",
    THC4: "bg-red-500 text-white",
    BGSD: "bg-teal-500 text-white",
    THSD: "bg-purple-500 text-white",
    TLC3: "bg-red-500 text-white",
    TLC4: "bg-orange-500 text-white"
};

const thanhLyStatusMap = {
    0: { text: "Chưa duyệt thanh lý", className: "bg-yellow-100 text-yellow-800" },
    1: { text: "Đã duyệt thanh lý", className: "bg-green-100 text-green-700" }
};

const TimelineItem = ({ keyIdx, item, dotStyle, handleXemBienBan, handleXemThanhLy, selectedIndex, isLoading }) => {

    const {
        loai_bban, loai_nghiepvu, ten_loai_nghiepvu,
        ten_phongban_cu, ten_phongban_moi,
        ten_donvi_cu, ten_donvi_moi,
        ten_kho_cu, ten_kho_moi,
        ten_nguoi_giao, ten_nguoi_nhan,
        ten_nguoi_sd_cu, ten_nguoi_sd_moi,
        ngay_tao, ngay_nhan, trangthai_bb, trangthai_thanhly, thoigian_xacnhan
    } = item;

    const isGiaoOrTra = loai_bban == 0 || loai_bban == 2;
    const isThanhLy = loai_bban == 3;
    const mode = isGiaoOrTra
    ? "GIAO_TRA"
    : isThanhLy
    ? (loai_nghiepvu === "TLC3" ? "THANH_LY_TLC3" : "THANH_LY")
    : "THU_HOI";

    // Các nhãn động theo loại biên bản
    const LABEL_MAP = {
        GIAO_TRA: {
            noiGiao: "ĐV giao: ",
            noiNhan: "ĐV nhận: ",
            nguoiGiao: "Người giao: ",
            nguoiNhan: "Người nhận: ",
            nguoiSD: "Người SD mới: "
        },
        THU_HOI: {
            noiGiao: "ĐV thu hồi: ",
            noiNhan: "ĐV trả: ",
            nguoiGiao: "Người thu hồi: ",
            nguoiNhan: "Người trả: ",
            nguoiSD: "Người SD cũ: "
        },
        THANH_LY: {
            noiGiao: "ĐV thanh lý: ",
            noiNhan: "ĐV kiểm tra: ",
            nguoiGiao: "Đại diện ĐV thanh lý: ",
            nguoiNhan: "Đại diện ĐV kiểm tra: ",
            nguoiSD: "Người SD cũ: "
        },
        THANH_LY_TLC3: {
            noiGiao: "ĐV thanh lý: ",
            noiNhan: "ĐV kiểm tra: ",
            nguoiGiao: "Người kiểm tra: ",
            nguoiNhan: "Người xác nhận: ",
            nguoiSD: "Người SD cũ: "
        }
    };

    const label = LABEL_MAP[mode];


    // Mapping logic:
    const mapping = {
        BGC3:  { giao: ten_phongban_cu,   nhan: ten_phongban_moi, nguoiSD: ten_nguoi_sd_moi },
        BGC4:  { giao: ten_phongban_cu,   nhan: ten_donvi_moi },
        THC3:  { giao: ten_phongban_moi,  nhan: ten_phongban_cu, nguoiSD: ten_nguoi_sd_cu },
        THC4:  { giao: ten_donvi_cu,  nhan: ten_phongban_moi },
        BGSD:  { giao: ten_donvi_cu,        nhan: ten_phongban_moi, nguoiSD: ten_nguoi_sd_moi },
        THSD:  { giao: ten_donvi_moi,       nhan: ten_phongban_cu, nguoiSD: ten_nguoi_sd_cu },
        TLC3:  {giao: ten_donvi_cu, nhan: ten_phongban_cu},
        TLC4:  {giao: ten_donvi_cu, nhan: ten_donvi_moi}
    };

    const { giao, nhan, nguoiSD } = mapping[loai_nghiepvu] || {};

    const showNguoiSD = !["BGC4", "THC4", "TLC3", "TLC4"].includes(loai_nghiepvu);
    //trạng thái TL:
    const thanhLyStatus = thanhLyStatusMap[trangthai_thanhly];

    const isSelected = keyIdx == selectedIndex;

    //Trạng thái biên bản:
    const getDotConfig = (trangthai_bb) => {
        if (trangthai_bb == 2) {
            return {
                className: "bg-green-500 text-white",
                icon: "pi pi-check"
            };
        }

        return {
            className: "bg-blue-400 text-white",
            icon: "pi pi-clock"
        };
    };

    const dotConfig = getDotConfig(trangthai_bb);
    
    return (
        <div className="relative">

            {/* Dot timeline */}
            <div
                style={dotStyle}
                className={`${dotConfig.className} absolute border-circle border flex align-items-center justify-content-center shadow-1`}
            >
                <i className={`${dotConfig.icon} text-sm`} />
            </div>

            {/* Box */}
            <div className={`${isSelected ? "bg-blue-100" : "bg-gray-100"} border border-round-xl shadow-sm`}>
                <div className="p-2 flex justify-content-between align-items-center surface-border border-bottom-1">
                    <div className="flex align-items-center gap-4">
                        <i className="pi pi-clock text-sm" />
                        <span className="text-sm font-semibold">
                            {ngay_tao || "Chưa xác định"} - {ngay_nhan || "Chưa xác định"}
                        </span>
                        {isThanhLy && thanhLyStatus && (
                            <div className="flex align-items-center gap-2">
                                <Button
                                    label={thanhLyStatus.text}
                                    icon="pi pi-eye"
                                    tooltip="Xem thông tin thanh lý"
                                    className={`text-xs px-2 py-1 border-none p-button-sm ${thanhLyStatus.className}`}
                                    onClick={() => handleXemThanhLy(item)}
                                />
                                {trangthai_thanhly == 1 && (
                                    <span className="text-sm font-bold font-italic">
                                        ({thoigian_xacnhan})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <span className={`text-sm px-2 py-1 border-round-lg ${loaiNghiepVuColors[loai_nghiepvu] || "bg-gray-300 text-black"}`}>
                        {ten_loai_nghiepvu}
                    </span>
                </div>

                {/* Chi tiết */}
                <div className="flex flex-column sm:flex-row col-12 text-sm">

                    {/* BÊN GIAO */}
                    <div className="col-12 sm:col-5">
                        <div className="mb-1">{label.noiGiao} {giao}</div>
                        <div className="mb-1">{label.nguoiGiao} {ten_nguoi_giao}</div>
                    </div>

                    {/* ICON */}
                    <div className="flex flex-column justify-content-center align-items-center col-12 sm:col-2">
                        {isGiaoOrTra
                            ? <i className="pi pi-angle-double-right text-3xl text-blue-500" />
                            : <i className="pi pi-angle-double-left text-3xl text-red-500" />
                        }
                        <Button
                            label="Xem biên bản"
                            className="p-button-text p-button-sm underline hover:underline"
                            style={{
                                color: headerStyleColumn.backgroundColor,
                                padding: "0.25rem 0.5rem"
                            }}
                            disabled={isLoading}
                            loading={isLoading}
                            onClick={() => handleXemBienBan(item, keyIdx)}
                        />
                    </div>

                    {/* BÊN NHẬN */}
                    <div className="col-12 sm:col-5">
                        <div className="mb-1">{label.noiNhan} {nhan}</div>
                        <div className="mb-1">{label.nguoiNhan} {ten_nguoi_nhan}</div>

                        {showNguoiSD && (
                            <div className="mb-1">{label.nguoiSD} {nguoiSD}</div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default TimelineItem;
