import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'leaflet/dist/leaflet.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import '../styles/layout/globalStyles.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import useMenuGuard from '../hooks/useMenuGuard';
import { MenuProvider } from '../layout/context/menucontext';
export default function MyApp({ Component, pageProps }) {
    const loading = useMenuGuard(); // lấy trạng thái loading

    if (loading) {
        return <div className="flex justify-content-center align-items-center h-screen">
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="none" animationDuration=".5s" />
        </div>;
    }
    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
    } else {
        return (
            <LayoutProvider>
                <MenuProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </MenuProvider>
            </LayoutProvider>
        );
    }
}
