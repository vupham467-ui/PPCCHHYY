import React, { useEffect, useState, useRef, use } from "react";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { pageSizeSelect } from "../../../../constants/propGlobal";
import { storageHelper } from "../../../../utils/storageUtils";
import ChiTietThietBiTable from "./ChiTietThietBiTable";
import { MADV_CTY } from "../../../../constants/propGlobal";
import { chungloaiTBService, nhomThietBiService, trangThaiTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { get_DM_DONVI_ROOT } from "../../../../services/quantrihethong/DM_DONVIService";
import { baoCaoService } from "../../../../services/quanlythietbi/QLTB_BaoCaoService";
import DropdownField from "../../../../components/FormInputs/DropDownField";
import { fetchData } from "../../../../utils/commonUltil";

export const BaoCaoChiTietThietBi = () => {
    // const currentMenu = sessionStorage.getItem("currentMenu");
    const currentMenu = localStorage.getItem("currentMenu");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeSelect);
    const [totalRecords, setTotalRecords] = useState(0);
    const [donViArr, setDonViArr] = useState([]);
    const [trangThaiThietBiArr, setTrangThaiThietBiArr] = useState([]);
    const [nhomThietBiArr, setNhomThietBiArr] = useState([]);
    const [chungLoaiArr, setChungLoaiArr] = useState([]);
    const [dataArr, setDataArr] = useState([]);
    const [filteredArr, setFilteredArr] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    
    const toast = useRef(null);
    const current_MADVIQLY = storageHelper.get("current_MADVIQLY");
    const isCompany = current_MADVIQLY == MADV_CTY;
    const userLocal = storageHelper.get("user");
    
    const [options, setOptions] = useState({
        ma_dviqly: isCompany ? "" : current_MADVIQLY,
        ma_nhom: "",
        dm_chungloai_id: "",
        trang_thai_tbi: "",
    });


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
        fetchData(trangThaiTBService.get, setTrangThaiThietBiArr)
        fetchData(nhomThietBiService.get, setNhomThietBiArr);
        //fetchData(chungloaiTBService.get, setChungLoaiArr); //Danh mục chủng loại thiết bị

    }, []);

    // Khi nhóm thiết bị thay đổi => load lại chủng loại
    useEffect(() => {
        // reset chủng loại đang chọn mỗi khi nhóm thay đổi
        setOptions(prev => ({
            ...prev,
            chungloai_id: null
        }));

        // nếu CHƯA chọn nhóm => load TẤT CẢ chủng loại
        if (!options.ma_nhom) {
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
            { ma_nhom: options.ma_nhom }
        );
    }, [options.ma_nhom]);


    const loadDataTable = async (isSearch = false) => {
        setIsLoading(true);
        if (isSearch) {
          setIsSearching(true);
          setPageIndex(1);
        }
        try {

            const params = {
                pageIndex: isSearch ? 1 : pageIndex,
                pageSize: pageSize,
                ma_dviqly: options.ma_dviqly,
                ma_nhom: options.ma_nhom,
                dm_chungloai_id: options.dm_chungloai_id,
                trang_thai_tbi: options.trang_thai_tbi
            }
            console.log(params);
            
            const res = await baoCaoService.getBaoCaoChiTiet(params);

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
                    return item?.ma_dviqly?.toLowerCase().includes(content.toLowerCase())
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
                    <Panel headerTemplate={getHeaderTemplate({ className: "p-panel-header panel-padding" })} className="mb-4">
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
                            divClassName="col-12 lg:col-3"
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
                                divClassName="col-12 lg:col-3"
                                labelClassName="mb-2 block"
                            />

                            {/* Chủng loại thiết bị */}
                            <DropdownField
                                label="Chủng loại thiết bị"
                                name="dm_chungloai_id"
                                value={options.dm_chungloai_id}
                                options={chungLoaiArr}
                                optionLabel={(option) => `${option.ma_chungloai} - ${option.ten_chungloai}`}
                                optionValue="id"
                                onChange={(e) =>
                                    setOptions({ ...options, dm_chungloai_id: e.value })
                                }
                                divClassName="col-12 lg:col-3"
                                labelClassName="mb-2 block"
                            />

                            {/* Trạng thái thiết bị */}
                            <DropdownField
                                label="Tình trạng thiết bị"
                                name="trang_thai_tbi"
                                value={options.trang_thai_tbi}
                                options={trangThaiThietBiArr}
                                optionLabel={(option) => `${option.ma} - ${option.ten}`}
                                optionValue="id"
                                onChange={(e) =>
                                    setOptions({ ...options, trang_thai_tbi: e.value })
                                }
                                divClassName="col-12 lg:col-3"
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
                    </Panel>

                    <ChiTietThietBiTable
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
                    />
                </div>

            </div>
        </div>
    );
};
export default BaoCaoChiTietThietBi;
