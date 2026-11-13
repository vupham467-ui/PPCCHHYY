import { TabView, TabPanel } from "primereact/tabview";
import { useState } from "react";

import BaoCaoThongKeBBC4 from "./BaoCaoThongKeBBC4";
import BaoCaoThongKeBBC3 from "./BaoCaoThongKeBBC3";
import { storageHelper } from "../../../../utils/storageUtils";
import { MADV_CTY } from "../../../../constants/propGlobal";

const BaoCaoGiaoNhanThietBi = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const headerTongHopGiaoNhanC4 = "Tổng hợp biên bản ĐVC4";
    const headerTongHopGiaoNhanC3 = "Tổng hợp biên bản ĐVC3";
    const user = storageHelper.get("user");

    return (
        <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
        >
            <TabPanel header={headerTongHopGiaoNhanC4}>
                <BaoCaoThongKeBBC4 />
            </TabPanel>
            {user.ma_dviqly == MADV_CTY &&
                <TabPanel header={headerTongHopGiaoNhanC3}>
                    <BaoCaoThongKeBBC3 />
                </TabPanel>
            }
        </TabView>
    );
};

export default BaoCaoGiaoNhanThietBi;
