import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { HT_NHOMQUYEN } from "../../../models/HT_NHOMQUYEN";
import { search_HT_NHOMQUYEN } from "../../../services/quantrihethong/HT_NHOMQUYENService";
import TableVaiTro from "./TableVaiTro";
import ModalInputVaiTro from "./ModalInputVaiTro";
import { HT_MENU } from "../../../models/HT_MENU";
import QuanLyMenuVaiTro from "./roleMenuTable";
import { arrVaiTroData, pageSizeSelect, propSortAndFilter } from "../../../constants/propGlobal";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { get_All_HT_MENU } from "../../../services/quantrihethong/HT_MENUService";
import { storageHelper } from "../../../utils/storageUtils";

const QuanLyVaiTro = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeSelect);
  const [totalRecords, setTotalRecords] = useState(0);
  const user = storageHelper.get("user");
  const isAdmin = user?.is_admin && user.ma_dviqly === "PA23";
  const [options, setOptions] = useState({
    ten_nhom: "",
    ma_dviqly: isAdmin ? "" : user?.ma_dviqly,
  });

  const [arrVaiTro, setArrVaiTro] = useState([HT_NHOMQUYEN]);
  const [arrMenu, setArrMenu] = useState([HT_MENU]);
  const [vaiTro, setVaiTro] = useState(HT_NHOMQUYEN);
  const [visible, setVisible] = useState(false);
  const [menuDialogVisible, setMenuDialogVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedVaiTro, setSelectedVaiTro] = useState(null);
  const [donViQuanLy, setDonViQuanLy] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const toast = useRef(null);
  const dt = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const getDSDonViQuanLy = async () => {
      try {
        const results = await get_All_DM_DONVI();
        setDonViQuanLy(results);
      } catch (err) {
        console.log(err.message);
      }
      

    };
    getDSDonViQuanLy();
  }, []);

  const home = { icon: "pi pi-home", url: "/" };
  const handleCloseModal = () => {
    setMenuDialogVisible(false);
  };
  const loadData = async (isSearch = false) => {
    setIsLoading(true);
    if (isSearch) {
      setIsSearching(true);
      setPage(1);
    }
    try {
      const data = {
        pageIndex: isSearch ? 1 : page,
        pageSize: pageSize,
        ten_nhom: options.ten_nhom,
        ma_dviqly: options.ma_dviqly,
      };

      const items = await search_HT_NHOMQUYEN(data) || [];
      const convertGhiChuToName = (items) => {
        const dataVaiTro = items?.data ?? [];
        return dataVaiTro.map(item => {
          const matched = arrVaiTroData.find(v => v.id === item.ghi_chu);
          return {
            ...item,
            vai_tro_name: matched?.name || null
          };
        });
      };
      const convertedItems = convertGhiChuToName(items);

      setArrVaiTro(convertedItems);
      setTotalRecords(items?.totalItems);
    } catch (error) {
      console.log(error);
      setArrVaiTro([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
  }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  // const loadDataMenu = async () => {
  //   try {
  //     const data = await get_All_HT_MENU();
  //     setArrMenu(data);
  //   } catch (error) {
  //     console.log(error);
  //     setArrMenu([]);
  //   }
  // };

  // useEffect(() => {
  //   loadDataMenu();
  // }, []);

  // useEffect(() => {
  //   // console.log(vaiTro);
  // }, [vaiTro]);

  const onClickSearchButton = (e) => {
    loadData(true);
  };

  return (
    <React.Fragment>
      <div className="flex flex-column md:flex-row w-full">
        <div className="flex-grow-1">
          <div className="card">
            <Toast ref={toast} />
            <Panel header="Tìm kiếm">
            <div className="flex flex-column md:flex-row gap-3">
                <div className="flex-grow-1 flex flex-column">
                  <label className="mb-2 block">Đơn vị quản lý</label>
                   <Dropdown
                     value={options?.ma_dviqly}
                     options={donViQuanLy}
                     onChange={(e) => {
                       setOptions({ ...options, ma_dviqly: e.target.value });
                     }}
                     optionLabel="ten"
                     id="ma_dviqly"
                     optionValue="ma_dviqly"
                     placeholder="Chọn đơn vị"
                     className="w-full"
                     showClear
                     filter
                     disabled={!isAdmin}
                   />
                </div>
                <div className="flex-grow-1 flex flex-column">
                  <label className="mb-2 block">Tên vai trò</label>
                  <InputText
                    placeholder="Nhập tên vai trò "
                    onChange={(e) => {
                      setOptions({
                        ...options,
                        ten_nhom: e.target.value,
                      });
                    }}
                    type="text"
                    value={options.ten_nhom}
                  />
                </div>
            </div>
              

             
              <div className="flex justify-content-center mt-4">
                <Button
                  label="Tìm kiếm"
                  style={{ backgroundColor: "#1445a7" }}
                  loading={isSearching}
                  onClick={onClickSearchButton}
                />
              </div>
            </Panel>

            <TableVaiTro
              setVisible={setVisible}
              setIsUpdate={setIsUpdate}
              setVaiTro={setVaiTro}
              data={arrVaiTro}
              totalRecords={totalRecords}
              setPage={setPage}
              setPageSize={setPageSize}
              page={page}
              pageSize={pageSize}
              loadData={loadData}
              isLoading={isLoading}
              setMenuDialogVisible={setMenuDialogVisible}
              toast={toast}
              setSelectedVaiTro={setSelectedVaiTro}
            ></TableVaiTro>
            {visible == true && (
              <ModalInputVaiTro
                vaitro={vaiTro}
                isUpdate={isUpdate}
                visible={visible}
                setVisible={setVisible}
                toast={toast}
                loadData={loadData}
              />
            )}
            {menuDialogVisible && (
              <QuanLyMenuVaiTro
                isUpdate={isUpdate}
                menu={selectedVaiTro}
                visible={menuDialogVisible}
                setVisible={handleCloseModal}
                toast={toast}
                // loadDataMenu={loadDataMenu}
                vaiTro={selectedVaiTro}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuanLyVaiTro;
