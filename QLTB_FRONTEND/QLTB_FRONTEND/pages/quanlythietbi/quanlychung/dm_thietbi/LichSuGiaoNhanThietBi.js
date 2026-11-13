import React, { useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { headerStyleColumn, pageSizeSelect } from "../../../../constants/propGlobal";
import { baoCaoService } from "../../../../services/quanlythietbi/QLTB_BaoCaoService";
import TimelineItem from "../../../../components/QLTB/TimeLineItem";
import { giaoNhanTBService } from "../../../../services/quanlythietbi/QLTB_GiaoNhanThietBi";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import { ProgressSpinner } from "primereact/progressspinner";
import { parseVNDate } from "../../../../utils/dateUtils";
import QLTB_BienBanTraLaiViewer from "../../../../components/QLTB/QLTB_BienBanTraLaiViewer";
import DialogDuyetThanhLy from "../thanhlythietbi/DialogDuyetThanhLy";
import { loaiNghiepVuService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { fetchData } from "../../../../utils/commonUltil";

const LichSuGiaoNhanThietBi = ({
    visible,
    setVisible,
    selectedRecord,
    showToast
}) => {

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]); //Dữ liệu lịch sử thiết bị
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showBienBan, setShowBienBan] = useState(false);
  const [dataBienBan, setDataBienBan] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [loaiNghiepVuArr, setLoaiNghiepVuArr] = useState([]);

  //Cho thanh lý:
  const [visibleThanhLy, setVisibleThanhLy] = useState(false);
  const [formThanhLy, setFormThanhLy] = useState({});
  const [actionThanhLy, setActionThanhLy] = useState("VIEW");

  const dotStyle = useMemo(() => ({ width: '1.5rem', height:'1.5rem', left:'-1.8rem', top:'12px' }), []);
  
  const [options, setOptions] = useState({
    thietbi_id: selectedRecord.id,
    tu_ngay: "",
    den_ngay: "",
    loai_nghiepvu: ""
  });

  useEffect(()=> {
    fetchData(loaiNghiepVuService.get, setLoaiNghiepVuArr);
  }, [])
  
  // const loaiNghiepVu = [
  //   { label: "Bàn giao cho phòng ban cùng cấp", value: "BGC3" },
  //   { label: "Bàn giao cho đơn vị cấp 4", value: "BGC4" },
  //   { label: "Thu hồi từ phòng ban cùng cấp", value: "THC3" },
  //   { label: "Bàn giao về công ty", value: "THC4" },
  //   { label: "Bàn giao tại đơn vị cấp 4", value: "BGSD" },
  //   { label: "Thu hồi tại đơn vị cấp 4", value: "THSD" },
  //   { label: "Thanh lý thiết bị tại công ty", value: "TLC3"},
  //   { label: "Thanh lý thiết bị tại đơn vị cấp 4", value: "TLC4"},

  // ];

    const loadDataHistory = async (isSearch = false) => {
      setIsLoading(true);
      const tuNgay = parseVNDate(options.tu_ngay);
      const denNgay = parseVNDate(options.den_ngay);
      if (tuNgay && denNgay && tuNgay.getTime() > denNgay.getTime()) {
        setIsLoading(false);
        showToast("error", "Từ ngày không được lớn hơn đến ngày!")
        return;
      }
      if (isSearch) {
        setIsSearching(true);
        setPageIndex(1);
      }
      try {
        const params = {
          ...options,
          // pageIndex: isSearch ? 1 : pageIndex,
          pageIndex: 1,
          pageSize: 0, //lấy tất cả
        };

        const items = await baoCaoService.getBaoCaoLichSuGiaoNhan(params);

        setData(items?.data || []);
        setTotalRecords(items?.totalItems);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setData([]);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    };

  useEffect(() => {
    loadDataHistory();
  }, [pageIndex, pageSize]);


  const handleXemBienBan = async (item, index) => {
    if (loadingIndex == index) return; 
    setLoadingIndex(index);
    setSelectedIndex(index);
    if (!item?.bban_id) {
      showToast("error", "Không tìm thấy biên bản!");
      return;
    }
    try {
      const bienBanInfo = await giaoNhanTBService.get_by_id(item.bban_id);
      
      setDataBienBan(bienBanInfo);
      setShowBienBan(true);

    } catch (err) {
      let message = "Lỗi khi lấy dữ liệu";
      const error = err?.response?.data;
      message = (error && typeof error === "string"
      ? error
      : typeof error === "object"
        ? JSON.stringify(error)
        : message);
      showToast("error", message);
    } finally {
      setLoadingIndex(null);
    }
  }

  const handleXemThanhLy = async (item) => {
  try {
    const res = await giaoNhanTBService.getThongTinDuyetThanhLy(
      item.bban_id
    );

      setFormThanhLy({
        ...res,
        file_vanban_url: res.file_vanban,
        file_vanban_file: null
      });

    setActionThanhLy("VIEW"); // chỉ xem
    setVisibleThanhLy(true);
  } catch (e) {
    console.log(e);
    
    showToast("error", "Không tải được thông tin thanh lý");
  }
};

  const handleCloseModalViewer = () => {
    setShowBienBan(false);
    setDataBienBan([]);
  }

  const handleClicKFilter = () => {
    setSelectedIndex(null);
    loadDataHistory(true);
  }

  return (
    <>
      <Dialog
        header="Lịch sử giao nhận"
        visible={visible}
        onHide={() => setVisible(false)}
        position="center"
        modal
        draggable={false}
        resizable={false}
        style={{ width: "90vw" }}
        className="p-0"
      >
        <div className="w-full grid">

          {/* Bộ lọc */}
          <div className="col-12 md:col-4 relative">
            <div className="sticky top-0">
              <Card className="shadow-md rounded-2xl" style={{ border: "1px solid #d1d5db" }}>
                <h2 className="text-lg font-semibold mb-3">Thông tin thiết bị</h2>
                <InputTextField
                  label="Tên thiết bị"
                  name="ten_thietbi"
                  value={selectedRecord.ten_thietbi}
                  disabled
                  divClassName="col-12"
                />
                <InputTextField
                  label="Mã thiết bị"
                  name="ma_thietbi"
                  value={selectedRecord.ma_thietbi}
                  disabled
                  divClassName="col-12"
                />
                <InputTextField
                  label="Serial thiết bị"
                  name="no_thietbi"
                  value={selectedRecord.no_thietbi}
                  disabled
                  divClassName="col-12"
                />
                <InputTextField
                  label="Trạng thái"
                  name="tbi_trangthai_ten"
                  value={selectedRecord.tbi_trangthai_ten}
                  disabled
                  divClassName="col-12"
                />
                <DropdownField
                  label="Loại nghiệp vụ"
                  name="loai_nghiepvu"
                  value={options?.loai_nghiepvu}
                  options={loaiNghiepVuArr}
                  optionLabel={(o) => `${o.ma_loai_nghiepvu} - ${o.ten_loai_nghiepvu}`}
                  optionValue="ma_loai_nghiepvu"
                  onChange={(e) => setOptions(prev => ({ ...prev, loai_nghiepvu: e.value }))}
                  showClear={true}
                  divClassName="col-12"
                />
                <CalendarField
                  label="Từ ngày"
                  name="tu_ngay"
                  value={options?.tu_ngay}
                   onChange={(val) => setOptions(prev => ({ ...prev, tu_ngay: val }))}
                  divClassName="col-12"
                  dateStringFormat= "DD/MM/YYYY"
                />
                <CalendarField
                  label="Đến ngày"
                  name="den_ngay"
                  value={options?.den_ngay}
                  onChange={(val) => setOptions(prev => ({ ...prev, den_ngay: val }))}
                  divClassName="col-12"
                  dateStringFormat= "DD/MM/YYYY"
                />

                <Button 
                  onClick={handleClicKFilter} 
                  loading={isSearching}
                  label="Lọc dữ liệu" 
                  className="w-full mt-2"  
                  style={{backgroundColor: headerStyleColumn.backgroundColor}}
                />
              </Card>
            </div>
          </div>

          {/* Timeline */}
          <div className="col-12 md:col-8">
              <Card
                  className="shadow-2 border-round-xl"
                  style={{ border: "1px solid #d1d5db", height: "80vh" }}
              >
                  <div className="border-bottom-1 surface-border bg-white mb-2">
                      <h2 className="text-xl font-semibold">
                          Lịch sử giao nhận thiết bị
                      </h2>
                  </div>

                  {/* Loading */}
                  {isLoading && (
                      <div className="flex align-items-center justify-content-center" style={{ height: "50vh" }}>
                          <ProgressSpinner
                              style={{ width: "50px", height: "50px" }}
                              strokeWidth="8"
                              fill="none"
                              animationDuration=".5s"
                          />
                      </div>
                  )}

                  {/* Có dữ liệu */}
                  {!isLoading && data.length > 0 && (
                      <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
                          <div className="flex flex-column gap-3 border-left-2 border-gray-300 relative pl-3 ml-3">
                              {data.map((item, index) => (
                                  <TimelineItem
                                      key={item.bban_id}
                                      keyIdx={index}
                                      item={item}
                                      dotStyle={dotStyle}
                                      handleXemBienBan={handleXemBienBan}
                                      handleXemThanhLy={handleXemThanhLy}
                                      selectedIndex={selectedIndex}
                                      isLoading={loadingIndex == index}
                                  />
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Không có dữ liệu */}
                  {!isLoading && data.length === 0 && (
                      <div className="flex align-items-center justify-content-center text-xl font-bold text-500" style={{ height: "50vh" }}>
                          Chưa có lịch sử giao nhận
                      </div>
                  )}
              </Card>
          </div>
        </div>
      </Dialog>

      {showBienBan && (
        <QLTB_BienBanTraLaiViewer
          dataBienBan={dataBienBan}
          visible={showBienBan}
          handleCloseModalViewer={handleCloseModalViewer}
          loadData={() => {}} //không thực hiện gì
          showSignBtn={false}
        />
      )}
      {visibleThanhLy && (
        <DialogDuyetThanhLy
          visible={visibleThanhLy}
          setVisible={setVisibleThanhLy}
          formData={formThanhLy}
          setFormData={setFormThanhLy}
          loadData={() => {}}
          action={actionThanhLy}
          setAction={setActionThanhLy}
        />
      )}
    </>
  );
};

export default LichSuGiaoNhanThietBi;
