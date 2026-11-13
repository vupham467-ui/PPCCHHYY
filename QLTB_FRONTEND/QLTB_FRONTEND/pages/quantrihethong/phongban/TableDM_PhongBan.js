import React, { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { propSortAndFilter, rowsPerPages, scrollTableHeight } from "../../../constants/propGlobal";

import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { deleteDM_PHONGBAN } from "../../../services/quantrihethong/DM_PHONGBANService";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import useReload from "../../../hooks/useReload";
import ReloadButton from "../../../components/ReloadButton";
import Pagination from "../../../components/Pagination";
import { ProgressSpinner } from "primereact/progressspinner";

const TableDM_PhongBan = ({
    setVisible,
    setIsUpdate,
    setPHONGBAN,
    data,
    totalRecords,
    setPage,
    setPageSize,
    page,
    pageSize,
    donvi,
    loadData,
    isLoading,
    toast,
}) => {
    const [isHide, setIsHide] = useState(false);
    const [id, setId] = useState();
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [isMultiDelete, setIsMultiDelete] = useState(false);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ten: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        trang_thai: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const confirm = async () => {
        setIsHide(false);
        try {
            if (isMultiDelete) {
                const res = await Promise.all(selectedRecords.map(record => deleteDM_PHONGBAN(record.id)));
                const isSuccess = res.every(res => res.status == 200);
                const severity = isSuccess ? "success" : "error";
                const errors = res.filter(item => item.status !== 200).map(item => item.role).join(", ");
                const detailsMessage = isSuccess ? "Xóa các phòng ban đã chọn thành công" : `Các phòng ban xóa không thành công: ${errors}`;
                toast.current.show({
                    severity: severity,
                    summary: "Thông báo",
                    detail: detailsMessage,
                    life: 3000,
                });
            } else {
                const res =  await deleteDM_PHONGBAN(id);
                toast.current.show({
                    severity: "success",
                    summary: "Thông báo",
                    detail: "Xóa bản ghi thành công",
                    life: 3000,
                });
            }
            loadData();
        } catch (err) {
            console.log(err);
            toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Xóa bản ghi không thành công",
                life: 3000,
            });
        }
    };

    const cancel = () => {
        setIsHide(false);
    };

    const buttonOption = (rowData) => {
        return (
            <div className="flex">
                <Button
                    style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
                    icon="pi pi-pencil"
                    tooltip="Sửa"
                    tooltipOptions={{ position: "top" }}
                    onClick={() => {
                        setVisible(true);
                        setIsUpdate(true);
                        setPHONGBAN(rowData);
                        // console.log(rowData);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    tooltip="Xóa"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        backgroundColor: "#1445a7",
                    }}
                    onClick={() => {
                        setIsHide(true);
                        setId(rowData.id);
                        setIsMultiDelete(false);
                    }}
                />
            </div>
        );
    };

    const headerTemplate = (options) => {
        const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`
        return (
            <div className={className} >
                <span className='text-xl font-bold'>Danh sách</span>
                <div className="flex flex-column sm:flex-row gap-3">
                    {selectedRecords.length > 0 &&
                        <Button
                            label="Xóa nhiều"
                           severity="danger"
                            onClick={() => {
                                setIsHide(true);
                                setIsMultiDelete(true);
                            }}
                            disabled={!selectedRecords.length}
                        />
                    }
                    <Button
                        label="Thêm mới"
                        style={{ backgroundColor: '#1445a7' }}
                        onClick={() => {
                            setVisible(true);
                            setIsUpdate(false);
                        }}
                    />
                </div>
            </div>
        )
    }



    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

   
    const { isReloading, reload } = useReload(loadData);
    

    return (
        <>
            <Panel headerTemplate={headerTemplate}>
                <div className="flex justify-content-between">
                    <ReloadButton onReload={reload} isLoading={isReloading} />
                    <span className="p-input-icon-left w-full md:w-auto">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Tìm kiếm"
                            className="w-full md:w-auto"
                        />
                    </span>
                </div>
                <DataTable
                    value={data.data}
                    showGridlines
                    stripedRows
                    scrollable
                    scrollHeight={scrollTableHeight}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    loadingIcon={
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
                    }
                    loading={isLoading}
                    rows={pageSize}
                    className={`datatable-responsive mt-3 ${isReloading ? "reloading" : ""}`}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    selection={selectedRecords}
                    onSelectionChange={(e) => setSelectedRecords(e.value)}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3em', backgroundColor: '#1445a7', color: '#fff' }}></Column>
                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="ten"
                        header="Tên phòng ban"
                        className="min-w-10rem"
                    ></Column>
                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="ma_dviqly"
                        header="Mã ĐVQL"
                        className="min-w-8rem"
                    ></Column>
                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="ten_dviqly"
                        header="Tên đơn vị"
                        // body={(rowData) => {
                        //     let nameDv = donvi?.find(item => item.id === rowData.dm_donvi_id)?.ten
                        //     return <span>{nameDv}</span>
                        // }}
                        className="min-w-10rem"
                    ></Column>
                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="trang_thai"
                        header="Trạng thái"
                        body={(rowData) => {
                            return rowData.trang_thai === 1
                                ? "Có hiệu lực"
                                : "Hết hiệu lực";
                        }}
                        className="min-w-8rem"
                    ></Column>
                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        body={buttonOption}
                        header="Thao tác"
                        className="min-w-8rem"
                    ></Column>
                </DataTable>

                {totalRecords > 0 &&
                        <Pagination
                            pageIndex={page}
                            setPageIndex={setPage}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            totalRecords={totalRecords}
                        />
                }  
                {/* <div className="flex flex-column md:flex-row justify-content-between align-items-center gap-3 mt-4">
                    <div className="flex align-items-center">
                        <Button
                            outlined
                            text
                            icon={PrimeIcons.ANGLE_DOUBLE_LEFT}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            severity="secondary"
                        />
                        <p className="mx-4 mb-0">
                            Trang {page} trong tổng số {pageCount} trang
                        </p>
                        <Button
                            outlined
                            text
                            severity="secondary"
                            icon={PrimeIcons.ANGLE_DOUBLE_RIGHT}
                            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={page === pageCount}
                        />
                    </div>
                    <Dropdown
                        value={pageSize}
                        options={rowsPerPages}
                        onChange={(e) => {
                            setPageSize(e.value);
                            setPage(1);
                        }}
                        placeholder="Select rows per page"
                        className="w-full md:w-auto"
                    />
                </div> */}

            </Panel>

            <Toast ref={toast} />
            <ConfirmDialog
                visible={isHide}
                onHide={() => setIsHide(false)}
                header="Xác nhận"
                message={isMultiDelete ? "Bạn có chắc chắn xóa các bản ghi này không?" : "Bạn có chắc chắn xóa bản ghi này không?"}
                icon="pi pi-info-circle"
                footer={
                    <div>
                        <Button
                            severity="secondary"
                            outlined
                            label="Hủy"
                            icon="pi pi-times"
                            onClick={cancel}
                        />
                        <Button
                            severity="danger"
                            label="Đồng ý"
                            icon="pi pi-check"
                            onClick={confirm}
                            autoFocus
                        />
                    </div>
                }
            >
                <div className="card flex flex-wrap gap-2 justify-content-center"></div>
            </ConfirmDialog>
        </>
    );
};

export default TableDM_PhongBan;
