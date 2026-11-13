import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../demo/service/ProductService';
import { LayoutContext } from '../layout/context/layoutcontext';
import Link from 'next/link';
import { storageHelper } from '../utils/storageUtils';
import QLTB_Dashboard from '../components/DashBoard/QLTB_DashBoard';

const Dashboard = () => {
    const [products, setProducts] = useState(null);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);

    const [current_MADVIQLY, setCurrentMADVIQLY] = useState(null);

    useEffect(() => {
        const madvi = storageHelper.get("current_MADVIQLY");
        if (madvi) {
            setCurrentMADVIQLY(madvi);
        }
    }, []);

    const appCode = storageHelper.get_normal("currentAppCode") || null;
    const showAll = !appCode;


    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);


    return (
        <>
            {(showAll || appCode == "quanlythietbi") && (
                <QLTB_Dashboard 
                    current_MADVIQLY={current_MADVIQLY} 
                />
            )}
        </>
    )
};

export default Dashboard;
