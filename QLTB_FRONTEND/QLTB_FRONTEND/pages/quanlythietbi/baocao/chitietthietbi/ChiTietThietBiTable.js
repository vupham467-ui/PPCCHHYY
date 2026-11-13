import { Panel } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { propSortAndFilter, rowsPerPages, scrollTableHeight } from "../../../../constants/propGlobal";
import { Dropdown } from "primereact/dropdown";
import ReloadButton from "../../../../components/ReloadButton";
import useReload from "../../../../hooks/useReload";
import ExportExcelButton from "../../../../components/ExportExcelButton";
import { ProgressSpinner } from "primereact/progressspinner";
import { storageHelper } from "../../../../utils/storageUtils";
import Pagination from "../../../../components/Pagination";
import { baoCaoService } from "../../../../services/quanlythietbi/QLTB_BaoCaoService";


const columnMapping = {
    stt: "STT",
    ma_dviqly: "Mã đơn vị",
    don_vi: "Đơn vị sử dụng",
    ten_nhom: "Nhóm TB",
    ten_chungloai: "Loại TB",
    no_thietbi: "Serial",
    ma_thietbi: "Mã TB",
    ten_thietbi: "Tên thiết bị",
    trang_thai: "Trạng thái",
    nam_sx: "Năm SX",
    trangthai_duyet: "TT duyệt",
    phongban_sd: "Phòng ban SD",
    ten_kho: "Kho",
    ten_nuoc_sx: "Nước SX",
    ten_hang_sx: "Hãng SX",
    nguoi_sd: "Người SD",
    thong_tin_khac: "TT khác",
};


const ChiTietThietBiTable = ({
    totalRecords,
    pageSize,
    pageIndex,
    setPageSize,
    setPageIndex,
    handleFilterData,
    filteredArr,
    loadData,
    setOptions,
    options,
    currentMenu,
    isLoading
}) => {
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoadingExport, setIsLoadingExport] = useState(false);

    const rowPerPageOptions = rowsPerPages;

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        handleFilterData(searchTerm);
    }, [searchTerm]);


    const getDataExportExcel = async () => {
        setIsLoadingExport(true);
        try {
            const params = {
                pageIndex: 1,
                pageSize: 0,
                ma_dviqly: options.ma_dviqly,
                dm_chungloai_id: options.dm_chungloai_id,
                trang_thai_tbi: options.trang_thai_tbi
            };

            const response = await baoCaoService.getBaoCaoChiTiet(params);

            const dataBC = response?.data || [];
            const mappedData = dataBC.map(rowData => ({
                ...rowData,
            }));

            return mappedData;
            
        } catch (error) {
            console.error("Lỗi khi xuất Excel:", error);
        } finally {
            setIsLoadingExport(false);
        }
    }

    // Render title table
    const headerTemplate = (options) => {
        const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;
        return (


            <div className={className}>
                <span className="text-xl font-bold">Danh sách</span>
                <div className="flex flex-column sm:flex-row gap-3">

                    <ExportExcelButton
                        fetchData={getDataExportExcel}
                        fileName={currentMenu}
                        title={currentMenu}
                        sheetName="Sheet1"
                        mapKeys={columnMapping}
                        isLoading={isLoadingExport}
                    />

                </div>
            </div>
        );
    };

    const { isReloading, reload } = useReload(loadData);

    return (
        <Panel headerTemplate={headerTemplate({ className: "p-panel-header panel-padding-small" })}>
            <div className="flex justify-content-between mb-3 gap-2">
                <div className="flex items-center">
                    <ReloadButton onReload={reload} isLoading={isReloading} />
                </div>

                <span className="p-input-icon-left w-full md:w-auto">
                    <i className="pi pi-search" />
                    <InputText
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Tìm kiếm"
                        className="w-full md:w-auto"
                    />
                </span>
            </div>
            <DataTable
                // value={filteredArr}
                value={filteredArr?.filter(rowData => rowData?.ma_dviqly != null)}
                scrollable
                scrollHeight={scrollTableHeight}
                showGridlines
                stripedRows
                loadingIcon={
                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
                }
                loading={isLoading}
                // rowkey="id_bienban"
                rows={pageSize}
                rowsPerPageOptions={rowPerPageOptions}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                selection={selectedRecords}
                onSelectionChange={(e) => setSelectedRecords(e.value)}
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
                    field="ma_dviqly"
                    header={columnMapping.ma_dviqly}
                    style={{minWidth: "10rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="don_vi"
                    header={columnMapping.don_vi}
                    style={{minWidth: "18rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="ten_nhom"
                    header={columnMapping.ten_nhom}
                    style={{minWidth: "15rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="ten_chungloai"
                    header={columnMapping.ten_chungloai}
                    style={{minWidth: "8rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="no_thietbi"
                    header={columnMapping.no_thietbi}
                    style={{minWidth: "10rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="ma_thietbi"
                    header={columnMapping.ma_thietbi}
                    style={{minWidth: "10rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="ten_thietbi"
                    header={columnMapping.ten_thietbi}
                    style={{minWidth: "15rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="trang_thai"
                    header={columnMapping.trang_thai}
                    style={{minWidth: "10rem"}}
                ></Column>
                
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="ten_kho"
                    header={columnMapping.ten_kho}
                    style={{minWidth: "15rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="ten_nuoc_sx"
                    header={columnMapping.ten_nuoc_sx}
                    style={{minWidth: "10rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="ten_hang_sx"
                    header={columnMapping.ten_hang_sx}
                    style={{minWidth: "10rem"}}
                ></Column>
               <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="nam_sx"
                    header={columnMapping.nam_sx}
                    style={{minWidth: "8rem"}}
                ></Column>

                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="trangthai_duyet"
                    header={columnMapping.trangthai_duyet}
                    style={{minWidth: "8rem"}}
                ></Column>

                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="phongban_sd"
                    header={columnMapping.phongban_sd}
                    style={{minWidth: "18rem"}}
                ></Column>

                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="nguoi_sd"
                    header={columnMapping.nguoi_sd}
                    style={{minWidth: "15rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="thong_tin_khac"
                    header={columnMapping.thong_tin_khac}
                    style={{minWidth: "10rem"}}
                ></Column>

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
        </Panel>

    );
};

export default ChiTietThietBiTable;
