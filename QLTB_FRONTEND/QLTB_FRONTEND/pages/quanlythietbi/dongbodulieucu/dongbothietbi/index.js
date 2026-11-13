import { Button } from "primereact/button";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
// import DiaglogForm from "./DiaglogForm";
import { MADV_CTY, pageSizeSelect, trangThaiDongBoArr } from "../../../../constants/propGlobal";
import { chungloaiTBService, nhomThietBiService, nuocSxService, trangThaiTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { storageHelper } from "../../../../utils/storageUtils";
import { get_DM_DONVI_ROOT } from "../../../../services/quantrihethong/DM_DONVIService";
import { fetchData, getLabelTrangThaiThietBi } from "../../../../utils/commonUltil";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DanhMucThietBiCuTable from "./DanhMucThietBiCuTable";
import { dongBoDuLieuService } from "../../../../services/quanlythietbi/QLTB_Dongbodulieu";
import DiaglogForm from "./DiaglogForm";
import { QLTB_DATA_THIETBICU } from "../../../../models/quanlythietbi/QLTB_DONGBODULIEU";
import DialogUpdateDoXa from "./DialogUpdateDoXa";
import ConfirmDialogCommon from "../../../../components/ConfirmDialogCommon";

const trangThaiDuyetArr = [
  {value: "1", label: "Đã duyệt"},
  {value: "0", label: "Chưa duyệt"},
];

const DanhMucThietBiCu = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const current_MADVIQLY = storageHelper.get("current_MADVIQLY");
  const [options, setOptions] = useState({
    ma_thietbi: "",
    no_thietbi: "",
    ten_thietbi: "",
    ma_dviqly: current_MADVIQLY  == MADV_CTY ? "" : current_MADVIQLY,
    ma_nhom_tbi: "",
    tbi_trangthai_new: "",
    tbi_dm_chungloai_id: "",
    sync_status: null
  });
  const [dataTable, setDataTable] = useState([]);
  const [formData, setFormData] = useState(QLTB_DATA_THIETBICU);
  const [donViArr, setDonViArr] = useState([]);
  const [trangThaiThietBiArr, setTrangThaiThietBiArr] = useState([]);
  const [nhomThietBiArr, setNhomThietBiArr] = useState([]);
  const [chungLoaiArr, setChungLoaiArr] = useState([]);
  const [nuocSXArr, setNuocSXArr] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isGetData, setIsGetData] = useState(false);

  //Nút cập nhật cho thiết bị đo xa:
  const [infoTimKiemDoXa, setInfoTimKiemDoXa] = useState({
    ma_dviqly: "",
    ma_nhom_tbi: "",
    tbi_trangthai_new: "",
    sync_status: null
  });
  const [showBtnUpdateDoXa, setShowBtnUpdateDoXa] = useState(false);
  const [showUpdateDoXaDialog, setShowUpdateDoXaDialog] = useState(false);
  const [showBtnRollBack, setShowBtnRollBack] = useState(false);
  const [showRollBackDoXaDialog, setShowRollBackDoXaDialog] = useState(false);
  const [isRollBack, setIsRollBack] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    const getDonViArr = async () => {
      try {
    
      const response = await get_DM_DONVI_ROOT(options.ma_dviqly);
      setDonViArr(response?.data);

      } catch (err) {
        console.log(err);
      } 
    }
    getDonViArr();
    fetchData(trangThaiTBService.get, setTrangThaiThietBiArr); //Danh mục trạng thái
    fetchData(nhomThietBiService.get, setNhomThietBiArr); //Danh mục nhóm thiết bị
    fetchData(chungloaiTBService.get, setChungLoaiArr); //Danh mục chủng loại thiết bị
    fetchData(nuocSxService.get, setNuocSXArr); //Danh mục nước SX thiết bị
  }, []);

  const loadData = async (isSearch = false) => {
    setIsLoading(true);
    setSelectedRecords([]);
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

      const items = await dongBoDuLieuService.get_thietbi(params);

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
    //Nếu là tìm kiếm thiết bị đo xa đang sử dụng hoặc trong kho của đơn vị hiện nút cập nhật:
    const canUpdate =
      options?.ma_dviqly == current_MADVIQLY &&
      options?.ma_nhom_tbi == "DX" &&
      options?.sync_status == 0 &&
      [1, 4, 5, 9].includes(Number(options?.tbi_trangthai_new));

    const canRollBack =
        options?.ma_dviqly == current_MADVIQLY &&
        options?.ma_nhom_tbi == "DX" &&
        options?.sync_status == 1 &&
        [1, 4, 5, 9].includes(Number(options?.tbi_trangthai_new));

    setShowBtnUpdateDoXa(canUpdate);
    setShowBtnRollBack(canRollBack);

    if(canUpdate || canRollBack) {
      setInfoTimKiemDoXa({
        ma_dviqly: options.ma_dviqly,
        ma_nhom_tbi: options?.ma_nhom_tbi,
        tbi_trangthai_new: options?.tbi_trangthai_new,
        sync_status: options?.sync_status
      })
    } else {
      setInfoTimKiemDoXa({
        ma_dviqly: "",
        ma_nhom_tbi: "",
        tbi_trangthai_new: "",
        sync_status: null
      })
    }
    
    loadData(true);
  };

  const handleRollBack = async () => {
    setIsRollBack(true);
    try {
      const user = storageHelper.get("user");
      const payload = {
        ma_dviqly: infoTimKiemDoXa.ma_dviqly,
        tbi_trangthai_new: (infoTimKiemDoXa.tbi_trangthai_new || "").toString(),
        update_by: user.ten_dang_nhap
      };
      const result = await dongBoDuLieuService.rollback_doxa_multi(payload);
      console.log(result);
      
      showToast("success", result);
      loadData();
    } catch (err) {
      let message = "Lỗi khi gửi dữ liệu";
      const error = err?.response?.data;
      message = (error && typeof error === "string"
      ? error
      : typeof error === "object"
      ? JSON.stringify(error)
      : message);
      showToast("error", message);
    } finally {
      setIsRollBack(false);
    }
  }

  const cancel = () => {
    setShowBtnRollBack(false);
  };


  const handleOnClickUpdateBtn = async (rowData) => {
    if (isGetData) return;
    const id = rowData?.id;
    if (!id) {
      showToast("error", "Không tìm thấy thiết bị!");
    }
    try {
      setIsGetData(true);
      const result = await dongBoDuLieuService.get_by_id(id);

      
      setFormData(result || QLTB_DATA_THIETBICU);
      setVisible(true);
      
    } catch (err) {
      console.log(err);
      showToast("error", "Có lỗi xảy ra!");
    } finally {
      setIsGetData(false);
    }
  };
  
  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
      life: 3000, 
    });
  };


  const getHeaderTemplate = (options) => {
    const className = `${options.className} flex flex-wrap align-items-start justify-content-between font-bold`;
    return (
      <div className={className}>
        <span className="w-full md:w-auto">{currentMenu}</span>
      </div>
    );
  }
  
  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <Panel 
            headerTemplate={getHeaderTemplate({ className: "p-panel-header panel-padding" })} 
            className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

          <div className="grid">
            {/* Đơn vị quản lý */}
            <DropdownField
              label="Đơn vị quản lý"
              name="ma_dviqly"
              value={options?.ma_dviqly}
              options={donViArr}
              optionLabel="ten"
              optionValue="ma_dviqly"
              onChange={(e) => setOptions({ ...options, ma_dviqly: e.value })}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
              disabled={current_MADVIQLY !== MADV_CTY}
            />

            {/* Tên thiết bị */}
            <InputTextField
              label="Tên thiết bị"
              name="ten_thietbi"
              type="search"
              value={options.ten_thietbi}
              onChange={(e) =>
                  setOptions({ ...options, ten_thietbi: e.target.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* Serial thiết bị */}
            <InputTextField
              label="Serial thiết bị"
              name="no_thietbi"
              type="search"
              value={options.no_thietbi}
              onChange={(e) =>
                  setOptions({ ...options, no_thietbi: e.target.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* Mã thiết bị */}
            <InputTextField
              label="Mã thiết bị"
              name="ma_thietbi"
              type="search"
              value={options.ma_thietbi}
              onChange={(e) =>
                  setOptions({ ...options, ma_thietbi: e.target.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />
          </div>

          <div className="grid">
            {/* Nhóm thiết bị */}
            <DropdownField
              label="Nhóm thiết bị"
              name="ma_nhom_tbi"
              value={options.ma_nhom_tbi}
              options={nhomThietBiArr}
              optionLabel={(option) => `${option.ma_nhom} - ${option.ten_nhom}`}
              optionValue="ma_nhom"
              onChange={(e) =>
                  setOptions({ ...options, ma_nhom_tbi: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />
            {/* Chủng loại thiết bị */}
            <DropdownField
              label="Chủng loại thiết bị"
              name="tbi_dm_chungloai_id"
              value={options.tbi_dm_chungloai_id}
              options={chungLoaiArr}
              optionLabel={(option) => `${option.ma_chungloai} - ${option.ten_chungloai}`}
              optionValue="id"
              onChange={(e) =>
                  setOptions({ ...options, tbi_dm_chungloai_id: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* <DropdownField
              label="Trạng thái duyệt"
              name="duyet_tbi"
              value={options.duyet_tbi}
              options={trangThaiDuyetArr}
              optionLabel={(option) => `${option.value} - ${option.label}`}
              optionValue="value"
              onChange={(e) =>
                  setOptions({ ...options, duyet_tbi: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            /> */}

            {/* Trạng thái thiết bị */}
            <DropdownField
              label="Trạng thái"
              name="tbi_trangthai_new"
              value={options.tbi_trangthai_new}
              options={trangThaiThietBiArr}
              optionLabel={(option) => `${option.ten}`}
              optionValue="id"
              onChange={(e) =>
                  setOptions({ ...options, tbi_trangthai_new: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />
            {/* Trạng thái đồng bộ */}
            <DropdownField
              label="Trạng thái đồng bộ"
              name="sync_status"
              value={options.sync_status}
              options={trangThaiDongBoArr}
              optionLabel={(option) => `${option.value} - ${option.label}`}
              optionValue="value"
              onChange={(e) =>
                  setOptions({ ...options, sync_status: e.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

          </div>

            <div className="flex justify-content-center mt-4">
              <Button
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
                label="Tìm kiếm"
                onClick={onClinkSearchBtn}
                severity="info"
                loading={isSearching}
              />
            </div>
          </Panel>

          <DanhMucThietBiCuTable
            setVisible={setVisible}
            dataTable={dataTable}
            totalRecords={totalRecords}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            loadData={loadData}
            showToast={showToast}
            isLoading={isLoading}
            handleOnClickUpdateBtn={handleOnClickUpdateBtn}
            selectedRecords={selectedRecords}
            setSelectedRecords={setSelectedRecords}
            options={options}
            showBtnUpdateDoXa={showBtnUpdateDoXa}
            setShowUpdateDoXaDialog={setShowUpdateDoXaDialog}
            showBtnRollBack={showBtnRollBack}
            setShowRollBackDoXaDialog={setShowRollBackDoXaDialog}
          />

          {visible && (
            <DiaglogForm
              formData={formData}
              setFormData={setFormData}
              visible={visible}
              setVisible={setVisible}
              showToast={showToast}
              loadData={loadData}
              donViArr={donViArr}
              chungLoaiArr={chungLoaiArr}
              nuocSXArr={nuocSXArr}
              trangThaiThietBiArr={trangThaiThietBiArr}
            />
          )}

          {/* Update đo xa */}
          {
           showUpdateDoXaDialog && (
              <DialogUpdateDoXa
                visible={showUpdateDoXaDialog}
                setVisible={setShowUpdateDoXaDialog}
                infoTimKiemDoXa={infoTimKiemDoXa}
                showToast={showToast}
                loadData={loadData}
              />
            )
          }

          {/* Rollback update đo xa*/}
          {
            showRollBackDoXaDialog && 
              <ConfirmDialogCommon
                visible={showRollBackDoXaDialog}
                setVisible={setShowRollBackDoXaDialog}
                header="Rollback cập nhật thiết bị đo xa"
                message={
                  `Bạn có chắc chắn rollback cập nhật cho các thiết bị đo xa 
                  ${getLabelTrangThaiThietBi(infoTimKiemDoXa.tbi_trangthai_new)} của ${infoTimKiemDoXa.ma_dviqly} không?`
                }
                multiInfo={{
                  isMulti: false,
                  count: 0
                }}
                isDanger={false}
                onConfirm={handleRollBack}
                onCancel={cancel}
                loading={isRollBack}
              />
          }
        </div>
      </div>
    </div>
  );
};

export default DanhMucThietBiCu;
