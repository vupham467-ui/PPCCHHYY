import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DialogQR = ({ visible, setVisible, dataBase64 }) => {
  const printRef = useRef(null);

  // const handlePrint = () => {
  //   const printContents = printRef.current.innerHTML;
  //   // const newWin = window.open("", "", "width=600,height=600");
  //   const newWin = window.open();
  //   newWin.document.write(`
  //     <html>
  //       <head><title>In mã QR</title></head>
  //       <body style="text-align:left;">
  //         ${printContents}
  //       </body>
        
  //     </html>
  //   `);
  //   newWin.document.close();
  //   newWin.focus();
  //   newWin.print();
  //   newWin.close();
  // };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>In mã QR</title>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  return (
    <Dialog
      header="Mã QR thiết bị"
      visible={visible}
      position="top"
      style={{ width: "auto" }}
      className="flex justify-content-center"
      onHide={() => setVisible(false)}
    >
      {dataBase64 ? (
        <div
          className="flex flex-column align-items-center justify-content-center gap-3"
        >
          <div ref={printRef}>
            <img
              src={dataBase64}
              alt="QR Code"
              style={{ width: "auto", maxHeight: "300px"}}
            />
          </div>
          <Button
            label="In mã QR"
            icon="pi pi-print"
            onClick={handlePrint}
            style={{ backgroundColor: "#1445a7", border: "none" }}
          />
        </div>
      ) : (
        <p>Đang tải mã QR...</p>
      )}
    </Dialog>
  );
};

export default DialogQR;
