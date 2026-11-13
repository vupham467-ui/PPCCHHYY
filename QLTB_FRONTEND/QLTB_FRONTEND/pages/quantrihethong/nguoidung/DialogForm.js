import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { useRef, useState, useEffect } from "react";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import UploadFileService from "../../../services/UploadFileService";
import { urlServer } from "../../../constants/api";
import { validatePassword } from "../../../utils/Function";
import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";
import { searchDM_PHONGBAN_V2 } from "../../../services/quantrihethong/DM_PHONGBANService";

const mockData = {
    trangThaiOptions: [
        { name: 'Còn hiệu lực', id: 1 },
        { name: 'Hết hiệu lực', id: 0 }
    ],

    gioiTinhOptions: [
        { name: 'Nam', id: 1 },
        { name: 'Nữ', id: 0 }
    ]
};

const FormField = ({ label, value, options, onChange, id, isDropdown = false, typeInput = "text",disabled = false }) => (
    <div className="field col-12 md:col-6">
        <label className='font-bold text-sm my-3 block' htmlFor={id}>{label}</label>
        {isDropdown ? (
            <Dropdown filter placeholder="Chọn giá trị " id={id} name={id} value={value} optionValue="id" optionLabel="name" options={options} onChange={onChange} className="w-full" />
        ) : (
            <InputText type={typeInput} placeholder="Nhập thông tin" id={id} name={id} value={value} disabled={disabled} onChange={onChange} className="w-full" />
        )}
    </div>
);

const DialogForm = ({ isAdd, formData, setFormData, visible, setVisible, toast, loadData, DM_DONVI, DM_CHUCVU, DM_PHONGBAN, search, setImgBase64, setImgUrl, setVisibleTestSignDialog}) => {
    const [loading, setLoading] = useState(false);
    const [filePath, setFilePath] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [dsPhongBan, setDsPhongBan] = useState([]);
    const fileUploadRef = useRef(null);




    useEffect(() => {
        if (formData.sign_image) {
            setPreviewImage(urlServer + formData.sign_image);
            setImgUrl(formData.sign_image);
        } else {
            setImgUrl("");
        }
    }, [formData.sign_image])

    useEffect(() => {
        // const ma_dviqly = (DM_DONVI.find(s => s.id === formData.dm_donvi_id))?.ma_dviqly;
        // const loadPB = async () => {
        //     try {
        //         if (!ma_dviqly) return;
        //         const res = await searchDM_PHONGBAN_V2({ma_dviqly});

        //         setDsPhongBan(res?.data.map(item => ({
        //             id: item.id,
        //             name: item.ten,
        //             dm_donvi_id: item.dm_donvi_id
        //         })))
        //     } catch (error) {
        //         console.log('====================================');
        //         console.log(error.message);
        //         console.log('====================================');
        //     }
        // }

        // loadPB();
        // console.log("test:" + formData.dm_donvi_id)
        // console.log(DM_PHONGBAN)
        // console.log(DM_PHONGBAN.filter(s => s.dm_donvi_id === formData.dm_donvi_id))
        // console.log('====================================');
        // console.log(DM_PHONGBAN);
        // console.log('====================================');
        setDsPhongBan(DM_PHONGBAN.filter(s => s.dm_donvi_id === formData.dm_donvi_id))
    }, [formData.dm_donvi_id])


    const handleUploadImage = async (event) => {
        const file = event.files[0];

        const formData = new FormData();
        formData.append("file", file);
        setFilePath(formData);
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        // Đọc file dưới dạng base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result;
            if (typeof result === 'string' && result.includes(',')) {
                const base64Only = result.split(',')[1];
                setImgBase64(base64Only);
                setImgUrl("");
            } else {
                console.error("Dữ liệu base64 không hợp lệ:", result);
                setImgBase64("");
            }
        };

        reader.onerror = (error) => {
            console.error("Lỗi khi đọc file:", error);
        };


        fileUploadRef.current.clear();
    }

    const handleTestSign = async () => {
        setVisibleTestSignDialog(true);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateEmptyFields = () => {
        const requiredFields = ["ten_dang_nhap", "ho_ten", "email", "dm_donvi_id", "dm_phongban_id", "dm_chucvu_id"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo!',
                    detail: `Trường ${field} không được để trống.`,
                    life: 3000
                });
                return false;
            }
            if (isAdd) {
                const password = formData["mat_khau"];
                return validatePassword(password, toast);
            }
        }
        return true;
    };


    const handleSubmit = async () => {
        if (validateEmptyFields()) {
            setLoading(true);
            try {
                let anhchuky = formData.sign_image;
                if (filePath) {
                    const res = await UploadFileService.image(filePath);
                    anhchuky = res.filePath;
                }


                const res = isAdd
                    ? await HT_NGUOIDUNG_Service.create({ ...formData, trang_thai: 1, sign_image: anhchuky })
                    : await HT_NGUOIDUNG_Service.update({ ...formData, sign_image: anhchuky });
                if (res.status === 200) {
                    toast.current.show({ severity: 'success', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thành công người dùng.`, life: 3000 });
                    if (isAdd) {
                        setFormData(HT_NGUOIDUNG);
                    }
                    loadData(search);
                }
            } catch (error) {
                const errorMessage = error.response.status == 400 ? "Tên đăng nhập đã tồn tại" : `${(isAdd ? "Thêm" : "Sửa")} thất bại.`;
                toast.current.show({ severity: 'error', summary: 'Thông báo!', detail: errorMessage, life: 3000 })

            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <Dialog position={"top"} header={<h4>{(isAdd ? "Thêm mới" : "Sửa thông tin") + " người dùng"}</h4>} visible={visible} className='w-11 md:w-8' onHide={() => setVisible(false)}>
            <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
                <div className="grid">
                    <FormField label="Đơn vị quản lý" value={formData.dm_donvi_id || ""} options={DM_DONVI} onChange={handleInputChange} id="dm_donvi_id" isDropdown />
                    <FormField label="Phòng ban" value={formData.dm_phongban_id || ""} options={dsPhongBan} onChange={handleInputChange} id="dm_phongban_id" isDropdown />
                    <FormField label="Tên đăng nhập" value={formData.ten_dang_nhap || ""} onChange={handleInputChange} id="ten_dang_nhap" 
                        disabled={!isAdd}
                    />
                   
                    {isAdd && <div className="field col-12 md:col-6">
                        <label className='font-bold text-sm my-3 block' htmlFor="mat_khau">Mật khẩu</label>
                        <Password  inputid="mat_khau" name="mat_khau" value={formData.mat_khau || ""} onChange={handleInputChange} placeholder="Nhập mật khẩu" toggleMask className="w-full mb-2" inputClassName="w-full p-3" />
                    </div>}
                    <FormField label="Họ tên" value={formData.ho_ten || ""} onChange={handleInputChange} id="ho_ten" />
                    <FormField label="Chức vụ" value={formData.dm_chucvu_id || ""} options={DM_CHUCVU} onChange={handleInputChange} id="dm_chucvu_id" isDropdown />
                    {!isAdd && <FormField label="Trạng thái" value={formData.trang_thai || ""} options={mockData.trangThaiOptions} onChange={handleInputChange} id="trang_thai" isDropdown />}
                    <FormField label="Email" value={formData.email || ""} onChange={handleInputChange} id="email" typeInput="email" />
                    <FormField label="Số điện thoại" value={formData.so_dien_thoai || ""} onChange={handleInputChange} id="so_dien_thoai" typeInput="tel" />
                    <FormField label="Giới tính" value={formData.gioi_tinh || ""} options={mockData.gioiTinhOptions} onChange={handleInputChange} id="gioi_tinh" isDropdown />
                    <FormField label="Số CMND" value={formData.so_cmnd || ""} onChange={handleInputChange} id="so_cmnd" />
                    {!isAdd && <FormField label="Mã nhân viên CMIS (Danh sách nhân viên)" value={formData?.ma_nvien_cmis || ""} onChange={handleInputChange} id="ma_nvien_cmis" />}
                    <FormField label="Hình thức ký" value={formData.sign_type || ""} options={[
                        { name: '1-VNPT SmartCA', id: 1 },
                        { name: '2-Viettel SmartCA', id: 2 },
                        { name: '3-VNPT Token', id: 3 },
                        { name: '4-Viettel Token', id: 4 },
                        { name: '5-EVN CA', id: 5 },
                        { name: '6-Ký ảnh', id: 6}
                    ]} onChange={handleInputChange} id="sign_type" isDropdown />
                    {/* <FormField label="Token/Alias Chữ Ký" value={formData.value_token || ""} onChange={handleInputChange} id="value_token" /> */}
                    <FormField label="Token/Alias Chữ Ký" value={formData.sign_alias || ""} onChange={handleInputChange} id="sign_alias" />
                </div>

                <h5 className="text-sm font-bold">Ảnh chữ ký (280 x 140px):</h5>
                {(previewImage) && (
                    <div className="mt-3 w-fit">
                        <img src={previewImage} alt="Ảnh chữ ký nháy" style={{ width: "200px", height: "100px" }} />
                    </div>
                )}
                <div className="flex gap-4 md:w-auto my-3" >
                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        id="fileUpload"
                        name="fileUpload"
                        accept="image/*"
                        chooseLabel="Chọn ảnh chữ ký"
                        className="p-inputtext-sm"
                        onSelect={handleUploadImage}
                    />
                    <Button
                        icon="pi pi-pen-to-square"
                        id="testSign"
                        name="testSign"
                        label="Xem ảnh chữ ký"
                        severity="success"
                        disabled={!previewImage}
                        style={{ backgroundColor: "#00bc2a" }}
                        className="p-button w-fit dim-on-disable"
                        onClick={handleTestSign}
                    />
                </div>
            </div>

            <div className='flex justify-content-end gap-2 mt-4'>
                <Button label="Đóng" icon="pi pi-times" onClick={() => setVisible(false)} className='p-button-outlined' />
                <Button label={isAdd ? "Thêm mới" : "Lưu"} icon="pi pi-check" loading={loading} onClick={handleSubmit} />
            </div>

        </Dialog>

    );
};

export default DialogForm;
