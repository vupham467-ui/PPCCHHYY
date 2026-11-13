import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox"; // dùng để chọn có thông tin chi tiết
import { validateRequiredFields } from "../../../../utils/commonUltil";
import { QLTB_DM_CHUNGLOAI } from "../../../../models/quanlythietbi/QLTB_DM_CHUNGLOAI";
import { chungloaiTBService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";
import { Column } from "primereact/column";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import DropdownField from "../../../../components/FormInputs/DropDownField";

const DiaglogForm = ({
  formData,
  setFormData,
  isUpdate,
  visible,
  setVisible,
  showToast,
  loadData,
  nhomThietBiArr
}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDetail, setHasDetail] = useState(formData?.co_thongtin_ct == "Y");
  const [configDetails, setConfigDetails] = useState([]); // mảng cấu hình chi tiết

  useEffect(() => {
    if (!isUpdate) {
      setFormData({ ...QLTB_DM_CHUNGLOAI }); 
    }
  }, []);


  useEffect(() => {
    if (!visible) return; // khi dialog đóng thì không làm gì

    const json = formData?.ct_cauhinh_json;
    if (json) {
      try {
        const parsed = JSON.parse(json);
        setConfigDetails(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        setConfigDetails([]);
      }
    } else {
      setConfigDetails([]);
    }

  }, [visible, formData?.ct_cauhinh_json]);

  const validateFields = () => {
    const requiredFields = {
      ma_nhom: "Nhóm thiết bị",
      ten_chungloai: "Tên chủng loại",
    };
    const newErrors = validateRequiredFields(formData, requiredFields);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!validateFields()) {
      showToast("error", "Vui lòng điền đủ thông tin!");
      setIsSubmitting(false);
      return;
    }

    //Nếu có cấu hình chi tiết thì phải thiết lập:
    if (hasDetail) {
      if (!configDetails || configDetails?.length == 0) {
        showToast("error", "Vui lòng thêm cấu hình thông tin chi tiết!");
        setIsSubmitting(false);
        return;
      }

      // Kiểm tra từng dòng, từng trường
      const invalidRow = configDetails.find(
        (row) => !row.name?.trim() || !row.label?.trim() || !row.type?.trim()
      );

      if (invalidRow) {
        showToast("error", "Vui lòng điền đầy đủ tên trường, nhãn hiển thị và loại input ở thông tin cấu hình chi tiết!");
        setIsSubmitting(false);
        return;
      }
    }
    
    const params = {
      ...formData,
      ct_cauhinh_json: JSON.stringify(configDetails),
      co_thongtin_ct: hasDetail ? "Y" : "N"
    };

    try {
      if (isUpdate) {
        await chungloaiTBService.update(params);
        showToast("success", "Cập nhật dữ liệu thành công!");
      } else {
        await chungloaiTBService.insert(params);
        showToast("success", "Thêm dữ liệu thành công!");
      }
      setVisible(false);
      loadData();
    } catch (err) {
      showToast("error", "Lỗi khi gửi dữ liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = () => {
    setConfigDetails([...configDetails, { name: "", label: "", type: "text" }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...configDetails];
    newRows.splice(index, 1);
    setConfigDetails(newRows);
  };

  const handleConfigChange = (index, field, value) => {
    const newRows = [...configDetails];
    newRows[index][field] = value;
    setConfigDetails(newRows);
  };

  return (
    <Dialog
      header={isUpdate ? "Sửa thông tin" : "Thêm mới"}
      visible={visible}
      className="w-11 md:w-9 lg:w-7 xl:w-7"
      onHide={() => {
        setVisible(false);
        setFormData(QLTB_DM_CHUNGLOAI);
      }}
    >
      <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
        <div className="grid">
          {/* Nhóm thiết bị */}
          <DropdownField
            label="Nhóm thiết bị"
            name="ma_nhom"
            value={formData?.ma_nhom}
            options={nhomThietBiArr}
            optionLabel="ten_nhom"
            optionValue="ma_nhom"
            onChange={(e) => setFormData(prev => ({ ...prev, ma_nhom: e.value }))}
            required
            disabled={isUpdate}
            error={errors?.ma_nhom}
            divClassName="md:field col-12"
          />

          {/* Mã chủng loại (nếu cập nhật) */}
          {isUpdate && (
            <div className="md:field col-12">
              <label className="font-bold text-sm md:my-2 my-1 block">Mã chủng loại</label>
              <InputText value={formData?.ma_chungloai || ""} disabled className="w-full" />
            </div>
          )}

          {/* Tên chủng loại */}
          <InputTextField
            label="Tên chủng loại"
            name="ten_chungloai"
            value={formData?.ten_chungloai || ""}
            onChange={handleInputChange}
            required
            error={errors?.ten_chungloai}
            divClassName="md:field col-12"
          />
          {/* <InputTextField
            label="Ghi chú"
            name="ghi_chu"
            value={formData?.ghi_chu || ""}
            onChange={handleInputChange}
            required
            error={errors?.ghi_chu}
            divClassName="md:field col-12"
          /> */}
          {/* Cần chọn NSD khi bàn giao */}
          <div className="col-12 mt-3">
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="can_chon_nsd"
                checked={formData?.can_chon_nsd === "Y"}
                onChange={(e) =>
                  setFormData({ ...formData, can_chon_nsd: e.checked ? "Y" : "N" })
                }
              />
              <label htmlFor="can_chon_nsd" className="text-sm font-bold">
                Cần chọn người sử dụng khi bàn giao
              </label>
            </div>
          </div>

          {/* Hiển thị thông tin chi tiết */}
          <div className="col-12 mt-3">
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="co_thongtin_ct"
                checked={hasDetail}
                onChange={(e) => {
                    setHasDetail(e.checked)
                  }
                }
              />
              <label htmlFor="co_thongtin_ct" className="text-sm font-bold">
                Hiển thị thông tin chi tiết
              </label>
            </div>
          </div>

          {/* Bảng thông tin chi tiết */}
          {hasDetail && (
            <div className="col-12 mt-3">
              <div className="flex justify-content-between align-items-center mb-2 flex-nowrap">
                {/* <h6 className="font-bold m-0">Thông tin chi tiết</h6> */}
                <Button
                  label="Thêm cấu hình thông tin chi tiết"
                  icon="pi pi-plus"
                  size="small"
                  onClick={handleAddRow}
                />
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "400px"}}>
                <DataTable
                  value={configDetails}
                  className="p-datatable-sm border-1 surface-border border-round-md"
                  emptyMessage="Chưa có thông tin chi tiết nào"
                >
                  <Column
                    header="STT"
                    body={(_, { rowIndex }) => rowIndex + 1}
                    headerStyle={{ width: "4rem", textAlign: "center" }}
                    bodyStyle={{ textAlign: "center" }}
                  />
                  <Column
                    header="Tên trường (name)"
                    body={(rowData, { rowIndex }) => (
                      <InputText
                        placeholder="Nhập tên trường"
                        value={rowData.name}
                        onChange={(e) => handleConfigChange(rowIndex, "name", e.target.value)}
                        className="w-full"
                      />
                    )}
                    style={{minWidth:"15rem"}}
                  />
                  <Column
                    header="Nhãn hiển thị (label)"
                    body={(rowData, { rowIndex }) => (
                      <InputText
                        placeholder="Nhập nhãn hiển thị"
                        value={rowData.label}
                        onChange={(e) => handleConfigChange(rowIndex, "label", e.target.value)}
                        className="w-full"
                      />
                    )}
                    style={{minWidth:"15rem"}}
                  />
                  <Column
                    header="Loại input"
                    body={(rowData, { rowIndex }) => (
                      <Dropdown
                        value={rowData.type}
                        options={[
                          { label: "Text", value: "text" },
                          { label: "Number", value: "number" },
                          { label: "Date", value: "date" },
                        ]}
                        onChange={(e) => handleConfigChange(rowIndex, "type", e.value)}
                        className="w-full"
                      />
                    )}
                    style={{minWidth:"8rem"}}
                  />
                  <Column
                    body={(rowData, { rowIndex }) => (
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        text
                        onClick={() => handleRemoveRow(rowIndex)}
                      />
                    )}
                    headerStyle={{ width: "3rem", textAlign: "center" }}
                    bodyStyle={{ textAlign: "center" }}
                  />
                </DataTable>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex justify-content-center gap-2 mt-4">
        <Button
          label="Lưu"
          onClick={handleSubmit}
          severity="success"
          style={{ backgroundColor: "#1445a7", border: "none" }}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
        <Button
          label="Đóng"
          outlined
          severity="secondary"
          onClick={() => setVisible(false)}
        />
      </div>
    </Dialog>
  );
};

export default DiaglogForm;
