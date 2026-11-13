import { useEffect, useState } from "react";
import { baoCaoService } from "../../services/quanlythietbi/QLTB_BaoCaoService";
import CardInfo from "./CardInfo";

const QLTB_Dashboard = ({
    current_MADVIQLY,
    title = 'Quản lý thiết bị',
    theme = 'teal', 
}) => {

    const [thietbiData, setThietBiData] = useState({
        tong_so: 0,
        sl_cho_duyet: 0,
        sl_dang_dung: 0,
        sl_trong_kho: 0,
        sl_thanh_ly: 0
    });

    useEffect(() => {
        if (!current_MADVIQLY) return;

        const fetchData = async () => {
            try {
                const res = await baoCaoService.getSLThietBiDashBoard({ma_dviqly: current_MADVIQLY});
                setThietBiData(res);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [current_MADVIQLY]);

    return (
        <div className={`module-box bg-${theme}-50`}>
            <div className="flex align-items-center justify-content-between mb-2">
                <div className={`text-${theme}-700 text-xl font-semibold`}>
                    <i className="pi pi-desktop mr-2" />
                    {title}
                </div>

                {/* Tổng số thiết bị */}
                <div
                    className={`
                        flex align-items-center gap-2
                        bg-${theme}-100 text-${theme}-700
                        px-3 py-1 border-round-lg
                    `}
                >
                    <i className="pi pi-database text-lg" />
                    <span className="text-sm">Tổng số:</span>
                    <span className="font-bold text-2xl leading-none">
                        {(thietbiData.tong_so ?? 0).toLocaleString("vi-VN")}
                    </span>
                </div>
            </div>
            <div className={`module-divider bg-${theme}-500 mb-3`} />

            <div className="grid">
                <CardInfo
                    value={(thietbiData.sl_cho_duyet ?? 0).toLocaleString("vi-VN")}
                    label="Chờ duyệt"
                    icon="pi-clock"
                    bgIconColor="bg-teal-100"
                    iconColor="text-teal-600"
                />
                <CardInfo
                    value={(thietbiData.sl_dang_dung ?? 0).toLocaleString("vi-VN")}
                    label="Đang sử dụng"
                    icon="pi-send"
                    bgIconColor="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <CardInfo
                    value={(thietbiData.sl_trong_kho ?? 0).toLocaleString("vi-VN")}
                    label="Trong kho"
                    icon="pi-box"
                    bgIconColor="bg-green-100"
                    iconColor="text-green-600"
                />
                <CardInfo
                    value={(thietbiData.sl_thanh_ly ?? 0).toLocaleString("vi-VN")}
                    label="Đã thanh lý"
                    icon="pi-exclamation-triangle"
                    bgIconColor="bg-orange-100"
                    iconColor="text-orange-600"
                />
            </div>
        </div>
    );
};

export default QLTB_Dashboard;