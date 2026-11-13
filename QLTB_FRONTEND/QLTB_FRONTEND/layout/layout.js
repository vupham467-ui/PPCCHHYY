import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEventListener, useMountEffect, useUnmountEffect } from 'primereact/hooks';
import { classNames, DomHandler } from 'primereact/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppFooter from './AppFooter';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import AppConfig from './AppConfig';
import { LayoutContext } from './context/layoutcontext';
import PrimeReact from 'primereact/api';

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import vi from '../constants/local';
import { checkLogin } from '../services/authService';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { getUserInfoForLogin } from '../services/quantrihethong/HT_NGUOIDUNGService';
        
addLocale('vi', vi);
locale('vi');

const Layout = (props) => {
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const topbarRef = useRef(null);
    const sidebarRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();

    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(sidebarRef.current.isSameNode(event.target) || sidebarRef.current.contains(event.target) || topbarRef.current.menubutton.isSameNode(event.target) || topbarRef.current.menubutton.contains(event.target));

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current.topbarmenu.isSameNode(event.target) ||
                topbarRef.current.topbarmenu.contains(event.target) ||
                topbarRef.current.topbarmenubutton.isSameNode(event.target) ||
                topbarRef.current.topbarmenubutton.contains(event.target)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: false }));
        unbindProfileMenuOutsideClickListener();
    };

    const blockBodyScroll = () => {
        DomHandler.addClass('blocked-scroll');
    };

    const unblockBodyScroll = () => {
        DomHandler.removeClass('blocked-scroll');
    };

    useMountEffect(() => {
        PrimeReact.ripple = true;
    });

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            hideMenu();
            hideProfileMenu();
        });
    }, []);

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });


    // useEffect(() => {
    //     const isAuthenticated = !!storageHelper.get('token');
    //     setIsLoggedIn(isAuthenticated);
    // }, []);

    // useEffect(() => {
    //     const isAuthenticated = !!storageHelper.get('token');

    //     if (!isAuthenticated) {
    //         router.replace('/auth/login');
    //     }
    // }, [router]);

    //Có token:
    useEffect(() => {
        const checkAuth = async () => {
            try {
                //Kiểm tra đăng nhập chưa:
                const res = await checkLogin();

                if (res.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    router.replace('/auth/login');
                }
            } catch (err) {
                setIsLoggedIn(false);
                router.replace('/auth/login');
            }
        };
    
        checkAuth();
    }, []);


    // useEffect(() => {
    //     if (!router.isReady) return;
    //     const initAuth = async () => {       
    //         const { loginFromRoot, code } = router?.query;
    //         try {
    //             // 1. Kiểm tra đăng nhập (cookie access token đã có từ SSO)
    //             const resLogin = await checkLogin();
                
    //             if (!resLogin.ok) {
    //                 setIsLoggedIn(false);
    //                 router.replace('/auth/login');
    //                 return;
    //             }

    //             // 2. Nếu đăng nhập HT root có code, lấy info user từ backend và lưu localStorage
    //             if (loginFromRoot == "Y" && code) {
    //                 localStorage.clear();
    //                 const userInfo = await getUserInfoForLogin(code);
    //                 if (userInfo) {
    //                     const ds_donvi = userInfo?.ds_donvi.map(s => ({ ten: s.ten, ma_dviqly: s.ma_dviqly }));
    //                     localStorage.setItem('ds_donvi', JSON.stringify(ds_donvi))
    //                     localStorage.setItem('user', JSON.stringify(userInfo));
    //                     localStorage.setItem("currentAppCode", code.trim().toLowerCase());
    //                 }

    //                 // Xóa code khỏi URL tránh gọi lại khi về trang chủ
    //                 router.replace(router.pathname, undefined, { shallow: true });
    //             }

    //             // 3. Bật trạng thái đã login
    //             setIsLoggedIn(true);

    //         } catch (err) {
    //             console.error(err);
    //             setIsLoggedIn(false);
    //             router.replace('/auth/login');
    //         }
    //     };

    //     initAuth();
    // }, [router?.isReady, router?.query]);

    const containerClass = classNames('layout-wrapper', {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

    return (
        isLoggedIn ? (
            <React.Fragment>
                <Head>
                    <title>Phần mềm PCHY- PCHY</title>
                    <meta charSet="UTF-8" />
                    <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                    <meta name="robots" content="index, follow" />
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <meta property="og:type" content="website"></meta>
                    <meta property="og:title" content="Sakai by PrimeReact | Free Admin Template for NextJS"></meta>
                    <meta property="og:url" content="https://www.primefaces.org/sakai-react"></meta>
                    <meta property="og:description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                    <meta property="og:image" content="https://www.primefaces.org/static/social/sakai-nextjs.png"></meta>
                    <meta property="og:ttl" content="604800"></meta>
                    <link rel='icon' href='/demo/images/login/Logo.ico' sizes='any'></link>
                </Head>

                <div className={containerClass}>
                    <AppTopbar ref={topbarRef} />
                    <div ref={sidebarRef} className="layout-sidebar">
                        <AppSidebar />
                    </div>
                    <div className="layout-main-container">
                        <div className="layout-main">{props.children}</div>
                        <AppFooter />
                    </div>
                    <AppConfig />
                    <div className="layout-mask"></div>
                </div>
            </React.Fragment>
        ) : ""
    );
};

export default Layout;
