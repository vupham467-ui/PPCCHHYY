import moment from "moment";

export const dateToString = (inputDate, format = "dd/mm/yyyy") => {
    if (!inputDate) return "";
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return "";

    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const HH = date.getHours().toString().padStart(2, "0");
    const mi = date.getMinutes().toString().padStart(2, "0");
    const ss = date.getSeconds().toString().padStart(2, "0");

    return format
        .replace("yyyy", yyyy)
        .replace("mm", mm)
        .replace("dd", dd)
        .replace("hh", HH)
        .replace("mi", mi)
        .replace("ss", ss)
        .replace("ngày", "ngày " + dd)
        .replace("tháng", "tháng " + mm)
        .replace("năm", "năm " + yyyy);
};


export const formatSignDate = (date) => {
  if (!date) return "Chưa ký"; // Nếu không có ngày -> "Chưa ký"
  const dateMoment = moment(date);
  // Nếu hợp lệ -> format, không hợp lệ -> "N/A"
  return dateMoment.isValid() ? dateMoment.format("HH:mm DD/MM/YYYY") : "N/A";
};


export const parseDateSafely = (dateString) => {
  if (!dateString) return null; // Nếu giá trị rỗng, trả về null

  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
      console.error("Lỗi: Giá trị ngày không hợp lệ!", dateString);
      return null; // Trả về null nếu không phải ngày hợp lệ
  }

  return date.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" }).replace(" ", "T");
};

//Chuyển string date sang Date:
export const parseVNDate = (dateStr) => {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split("/").map(Number);

  return new Date(year, month - 1, day);
};


//Lấy tháng năm hiện tại cho phiếu QT tháng, nếu QT trước ngày n của tháng sau thì vẫn tính tháng trước:
export const getCurrentMonthAndYear = (expDate = 5)=> {
  const now = new Date();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  const date = now.getDate();

  if (date <= expDate) {
      month -= 1;
      //Nếu là tháng 1 thì chuyển thành tháng 12 của năm trước:
      if (month === 0) {
        month = 12;
        year -= 1;
      }
  }

  return { month, year };
}
