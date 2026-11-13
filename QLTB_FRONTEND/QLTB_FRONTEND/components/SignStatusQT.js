import React from 'react';
import moment from 'moment';

const signStatusStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "green"
}

const SignStatusQTComponent = ({ name, date, isSigned, isCanceled = false, donVi = "" }) => (
    <>
        {name || "Không xác định"}
        <p className='font-bold'>{donVi}</p>
        <div style={{ ...signStatusStyle, color: isCanceled ? "gray" : (isSigned ? "green" : "red") }}>
            {isCanceled ? "Đã hủy" : (isSigned ? "Đã ký" : "Chưa ký")}
        </div>
        {isSigned && moment(date).isValid() &&
            <div style={signStatusStyle}>{moment(date).format("HH:mm:ss DD/MM/YYYY") || ""}</div>
        }
    </>
);


const RenderSignStatusQT = ({ rowData, isSend, isQLY, isC4 = true }) => {
    const trang_thai = rowData?.tranG_THAI || "";
    const ngay_qtoan = isC4 ? (rowData?.ngaY_QTOAN || "") : (rowData?.ngaY_DVLINH_KY || "");
    const ngay_quanly_ky = rowData?.ngaY_QUANLY_KY || "";
    const ngay_truongdv_ky = rowData?.ngaY_TRUONGDV_KY || "";
    const ten_nguoi_qtoan = rowData?.teN_NGUOI_QTOAN || rowData?.teN_NGUOI_DVLINH || "";
    const ten_nguoi_qly = rowData?.teN_NGUOI_QLY || rowData?.teN_NGUOI_QUANLY || "";
    const ten_truongdv = rowData?.teN_LANHDAO || rowData?.teN_TRUONGDV || "";
    let isSigned = false;
    if (isSend) {
        isSigned = trang_thai == 1 || trang_thai == 2 || trang_thai == 3; //đã ký c1,c2,c3
    } else {
        isSigned = isQLY ? (trang_thai == 2 || trang_thai == 3) : trang_thai == 3;
    }

    const name = isSend ? ten_nguoi_qtoan : isQLY ? ten_nguoi_qly : ten_truongdv;
    const date = isSend ? ngay_qtoan : isQLY ? ngay_quanly_ky : ngay_truongdv_ky;
    const isCanceled = trang_thai == 4; //Với PQT trạng thái 4 là hủy
    const donViQLy = rowData?.teN_DONVI_QLY || rowData?.teN_DONVI_QUANLY || "";
    const phongbanQT = rowData?.teN_PHONGBAN_QTOAN || rowData?.teN_DONVI_LINH || "";
    const donVi = isSend ? phongbanQT : donViQLy;

    return <SignStatusQTComponent name={name} date={date} isSigned={isSigned} isCanceled={isCanceled} donVi={donVi} />;
}

export default RenderSignStatusQT;