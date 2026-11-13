import { Dialog } from "primereact/dialog";
import PDFViewerComponent from "../../../components/PDFViewer";
import { useEffect, useState } from "react";
import { getTestSignPdf } from "../../../utils/pdfUtils";
import { storageHelper } from "../../../utils/storageUtils";
import { checkImageExists } from "../../../services/pdfService";


const DialogTestSign = ({ ...props }) => {
    const { visible, setVisible, imgUrl, signImgBase64, toast } = props;
    
    const [pdfData, setPdfData] = useState(null);

    const getPdfData = async () => {
        try {

            const signName = "Họ và tên";
            const current_MADVIQLY = storageHelper.get("current_MADVIQLY") || "";

            //Nếu ảnh tồn tại thì lấy đường dẫn, nếu không lấy base64 lúc chọn ảnh:
            const prepareSignImage = async (imgUrl) => {
                let signImg = signImgBase64;
                let isImgPath = false;
            
                if (imgUrl) {
                    //Kiểm tra xem ảnh từ đường dẫn có tồn tại không:
                    const exists = await checkImageExists(imgUrl);
                    if (exists) {
                        signImg = imgUrl;
                        isImgPath = true;
                    }
                }
            
                return { signImg, isImgPath };
            };
            const {signImg, isImgPath} = await prepareSignImage(imgUrl);


            const res = await getTestSignPdf(signName, signImg, current_MADVIQLY, isImgPath);

            if (!res.success) {
                toast.current?.show({
                    severity: "error",
                    summary: "Thông báo",
                    detail: res?.message,
                    life: 3000,
                });
            } else setPdfData(res.data);

        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        if (visible) {
            getPdfData(); // Lấy lại PDF mỗi khi dialog hiển thị
        }
    }, [visible, signImgBase64]);

    const handleCloseModalViewer = () => {
        setVisible(false);
    };

    return (
        <Dialog
            className="viewer-dialog"
            header="Xem ảnh chữ ký"
            visible={visible}
            onHide={handleCloseModalViewer}
        >
            <div className="viewer-container">
                <div className="pdf-view">

                {
                    pdfData && <PDFViewerComponent pdfData={pdfData} /> 
                }
                </div>
            </div>
        </Dialog>
    );
}

export default DialogTestSign;