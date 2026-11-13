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
    don_vi: "Tên đơn vị",
    ten_nhom: "Nhóm thiết bị",
    ten_chungloai: "Chủng loại",
    tong_so_thiet_bi: "Tổng số thiết bị",
    da_dong_bo: "Đã đồng bộ",
    chua_dong_bo: "Chưa đồng bộ",
    dong_bo_loi: "Đồng bộ lỗi",
};


const BaoCaoDongBoThietBiCuTable = ({
    handleFilterData,
    filteredArr,
    loadData,
    setOptions,
    options,
    currentMenu,
    isLoading,
    isSelectGroup
}) => {
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoadingExport, setIsLoadingExport] = useState(false);

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
                ma_dviqly: options.ma_dviqly,
                ma_nhom: options.ma_nhom,
                chungloai_id: options.chungloai_id,
                trang_thai_tbi: options.trang_thai_tbi
            };

            const response = await baoCaoService.getBaoCaoDongBoThietBiCu(params);

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
                scrollable
                scrollHeight={scrollTableHeight}
                value={filteredArr?.filter(rowData => rowData?.ma_dviqly != null)}
                showGridlines
                stripedRows
                loadingIcon={
                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
                }
                loading={isLoading}
                // rowkey="id_bienban"
                // rowsPerPageOptions={rowPerPageOptions}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                selection={selectedRecords}
                onSelectionChange={(e) => setSelectedRecords(e.value)}
                responsiveLayout="scroll"
            >

                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="stt"
                    header={columnMapping.stt}
                    style={{minWidth: "3rem", textAlign:"center"}}
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
                {isSelectGroup && <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    header={columnMapping.ten_chungloai}
                    body={(rowData) => {
                            const {ma_chungloai, ten_chungloai} = rowData;
                            return `${ma_chungloai} - ${ten_chungloai}`    
                        }
                    }
                    style={{minWidth: "15rem"}}
                ></Column>
                }
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="tong_so_thiet_bi"
                    header={columnMapping.tong_so_thiet_bi}
                    style={{minWidth: "10rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="da_dong_bo"
                    header={columnMapping.da_dong_bo}
                    style={{minWidth: "10rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="chua_dong_bo"
                    header={columnMapping.chua_dong_bo}
                    style={{minWidth: "10rem"}}
                ></Column>
               <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="dong_bo_loi"
                    header={columnMapping.dong_bo_loi}
                    style={{minWidth: "8rem"}}
                ></Column>

            </DataTable>
        </Panel>

    );
};

export default BaoCaoDongBoThietBiCuTable;
