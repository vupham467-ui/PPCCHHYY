import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { SplitButton } from 'primereact/splitbutton';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel'
import { InputNumber } from 'primereact/inputnumber';
import DialogForm from './DialogForm';
import { Paginator } from 'primereact/paginator';
import { HT_NGUOIDUNG } from '../../../models/HT_NGUOIDUNG';
import DialogPhanQuyen from './DiaLogPhanQuyen';
import { HT_NGUOIDUNG_Service } from '../../../services/quantrihethong/HT_NGUOIDUNGService';
import { apiClient } from '../../../constants/api';
import { get_All_DM_DONVI } from '../../../services/quantrihethong/DM_DONVIService';
import { getAll_DM_CHUCVU } from '../../../services/quantrihethong/DM_CHUCVUService';
import { searchDM_PHONGBAN, searchDM_PHONGBAN_V2 } from '../../../services/quantrihethong/DM_PHONGBANService';
import DialogResetPass from './DialogResetPass';
import { propSortAndFilter, scrollTableHeight } from "../../../constants/propGlobal";
import ReloadButton from '../../../components/ReloadButton';
import useReload from '../../../hooks/useReload';
import DialogResetDefaultPass from './DialogResetDefaultPass';
import { storageHelper } from '../../../utils/storageUtils';
import { ProgressSpinner } from 'primereact/progressspinner';
import Pagination from '../../../components/Pagination';
import DialogTestSign from './DialogTestSign';



const initSearch = {
    "hO_TEN": "",
    "teN_DANG_NHAP": "",
    "tranG_THAI": 1,
    "dM_DONVI_ID": null,
    "dM_PHONGBAN_ID": null,
    "dM_CHUCVU_ID": null,
    "pageIndex": 1,
    "pageSize": 100
}

const NguoiDung = () => {
    const [NguoiDung, setNguoiDung] = useState([]);
    const [DM_DONVI, setDM_DONVI] = useState([]);
    const [DM_CHUCVU, setDM_CHUCVU] = useState([]);
    const [DM_PHONGBAN, setDM_PHONGBAN] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);  // Tổng số bản ghi
    const [pageSize, setPageSize] = useState(initSearch.pageSize);   // Số bản ghi trên mỗi trang
    const [pageIndex, setPageIndex] = useState(initSearch.pageIndex); //Trang hiện tại


    const [filter, setFilter] = useState('')
    const [DataFilter, setDataFilter] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visiblePhanQuyen, setvisiblePhanQuyen] = useState(false);
    const [formData, setFormData] = useState(HT_NGUOIDUNG);
    const [selectedNguoiDung, setSelectedNguoiDung] = useState([]);
    const [isDeleteMultiple, setIsDeleteMultiple] = useState(false);
    const [changePass, setChangePass] = useState({ visible: false, idUser: null });
    const [resetPass, setResetPass] = useState({ visible: false, idUser: null, account: null });
    const [editPhanQuyen, setEditPhanQuyen] = useState({
        isEdit: false,
        user: null
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [imgBase64, setImgBase64] = useState(""); 
    const [imgUrl, setImgUrl] = useState("");
    const [visibleTestSignDialog, setVisibleTestSignDialog] = useState(false);

    //Ở các điện lực khóa chọn theo đơn vị:
    const user = storageHelper.get("user") || {};
    const current_MADVIQLY = storageHelper.get("current_MADVIQLY") || "";
    const isCompany = current_MADVIQLY == "PA23";
    const isAdmin = user?.ma_dviqly === "PA23" && user?.is_admin === "Y";

    const [searchTerm, setSearchTerm] = useState(isCompany ? initSearch : { ...initSearch, dM_DONVI_ID: user?.dm_donvi_id });

    const toast = useRef(null);

    // Lấy dữ liệu người dùng khi thay đổi trang hoặc số bản ghi trên mỗi trang
    useEffect(() => {
        loadData({ ...searchTerm, pageIndex, pageSize })
    }, [pageIndex, pageSize]);

    // Lấy dữ liệu người dùng khi thay đổi trang hoặc số bản ghi trên mỗi trang
    const loadData = async (searchTerm, isSearch = false) => {
        setIsLoading(true);
        if (isSearch) {
            setIsSearching(true);
            setPageIndex(1);
        }
        try {
            let res = await HT_NGUOIDUNG_Service.search({
                ...searchTerm,
                pageIndex: isSearch ? 1 : pageIndex,
            });

            if (res) {
                setNguoiDung(res.data);  // Dữ liệu của người dùng từ API
                setDataFilter(res.data);  // Dữ liệu của người dùng từ API
                setTotalRecords(res.totalRecords);  // Tổng số bản ghi từ API
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
            setIsSearching(false);
        }
    };

    // Lấy dữ liệu đơn vị khi load trang
    useEffect(() => {
        loadDM_DONVI()
        loadDM_CHUCVU()
        loadDM_PHONGBAN()
    }, [])


    // Lấy dữ liệu đơn vị 
    const loadDM_DONVI = async () => {
        try {
            let res = await get_All_DM_DONVI()
            // console.log(res)
            if (res) {
                setDM_DONVI([{ id: "", name: '-- Tất cả --' }, ...res.map(item => ({
                    id: item.id,
                    name: item.ten,
                    ma_dviqly: item.ma_dviqly
                }))])
                // setDM_DONVI([...res.map(item => ({
                //     id: item.id,
                //     name: item.ten,
                //     ma_dviqly: item.ma_dviqly
                // }))])
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    // Lấy dữ liệu chức vụ
    const loadDM_CHUCVU = async () => {
        try {
            let res = await getAll_DM_CHUCVU();
            if (res) {
                setDM_CHUCVU([{ id: "", name: '-- Tất cả --' }, ...res.map(item => ({
                    id: item.id,
                    name: item.ten
                }))])
            }
        } catch (error) {
            console.log('====================================');
            console.log(error.message);
            console.log('====================================');
        }

    }

    const loadDM_PHONGBAN = async () => {
        try {
            let res = await searchDM_PHONGBAN_V2({})
            // console.log(res)
            if (res) {
                setDM_PHONGBAN(res.data.map(item => ({
                    id: item.id,
                    name: item.ten,
                    dm_donvi_id: item.dm_donvi_id
                })))
            }
        } catch (error) {
            console.log('====================================');
            console.log(error.message);
            console.log('====================================');
        }
    }



    // Sự kiện khi thay đổi trang hoặc số bản ghi trên mỗi trang
    const onPageChange = (event) => {

        setPageIndex(event.page + 1);  // Cập nhật pageIndex từ sự kiện
        setPageSize(event.rows);    // Cập nhật pageSize từ sự kiện

    };


    // Sự kiện khi sửa người dùng
    const onEdit = async (kh) => {
        try {
            setIsAdd(false);
            let resUser = await HT_NGUOIDUNG_Service.getById(kh.id)
            setFormData(resUser);
            setVisibleForm(true);
        } catch (error) {
            console.log(error.message);
        }
    };

    // Sự kiện khi xóa người dùng
    const onDelete = (kh) => {
        confirmDialog({
            message: 'Bạn có chắc chắn muốn xóa người dùng này không?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {

                    let res = await HT_NGUOIDUNG_Service.delete(kh.id)
                    toast.current.show({ severity: 'success', summary: 'Xóa thành công', detail: `Người dùng ID= ${kh.id}`, life: 3000 });
                    loadData(searchTerm)
                }
                catch {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa người dùng thất bại! Hãy thử lại.', life: 3000 });
                }
            }
        });
    };

    // Sự kiện khi chọn nhiều người dùng phân quyền người dùng
    const items = useRef([
        {
            label: 'Phân quyền',
            icon: 'pi pi-users',
            command: () => {
                setEditPhanQuyen({ isEdit: false, user: null })
                setIsDeleteMultiple(false)
                setvisiblePhanQuyen(true)
            }
        },
        {
            label: 'Xóa nhiều',
            icon: 'pi pi-user-minus',
            command: () => {
                setEditPhanQuyen({ isEdit: false, user: null })
                setIsDeleteMultiple(true)
                setvisiblePhanQuyen(true)
            }
        }
    ])

    // Tìm kiếm tĩnh không gọi api (local)
    const onFilterChangeTable = (e) => {
        const value = e.target.value;
        setFilter(value);

        if (value) {
            // Lọc trên dữ liệu tĩnh
            const filteredData = NguoiDung.filter((item) =>
                item.hO_TEN?.toLowerCase().includes(value.toLowerCase()) ||
                item.teN_DANG_NHAP?.toLowerCase().includes(value.toLowerCase())
                //|| item.email?.toLowerCase().includes(value.toLowerCase()) (trong bảng không có cột email)
            );
            setDataFilter(filteredData);
        } else {
            setDataFilter(NguoiDung); // Trả về dữ liệu ban đầu nếu không có từ khóa
        }
    };

    // Template header
    const headerTemplate = (options) => {
        const className = `${options.className} flex flex-column md:flex-row justify-content-between align-items-center gap-2 mt-2`
        return (
            <div className={className}>
                <span className='text-xl font-bold mb-3 md:mb-0'>Danh sách</span>
                <div className="flex flex-column md:flex-row align-items-center gap-2">
                    {/* {selectedNguoiDung.length > 0 && 
                        <div className="mb-2 md:mb-0 w-full md:w-auto">
                            <SplitButton model={items.current} label="Bổ sung" icon="pi pi-plus" severity={"success"} rounded />
                        </div>
                    } */}
                    {/* <div className="mb-2 md:mb-0 w-full md:w-auto">
                        <InputText
                            type="search"
                            value={filter || ''}
                            onChange={(e) => onFilterChangeTable(e)}
                            placeholder="Tìm kiếm"
                            className="w-full"
                        />
                    </div> */}
                    {isAdmin && 
                        <div className="w-full md:w-auto">
                            <Button
                                icon="pi pi-plus-circle"
                                style={{ backgroundColor: "#1146A6" }}
                                className='background-blue text-sm w-full'
                                label='Thêm mới'
                                onClick={() => {
                                    setIsAdd(true);
                                    setFormData(HT_NGUOIDUNG);
                                    setVisibleForm(true);
                                }}
                            />
                        </div>
                    }
                </div>
            </div>
        )
    }

    const onLockOrUnlock = async (user) => {
        try {
            let res = await HT_NGUOIDUNG_Service.lockOrUnlock(user.id, user.tranG_THAI === 0 ? 1 : 0)
            if (res) {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: `Cập nhật trạng thái thành công`, life: 1000 });
                loadData(searchTerm)
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    //Khai báo hàm load dữ liệu
    const onReload = () => {
        loadData(searchTerm)
    }
    const { isReloading, reload } = useReload(onReload);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className='border-round-3xl bg-white p-4'>
                <Panel header="Tìm kiếm">
                    <div className='grid'>
                        <div className='col-12 md:col-6 lg:col-4'>
                            <label className="block mb-2">Đơn vị</label>
                            {isCompany && <Dropdown
                                className="w-full"
                                value={searchTerm.dM_DONVI_ID}
                                filter 
                                onChange={(e) => setSearchTerm({ ...searchTerm, dM_DONVI_ID: e.target.value })}
                                placeholder='-- Chọn đơn vị --'
                                optionLabel='name'
                                optionValue='id'
                                options={DM_DONVI}
                            />}
                            {!isCompany && <Dropdown
                                className="w-full"
                                value={searchTerm.dM_DONVI_ID}
                                disabled
                                optionLabel='name'
                                optionValue='id'
                                options={DM_DONVI}
                            />}
                        </div>

                        <div className='col-12 md:col-6 lg:col-4'>
                            <label className="block mb-2">Phòng ban</label>
                            <Dropdown className="w-full" showClear value={searchTerm.dM_PHONGBAN_ID} filter onChange={(e) => setSearchTerm({ ...searchTerm, dM_PHONGBAN_ID: e.target.value })} placeholder='-- Chọn phòng ban --' optionLabel='name' optionValue='id' options={DM_PHONGBAN.filter(s => s.dm_donvi_id === searchTerm.dM_DONVI_ID)} />
                        </div>

                        <div className='col-12 md:col-6 lg:col-4'>
                            <label className="block mb-2">Chức vụ</label>
                            <Dropdown className="w-full" showClear value={searchTerm.dM_CHUCVU_ID} filter placeholder='-- Tất cả --' optionLabel='name' optionValue='id' onChange={(e) => setSearchTerm({ ...searchTerm, dM_CHUCVU_ID: e.target.value })} options={DM_CHUCVU} />
                        </div>

                        <div className='col-12 md:col-6 lg:col-4'>
                            <label className="block mb-2">Trạng thái</label>
                            <Dropdown className="w-full" value={searchTerm.tranG_THAI} onChange={(e) => setSearchTerm({ ...searchTerm, tranG_THAI: e.target.value })} placeholder='-- Chọn trạng thái --' optionLabel='name' optionValue='id' options={[{ id: -1, name: '-- Tất cả --' }, { id: 1, name: 'Còn hiệu lực' }, { id: 0, name: 'Hết hiệu lực' }]} />
                        </div>

                        <div className='col-12 md:col-6 lg:col-4'>
                            <label className="block mb-2">Họ tên</label>
                            <InputText className="w-full" value={searchTerm.hO_TEN} onChange={(e) => setSearchTerm({ ...searchTerm, hO_TEN: e.target.value })} placeholder='Nhập họ tên' type='search' />
                        </div>

                        <div className='col-12 md:col-6 lg:col-4'>
                            <label className="block mb-2">Tên đăng nhập</label>
                            <InputText className="w-full" value={searchTerm.teN_DANG_NHAP} onChange={(e) => setSearchTerm({ ...searchTerm, teN_DANG_NHAP: e.target.value })} placeholder='Nhập tên đăng nhập' type='search' />
                        </div>
                    </div>
                    <div className='flex justify-content-center mt-2'>
                        <Button label='Tìm kiếm' style={{ backgroundColor: '#1445a7' }} loading={isSearching} onClick={() => loadData(searchTerm, true)} />
                    </div>
                </Panel>

                {/* <p className="mt-4 mb-2">* Ghi chú : <span style={{ color: "red" }}>Tích chọn vào những người cần thao tác sẽ hiển thị nút Bổ sung để Phân Quyền hoặc Xóa nhiều .</span> </p> */}

                <Panel headerTemplate={headerTemplate}>
                    <div className="flex justify-content-between">
                        <ReloadButton onReload={reload} isLoading={isReloading} />
                        <InputText
                            className="w-full md:w-20rem"
                            type="search"
                            value={filter || ''}
                            onChange={(e) => onFilterChangeTable(e)}
                            placeholder="Tìm kiếm"
                        />
                    </div>
                    <DataTable
                        scrollable
                        scrollHeight={scrollTableHeight}
                        selection={selectedNguoiDung}
                        onSelectionChange={(e) => { setSelectedNguoiDung(e.value) }} dataKey='teN_DANG_NHAP'
                        value={DataFilter} showGridlines
                        loadingIcon={
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="none" animationDuration=".5s" />
                        }
                        loading={isLoading}
                        className={`datatable-responsive mt-3 ${isReloading ? "reloading" : ""}`}
                        responsiveLayout="scroll"
                        style={{ fontSize: 12, fontWeight: "" }}
                    >
                        <Column headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} selectionMode="multiple" ></Column>
                        <Column {...propSortAndFilter} headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} field="hO_TEN" header="Họ tên" />
                        <Column {...propSortAndFilter} headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} field="teN_DANG_NHAP" header="Tên đăng nhập" />
                        <Column {...propSortAndFilter} headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} field="teN_DONVI" header="Tên đơn vị" />
                        <Column {...propSortAndFilter} headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} field="teN_PHONGBAN" header="Tên phòng ban" />
                        <Column {...propSortAndFilter} headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} field="teN_CHUCVU" header="Chức vụ" />
                        <Column headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} field="tranG_THAI" header="Trạng thái" style={{ width: "9rem" }} body={(row) => <span>{`${row.tranG_THAI === 0 ? "Không" : "Còn"} hiệu lực`}</span>} />
                        <Column headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }} header="Thao tác" style={{ width: 100 }} body={(rowData) => {

                            return (
                                <span className="flex  w-1">
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon={rowData.tranG_THAI === 0 ? "pi pi-lock-open" : "pi pi-lock"} tooltip={rowData.tranG_THAI === 0 ? 'Mở khóa người dùng' : 'Khóa người dùng'} onClick={() => onLockOrUnlock(rowData)} />
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon="pi pi-user-plus" tooltip='Phân quyền người dùng' onClick={() => {
                                        setvisiblePhanQuyen(true)
                                        setEditPhanQuyen({ isEdit: true, user: rowData }
                                        )
                                    }} />
                                    <Button size='small' className="w-1rem h-2rem p-3 mr-1" style={{ backgroundColor: "#1146A6" }} icon="pi pi-user-edit" tooltip='Sửa thông tin người dùng' onClick={() => onEdit(rowData)} />
                                    <Button disabled={!isAdmin} size='small' className="w-1rem h-2rem p-3 mr-1 dim-on-disable" style={{ backgroundColor: "#1146A6" }} icon="pi pi-trash" tooltip='Xóa người dùng' onClick={() => onDelete(rowData)} />
                                    <Button disabled={!isAdmin} size='small' className="w-1rem h-2rem p-3 mr-1 dim-on-disable" style={{ backgroundColor: "#1146A6" }} icon="pi pi-sync" tooltip='Reset mật khẩu ' onClick={() => setResetPass({ visible: true, idUser: rowData.id, account: rowData.teN_DANG_NHAP })} />
                                </span>
                            )
                        }} />
                    </DataTable>
                    {totalRecords > 0 &&
                        // <Paginator

                        //     first={((pageIndex - 1) * pageSize)}
                        //     rows={pageSize}
                        //     totalRecords={totalRecords}
                        //     onPageChange={onPageChange}
                        //     rowsPerPageOptions={rowsPagination}
                        // />}
                        <Pagination
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            totalRecords={totalRecords}
                        />
                    }
                </Panel>
            </div>

            {visiblePhanQuyen && <DialogPhanQuyen
                isDeleteMultiple={isDeleteMultiple}
                dataSelected={selectedNguoiDung}
                loadData={loadData}
                search={searchTerm}
                setDataSelected={setSelectedNguoiDung}
                EditPhanQuyen={editPhanQuyen}
                visible={visiblePhanQuyen}
                setVisible={setvisiblePhanQuyen}
                toast={toast} />}

            {visibleForm && 
                <DialogForm 
                    isAdd={isAdd}
                    search={searchTerm}
                    toast={toast}
                    DM_DONVI={DM_DONVI}
                    DM_CHUCVU={DM_CHUCVU}
                    DM_PHONGBAN={DM_PHONGBAN}
                    formData={formData}
                    setFormData={setFormData}
                    loadData={loadData}
                    visible={visibleForm}
                    setVisible={setVisibleForm} 
                    setImgBase64={setImgBase64}
                    setImgUrl={setImgUrl}
                    setVisibleTestSignDialog={setVisibleTestSignDialog}
                />
            }
            {/* {
                changePass.visible &&
                <DialogResetPass
                    toast={toast}
                    idNguoiDung={changePass.idUser}
                    visible={changePass.visible}
                    onClose={() => setChangePass({ ...changePass, visible: false })} />
            } */}

            {/* Reset Mật Khẩu */}
            {
                resetPass.visible &&
                <DialogResetDefaultPass
                    toast={toast}
                    idNguoiDung={resetPass.idUser}
                    account={resetPass.account}
                    visible={resetPass.visible}
                    onClose={() => setResetPass({ ...resetPass, visible: false })} />
            }

            {/* Xem ảnh chữ ký */}
            {
                visibleTestSignDialog &&
                <DialogTestSign
                    visible = {visibleTestSignDialog}
                    setVisible = {setVisibleTestSignDialog}
                    imgUrl={imgUrl}
                    signImgBase64 = {imgBase64}
                    toast={toast}
                />
            }
        </>
    );
};
export default NguoiDung
