import { TabView, TabPanel } from "primereact/tabview";
import DuyetThietBiMoi from "./DuyetThietBiMoi";
import DuyetMoKhoa from "./DuyetMoKhoa";
import { useState } from "react";

const DuyetThietBiPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const headerMoKhoaTB = "Duyệt mở khóa";
    const headerDuyetTBMoi = "Duyệt thiết bị mới";

    return (
        <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
        >
            <TabPanel header={headerMoKhoaTB}>
                <DuyetMoKhoa />
            </TabPanel>
            <TabPanel header={headerDuyetTBMoi}>
                <DuyetThietBiMoi />
            </TabPanel>
        </TabView>
    );
};

export default DuyetThietBiPage;
