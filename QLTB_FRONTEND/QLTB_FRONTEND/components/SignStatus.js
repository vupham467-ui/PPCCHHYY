import React from 'react';
import moment from 'moment';

const signStatusStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "green"
}

const SignStatusComponent = ({ name, date, isSigned, isCanceled = false, donVi = "" }) => (
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

const RenderSignStatus = ({ rowData, isSend }) => {
    const trang_thai = rowData?.tranG_THAI || rowData?.trang_thai;
    const ngay_giao = rowData?.ngaY_GIAO || rowData?.ngay_giao;
    const ngay_nhan = rowData?.ngaY_NHAN || rowData?.ngay_nhan;
    const ten_nguoi_giao = rowData?.teN_NGUOI_GIAO || rowData?.ten_nguoi_giao;
    const ten_nguoi_nhan = rowData?.teN_NGUOI_NHAN || rowData?.ten_nguoi_nhan;
    const isSigned = isSend ? (trang_thai == 1 || trang_thai == 2) : trang_thai == 2;
    const isCanceled = trang_thai == 3;

    const name = isSend ? ten_nguoi_giao : ten_nguoi_nhan;
    const date = isSend ? ngay_giao : ngay_nhan;
    const donViGiao = rowData?.teN_PHONGBAN_GIAO || rowData?.ten_phongban_giao || "";
    const donViNhan = rowData?.teN_PHONGBAN_NHAN || rowData?.ten_phongban_nhan || "";
    const donVi = isSend ? donViGiao: donViNhan;
    
    return <SignStatusComponent name={name} date={date} isSigned={isSigned} isCanceled={isCanceled} donVi={donVi} />;
};


export default RenderSignStatus;
