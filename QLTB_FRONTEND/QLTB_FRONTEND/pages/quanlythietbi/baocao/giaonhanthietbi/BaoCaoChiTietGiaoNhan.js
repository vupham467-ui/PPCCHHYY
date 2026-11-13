import React, { useEffect, useState, useRef, use } from "react";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { pageSizeSelect } from "../../../../constants/propGlobal";
import { storageHelper } from "../../../../utils/storageUtils";
import { MADV_CTY } from "../../../../constants/propGlobal";
import { chungloaiTBService, nhomThietBiService, trangThaiTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { get_DM_DONVI_ROOT } from "../../../../services/quantrihethong/DM_DONVIService";
import { baoCaoService } from "../../../../services/quanlythietbi/QLTB_BaoCaoService";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import { fetchData } from "../../../../utils/commonUltil";
import BaoCaoChiTietGiaoNhanTable from "./BaoCaoChiTietGiaoNhanTable";
import moment from "moment";
import CalendarField from "../../../../components/FormInputs/CalenderField";

const danhSachTinhTrangCapPhat = [
    {value: 1, label: "Đã cấp phát trong kỳ giao"},
    {value: 2, label: "Cấp phát sau kỳ giao"},
    {value: 3, label: "Chưa cấp phát"},
];

export const BaoCaoChiTietGiaoNhan = () => {
    // const currentMenu = sessionStorage.getItem("currentMenu");
    const currentMenu = localStorage.getItem("currentMenu");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeSelect);
    const [totalRecords, setTotalRecords] = useState(0);
    const [donViArr, setDonViArr] = useState([]);
    const [chungLoaiArr, setChungLoaiArr] = useState([]);
    const [nhomThietBiArr, setNhomThietBiArr] = useState([]);
    const [dataArr, setDataArr] = useState([]);
    const [filteredArr, setFilteredArr] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    
    const toast = useRef(null);
    const current_MADVIQLY = storageHelper.get("current_MADVIQLY");
    const isCompany = current_MADVIQLY == MADV_CTY;
    const userLocal = storageHelper.get("user");
    
    const [options, setOptions] = useState({
        ma_donvi_nhan: isCompany ? "" : current_MADVIQLY,
        ma_nhom: "",
        tu_ngay: moment().startOf("month").format("DD/MM/YYYY"),
        den_ngay: moment().endOf("month").format("DD/MM/YYYY"),
        tinhtrang_capphat: null,
    });

    useEffect(() => {
        const getDonViArr = async () => {
        try {
        
        const response = await get_DM_DONVI_ROOT(options.ma_donvi_nhan);
        setDonViArr(response?.data);

        } catch (err) {
            console.log(err);
        } 
        }
        getDonViArr();
        fetchData(nhomThietBiService.get, setNhomThietBiArr); //Danh mục nhóm thiết bị

    }, []);


    const loadDataTable = async (isSearch = false) => {
        setIsLoading(true);
        if (isSearch) {
          setIsSearching(true);
          setPageIndex(1);
        }
        try {

            const params = {
                ...options,
                pageIndex: isSearch ? 1 : pageIndex,
                pageSize: pageSize,
            }
            
            const res = await baoCaoService.getBaoCaoChiTietTinhTrangGiaoNhan(params);
            

            const dataBC = res?.data;
            setDataArr(dataBC);
            setTotalRecords(res?.totalItems);
            
            
        } catch (err) {
            console.log(err.message);
            setDataArr([]);
            setTotalRecords(0);
        } finally {
            setIsLoading(false);
            setIsSearching(false);
        }
    };

    const handleFilterData = (content) => {
        if (content === "") {
            setFilteredArr(dataArr);
        } else {
            const filtered = dataArr.filter(
                (item) => {
                    return item?.ma_donvi_nhan?.toLowerCase().includes(content.toLowerCase())
                }
            );
            setFilteredArr(filtered);
        }
    };

    useEffect(() => {
        loadDataTable();
    }, [pageIndex, pageSize]);

    const onClinkSearchBtn = (e) => {
        loadDataTable(true);
      };


      useEffect(() => {
        setFilteredArr(dataArr);
      }, [dataArr]);

    // show toast function
    const showToast = (type, message) => {
        toast.current.show({
            severity: type,
            summary: "Thông báo",
            detail: message,
        });
    };


    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div>
                    <div className="card mb-4">
                        {/* <Divider style={{ marginTop: "0", marginBottom: "10px" }} /> */}
                        <div className="grid">
                            {/* Đơn vị nhận*/}
                            <DropdownField
                            label="Đơn vị nhận"
                            name="ma_donvi_nhan"
                            value={options?.ma_donvi_nhan}
                            options={donViArr}
                            optionLabel="ten"
                            optionValue="ma_dviqly"
                            onChange={(e) => setOptions({ ...options, ma_donvi_nhan: e.value })}
                            divClassName="col-12 lg:col-4"
                            labelClassName="mb-2 block"
                            disabled={!isCompany}
                            />

                          {/* Nhóm thiết bị */}
                            <DropdownField
                                label="Nhóm thiết bị"
                                name="ma_nhom"
                                value={options.ma_nhom}
                                options={nhomThietBiArr}
                                optionLabel={(option) => `${option.ma_nhom} - ${option.ten_nhom}`}
                                optionValue="ma_nhom"
                                onChange={(e) =>
                                    setOptions({ ...options, ma_nhom: e.value })
                                }
                                divClassName="col-12 lg:col-4"
                                labelClassName="mb-2 block"
                            />

                            <DropdownField
                                label="Tình trạng cấp phát"
                                name="tinhtrang_capphat"
                                value={options.tinhtrang_capphat}
                                options={danhSachTinhTrangCapPhat}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) =>
                                    setOptions({ ...options, tinhtrang_capphat: e.value })
                                }
                                divClassName="col-12 lg:col-4"
                                labelClassName="mb-2 block"
                            />

                          {/* Từ ngày */}
                            <CalendarField
                                label=" Giao từ ngày"
                                name="tu_ngay"
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
                                value={options?.den_ngay}
                                onChange={(val) => setOptions(prev => ({ ...prev, den_ngay: val }))}
                                dateStringFormat="DD/MM/YYYY"
                                divClassName="col-12 md:col-6 lg:col-4"
                                labelClassName="mb-2 block"
                            />
                        </div>
                        <div className="flex justify-content-center mt-4">
                            <Button
                                style={{ backgroundColor: "#1445a7", color: "#fff" }}
                                label="Tìm kiếm"
                                severity="info"
                                loading={isSearching}
                                onClick={onClinkSearchBtn}
                            />
                        </div>
                    </div>

                    <BaoCaoChiTietGiaoNhanTable
                        totalRecords={totalRecords}
                        pageSize={pageSize}
                        pageIndex={pageIndex}
                        setPageSize={setPageSize}
                        setPageIndex={setPageIndex}
                        handleFilterData={handleFilterData}
                        filteredArr={filteredArr}
                        loadData={loadDataTable}
                        setOptions={setOptions}
                        options={options}
                        currentMenu={currentMenu}
                        isLoading={isLoading}
                        showToast={showToast}
                    />
                </div>

            </div>
        </div>
    );
};
export default BaoCaoChiTietGiaoNhan;
