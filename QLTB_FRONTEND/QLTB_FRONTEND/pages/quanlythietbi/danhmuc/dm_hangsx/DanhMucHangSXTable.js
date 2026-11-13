import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import {
  headerStyleColumn,
  scrollTableHeight,
} from "../../../../constants/propGlobal";
import useDebounce from "../../../../hooks/useDebounce";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import Pagination from "../../../../components/Pagination";
import ReloadButton from "../../../../components/ReloadButton";
import useReload from "../../../../hooks/useReload";
import { hangSxTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";

const DanhMucHangSXTable = ({
  data,
  totalRecords,
  loadData,
  showToast,
  setFormData,
  setShowDialog,
  setIsAdd,
  pageSize,
  pageIndex,
  setPageSize,
  setPageIndex,
  isLoading,
}) => {
  const [searchData, setSearchData] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const delayTyping = useDebounce(searchData, 600);

  useEffect(() => {
    loadData(delayTyping);
  }, [delayTyping, loadData, pageSize, pageIndex]);

  
  const handleDelete = async () => {
    try {
      await hangSxTBService.delete(selectedId);
      showToast("success", "Xóa bản ghi thành công!")
      loadData(delayTyping);
    } catch (err) {
      showToast("error", "Xóa bản ghi thất bại!")
    } 
  };

  const { isReloading, reload } = useReload(loadData);
  
  return (
    <>
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Bạn có chắc chắn muốn xóa mục này?"
        header="Xác nhận xóa"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={handleDelete}
        reject={() => setVisible(false)}
      />
      <div className="flex flex-column md:flex-row justify-content-end align-items-center mb-2">
        {/* <ReloadButton onReload={reload} isLoading={isReloading} /> */}
        <InputText
          className="w-full md:w-3 mb-2 md:mb-0"
          type="search"
          value={searchData}
          onInput={(e) => setSearchData(e.target.value)}
          placeholder="Tìm kiếm..."
        />
      </div>

      <DataTable
        value={data}
        scrollable
        scrollHeight={scrollTableHeight}
        emptyMessage="Không tìm thấy dữ liệu"
        showGridlines={true}
        loadingIcon={
          <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
        }
        loading={isLoading}
      >
        <Column
          headerStyle={headerStyleColumn}
          header="STT"
          body={(_, options) => (pageIndex - 1) * pageSize + options.rowIndex + 1}
          style={{ width: "3%", minWidth: "2rem" }}
        />
        <Column
          headerStyle={headerStyleColumn}
          field="ma_hang_sx"
          header="Mã hãng SX"
          style={{ width: "25%", minWidth: "20rem" }}
        />
        <Column
          headerStyle={headerStyleColumn}
          field="ten_hang_sx"
          header="Tên hãng SX"
          style={{ width: "57%", minWidth: "20rem" }}

        />
        <Column
          header="Thao tác"
          headerStyle={headerStyleColumn}
          style={{ width: "15%" }}
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                tooltip="Sửa"
                onClick={() => {
                  setShowDialog(true);
                  setIsAdd(false)
                  setFormData(rowData);
                }}
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
              />
              <Button
                severity="danger"
                icon="pi pi-trash"
                tooltip="Xóa"
                onClick={() => {
                  setVisible(true);
                  setSelectedId(rowData.id);
                }}
              />
            </div>
          )}
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
    </>
  );
};

export default DanhMucHangSXTable;
