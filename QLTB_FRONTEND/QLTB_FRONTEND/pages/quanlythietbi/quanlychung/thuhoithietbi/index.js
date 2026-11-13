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
import { getDM_PHONGBANByMA_DVIQLY } from "../../../../services/quantrihethong/DM_PHONGBANService";
import { giaoNhanTBService } from "../../../../services/quanlythietbi/QLTB_GiaoNhanThietBi";
import DialogFormGiaoNhan from "./DialogFormThuHoi";
import { HT_NGUOIDUNG_Service } from "../../../../services/quantrihethong/HT_NGUOIDUNGService";
import ThuHoiThietBiTable from "./ThuHoiThietBiTable";
import DialogFormThuHoi from "./DialogFormThuHoi";
import QLTB_BienBanViewer from "../../../../components/QLTB/QLTB_BienBanViewer";



const ThuHoiThietBi = () => {
  const currentMenu = localStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const current_MADVIQLY = storageHelper.get("current_MADVIQLY");
  const user = storageHelper.get("user");
  const [options, setOptions] = useState({
    id: "",
    ma_dvi_giao: MADV_CTY,
    phongban_giao_id: "",
    ma_dvi_nhan: MADV_CTY,
    phongban_nhan_id: "",
    nguoi_nhan: "",
    trang_thai: null,
    loai_bban: 1, // mặc định hiện biên bản thu hồi
    loai_nghiepvu: "",
    tu_ngay: "",
    den_ngay: "",
  });
  const [dataTable, setDataTable] = useState([]);
  const [phongBanThuHoiArr, setPhongBanThuHoiArr] = useState([]);
  const [donViTraArr, setDonViTraArr] = useState([]);
  const [phongBanTraArr, setPhongBanTraArr] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [formData, setFormData] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [visibleViewer, setVisibleViewer] = useState(false); //dialog phiếu


  const toast = useRef(null);

  //Danh sách đơn vị trả và phòng ban thu hồi:
  useEffect(() => {
    const getData = async () => {
      try {
        const [resDVT, resPBTH] = await Promise.all([
          get_DM_DONVI_ROOT(options.ma_dvi_nhan),
          getDM_PHONGBANByMA_DVIQLY(MADV_CTY)
        ]);
        
        setDonViTraArr(resDVT?.data);
        setPhongBanThuHoiArr(resPBTH);
        
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);


    // Lấy phòng ban trả khi ma_dvinhan (đơn vị trả) thay đổi
    useEffect(() => {
      const fetchPhongBanTra = async () => {
        if (!options?.ma_dvi_nhan) return;
        try {
          const response = await getDM_PHONGBANByMA_DVIQLY(options.ma_dvi_nhan);
          setPhongBanTraArr(response);
        } catch (err) {
          console.log(err);
        }
      };
      fetchPhongBanTra();
    }, [options?.ma_dvi_nhan]);

    // Load người trả
    useEffect(() => {
      const fetchNguoiTra = async () => {
        if (!options?.ma_dvi_nhan) return;
        try {
          const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY({
            ma_dviqly: options?.ma_dvi_nhan,
            db_maphongban: options?.phongban_nhan_id,
          });
          setUsers(res || []);
        } catch (e) {
          console.log(e);
        }
      };
      fetchNguoiTra();
    }, [options?.ma_dvi_nhan, options?.phongban_nhan_id]);

  const loadData = async (isSearch = false) => {
    setIsLoading(true);
    if (isSearch) {
      setIsSearching(true);
      setPageIndex(1);
    }
    try {

      const dsQuyen = user?.ds_quyen || "";
      const dsQuyenArr = dsQuyen.split(',');
      const checkQuyenXemBB = ['ADMIN', 'QLTB_QLP10'];
      const hasQuyenXemBB = dsQuyenArr.some(q => checkQuyenXemBB.includes(q));

      const params = {
        ...options,
        user: hasQuyenXemBB ? "" : user?.ten_dang_nhap, //Có quyền xem thì truyền user rỗng để xem hết biên bản
        pageIndex: isSearch ? 1 : pageIndex,
        pageSize: pageSize,
      };
      
      const items = await giaoNhanTBService.get(params);
      
      
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

              {/* Phòng ban nhận */}
              <DropdownField
                label="Phòng ban trả"
                name="phongban_nhan_id"
                value={options?.phongban_nhan_id}
                options={phongBanTraArr}
                optionLabel="ten"
                optionValue="id"
                onChange={(e) => setOptions({ ...options, phongban_nhan_id: e.value })}
                divClassName="col-12 md:col-6 lg:col-4"
                labelClassName="mb-2 block"
              />

              {/* Người nhận */}
              <DropdownField
                label="Người trả"
                name="nguoi_nhan"
                value={options?.nguoi_nhan}
                options={users}
                optionLabel={(option) => `${option.hO_TEN} - ${option.teN_DANG_NHAP}`}
                optionValue="teN_DANG_NHAP"
                onChange={(e) => setOptions({ ...options, nguoi_nhan: e.value })}
                divClassName="col-12 md:col-6 lg:col-4"
                labelClassName="mb-2 block"
              />

              {/* Trạng thái phiếu */}
              <DropdownField
                label="Trạng thái"
                name="trang_thai"
                value={options.trang_thai}
                options={mockData.arrTrangThai}
                optionLabel={(option) => `${option.label}`}
                optionValue="value"
                onChange={(e) => 
                    setOptions({ ...options, trang_thai: e.value })
                  
                }
                showClear={true}
                divClassName="col-12 md:col-6 lg:col-4"
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
                divClassName="col-12 md:col-6 lg:col-4"
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
                divClassName="col-12 md:col-6 lg:col-4"
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
          </Panel>

          <ThuHoiThietBiTable
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
            <DialogFormThuHoi
              visible={isShowDialog}
              setVisible={setIsShowDialog}
              donViTraArr={donViTraArr}
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
            <QLTB_BienBanViewer
              dataBienBan={selectedRecords}
              visible={visibleViewer}
              handleCloseModalViewer={handleCloseModalViewer}
              showToast={showToast}
              loadData={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThuHoiThietBi;
