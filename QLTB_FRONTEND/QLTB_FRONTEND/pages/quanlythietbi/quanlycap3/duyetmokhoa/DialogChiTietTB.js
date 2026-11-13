import { useEffect, useState } from "react";
import { QLTB_DM_THIETBI } from "../../../../models/quanlythietbi/QLTB_DM_THIETBI";
import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import InputTextField from "../../../../components/FormInputs/InputTextField";
import CalendarField from "../../../../components/FormInputs/CalenderField";
import { storageHelper } from "../../../../utils/storageUtils";
import { thietBiService } from "../../../../services/quanlythietbi/QLTB_DANH_MUC_Service";

const DialogChiTietThietBi = ({
    visible,
    setVisible,
    selectedId,
    setIsMulti,
    setIsShow
}) => {
    const [formData, setFormData] = useState(QLTB_DM_THIETBI);
    const [hasDetail, setHasDetail] = useState(false);
    const [configDetails, setConfigDetails] = useState([]); // mảng cấu hình chi tiết
    const [detailValues, setDetailValues] = useState({});   // giá trị nhập của từng trường

    const user = storageHelper.get("user");
    const { ho_ten, ten_dang_nhap, dm_donvi_id } = user;

    useEffect(() => {
        const loadData = async () => {
            try {
                const params = {
                    id: selectedId,
                    pageIndex: 1,
                    pageSize: 1,
                };
                const items = await thietBiService.get(params); // lấy theo id chỉ có 1 thiết bị
                
                const dataItem = items?.data[0];
                if (typeof dataItem === "object" && dataItem !== null) {
                    setFormData(dataItem);  

                    const hasDetailValue = dataItem?.co_thongtin_ct == "Y" && dataItem?.ct_cauhinh_json;  
                    setHasDetail(hasDetailValue);

                    if (hasDetailValue) {
                        try {
                            const parsed = JSON.parse(dataItem?.ct_cauhinh_json);
                            setConfigDetails(Array.isArray(parsed) ? parsed : []);
                            // Nếu là cập nhật hoặc xem, điền giá trị cũ vào
                            if (dataItem?.thongtin_chitiet_json) {
                            const values = JSON.parse(dataItem?.thongtin_chitiet_json);
                            setDetailValues(values);
                            } else {
                            const initValues = {};
                            parsed.forEach(f => initValues[f.name] = ""); // mặc định rỗng
                            setDetailValues(initValues);
                            }
                        } catch {
                            setConfigDetails([]);
                            setDetailValues({});
                        }
                        } else {
                        setConfigDetails([]);
                        setDetailValues({});
                    }
                }

            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            }
        };
        loadData();
    }, []);

    const handleClickDuyetBtn = () => {
        setIsMulti(false);
        setIsShow(true);
    }

    return (
        <Dialog
        header={"Xem chi tiết"}
        visible={visible}
        className="w-11 md:w-10 lg:w-9"
        onHide={() => setVisible(false)}
        >
        <TabView>
            <TabPanel header="Thông tin chung">
            <div className="p-fluid p-2" style={{ minHeight: "350px" }}>
                <div className="grid">
                {/* Đơn vị quản lý */}
                <InputTextField
                    label="Đơn vị"
                    name="dm_donvi_ten"
                    value={formData?.dm_donvi_ten || ""}
                    required
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />

                {/* Phòng ban sử dụng */}
                <InputTextField
                    label="Phòng ban"
                    name="dm_phongban_ten"
                    value={formData?.dm_phongban_ten || ""}
                    required
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />


                {/* Kho */}
                <InputTextField
                    label="Kho đơn vị"
                    name="tbi_kho_ten"
                    value={formData?.tbi_kho_ten || ""}
                    required
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />

                {/* Mã & Tên & Serial */}
                <InputTextField
                    label="Tên thiết bị"
                    name="ten_thietbi"
                    value={formData?.ten_thietbi || ""}
                    required
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />
                <InputTextField
                    label="Mã thiết bị"
                    name="ma_thietbi"
                    value={formData?.ma_thietbi || ""}
                    required
                    divClassName="col-6 md:col-3 lg:col-2"
                    disabled
                />
                <InputTextField
                    label="Serial"
                    name="no_thietbi"
                    value={formData?.no_thietbi || ""}
                    required
                    divClassName="col-6 md:col-3 lg:col-2"
                    disabled
                />

                {/* Đơn vị tính */}
                <InputTextField
                    label="ĐV Tính"
                    name="dm_donvitinh_ten"
                    value={formData?.dm_donvitinh_ten || ""}
                    required
                    divClassName="col-6 md:col-3 lg:col-2"
                    disabled
                />

                {/* Năm SX */}
                <CalendarField
                    label="Năm SX"
                    name="namsx"
                    value={formData?.namsx}
                    required
                    view="year"
                    dateFormat="yy"
                    dateStringFormat="YYYY"
                    divClassName="col-6 md:col-3 lg:col-2"
                    disabled
                />

                {/* Chủng loại, Hãng SX, Nước SX, Trạng thái */}
                <InputTextField
                    label="Chủng loại"
                    name="tbi_dm_chungloai_ten"
                    value={formData?.tbi_dm_chungloai_ten || ""}
                    required
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />
                <InputTextField
                    label="Hãng SX"
                    name="tbi_dm_hangsx_ten"
                    value={formData?.tbi_dm_hangsx_ten || ""}
                    required
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />
                <InputTextField
                    label="Nước SX"
                    name="tbi_nuocsx_ten"
                    value={formData?.tbi_nuocsx_ten || ""}
                    required
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />

                {/* Ngày vận hành */}
                <CalendarField
                    label="Ngày vận hành"
                    name="ngay_vanhanh"
                    value={formData?.ngay_vanhanh}
                    required
                    // showTime
                    dateStringFormat="DD/MM/YYYY"
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />

                {/* Người tạo & Ngày tạo */}
                <InputTextField
                    label="Người tạo"
                    name="nguoi_tao"
                    value={`${ho_ten} - [${ten_dang_nhap}]`}
                    required
                    disabled
                    divClassName="col-12 md:col-6 lg:col-4"
                />
                <CalendarField
                    label="Ngày tạo"
                    name="ngay_tao"
                    value={formData?.ngay_tao}
                    required
                    disabled
                    showTime
                    divClassName="col-12 md:col-6 lg:col-4"
                />

                {/* Người sử dụng & Thông tin khác */}
                <InputTextField
                    label="Người sử dụng"
                    name="nguoi_sd"
                    value={formData?.nguoi_sd || ""}
                    divClassName="col-12 md:col-6 lg:col-4"
                    disabled
                />
                <InputTextField
                    label="Thông tin khác"
                    name="thong_tin_khac"
                    value={formData?.thong_tin_khac || ""}
                    divClassName="col-12 md:col-6 lg:col-8"
                    disabled
                />
                </div>
            </div>
            </TabPanel>
            <TabPanel
            header={
                <div className="flex align-items-center gap-2">
                Thông tin chi tiết
                {!hasDetail && (
                    <i
                    className="pi pi-lock"
                    style={{ fontSize: "0.8rem", color: "red" }}
                    />
                )}
                </div>
            }
            disabled={!hasDetail}
            >
            <div className="p-fluid p-2" style={{ minHeight: "350px" }}>
                <div className="grid">
                {configDetails.map((cfg, idx) => (
                    <div className="col-12 md:col-6 lg:col-4" key={idx}>
                    {cfg.type === "text" && (
                        <InputTextField
                        label={cfg.label}
                        name={cfg.name}
                        value={detailValues[cfg.name] || ""}
                        disabled
                        />
                    )}
                    {cfg.type === "number" && (
                        <InputTextField
                        label={cfg.label}
                        name={cfg.name}
                        type="number"
                        value={detailValues[cfg.name] || ""}
                        disabled
                        />
                    )}
                    {cfg.type === "date" && (
                        <CalendarField
                        label={cfg.label}
                        name={cfg.name}
                        value={detailValues[cfg.name] || null}
                        disabled
                        />
                    )}
                    </div>
                ))}
                </div>
            </div>
            </TabPanel>
        </TabView>

        {/* Nút hành động */}

        <div className="flex justify-content-center gap-2 mt-2">
            <Button
                label="Xác nhận duyệt"
                onClick={handleClickDuyetBtn}
                severity="success"
                style={{ backgroundColor: "#1445a7", border: "none" }}
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

export default DialogChiTietThietBi;
