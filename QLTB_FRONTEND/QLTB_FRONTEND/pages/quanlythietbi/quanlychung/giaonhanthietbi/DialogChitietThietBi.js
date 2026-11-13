import React from "react";
import { Dialog } from "primereact/dialog";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ExportExcelButton from "../../../../components/ExportExcelButton";

  // Gom nhóm thiết bị theo tên
const groupThietBiByTen = (list = []) => {
    return list.reduce((groups, tb) => {
    const key = (tb.ten_thietbi || "").trim() || "Khác";

    if (!groups[key]) groups[key] = [];
    groups[key].push(tb);

    return groups;
    }, {});
};

const DialogChiTietThietBi = ({ visible, onHide, devices }) => {
    
    // map tên cột
    const columnMapping = {
        ten_thietbi: "Tên thiết bị",
        no_thietbi: "Serial",
        ma_thietbi: "Mã thiết bị",
        dm_donvitinh_ten: "Đơn vị tính",
        tbi_dm_hangsx_ten: "Hãng SX",
        ten_nguoi_sd: "Người sử dụng"
    };

    const getDataExportExcel = async () => {
        if (!devices || devices.length === 0) return [];

        // Gom theo tên thiết bị
        const grouped = devices.reduce((acc, item) => {
            const key = item.ten_thietbi || "Nhóm không tên";
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        const result = [];
        let stt = 1; // STT bắt đầu từ 1

        Object.entries(grouped).forEach(([tenThietBi, items]) => {
            // Dòng nhóm: chỉ hiển thị tên nhóm + tổng số lượng
            const groupRow = {};
            groupRow["STT"] = ""; // dòng nhóm không có STT
            Object.keys(columnMapping).forEach(key => {
                groupRow[columnMapping[key]] = key === "ten_thietbi" ? tenThietBi : ""; // chỉ hiện tên nhóm ở cột tên thiết bị
            });
            groupRow["Số lượng"] = items.length; // tổng số lượng của nhóm
            result.push(groupRow);

            // Dòng chi tiết: hiển thị các cột chi tiết + STT
            items.forEach(item => {
                const row = {};
                row["STT"] = stt++;
                Object.keys(columnMapping).forEach(key => {
                    if (key !== "ten_thietbi") {
                        row[columnMapping[key]] = item[key] || "";
                    } else {
                        row[columnMapping[key]] = ""; // bỏ tên thiết bị ở dòng con
                    }
                });
                row["Số lượng"] = 1; // mỗi thiết bị = 1
                result.push(row);
            });
        });

        return result;
    };

    // Gom theo tên thiết bị
    const grouped = devices?.length ? groupThietBiByTen(devices) : {};

    return (
        <Dialog
        header="Chi tiết thiết bị"
        visible={visible}
        style={{ width: "60vw" }}
        modal
        onHide={onHide}
        >
        <div className="mb-3 flex justify-content-end">

            <ExportExcelButton
            fetchData={getDataExportExcel}
            fileName="Phu_luc_thiet_bi"
            sheetName="ThietBi"
            mapKeys={columnMapping}
            title="PHỤ LỤC THIẾT BỊ"
            />

        </div>

        <Accordion multiple>
            {Object.entries(grouped).map(([name, items]) => (
            <AccordionTab key={name} header={`${name} (${items.length})`}>
                <DataTable value={items} stripedRows showGridlines scrollable>
                    <Column header="STT" body={(_, o) => o.rowIndex + 1} style={{ width: "3rem" }} />
                    <Column field="ma_thietbi" header="Mã thiết bị" />
                    <Column field="no_thietbi" header="Serial" />
                    <Column field="dm_donvitinh_ten" header="Đơn vị tính" />
                    <Column field="tbi_dm_hangsx_ten" header="Hãng SX" />
                    <Column field="ten_nguoi_sd" header="Người SD mới" />
                </DataTable>
            </AccordionTab>
            ))}
        </Accordion>
        </Dialog>
    );
};

export default DialogChiTietThietBi;
