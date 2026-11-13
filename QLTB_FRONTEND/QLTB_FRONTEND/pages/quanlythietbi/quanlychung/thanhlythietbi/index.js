import { TabView, TabPanel } from "primereact/tabview";
import { useState } from "react";
import ThanhLyThietBiC4Tab from "./ThanhLyThietBiC4Tab";
import { storageHelper } from "../../../../utils/storageUtils";
import ThanhLyThietBiC3Tab from "./ThanhLyThietBiC3Tab";

const DuyetThietBiPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const headerC4 = "Kiểm tra, thanh lý thiết bị tại ĐVC4";
    const headerC3 = "Kiểm tra, thanh lý thiết bị tại Công ty";
    const user = storageHelper.get("user");
    const dsQuyen = user?.ds_quyen || "";
    const dsQuyenArr = dsQuyen.split(',');
    const checkQuyenXemMenuC3 = ['ADMIN', 'QLTB_QLP10'];
    const hasQuyenXemMenuC3 = dsQuyenArr.some(q => checkQuyenXemMenuC3.includes(q));

    return (
        <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
        >
            <TabPanel header={headerC4}>
                <ThanhLyThietBiC4Tab />
            </TabPanel>
            { hasQuyenXemMenuC3 &&
                <TabPanel header={headerC3}>
                    <ThanhLyThietBiC3Tab />
                </TabPanel>
            }

        </TabView>
    );
};

export default DuyetThietBiPage;
