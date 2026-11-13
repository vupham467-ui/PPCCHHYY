import { Button } from "primereact/button";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Panel } from "primereact/panel";
import { MADV_CTY, pageSizeSelect } from "../../../../constants/propGlobal";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import { kiemTraTBService } from "../../../../services/quanlythietbi/QLTB_KiemTraTBService";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Column } from "primereact/column";
import LabelStatus from "../../../../components/LabelStatus";
import Pagination from "../../../../components/Pagination";


const DialogLichSuKiemTra = ({
    visible,
    setVisible,
    donViArr,
    showToast,
    current_MADVIQLY,
    danhMucKetQuaKiemTra,
    selectedId
}) => {

    const danhMucKetQuaKiemTraFiltered = danhMucKetQuaKiemTra.filter(item => item.value !== "O");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeSelect);
    const [totalRecords, setTotalRecords] = useState(0);

    const [options, setOptions] = useState({
        tbi_id: selectedId,
        donvi_kiemtra: current_MADVIQLY  == MADV_CTY ? "" : current_MADVIQLY,
        nguoi_kiemtra: "",
        ket_qua: "",
        
    });
    const [dataTable, setDataTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);



    const loadData = async (isSearch = false) => {
        setIsLoading(true);
        if (isSearch) {
            setIsSearching(true);
            setPageIndex(1);
        }
        try {
            const params = {
                ...options,
                pageIndex: isSearch ? 1 : pageIndex,
                pageSize: pageSize,
            };
            
            const items = await kiemTraTBService.getLichSu(params);
            
            setDataTable(items?.data || []);
            setTotalRecords(items?.totalItems);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setDataTable([]);
        } finally {
            setIsLoading(false);
            setIsSearching(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [pageIndex, pageSize]);


    const onClinkSearchBtn = (e) => {
        loadData(true);
    };



    return (
        <Dialog
            header={"Lịch sử kiểm tra thiết bị"}
            visible={visible}
            className="w-9"
            onHide={() => {
                setVisible(false);
            }}
        >
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="grid">

                        {/* Đơn vị kiểm tra */}
                        <DropdownField
                            label="Đơn vị kiểm tra"
                            name="donvi_kiemtra"
                            value={options?.donvi_kiemtra}
                            options={donViArr}
                            optionLabel="ten"
                            optionValue="ma_dviqly"
                            onChange={(e) => setOptions({ ...options, donvi_kiemtra: e.value })}
                            divClassName="col-12 md:col-6 lg:col-4"
                            labelClassName="mb-2 block"
                        />

                        <InputTextField
                            label="Người kiểm tra"
                            name="nguoi_kiemtra"
                            type="search"
                            value={options.nguoi_kiemtra}
                            onChange={(e) =>
                                setOptions({ ...options, nguoi_kiemtra: e.target.value })
                            }
                            divClassName="col-12 md:col-6 lg:col-4"
                            labelClassName="mb-2 block"
                        />

                        {/* Kết quả kiểm tra */}
                        <DropdownField
                            label="Kết quả"
                            name="ket_qua"
                            value={options.ket_qua}
                            options={danhMucKetQuaKiemTraFiltered}
                            optionLabel={(option) => `${option.value} - ${option.label}`}
                            optionValue="value"
                            onChange={(e) =>
                                setOptions({ ...options, ket_qua: e.value })
                            }
                            divClassName="col-12 md:col-6 lg:col-4"
                            labelClassName="mb-2 block"
                        />

                    </div>

                    <div className="flex justify-content-center mt-2">
                        <Button
                            style={{ backgroundColor: "#1445a7", color: "#fff" }}
                            label="Tìm kiếm"
                            onClick={onClinkSearchBtn}
                            severity="info"
                            loading={isSearching}
                        />
                    </div>

                    <DataTable
                    value={dataTable}
                    showGridlines
                    stripedRows
                    loadingIcon={
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
                    }
                    loading={isLoading}
                    rows={pageSize}
                    className="mt-3"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    responsiveLayout="scroll"
                    >

                    <Column
                        headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                        header="STT"
                        body={(_, options) => (pageIndex - 1) * pageSize + options.rowIndex + 1}
                        style={{minWidth: "3rem"}}
                    />

                    <Column
                        headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                        field="ten_thietbi"
                        header="Tên thiết bị"
                        style={{minWidth: "15rem"}}
                    />
                    <Column
                        headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                        field="no_thietbi"
                        header="Serial"
                        style={{minWidth: "10rem"}}
                    />
                    <Column
                        headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                        field="ket_qua"
                        header="Kết quả"
                        body={(rowData) => {
                        const ketQua = rowData?.ket_qua || "";
                        const trang_thai = ketQua == "Y" ? 1 : ((ketQua == "N") ? 2 : 0);
                        const label = ketQua == "Y" ? "Đạt" : ((ketQua == "N") ? "Không đạt" : "Chưa kiểm tra");

                        return (
                            <LabelStatus trang_thai={trang_thai} label={label}/>
                        );
                        }}
                        style={{minWidth: "10rem"}}
                    />
                    <Column
                        headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                        field="donvi_kiemtra"
                        header="Đơn vị KT"
                        style={{minWidth: "15rem"}}
                    />
                    <Column
                        headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                        field="nguoi_kiemtra"
                        header="Người KT"
                        style={{minWidth: "10rem"}}
                    />
                    <Column
                        headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                        field="ngay_kiemtra"
                        header="Ngày KT"
                        style={{minWidth: "10rem"}}
                    />

                    <Column
                        headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                        field="ghi_chu"
                        header="Ghi chú"
                        style={{minWidth: "15rem"}}
                    />
                    </DataTable>

                    {totalRecords > 0 &&
                        <Pagination
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            totalRecords={totalRecords}
                        />
                    }  
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogLichSuKiemTra;
