import React, { useEffect, useState } from "react";
import { HT_NHOMQUYEN } from "../../../models/HT_NHOMQUYEN";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import {
  create_HT_NHOMQUYEN,
  update_HT_NHOMQUYEN,
} from "../../../services/quantrihethong/HT_NHOMQUYENService";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DM_DONVI } from "../../../models/DM_DONVI";
import { v4 as uuidv4 } from "uuid";
import { Button } from "primereact/button";
import { getAllD_DVIQLY } from "../../../services/quantrihethong/DM_DVIQLYService";
import { arrVaiTroData } from "../../../constants/propGlobal";

const ModalInputVaiTro = ({
  isUpdate,
  vaitro,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  const [vaiTro, setVaiTro] = useState(vaitro);

  const [dviQLY, setDVIQLY] = useState([]);

  const [errors, setErrors] = useState({});

  const getDVIQLY = async () => {
    try {
      let data = await get_All_DM_DONVI()
      data && setDVIQLY(data.map(d => ({ id: d.ma_dviqly, name: d.ten })))
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    getDVIQLY()
  }, []);

  const handleCreateVaiTro = () => {
    let tempErrors = {};
    let isValid = true;
    if (!vaiTro.ten_nhom) {
      isValid = false;
      tempErrors.ten_nhom = "Tên nhóm quyền không được để trống";
    }
    if (!vaiTro.ma_dviqly) {
      isValid = false;
      tempErrors.ten_nhom = "Vui lòng chọn đơn vị";
    }
    if (!vaiTro.ghi_chu) {
      isValid = false;
      tempErrors.ten_nhom = "Vui lòng chọn ghi chú";
    }
    setErrors(tempErrors);

    return isValid;
  };

  const handleSubmit = () => {
    if (isUpdate) {
      updateVaiTro();
    } else {
      createVaiTro();
    }
  };

  const createVaiTro = async () => {
    const nhom_id = uuidv4();
    try {
      if (handleCreateVaiTro()) {
        // console.log({
        //   ...vaiTro
        // })
        const results = await create_HT_NHOMQUYEN({
          ...vaiTro,
          nhom_id: nhom_id,
          nguoi_tao: "1",
          cap_bac: 0,
          sap_xep: 0,
          ma_dviqly: vaiTro.ma_dviqly,
        });

        const isSuccess = results.status == 200;
        const severity = isSuccess ? "success" : "error";
        const detailsMessage = isSuccess ? "Thêm vai trò thành công" : "Đã xảy ra lỗi!";
        toast.current.show({
          severity: severity,
          summary: "Thông báo",
          detail: detailsMessage,
          life: 3000,
        });

        if (isSuccess) {
          setVisible(false);
          loadData();
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Thông báo",
          detail: "Vui lòng điền đủ thông tin!",
          life: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Thêm vai trò không thành công",
        life: 3000,
      });
    }
  };

  const updateVaiTro = async () => {
    try {
      if (handleCreateVaiTro()) {
        const results = await update_HT_NHOMQUYEN({
          ...vaiTro,
          nguoi_sua: "1",
        });
        const isSuccess = results.status == 200;
        const severity = isSuccess ? "success" : "error";
        const detailsMessage = isSuccess ? "Cập nhật vai trò thành công" : "Đã xảy ra lỗi!";
        toast.current.show({
          severity: severity,
          summary: "Thông báo",
          detail: detailsMessage,
          life: 3000,
        });

        if (isSuccess) {
          setVisible(false);
          loadData();
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Thông báo",
          detail: "Vui lòng điền đủ thông tin!",
          life: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Sửa vai trò không thành công",
        life: 3000,
      });
    }
  };

  return (
    <Dialog
      header={!isUpdate ? "Thêm mới vai trò" : "Cập nhật vai trò"}
      className="p-fluid w-11 md:w-6"
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        setVaiTro(null);
      }}
    >
      <div className="grid">
        <div className="col-12">
          <div className="field">
            <label htmlFor="ma_dviqly">Đơn vị quản lý</label>
            <Dropdown
              value={vaiTro.ma_dviqly || ""}
              options={dviQLY}
              onChange={(e) => {
                setVaiTro({ ...vaiTro, ma_dviqly: e.value });
                // console.log(e.value);
              }}
              filter
              optionLabel="name"
              optionValue="id"
              id="MA_DVIQLY"
              placeholder="Chọn đơn vị"
              className="w-full"
            ></Dropdown>
          </div>
        </div>

        <div className="col-12">
          <div className="field">
            <label htmlFor="ten_nhom">Tên vai trò</label>
            <InputText
              id="ten_nhom"
              onChange={(e) => {
                setVaiTro({ ...vaiTro, ten_nhom: e.target.value })
              }}
              type="text"
              value={vaiTro.ten_nhom || ""}
            />
          </div>
        </div>

        {/* <div className="col-12">
          <div className="field">
            <label htmlFor="ghi_chu">Ghi chú</label>
            <InputText
              id="ghi_chu"
              onChange={(e) => {
                // console.log(e.target.value)
                setVaiTro({ ...vaiTro, ghi_chu: e.target.value })
              }}
              type="text"
              value={vaiTro.ghi_chu || ""}
            />
          </div>
        </div> */}
        <div className="col-12">
          <div className="field">
            <label htmlFor="ghi_chu">Ghi chú</label>
            <Dropdown
              value={vaiTro.ghi_chu || ""}
              options={arrVaiTroData}
              onChange={(e) => {
                setVaiTro({ ...vaiTro, ghi_chu: e.value });
                // console.log(e.value);
              }}
              filter
              optionLabel="name"
              optionValue="id"
              id="ghi_chu"
              placeholder="Chọn ghi chú vai trò"
              className="w-full"
            ></Dropdown>
          </div>
        </div>

        <div className="col-12">
          <div className="flex mt-4" style={{ justifyContent: "center" }}>
            <Button
              label="Lưu"
              onClick={() => {
                handleSubmit();
              }}
              style={{
                backgroundColor: "#1445a7",
              }}
              className="mr-4"
            />
            <Button
              label="Đóng"
              outlined
              severity="secondary"
              onClick={() => {
                setVisible(false);
                setVaiTro(null);
              }}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalInputVaiTro;
