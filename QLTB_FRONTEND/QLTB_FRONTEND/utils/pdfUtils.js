import { digitalSign, getPdf, preview, QLTB_digitalSign, QLTB_kiemKeDigitalSign, QLTB_preview, test_sign } from "../services/pdfService";

//Xem phiếu:
export const previewPdf = async (id_bienban, trang_thai, loai_bban, nhom_bban, isTND, isQTC4 = false) => {
  try {
    // Gọi API để lấy PDF
    const response = await preview({ id_bienban, trang_thai, loai_bban, nhom_bban, isTND, isQTC4})

    if (response) {
      if (!response.success || !response.base64) {
          return {
            data: "",
            success: false,
            message: response?.message
          }
      }
      const base64Pdf = response?.base64;
      // Giải mã base64
      const byteCharacters = atob(base64Pdf);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      // Tạo Blob từ Uint8Array
      const blob = new Blob([byteArrays], { type: "application/pdf" });

      // Tạo Object URL để dùng trong viewer
      const blobUrl = URL.createObjectURL(blob);
      return {
        data: blobUrl,
        success: response?.success,
        message: response?.message
      }

    } else {
      console.error(response);
      return {
        data: "",
        success: false,
        message: "No PDF data returned"
      }
    }
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return {
      data: "",
      success: false,
      message: "Error fetching PDF"
    }
  }
};

//Ký phiếu:
export const signPdf = async (id_bienban, loai_bban, nhom_bban, signName, signImg, isQTC4 = false, checkTen = false, danhSachTen= []) => {
  try {
    // Gọi API để lấy PDF
    const response = await digitalSign({ id_bienban, loai_bban, nhom_bban, signName, signImg, isQTC4, checkTen, danhSachTen })
    
    if (response) {
      if (!response.success || !response.base64) {
          return {
            data: "",
            success: false,
            message: response?.message
          }
      }
      const base64Pdf = response?.base64;
      // Giải mã base64
      const byteCharacters = atob(base64Pdf);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      // Tạo Blob từ Uint8Array
      const blob = new Blob([byteArrays], { type: "application/pdf" });

      // Tạo Object URL để dùng trong viewer
      const blobUrl = URL.createObjectURL(blob);
      return {
        data: blobUrl,
        success: response?.success,
        message: response?.message
      }
    } else {
      console.error(response);
      return {
        data: "",
        success: false,
        message: "No PDF data returned"
      }
    }
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return {
      data: "",
      success: false,
      message: "Error fetching PDF"
    }
  }
};


//Lấy file pdf ký thử nghiệm:
export const getTestSignPdf = async (signName, signImg, ma_dviqly, isImgPath) => {
  try {
    const response = await test_sign({ signName, signImg, ma_dviqly, isImgPath});
    if (response) {
      const base64Pdf = response?.base64;
      const byteCharacters = atob(base64Pdf); // Giải mã base64 thành chuỗi byte
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
    // Tạo Blob từ Uint8Array
    const blob = new Blob([byteArrays], { type: "application/pdf" });

      // Tạo Object URL để dùng trong viewer
    const blobUrl = URL.createObjectURL(blob);

      return {
        data: blobUrl,
        success: response?.success,
        message: response?.message
      }

    } else {
      console.error(response);
      return {
        data: "",
        success: false,
        message: "No PDF data returned"
      }
    }
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return {
      data: "",
      success: false,
      message: "Error fetching PDF"
    }
  }
}

//Lấy pdf data từ đường dẫn:
export const getPdfDataFromUrl = async (url) => {
  try {
    const response = await getPdf(url);

    if (!response?.base64) {
      return "";
    }
    const base64Pdf = response?.base64;
    const byteCharacters = atob(base64Pdf); // Giải mã base64 thành chuỗi byte
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArrays], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);

    return objectUrl;
    
  } catch (error) {
      console.error('Error fetching PDF:', error);
    return "";
  }
}



//QLTB:
export const QLTB_previewPdf = async (id, trang_thai, loai_bban, loai_nghiepvu, ma_dviqly) => {
  try {
    // Gọi API để lấy PDF
    const response = await QLTB_preview({ id, trang_thai, loai_bban, loai_nghiepvu, ma_dviqly})

    if (response) {
      if (!response.success || !response.base64) {
          return {
            data: "",
            success: false,
            message: response?.message
          }
      }
      const base64Pdf = response?.base64;
      // Giải mã base64
      const byteCharacters = atob(base64Pdf);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      // Tạo Blob từ Uint8Array
      const blob = new Blob([byteArrays], { type: "application/pdf" });

      // Tạo Object URL để dùng trong viewer
      const blobUrl = URL.createObjectURL(blob);
      return {
        data: blobUrl,
        success: response?.success,
        message: response?.message
      }

    } else {
      console.error(response);
      return {
        data: "",
        success: false,
        message: "No PDF data returned"
      }
    }
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return {
      data: "",
      success: false,
      message: "Error fetching PDF"
    }
  }
};

export const QLTB_signPdf = async (ma_dviqly, cap_ky, id_bienban, loai_bban, loai_nghiepvu, signName, signImg) => {
  try {
    // Gọi API để lấy PDF
    const response = await QLTB_digitalSign({ma_dviqly, cap_ky, id_bienban, loai_bban, loai_nghiepvu, signName, signImg })
    
    if (response) {
      if (!response.success || !response.base64) {
          return {
            data: "",
            success: false,
            message: response?.message
          }
      }
      const base64Pdf = response?.base64;
      // Giải mã base64
      const byteCharacters = atob(base64Pdf);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      // Tạo Blob từ Uint8Array
      const blob = new Blob([byteArrays], { type: "application/pdf" });

      // Tạo Object URL để dùng trong viewer
      const blobUrl = URL.createObjectURL(blob);
      return {
        data: blobUrl,
        success: response?.success,
        message: response?.message
      }
    } else {
      console.error(response);
      return {
        data: "",
        success: false,
        message: "No PDF data returned"
      }
    }
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return {
      data: "",
      success: false,
      message: "Error fetching PDF"
    }
  }
};

export const QLTB_signKiemKePdf = async (ma_dviqly, cap_ky, id_bienban, signName, signImg, signUser) => {
  try {
    const response = await QLTB_kiemKeDigitalSign({
      ma_dviqly,
      cap_ky,
      id_bienban,
      signName,
      signImg,
      signUser,
    });

    if (!response?.success || !response?.base64) {
      return {
        data: "",
        success: false,
        message: response?.message || "Không có dữ liệu PDF sau khi ký",
      };
    }

    const byteCharacters = atob(response.base64);
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArrays], { type: "application/pdf" });
    return {
      data: URL.createObjectURL(blob),
      success: true,
      message: response?.message,
    };
  } catch (error) {
    console.error("Error signing inventory PDF:", error);
    return {
      data: "",
      success: false,
      message: "Error signing inventory PDF",
    };
  }
};

