import { Button } from "primereact/button";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { MADV_CTY, pageSizeSelect } from "../../../../constants/propGlobal";
import {  chungloaiTBService, nhomThietBiService, trangThaiTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { storageHelper } from "../../../../utils/storageUtils";
import { get_DM_DONVI_ROOT } from "../../../../services/quantrihethong/DM_DONVIService";
import { fetchData } from "../../../../utils/commonUltil";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import DangKyMoKhoaTBTable from "./DangKyMoKhoaTBTable";
import { dangKyMoKhoaTBService } from "../../../../services/quanlythietbi/QLTB_DangKyMoKhoaTBService";
import DialogFormDangky from "./DialogFormDangKy";


//Trạng thái đăng ký:
const arrTrangThaiDangKy = [
    { label: "Chưa đăng ký", value: "0" },
    { label: "Đã đăng ký mở khóa", value: "1" },
    { label: "Đã duyệt mở khóa", value: "2" },
    { label: "Đang khóa", value: "3" },
];

//Trạng thái thiết bị được phép đăng ký mở khóa:
const STATUS_ALLOW = [1, 5];

const DangKyMoKhoaTB = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const current_MADVIQLY = storageHelper.get("current_MADVIQLY");
  const [options, setOptions] = useState({
    id: "",
    search_thietbi: "",
    tbi_dm_chungloai_id: "",
    // ma_thietbi: "",
    // no_thietbi: "",
    ma_dviqly: current_MADVIQLY  == MADV_CTY ? "" : current_MADVIQLY,
    ma_nhom_tbi: "",
    trang_thai: "",
    tbi_trangthai_id: "",
    khoa_tbi: "",
    duyet_tbi: "",
    mk_ngay_khoa_tu: "",
    mk_ngay_khoa_den: "",
  });
  const [dataTable, setDataTable] = useState([]);
  const [donViArr, setDonViArr] = useState([]);
  const [trangThaiThietBiArr, setTrangThaiThietBiArr] = useState([]);
  const [nhomThietBiArr, setNhomThietBiArr] = useState([]);
  const [chungLoaiArr, setChungLoaiArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [isMulti, setIsMulti] = useState(false);
  const [isShowDialog, setIsShowDialog] = useState(false);

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
  }, []);

    // Khi nhóm thiết bị thay đổi => load lại chủng loại
    useEffect(() => {
        // reset chủng loại đang chọn mỗi khi nhóm thay đổi
        setOptions(prev => ({
            ...prev,
            tbi_dm_chungloai_id: null
        }));
  
        // nếu CHƯA chọn nhóm => load TẤT CẢ chủng loại
        if (!options.ma_nhom_tbi) {
            fetchData(
                chungloaiTBService.get,
                setChungLoaiArr,
                {}
            );
            return;
        }
  
        // nếu ĐÃ chọn nhóm => load chủng loại theo nhóm
        fetchData(
            chungloaiTBService.get,
            setChungLoaiArr,
            { ma_nhom: options.ma_nhom_tbi }
        );
    }, [options.ma_nhom_tbi]);

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

      const items = await dangKyMoKhoaTBService.get(params);
      
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


  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
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
            className="card mb-4"
          >
            {/* <Divider style={{ marginTop: "0", marginBottom: "10px" }} /> */}

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
              label="Tên, serial hoặc mã thiết bị"
              name="search_thietbi"
              type="search"
              value={options.search_thietbi}
              onChange={(e) =>
                  setOptions({ ...options, search_thietbi: e.target.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

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
              
            </div>
            <div className="grid">

              
              {/* Trạng thái thiết bị */}
              <DropdownField
                label="Trạng thái"
                name="tbi_trangthai_id"
                value={options.tbi_trangthai_id}
                options={(trangThaiThietBiArr || []).filter(x =>
                    STATUS_ALLOW.includes(x?.id)
                )}                
                optionLabel={(option) => `${option.ma} - ${option.ten}`}
                optionValue="id"
                onChange={(e) =>
                    setOptions({ ...options, tbi_trangthai_id: e.value })
                }
                divClassName="col-12 md:col-6 lg:col-3"
                labelClassName="mb-2 block"
              />

              {/* Trạng thái đăng ký */}
              <DropdownField
                label="Trạng thái đăng ký"
                name="trang_thai"
                value={options.trang_thai}
                options={arrTrangThaiDangKy}
                optionLabel={(option) => `${option.value} - ${option.label}`}
                optionValue="value"
                onChange={(e) =>
                    setOptions({ ...options, trang_thai: e.value })
                }
                divClassName="col-12 md:col-6 lg:col-3"
                labelClassName="mb-2 block"
              />

              {/* Đăng ký từ ngày */}
              <CalendarField
                label="Đăng ký từ ngày"
                name="mk_ngay_khoa_tu"
                placeholder="Chọn ngày"
                value={options?.mk_ngay_khoa_tu}
                onChange={(val) => setOptions(prev => ({ ...prev, mk_ngay_khoa_tu: val }))}
                dateStringFormat="DD/MM/YYYY"
                divClassName="col-12 md:col-6 lg:col-3"
                labelClassName="mb-2 block"
              />

              {/* Đăng ký đến ngày */}
              <CalendarField
                label="Đến ngày"
                name="mk_ngay_khoa_den"
                placeholder="Chọn ngày"
                value={options?.mk_ngay_khoa_den}
                onChange={(val) => setOptions(prev => ({ ...prev, mk_ngay_khoa_den: val }))}
                dateStringFormat="DD/MM/YYYY"
                divClassName="col-12 md:col-6 lg:col-3"
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
          </Panel>

          <DangKyMoKhoaTBTable
            dataTable={dataTable}
            totalRecords={totalRecords}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            loadData={loadData}
            showToast={showToast}
            isLoading={isLoading}
            selectedRecords={selectedRecords}
            setSelectedRecords={setSelectedRecords}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            isMulti={isMulti}
            setIsMulti={setIsMulti}
            setIsShowDialog={setIsShowDialog}
          />
          {isShowDialog && (
            <DialogFormDangky
              visible={isShowDialog}
              setVisible={setIsShowDialog}
              isMulti={isMulti}
              showToast={showToast}
              loadData={loadData}
              current_MADVIQLY={current_MADVIQLY}
              selectedRecords={selectedRecords}
              selectedId={selectedId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DangKyMoKhoaTB;
