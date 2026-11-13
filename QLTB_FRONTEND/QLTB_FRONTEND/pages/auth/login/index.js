import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import styles from './login.module.scss'
import { Message } from 'primereact/message';
import { login_HT_NGUOIDUNG, ssoLogin } from '../../../services/quantrihethong/HT_NGUOIDUNGService';
import Head from 'next/head';
import { Toast } from 'primereact/toast';
import Link from 'next/link';

import useLoading from "../../../hooks/useLoading";
import { ProgressSpinner } from "primereact/progressspinner";
import { storageHelper } from '../../../utils/storageUtils';

const getApiErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data;

    if (typeof responseData === 'string' && responseData.trim()) {
        return responseData.trim();
    }

    if (responseData && typeof responseData === 'object') {
        const backendMessage =
            responseData.message ??
            responseData.Message ??
            responseData.error ??
            responseData.title;

        if (typeof backendMessage === 'string' && backendMessage.trim()) {
            return backendMessage.trim();
        }
    }

    return fallbackMessage;
};

const LoginPage = () => {
    const currentYear = new Date().getFullYear()
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSsoLogging, setIsSsoLogging] = useState(false);

    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const [username, setUsername] = useState('')
    const toast = useRef(null);

    const { isLoading, startLoading, stopLoading } = useLoading();

    //Làm sạch dữ liệu localstorage:
    useEffect(() => {
        localStorage.clear();
    }, []);

    useEffect(() => {
        if (!router?.isReady) return;
        const { tempToken, username, id, code } = router?.query;
        if (tempToken && username) {
            // tự submit SSO
            (async () => {
                try {
                    setIsSsoLogging(true);
                    const response = await ssoLogin({ tempToken, username, id, code });

                    if (response) {
                        // lưu thông tin người dùng vào localStorage
                        storageHelper.set('user', response?.user);
                        storageHelper.set('ds_donvi', response?.user.ds_donvi || []);
                        storageHelper.set("current_MADVIQLY", response?.user?.ma_dviqly);
                        storageHelper.set_normal("currentAppCode", code.trim().toLowerCase());
                        toast.current.show({ severity: 'success', summary: 'Đăng nhập thành công', detail: 'Bạn đã đăng nhập tự động!', life: 3000 });
                        router.push('/'); // vào trang chính
                    }
                } catch (error) {
                    setIsSsoLogging(false);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Đăng nhập thất bại',
                        detail: getApiErrorMessage(error, 'Token không hợp lệ'),
                        life: 4000
                    });
                }
            })();
        }
    }, [router?.isReady, router?.query]);

    const handleLogin = async () => {
        let detailMessage = '';
        try {
            startLoading();
            const data = { ten_dang_nhap: username, mat_khau: password }
            const response = await login_HT_NGUOIDUNG(data)

            if (response) {
                let ds_donvi = response.user.ds_donvi.map(s => ({ ten: s.ten, ma_dviqly: s.ma_dviqly }))
                // sessionStorage.setItem('ds_donvi', JSON.stringify(ds_donvi))
                // sessionStorage.setItem('user', JSON.stringify(response.user));
                // sessionStorage.setItem('token', JSON.stringify(response.accessToken)); //accessToken
                storageHelper.set('user', response?.user);
                storageHelper.set('ds_donvi', ds_donvi);
                storageHelper.set("current_MADVIQLY", response?.user?.ma_dviqly);

                detailMessage = "Đăng nhập thành công!";
                toast.current.show({ severity: 'success', summary: 'Thông báo', detail: detailMessage, life: 3000 })
                router.push('/')
            }
        } catch (error) {
            console.log(error);
            const statusCode = error?.response?.status;
            const fallbackMessage =
                statusCode === 401
                    ? 'Tên đăng nhập, mật khẩu không đúng hoặc người dùng chưa được phân quyền.'
                    : statusCode === 429
                        ? 'Bạn đã đăng nhập sai quá 3 lần trong 1 phút. Vui lòng thử lại sau 1 phút.'
                        : statusCode === 400
                            ? 'Dữ liệu đăng nhập không hợp lệ.'
                            : statusCode === 502 || statusCode === 503
                                ? 'Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại sau.'
                                : 'Đã xảy ra lỗi trong quá trình đăng nhập.';

            detailMessage = error?.code === 'ERR_NETWORK' || !error?.response
                ? 'Không thể kết nối đến máy chủ.'
                : getApiErrorMessage(error, fallbackMessage);

            toast.current.show({ severity: 'error', summary: 'Đăng nhập thất bại', detail: detailMessage, life: 4000 })
        } finally {
            stopLoading();
        }
    }

    const handleUsernameError = () => {
        if (!username) {
            setUsernameError('Tên đăng nhập không được để trống')
        } else {
            setUsernameError('')
        }
    }

    const handlePasswordError = () => {
        if (!password) {
            setPasswordError('Mật khẩu không được để trống')
        } else {
            setPasswordError('')
        }
    }

    return (
        <React.Fragment>
            <Head>
                <title>Đăng nhập - Phần mềm quản lý kìm chì</title>
            </Head>
            <Toast ref={toast} />

            <div className={containerClassName}  style={{ backgroundColor: 'white' }}>
                <div className="w-11 " style={{ backgroundColor: 'white' }}>
                    {isSsoLogging ? (
                        <div className="flex flex-column align-items-center justify-content-center h-full">
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="none" animationDuration=".5s" />
                            <p className="mt-3 text-lg font-medium">Đang đăng nhập tự động… vui lòng chờ giây lát</p>
                        </div>
                    ) :
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}>
                        <div className="grid">
                            <div className="col-12 md:col-6 relative z-5 ">
                                <div className="pb-5">
                                    <div className="row">
                                        <img alt='logo' src='/demo/images/login/logologin.png' className="w-4" />
                                    </div>
                                </div>
                                <div className='hidden md:block' style={{
                                    height: '75vh',
                                    backgroundImage: "url('/demo/images/login/bg.jpg')",
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}>
                                </div>
                            </div>
                            <div className="col-12 md:col-6 p-4">
                                {isLoading && (
                                    <div className='flex justify-content-center'
                                        style = {
                                            {
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                            }
                                        }
                                    >
                                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
                                    </div>
                                )}
                                <div className="mb-8">
                                    <div className="text-center">
                                        <h3 className="page-title uppercase" style={{ color: '#1445a7' }}>hệ thống phần mềm pchungyen.vn</h3>
                                    </div>
                                    <div className="flex flex-wrap px-3 mb-4 mx-minus-2">
                                        <div className="h-1rem w-5 bg-gray-200 mt-2"></div>
                                        <small className="w-1 font-bold text-center">o0o</small>
                                        <div className="h-1rem w-5 bg-gray-200 mt-2"></div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                        Tên đăng nhập
                                    </label>
                                    <InputText 
                                        inputid="username" 
                                        value={username} 
                                        type="text" 
                                        placeholder="Tài khoản" 
                                        className="w-full mb-2 p-3" 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        onBlur={handleUsernameError}
                                        autoComplete="username"
                                    />
                                    {
                                        usernameError && (
                                            <Message severity='error' text={usernameError} className='mb-5 w-full' />
                                        )
                                    }
                                </div>

                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    Mật khẩu
                                </label>
                                <Password inputid="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Mật khẩu" 
                                    toggleMask 
                                    feedback={false} 
                                    className="w-full mb-2" 
                                    inputClassName="w-full p-3" 
                                    onBlur={handlePasswordError}
                                    // onKeyDown={(e) => {
                                    //     if (e.key === 'Enter') {
                                    //         e.preventDefault();
                                    //         e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
                                    //         handleLogin();
                                    //     }
                                    // }}
                                    autoComplete="current-password"
                                >  
                                </Password>
                                {
                                    passwordError && (
                                        <Message severity='error' text={passwordError} className='mb-4 w-full' />
                                    )
                                }

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div className="flex align-items-center">
                                        <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                        <label htmlFor="rememberme1">Lưu mật khẩu</label>
                                    </div>
                                    <Link className="font-medium no-underline ml-2 text-right cursor-pointer hover:text-blue-700" href='/auth/forgotpassword'>
                                        Quên mật khẩu
                                    </Link>
                                </div>
                                <div className="text-center">
                                    <Button 
                                        label="Đăng nhập"
                                        type="submit"
                                        className="w-5 h-3rem shadow-6 bg-blue-700 hover:bg-blue-700 hover:opacity-80" 
                                        // onClick={handleLogin}
                                        disabled={isLoading}
                                    >
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="text-center py-4 bg-indigo-900">
                            <div className="text-center text-white">
                                <small className="text-center">Copyright © {currentYear} <span className="font-bold text-sm">Công ty Điện lực Hưng Yên</span></small>
                            </div>
                        </div>
                    </form>}
                </div>
            </div>
            
        </React.Fragment>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
