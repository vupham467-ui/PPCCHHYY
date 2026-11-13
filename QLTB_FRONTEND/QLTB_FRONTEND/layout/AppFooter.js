import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img
                src={`/layout/images/logo-evn.svg`}
                alt="EVN Logo"
                height="26"
                className="mr-1"
            />

            <span className="font-medium ml-1 text-lg">PC Hưng Yên</span>
        </div>
    );
};

export default AppFooter;
