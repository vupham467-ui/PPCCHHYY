import React, { useState, useRef, useEffect, useContext } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import useReload from "../../../../hooks/useReload";
import Pagination from "../../../../components/Pagination";
import ReloadButton from "../../../../components/ReloadButton";
import { storageHelper } from "../../../../utils/storageUtils";
import RenderSignStatus from "../../../../components/SignStatus";
import ButtonOption from "../../../../components/ButtonOption";
import { giaoNhanTBService } from "../../../../services/quanlythietbi/QLTB_GiaoNhanThietBi";
import { MADV_CTY, scrollTableHeight } from "../../../../constants/propGlobal";
import DialogChiTietThietBi from "./DialogChitietThietBi";
import { MenuContext } from "../../../../layout/context/menucontext";

const columnMapping = {
    stt: "STT",
    ngay_lapphieu: "Ngày lập phiếu",
    id: "ID Biên bản",
    ten_phongban_giao: "Đơn vị/Phòng ban giao",
    ten_dvi_nhan_hienthi: "Đơn vị/Phòng ban nhận",
    ten_nguoi_giao: "Người giao",
    ten_nguoi_nhan: "Người nhận",
    so_luong: "Số lượng",
    noi_dung: "Nội dung",
};


const GiaoNhanThietBiTable = ({
  dataTable,
  totalRecords,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
  loadData,
  showToast,
  isLoading,
  selectedRecords,
  setSelectedRecords,
  setIsShowDialog,
  setIsUpdate,
  setFormData,
  handleOnClickKySoBtn
}) => {
  const [isShow, setIsShow] = useState(false);  //Hiển thị dialog comfirm xóa
  const [id, setId] = useState(); //ID biên bản chọn
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [showTbDetailDialog, setShowTbDetailDialog] = useState(false);
  const [thietBiDetail, setThietBiDetail] = useState([]);
  const [loadingTbDetail, setLoadingTbDetail] = useState(false);
  
  const user = storageHelper.get("user");

  //Tìm kiếm local tại trang:
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ma_thietbi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const { refreshWaitSign } = useContext(MenuContext);

  const confirm = async () => {
    try {
      if (!selectedRecords?.id) {
        showToast("error", "Không thấy biên bản!");
        return;
      }

      const id = selectedRecords.id;
      const status = selectedRecords.trang_thai; // trạng thái ký

      let apiFunc;
      let payload;
      let successMsg;

      if (status === 0) {
        // trạng thái 0 → xóa hoàn toàn
        apiFunc = giaoNhanTBService.delete;
        payload = id;
        successMsg = "Xóa biên bản thành công";
      } else if (status === 1) {
        // trạng thái 1 → hủy (không xóa)
        apiFunc = giaoNhanTBService.cancel; 
        payload = {
          id,
          nguoi_huy: user?.ten_dang_nhap
        }
        successMsg = "Hủy biên bản thành công";
      } else {
        showToast("error", "Biên bản đã ký xong, không thể xóa/hủy!");
        return;
      }

      await apiFunc(payload);

      setIsShow(false);
      loadData();

      await refreshWaitSign(user?.ten_dang_nhap);

      showToast("success", successMsg);
    } catch (err) {
      console.log(err);
      
      let message = "Thao tác không thành công!";
      const error = err?.response?.data;

      message = (error && typeof error === "string"
        ? error
        : typeof error === "object"
          ? JSON.stringify(error)
          : message);

      console.log(err);
      showToast("error", message);
    }

    setIsShow(false);
  };

  const cancel = () => {
    setIsShow(false);
    setIsShowCancel(false);
  };



  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;

    //Chỉ Admin hoặc người quản lý TB tại P10 mới có quyền tạo phiếu:
    const dsQuyen = user?.ds_quyen || "";
    const dsQuyenArr = dsQuyen.split(',');
    const checkQuyenTaoBB = ['ADMIN', 'QLTB_QLP10'];
    const hasQuyenTaoBB = dsQuyenArr.some(q => checkQuyenTaoBB.includes(q));

    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">
          {hasQuyenTaoBB && 
            <Button 
                label="Thêm mới" 
                icon="pi pi-plus-circle"
                className="p-button-primary dim-on-disable"
                onClick={() => {
                    setIsShowDialog(true);
                    setIsUpdate(false);
                  } 
                }
            />
          } 
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  
  const buttonOption = (rowData) => {
    return (
      <div className="flex">
        <ButtonOption 
          rowData={rowData}
          actions={
            {
              setIsUpdate, //update
              handleOnClickUpdateBtn, //update
              setShowConfirmDialog: setIsShow, //Delete
              setId, //delete
              handleOnClickKySoBtn,
              setShowConfirmCancelDialog: setIsShow,
              setBienBan: setSelectedRecords
            }
          }
        />
      </div>
    );
  };

  //Nhấn nút cập nhật:
  const handleOnClickUpdateBtn = async (rowData) => {
    if (!rowData?.id) {
      showToast("error", "Không tìm thấy biên bản!");
      return;
    }
    try {
      // Chạy song song 2 API:
      const [item, thietbis] = await Promise.all([
        giaoNhanTBService.get_by_id(rowData.id), //Lấy thông tin biên bản
        giaoNhanTBService.getthietbi(rowData.id) //Lấy danh sách thiết bị
      ]);

      if (!item) {
        showToast("error", "Không lấy được dữ liệu biên bản!");
        return;
      }

      setFormData({
        ...item,
        kho_nhan_id: + item?.kho_nhan_id,
        ds_thietbi: thietbis || []
      });
      setIsUpdate(true);
      setIsShowDialog(true);

    } catch (err) {
        console.log(err);
        let message = "Lỗi khi tải dữ liệu";
        const error = err?.response?.data ;
        message = (error && typeof error === "string"
        ? error
        : typeof error === "object"
            ? JSON.stringify(error)
            : message);
        showToast("error", message);
      console.error(err);
    }
  };


  const handleViewThietBi = async (rowData) => {
    try {
      setLoadingTbDetail(true);

      const thietbis = await giaoNhanTBService.getthietbi(rowData.id);
      setThietBiDetail(thietbis || []);
      setShowTbDetailDialog(true);  // mở dialog riêng
    } catch (err) {
      showToast("error", "Không tải được danh sách thiết bị!");
    } finally {
      setLoadingTbDetail(false);
    }
  };

  const { isReloading, reload } = useReload(loadData);

  return (
    <>
      <Panel headerTemplate={headerTemplate({className: "p-panel-header panel-padding"})}>
        <div className="flex justify-content-between mb-3 gap-2">
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
          value={dataTable}
          scrollable
          scrollHeight={scrollTableHeight}
          showGridlines
          stripedRows
          loadingIcon={
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
          }
          loading={isLoading}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          rows={pageSize}
          className={`mt-3 ${isReloading ? "reloading" : ""}`}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          selection={selectedRecords}
          onSelectionChange={(e) => setSelectedRecords(e.value)}
          responsiveLayout="scroll"
        >
          {/* <Column 
            headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} 
            selectionMode="multiple"
          /> */}

          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            header={columnMapping.stt}
            body={(_, options) => (pageIndex - 1) * pageSize + options.rowIndex + 1}
            style={{minWidth: "3rem"}}
          />
          {/* <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            body={ getBtnGroup}
            header="Thao tác"
            style={{minWidth: "10rem"}}
          /> */}
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ngay_lapphieu"
            header={columnMapping.ngay_lapphieu}
            style={{minWidth: "10rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="id"
            header={columnMapping.id}
            style={{minWidth: "8rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_phongban_giao"
            header={columnMapping.ten_phongban_giao}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_dvi_nhan_hienthi"
            header={columnMapping.ten_dvi_nhan_hienthi}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_nguoi_giao"
            header={columnMapping.ten_nguoi_giao}
            style={{minWidth: "18rem" }}
            body={(rowData) => <RenderSignStatus rowData={rowData} isSend={true} />}
          ></Column>

          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_nguoi_nhan"
            header={columnMapping.ten_nguoi_nhan}
            style={{minWidth: "18rem" }}
            body={(rowData) => <RenderSignStatus rowData={rowData} isSend={false} />}
          ></Column>
          <Column
              headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
              header={columnMapping.so_luong}
              body={(rowData) => (
                  <Button
                      // loading={loadingTbDetail}
                      label={`${rowData.so_luong} thiết bị`}
                      className="p-button-text p-2 text-primary"
                      onClick={() => handleViewThietBi(rowData)}
                  />
              )}
              style={{ minWidth: "8rem" }}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="noi_dung"
            header={columnMapping.noi_dung}
            style={{minWidth: "15rem"}}
          />
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            body={buttonOption}
            header="Thao tác"
            style={{ width: "12%", minWidth: "10rem" }}
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

      
      {!loadingTbDetail && showTbDetailDialog && (
        <DialogChiTietThietBi
          visible={showTbDetailDialog}
          onHide={() => setShowTbDetailDialog(false)}
          devices={thietBiDetail}
        />
      )}

      <ConfirmDialog
        visible={isShow}
        onHide={() => setIsShow(false)}
        header="Xác nhận"
        message="Bạn có chắc chắn xóa/hủy biên bản này không?"
        icon="pi pi-info-circle"
        footer={
          <div className="flex justify-content-center gap-3">
            <Button
              severity="secondary"
              label="Hủy"
              icon="pi pi-times"
              onClick={cancel}
            />

            <Button
              severity="primary"
              label="Đồng ý"
              icon="pi pi-check"
              onClick={confirm}
            />
          </div>
        }
      >
      </ConfirmDialog>
    </>
  );
};

export default GiaoNhanThietBiTable;