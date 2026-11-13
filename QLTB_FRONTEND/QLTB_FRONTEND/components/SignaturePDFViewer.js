import React from 'react';
import { Dialog } from 'primereact/dialog';
import PDFViewerComponent from './PDFViewer';
import { Dropdown } from 'primereact/dropdown';
import { Timeline } from 'primereact/timeline';
import SignButton from './SignButton';
import { Button } from 'primereact/button';
import { nhomBienBanPDF } from '../constants/propGlobal';
import { Calendar } from 'primereact/calendar';
import SignatureTimeLine from './SignatureTimeLine';


const SignaturePDFViewer = ({
  visible,
  handleCloseModalViewer,
  pdfData,
  bienBan,
  setBienBan,
  update_NguoiNhan,
  users,
  user,
  isSigned,
  disabledSignBtn,
  events,
  formatSignDate,
  signC1,
  signC2,
  showToast,
  isLoading,
  customizedMarker,
  type
}) => {
  
  let ten_dvi_giao = "";
  let ten_dvi_nhan = "";
  let nguoi_giao = "";
  let ten_nguoi_giao = "";
  let nguoi_nhan = "";
  let ten_nguoi_nhan = "";
  let so_luong = 0;
  let loai_bban = 0;
  let trang_thai = 0;


  const {kimC3, temchiC3, kimC4, temchiC4} = nhomBienBanPDF;
  //Chọn người ký:
  const hasDropDownSelect = [temchiC4].includes(type);

  switch (type) {
    case kimC3:
    case temchiC3:
      ten_dvi_giao = bienBan?.ten_pb || "";
      ten_dvi_nhan = bienBan?.ten_dv || "";
      nguoi_giao = bienBan?.nguoi_giao || "";
      ten_nguoi_giao = bienBan?.ten_nguoi_giao || "";
      nguoi_nhan = bienBan?.nguoi_nhan || "";
      ten_nguoi_nhan = bienBan?.ten_nguoi_nhan || "";
      loai_bban = bienBan?.loai_bban || 0;
      trang_thai = bienBan?.trang_thai || 0;
      so_luong = type === kimC3 ? bienBan?.so_luong : bienBan?.soluong;
    break;
    case kimC4:
    case temchiC4:
      ten_dvi_giao = bienBan?.teN_PHONGBAN_GIAO || "";
      ten_dvi_nhan = bienBan?.teN_PHONGBAN_NHAN || "";
      nguoi_giao = bienBan?.nguoI_GIAO || "";
      ten_nguoi_giao = type === kimC4 ? bienBan?.ten_nguoi_giao : bienBan?.teN_NGUOI_GIAO;
      nguoi_nhan = bienBan?.nguoI_NHAN || "";
      ten_nguoi_nhan = type === kimC4 ? bienBan?.ten_nguoi_nhan : bienBan?.teN_NGUOI_NHAN;
      loai_bban = bienBan?.loaI_BBAN || 0;
      trang_thai = bienBan?.tranG_THAI || 0;
      so_luong = bienBan?.sO_LUONG_GIAO || 0;
    break;
  }

  const isGiao = type === temchiC4 ? loai_bban == 1 : loai_bban == 0;

  return (
    <Dialog
      className="viewer-dialog"
      header="Chi tiết văn bản ký số"
      visible={visible}
      onHide={handleCloseModalViewer}
    >
      <div className="viewer-container">
        <div className="pdf-view">
          {pdfData && <PDFViewerComponent pdfData={pdfData} />}
        </div>
        <div className="info-panel surface-100">
          <div className="info-item">
            <label>
              {isGiao ? "Đơn vị giao:" : "Đơn vị thu hồi:"}
            </label>
            <strong>{ten_dvi_giao.toUpperCase()}</strong>
  
          </div>
          <div className="info-item">
            <label>
              {isGiao ? "Đơn vị nhận:" : "Đơn vị trả:"}
            </label>
            <strong>{ten_dvi_nhan.toUpperCase()}</strong>
          </div>
          <div className="info-item">
            <label>
              {isGiao ? "Người giao:" : "Người thu hồi:"}
            </label>
            <strong>{ten_nguoi_giao}</strong>
          </div>
          <div className="info-item">
            <label>{isGiao ? "Người nhận:" : "Người trả:"}</label>
            <span className='select-item'>
              { hasDropDownSelect && <Dropdown
                value={nguoi_nhan}
                className="w-full"
                options={users}
                placeholder="Chọn"
                filter
                required
                disabled={
                  trang_thai !== 0 || user?.id !== nguoi_giao || isSigned || disabledSignBtn
                    ? true
                    : false
                }
                optionValue="id"
                optionLabel="hO_TEN"
                onChange={(e) => {
                  const userInfo = users.find((u) => u.id === e.value);
                  setBienBan({
                    ...bienBan,
                    nguoi_nhan: e.value,
                    nguoI_NHAN: e.value,
                    ten_nguoi_nhan: userInfo?.hO_TEN,
                    teN_NGUOI_NHAN: userInfo?.hO_TEN
                  });
                  update_NguoiNhan(e.value);
                }}
              /> }
              { !hasDropDownSelect && <strong>{ten_nguoi_nhan}</strong> }
            </span>
          </div>
          <div className="info-item">
            <label>Số lượng:</label>
            <strong>{so_luong}</strong>
          </div>

          {/* <div className="progress mt-4">
            <h5> Tiến trình ký số</h5>
            <div className="time-line">
              <Timeline
                marker={customizedMarker}
                value={events}
                opposite={(item) => item.status}
                content={(item) => (
                  <>
                    <small className="text-color-secondary">{item.user}</small>
                    <br></br>
                    <small className="text-color-secondary">
                      {formatSignDate(item?.date)}
                    </small>
                  </>
                )}
              />
            </div>
          </div> */}
          <SignatureTimeLine 
            events={events}
            formatSignDate={formatSignDate}
            title="Tiến trình ký số"
          />
        </div>
      </div>
      <div className="flex justify-content-end" style={{ marginTop: "15px" }}>
        <SignButton
          dataReport={bienBan}
          signC1={signC1}
          signC2={signC2}
          showToast={showToast}
          isSigned={isSigned}
          disabled={disabledSignBtn}
          loading={isLoading}
        />
        <Button
          label="Đóng"
          severity="secondary"
          onClick={handleCloseModalViewer}
        />
      </div>
    </Dialog>
  );
};

export default SignaturePDFViewer;
