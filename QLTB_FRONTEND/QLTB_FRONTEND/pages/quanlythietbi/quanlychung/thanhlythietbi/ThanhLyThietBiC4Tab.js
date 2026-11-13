import { Button } from "primereact/button";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { MADV_CTY, mockData, pageSizeSelect, QLTB_LoaiThuHoiArr } from "../../../../constants/propGlobal";
import { storageHelper } from "../../../../utils/storageUtils";
import { get_DM_DONVI_ROOT } from "../../../../services/quantrihethong/DM_DONVIService";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import { giaoNhanTBService } from "../../../../services/quanlythietbi/QLTB_GiaoNhanThietBi";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
import ThanhLyThietBiC4Table from "./ThanhLyThietBiC4Table";
import DialogFormThanhLyC4 from "./DialogFormThanhLyC4";
import QLTB_BienBanKiemTraThanhLyViewer from "../../../../components/QLTB/QLTB_BienBanKiemTraThanhLyViewer";

const  arrTrangThai = [
    { label: "Khởi tạo", value: 0 },
    { label: "Đơn vị C4 đã ký xác nhận kiểm tra", value: 1 },
    { label: "P10 đã ký xác nhận kiểm tra", value: 2 },
];

const  arrTrangThaiThanhLy = [
    { label: "Chưa duyệt thanh lý", value: -1 },
    { label: "Đang duyệt thanh lý", value: 0 },
    { label: "Đã duyệt thanh lý", value: 1 },
];

const ThanhLyThietBiC4Tab = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const current_MADVIQLY = storageHelper.get("current_MADVIQLY");
  const user = storageHelper.get("user");
  const [options, setOptions] = useState({
    id: "",
    ma_dvi_giao: current_MADVIQLY  == MADV_CTY ? "" : current_MADVIQLY, //Nếu là công ty mặc định hiện tất cả
    ma_dvi_nhan: MADV_CTY,
    phongban_giao_id: "",
    nguoi_tao: "",
    nguoi_nhan: "",
    trang_thai: null,
    loai_bban: 3, // biên bản xác nhận thanh lý
    loai_nghiepvu: "TLC4", //xác nhận thanh lý C4
    tu_ngay: "",
    den_ngay: "",
    trang_thai_thanh_ly: null
  });
  const [dataTable, setDataTable] = useState([]);
  const [donViThanhLyArr, setDonViThanhLyArr] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [formData, setFormData] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [visibleViewer, setVisibleViewer] = useState(false); //dialog phiếu


  const toast = useRef(null);

  //Danh sách đơn vị thanh lý:
  useEffect(() => {
    const getData = async () => {
      try {
        const resDVTL = await get_DM_DONVI_ROOT(options.ma_dvi_giao)
        setDonViThanhLyArr(resDVTL?.data);
        
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

    // Load DS người lập biên bản xác nhận thiết bị hỏng chờ thanh lý
    useEffect(() => {
      const fetchNguoiTao = async () => {
        if (!options?.ma_dvi_giao) {
          setUsers([]);
          return;
        }
        try {
          const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY({
            ma_dviqly: options?.ma_dvi_giao,
            db_maphongban: options?.phongban_giao_id,
            vai_tro: "QLTB_QLC4"
          });
          setUsers(res || []);
        } catch (e) {
          console.log(e);
        }
      };
      fetchNguoiTao();
    }, [options?.ma_dvi_giao, options?.phongban_giao_id]);

  const loadData = async (isSearch = false) => {
    setIsLoading(true);
    if (isSearch) {
      setIsSearching(true);
      setPageIndex(1);
    }
    try {

      // const dsQuyen = user?.ds_quyen || "";
      // const dsQuyenArr = dsQuyen.split(',');
      // const checkQuyenXemBB = ['ADMIN', 'QLTB_QLP10'];
      // const hasQuyenXemBB = dsQuyenArr.some(q => checkQuyenXemBB.includes(q));

      const params = {
        ...options,
        // user: hasQuyenXemBB ? "" : user?.ten_dang_nhap, //Có quyền xem thì truyền user rỗng để xem hết biên bản
        user: "",
        pageIndex: isSearch ? 1 : pageIndex,
        pageSize: pageSize,
      };

      const items = await giaoNhanTBService.getBienBanKiemTraThanhLy(params);
      // console.log(items.data);
      
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

  const handleCloseModalViewer = () => {
      setVisibleViewer(false);
      setSelectedRecords({});
  };

  const handleOnClickKySoBtn = (rowData) => {
      setVisibleViewer(true);
      setSelectedRecords(rowData);
  };


  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
    });
  };


  // const getHeaderTemplate = (options) => {
  //   const className = `${options.className} flex flex-wrap align-items-start justify-content-between font-bold`;
  //   return (
  //     <div className={className}>
  //       <span className="w-full md:w-auto">{currentMenu}</span>
  //     </div>
  //   );
  // }
  
  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <div
          // headerTemplate={getHeaderTemplate({ className: "p-panel-header panel-padding" })} 
          className="card mb-4"
        >
          {/* <Divider style={{ marginTop: "0", marginBottom: "10px" }} /> */}
          <div className="grid">

            {/* Đơn vị nhận */}
            <DropdownField
              label="Đơn vị thanh lý"
              name="ma_dvi_giao"
              value={options?.ma_dvi_giao}
              options={donViThanhLyArr.filter(dv => dv.ma_dviqly !== MADV_CTY)}
              optionLabel="ten"
              optionValue="ma_dviqly"
              onChange={(e) => setOptions({ ...options, ma_dvi_giao: e.value })}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
              disabled={current_MADVIQLY !== MADV_CTY }
            />
            {/* Người tạo phiếu */}
            <DropdownField
              label="Người tạo"
              name="nguoi_tao"
              value={options?.nguoi_tao}
              options={users}
              optionLabel={(option) => `${option.hO_TEN} - ${option.teN_DANG_NHAP}`}
              optionValue="teN_DANG_NHAP"
              onChange={(e) => setOptions({ ...options, nguoi_tao: e.value })}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />
            
            {/* Trạng thái phiếu */}
            <DropdownField
              label="Trạng thái biên bản KT"
              name="trang_thai"
              value={options.trang_thai}
              options={arrTrangThai}
              optionLabel={(option) => `${option.label}`}
              optionValue="value"
              onChange={(e) => 
                  setOptions({ ...options, trang_thai: e.value })
                
              }
              showClear={true}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />
            {/* Trạng thái phiếu */}
            <DropdownField
              label="Trạng thái thanh lý"
              name="trang_thai_thanh_ly"
              value={options.trang_thai_thanh_ly}
              options={arrTrangThaiThanhLy}
              optionLabel={(option) => `${option.label}`}
              optionValue="value"
              onChange={(e) => 
                  setOptions({ ...options, trang_thai_thanh_ly: e.value })
                
              }
              showClear={true}
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

          </div>

          <div className="grid">

            {/* ID biên bản */}
            <InputTextField
              label="ID biên bản"
              name="id"
              type="search"
              value={options.id}
              onChange={(e) =>
                  setOptions({ ...options, id: e.target.value })
              }
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* Lập từ ngày */}
            <CalendarField
              label="Lập từ ngày"
              name="tu_ngay"
              placeholder="Chọn ngày"
              value={options?.tu_ngay}
              onChange={(val) => setOptions(prev => ({ ...prev, tu_ngay: val }))}
              dateStringFormat="DD/MM/YYYY"
              divClassName="col-12 md:col-6 lg:col-3"
              labelClassName="mb-2 block"
            />

            {/* Đến ngày */}
            <CalendarField
              label="Đến ngày"
              name="den_ngay"
              placeholder="Chọn ngày"
              value={options?.den_ngay}
              onChange={(val) => setOptions(prev => ({ ...prev, den_ngay: val }))}
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
        </div>

        <ThanhLyThietBiC4Table
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
          setIsShowDialog={setIsShowDialog}
          setIsUpdate={setIsUpdate}
          setFormData={setFormData}
          handleOnClickKySoBtn={handleOnClickKySoBtn}
        />
        {isShowDialog && (
          <DialogFormThanhLyC4
            visible={isShowDialog}
            setVisible={setIsShowDialog}
            showToast={showToast}
            loadData={loadData}
            current_MADVIQLY={current_MADVIQLY}
            selectedRecords={selectedRecords}
            formData={formData}
            setFormData={setFormData}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
          />
        )}

        {visibleViewer && (
          <QLTB_BienBanKiemTraThanhLyViewer
            dataBienBan={selectedRecords}
            visible={visibleViewer}
            handleCloseModalViewer={handleCloseModalViewer}
            showToast={showToast}
            loadData={loadData}
          />
        )}
      </div>
    </div>
  );
};

export default ThanhLyThietBiC4Tab;
