import { TabView, TabPanel } from "primereact/tabview";
import { useState } from "react";

import BaoCaoTongHopGiaoNhan from "./BaoCaoTongHopGiaoNhan";
import BaoCaoChiTietGiaoNhan from "./BaoCaoChiTietGiaoNhan";

const BaoCaoGiaoNhanThietBi = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const headerTongHopGiaoNhan = "Tổng hợp tình trạng giao nhận";
    const headerChiTietGiaoNhan = "Chi tiết tình trạng giao nhận";

    return (
        <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
        >
            <TabPanel header={headerTongHopGiaoNhan}>
                <BaoCaoTongHopGiaoNhan />
            </TabPanel>
            <TabPanel header={headerChiTietGiaoNhan}>
                <BaoCaoChiTietGiaoNhan />
            </TabPanel>
        </TabView>
    );
};

export default BaoCaoGiaoNhanThietBi;
