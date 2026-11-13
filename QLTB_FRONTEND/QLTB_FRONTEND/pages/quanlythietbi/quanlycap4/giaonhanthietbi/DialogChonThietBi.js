import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import { chungloaiTBService, thietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import Pagination from "../../../../components/Pagination";
import { pageSizeSelect, scrollTableHeight } from "../../../../constants/propGlobal";
import { fetchData } from "../../../../utils/commonUltil";
import { Button } from "primereact/button";

const DialogChonThietBi = ({
  visible,
  setVisible,
  onSelect,
  initialSelected = [],
  ma_dvi_giao,
  isUpdate,
  formData,
}) => {

  const [thietBiList, setThietBiList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [chungLoaiArr, setChungLoaiArr] = useState([]);

  // state filter
  const [options, setOptions] = useState({
    bban_id: "",
    tbi_dm_chungloai_id: "",
    ma_thietbi: "",
    no_thietbi: "",
    ten_thietbi: "",
    tbi_kho_id: "",
    ma_dviqly: ma_dvi_giao,
    phongban_id: "",
    nguoi_sd: ""
  });

  // cancel flag dùng useRef
  const ignoreRef = useRef(false);

  // Track request mới nhất để tránh bị response cũ ghi đè
  const latestRequestId = useRef(0);

  // Multi-page selection: dùng Map giúp ổn định
  const selectedMapRef = useRef(new Map());
  const [selectedThietBi, setSelectedThietBi] = useState([]);

  useEffect(() => {
    ignoreRef.current = false;
    return () => { ignoreRef.current = true; };
  }, []);

  // Khi initialSelected thay đổi (edit/update)
  useEffect(() => {
    selectedMapRef.current = new Map((initialSelected || []).map(it => [it.id, it]));
    setSelectedThietBi(Array.from(selectedMapRef.current.values()));
  }, [initialSelected]);

  // Load chủng loại
  useEffect(() => {
    fetchData(chungloaiTBService.get, setChungLoaiArr);
  }, []);

  // Hàm load dữ liệu thiết bị
  const loadDataTB = async (isSearch = false) => {
    if (isLoading) return;
    const reqId = ++latestRequestId.current;

    setIsLoading(true);
    try {
      const params = {
        ...options,
        loai_nghiepvu: formData?.loai_nghiepvu,
        pageIndex: isSearch ? 1 : pageIndex,
        pageSize,
      };

      if (isUpdate) params.bban_id = formData?.id;
      
      const items = await thietBiService.getDSTbiGiaoNhan(params);

      if (reqId === latestRequestId.current && !ignoreRef.current) {
        setThietBiList(items.data || []);
        setTotalRecords(items.totalItems || 0);
      }
    } catch (err) {
      if (reqId === latestRequestId.current && !ignoreRef.current) {
        console.error("Lỗi load thiết bị:", err);
        setThietBiList([]);
        setTotalRecords(0);
      }
    } finally {
      if (reqId === latestRequestId.current && !ignoreRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Khi mở dialog → reset trang + load lần đầu
  useEffect(() => {
    if (visible) {
      setPageIndex(1);
      loadDataTB(true);
    }
  }, [visible]);

  // Khi đổi trang hoặc pageSize → load
  useEffect(() => {
    if (visible) loadDataTB();
  }, [pageIndex, pageSize]);

  const handleSearch = () => loadDataTB(true);

  // Multi-page selection: sync ổn định
  const handleSelectionChange = (e) => {
    // danh sách id trên page hiện tại
    const currentPageIds = new Set(thietBiList.map(tb => tb.id));

    // Loại bỏ những ID của page hiện tại nếu không được chọn
    for (const id of currentPageIds) {
      if (!e.value.some(v => v.id === id)) {
        selectedMapRef.current.delete(id);
      }
    }

    // Thêm các item vừa được chọn
    for (const it of e.value) {
      selectedMapRef.current.set(it.id, it);
    }

    const arr = Array.from(selectedMapRef.current.values());
    setSelectedThietBi(arr);
    onSelect && onSelect(arr);
  };

  return (
    <Sidebar
      visible={visible}
      position="right"
      baseZIndex={1000}
      onHide={() => setVisible(false)}
      style={{ 
        width: window.innerWidth < 640 ? "100%" : "45vw", 
        transition: "all 0.3s ease-in-out" 
      }}
    >
      <h3>Chọn thiết bị</h3>

      <div className="grid">
        <InputTextField
          label="Tên thiết bị"
          value={options.ten_thietbi}
          onChange={(e) => setOptions({ ...options, ten_thietbi: e.target.value })}
          divClassName="col-12 md:col-6 lg:col-3"
        />
        <InputTextField
          label="Serial thiết bị"
          value={options.no_thietbi}
          onChange={(e) => setOptions({ ...options, no_thietbi: e.target.value })}
          divClassName="col-12 md:col-6 lg:col-3"
        />
        <InputTextField
          label="Mã thiết bị"
          value={options.ma_thietbi}
          onChange={(e) => setOptions({ ...options, ma_thietbi: e.target.value })}
          divClassName="col-12 md:col-6 lg:col-3"
        />
        <DropdownField
          label="Chủng loại"
          value={options.tbi_dm_chungloai_id}
          options={chungLoaiArr}
          optionLabel={(o) => `${o.ma_chungloai} - ${o.ten_chungloai}`}
          optionValue="id"
          onChange={(e) => setOptions({ ...options, tbi_dm_chungloai_id: e.value })}
          divClassName="col-12 md:col-6 lg:col-3"
        />
      </div>

      <div className="flex justify-content-center my-2">
        <Button className="btn btn-primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>

      <DataTable
        value={thietBiList}
        scrollable
        scrollHeight={scrollTableHeight}
        showGridlines
        stripedRows
        loading={isLoading}
        loadingIcon={<ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" />}
        paginator={false}
        dataKey="id"
        selectionMode="checkbox"
        selection={
          selectedThietBi.filter(tb =>
            thietBiList.some(t => t.id === tb.id)
          )
        }
        onSelectionChange={handleSelectionChange}
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" style={{ width: "3rem" }} />
        <Column header="STT" body={(_, opt) => (pageIndex - 1) * pageSize + opt.rowIndex + 1} />
        <Column field="ten_thietbi" header="Tên thiết bị" />
        <Column field="ma_thietbi" header="Mã thiết bị" />
        <Column field="no_thietbi" header="Serial" />
        <Column field="dm_donvitinh_ten" header="Đơn vị tính" />
        <Column field="tbi_dm_hangsx_ten" header="Hãng SX" />
      </DataTable>

      {totalRecords > 0 && (
        <Pagination
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalRecords={totalRecords}
        />
      )}
    </Sidebar>
  );
};

export default DialogChonThietBi;
