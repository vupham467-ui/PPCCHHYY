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
import { baoCaoService } from "../../../../services/quanlythietbi/QLTB_BaoCaoService";


const columnMapping = {
    stt: "STT",
    ten_phong: "Phòng ban",
    loai_nghiepvu: "Loại nghiệp vụ",
    ten_loai_nghiepvu: "Tên loại nghiệp vụ",
    tong_bienban: "Tổng biên bản",
    da_hoan_thanh: "Đã hoàn thành",
    chua_ky_du: "Chưa ký đủ",
    chua_ky: "Chưa ký",
};


const BaoCaoThongKeBBC3Table = ({
    handleFilterData,
    filteredArr,
    loadData,
    setOptions,
    options,
    currentMenu,
    isLoading,
    showToast
}) => {
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [title, setTitle] = useState(`Báo cáo tổng hợp biên bản ĐVC3 từ ngày ${options.fromDate} đến ngày ${options.toDate}`);

    const rowPerPageOptions = rowsPerPages;

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        handleFilterData(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        setTitle(`Báo cáo tổng hợp biên bản ĐVC3 từ ngày ${options.tu_ngay} đến ngày ${options.den_ngay}`);
    }, [options.tu_ngay, options.den_ngay]);


    const getDataExportExcel = async () => {
        setIsLoadingExport(true);
        try {

            const response = await baoCaoService.getBaoCaoTongHopBienBanC3(options);

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
                        fileName="Báo cáo tổng hợp biên bản ĐVC3"
                        title={title}
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
                value={filteredArr}
                scrollable
                scrollHeight={scrollTableHeight}
                showGridlines
                stripedRows
                loadingIcon={
                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
                }
                loading={isLoading}
                // rowkey="id_bienban"
                rowsPerPageOptions={rowPerPageOptions}
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
                    field="ten_phong"
                    header={columnMapping.ten_phong}
                    style={{minWidth: "18rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="loai_nghiepvu"
                    header={columnMapping.loai_nghiepvu}
                    style={{minWidth: "8rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="ten_loai_nghiepvu"
                    header={columnMapping.ten_loai_nghiepvu}
                    style={{minWidth: "15rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="tong_bienban"
                    header={columnMapping.tong_bienban}
                    style={{minWidth: "8rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="da_hoan_thanh"
                    header={columnMapping.da_hoan_thanh}
                    style={{minWidth: "10rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="chua_ky_du"
                    header={columnMapping.chua_ky_du}
                    style={{minWidth: "10rem"}}
                ></Column>
                <Column
                    headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                    field="chua_ky"
                    header={columnMapping.chua_ky}
                    style={{minWidth: "10rem"}}
                ></Column>

            </DataTable>

        </Panel>

    );
};

export default BaoCaoThongKeBBC3Table;
