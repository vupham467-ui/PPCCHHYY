import Link from "next/link";
import Router, { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import React, {
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { Menu } from "primereact/menu";
import { PrimeIcons } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown } from "primereact/dropdown";
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import DialogResetPass from '../pages/quantrihethong/nguoidung/DialogResetPass';
import { Toast } from 'primereact/toast';
import { storageHelper } from "../utils/storageUtils";
import { logOut } from "../services/authService";

// eslint-disable-next-line react/display-name
const AppTopbar = forwardRef((props, ref) => {
    const menuLeft = useRef(null);
    const menuRight = useRef(null);
    const overlayPanelRef = useRef(null);
    const router = useRouter();

    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [tenPhongBan, setTenPhongBan] = useState("");
    const [selectedDonVi, setSelectedDonVi] = useState(storageHelper.get("current_MADVIQLY") || ""); // Lưu giá trị đã chọn
    const [visible, setVisible] = useState(false);
    const [showResetPass, setShowResetPass] = useState(false);
    const toast = useRef(null);

    const [avatarUrl, setAvatarUrl] = useState("");

    const user = storageHelper.get("user");
    const userId = user?.id || "";

    useEffect(() => {
        if (user) {
            !selectedDonVi && setSelectedDonVi(user?.ma_dviqly)
            setTenPhongBan(user?.ten_phongban);
            setTenDangNhap(user?.ho_ten);
            setAvatarUrl(user?.anhdaidien || "");
            // setTenDangNhap(user?.ten_dang_nhap);

        }
    }, []);


    useEffect(() => {
        storageHelper.set("current_MADVIQLY", selectedDonVi);

    }, [selectedDonVi])

    const ds_donvi = storageHelper.get("ds_donvi");


    const logout = async () => {
        try {
            const res = await logOut();
            if (res.ok) {
                Router.push('/auth/login');
            }
        } catch (error) {
            console.log(error.message);
        }
        localStorage.clear();
        // sessionStorage.removeItem('user');
        // sessionStorage.removeItem('current_MADVIQLY');
        // sessionStorage.removeItem('token');
    }
    const items = [
        {
            label: tenPhongBan,
            icon: PrimeIcons.BUILDING,
        },
        {
            label: tenDangNhap,
            icon: PrimeIcons.USER,
        },
        {
            label: "Đổi mật khẩu",
            icon: PrimeIcons.LOCK,
        },
    ];

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    return (
        <div className="layout-topbar">
            <Toast ref={toast} />
            <ConfirmDialog
                visible={visible}
                onHide={() => setVisible(false)}
                message="Bạn có chắc chắn muốn đăng xuất?"
                header="Xác nhận đăng xuất"
                icon="pi pi-exclamation-triangle"
                accept={logout}
                acceptLabel="Đồng ý"
                rejectLabel="Hủy"
            />
            <Link href="/" className="layout-topbar-logo">
                <img
                    style={{ width: "200px", "height": "auto" }}
                    src="/demo/images/login/logologin.png"
                    widt={"true"}
                    alt="logo"
                />
            </Link>

            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            <div
                ref={topbarmenuRef}
                className={classNames("layout-topbar-menu", {
                    "layout-topbar-menu-mobile-active":
                        layoutState.profileSidebarVisible,
                })}
            >
                <div className="p-menuitem" style={{ cursor: "pointer" }} >
                    <Button
                        tooltip="Trợ giúp"
                        tooltipOptions={{ position: 'left' }} 
                        title="Trợ giúp"
                        type="button"
                        style={{ color: "#8183F4" }}
                        className="p-link layout-topbar-button"
                    >
                        <i className="pi pi-question-circle"></i>
                    </Button>

                </div>
                <button
                    type="button"
                    className="p-link layout-topbar-button mr-2"
                    onClick={(e) => overlayPanelRef.current.toggle(e)}
                >
                    {avatarUrl && (
                        <img src={avatarUrl} alt="Avatar"   
                            style={{
                                width: 40,
                                height: 40,
                                aspectRatio: 1 / 1,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                cursor: "pointer",
                                transition: "transform 0.3s ease",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.3)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        />
                    )}
                    {!avatarUrl && (
                        <i className="pi pi-user"></i>
                    )}
                    <span className="ml-2">Profile</span>
                    {/* <Menu
                        model={items}
                        popup
                        id="popup_menu_left"
                        ref={menuLeft}
                        style={{ width: "250px" }}
                    /> */}
                </button>

                <OverlayPanel
                    ref={overlayPanelRef}
                    id="overlay_panel"
                    style={{ width: "350px" }}

                >
                    <ul className="p-menu-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', margin: '0', padding: '0' }}>
                        <li className="p-menuitem" style={{ height: 'auto' }}>
                            <a className="p-menuitem-link text-xl">
                                <span className="p-menuitem-icon pi pi-home mr-2"></span>
                                <span title="Tên phòng ban" className="p-menuitem-text" style={{fontSize: "13px"}} >
                                    {tenPhongBan}
                                </span>
                            </a>
                        </li>
                        <li className="p-menuitem">
                            <a className="p-menuitem-link text-xl">
                                <span className="p-menuitem-icon pi pi-user mr-2"></span>
                                <span className="p-menuitem-text" style={{fontSize: "13px"}}>
                                    {tenDangNhap}
                                </span>
                            </a>
                        </li>
                        <li onClick={() => setShowResetPass(true)} className="p-menuitem">
                            <a className="p-menuitem-link text-xl" style={{ cursor: 'pointer' }}>
                                <span className="p-menuitem-icon pi pi-lock mr-2" ></span>
                                <span className="p-menuitem-text" style={{fontSize: "13px"}}>
                                    Đổi mật khẩu
                                </span>
                            </a>
                        </li>
                    </ul>
                </OverlayPanel>

                <div style={{ cursor: "pointer", position: "relative" }}>

                    <div className="menuitem">
                        <Dropdown
                            tooltip="Chuyển đơn vị"
                            tooltipOptions={{ position: 'left' }}
                            value={selectedDonVi}
                            filter
                            onChange={(e) => {

                                setSelectedDonVi(e.value);
                                router.reload()

                            }}
                            options={ds_donvi}
                            optionLabel="ten"
                            optionValue="ma_dviqly"
                            placeholder="Chọn đơn vị"
                            style={{ border: 0, fontSize: 22 }}
                            dropdownIcon="pi pi-sync"
                        />
                    </div>

                </div>

                <div onClick={() => setVisible(true)} className="p-menuitem" style={{ cursor: "pointer" }} >
                    <Button
                        tooltip="Đăng xuất"
                        tooltipOptions={{ position: 'left' }} 
                        title="Đăng xuất"
                        type="button"
                        style={{ color: "red" }}
                        className="p-link layout-topbar-button"
                    >
                        <i className="pi pi-power-off"></i>
                    </Button>

                </div>

                {showResetPass && (
                    <DialogResetPass
                        idNguoiDung={userId}
                        visible={showResetPass}
                        onClose={() => setShowResetPass(false)}
                        toast={toast}
                    />
                )}
            </div>
        </div>
    );

});

export default AppTopbar;
