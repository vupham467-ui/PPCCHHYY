import { HT_NGUOIDUNG_Service } from "../services/quantrihethong/HT_NGUOIDUNGService";

export const managerRoles = ["giám đốc", "phó giám đốc", "giám đốc điện lực", "phó giám đốc điện lực", "trưởng phòng", "phó phòng"];

//Lọc người dùng theo chức vụ:
export function filterUsersByRole(users, key, allowedRoles) {

    return users.filter(user => {
        const userRole = user[key] ? user[key].trim().toLowerCase() : '';
        return userRole && allowedRoles.includes(user[key].trim().toLowerCase())
    }
    );
}

//Lấy thông tin người dùng theo id:
export async function safeGetUsersById(...ids) {
    try {
        const results = await Promise.allSettled(
            ids.map(id => {
                if (!id) return Promise.reject('ID null or undefined');
                return HT_NGUOIDUNG_Service.getById(id);
            })
        );

        results.forEach((res, idx) => {
            if (res.status === 'rejected') {
                console.warn(`Lỗi khi lấy người dùng thứ ${idx + 1}:`, res.reason);
            }
        });

        return results.map(res => res.status === 'fulfilled' ? res.value : null);
    } catch (err) {
        console.error('Lỗi không mong muốn:', err);
        return ids.map(_ => null);
    }
}

export async function safeGetUsersByUserName(...usernames) {
    try {
        const results = await Promise.allSettled(
            usernames.map(username => {
                if (!username) return Promise.reject('Username null or undefined');
                return HT_NGUOIDUNG_Service.getByUsername(username);
            })
        );

        results.forEach((res, idx) => {
            if (res.status === 'rejected') {
                console.warn(`Lỗi khi lấy người dùng thứ ${idx + 1}:`, res.reason);
            }
        });

        return results.map(res => res.status === 'fulfilled' ? res.value : null);
    } catch (err) {
        console.error('Lỗi không mong muốn:', err);
        return ids.map(_ => null);
    }
}

// Format số:
 export const formatNumberToString = (number) => {
    if (number === null || number === undefined) return null;
    if (typeof number !== 'number') return number;
    return number.toLocaleString("vi-VN");
} 

// Thông tin lần yêu cầu thí nghiệm:
export const getNextLanthu =(danhsachTB) => {
    // Lấy danh sách lanthu và sắp xếp tăng dần
    const sorted = [...new Set(danhsachTB.map(item => item?.lanthu))].sort((a, b) => a - b);

    // Bắt đầu từ 1, tìm số nhỏ nhất chưa có trong dãy
    for (let i = 1; i <= sorted[sorted.length - 1]; i++) {
        if (!sorted.includes(i)) {
            return i;
        }
    }

    // Nếu không thiếu số nào, trả về số lớn nhất + 1
    return sorted.length > 0 ? sorted[sorted.length - 1] + 1 : 1;
}

//Hàm validate lấy thêm trường vào danh sách lỗi:
export function validateRequiredFields(formData, fields) {
    
  const errors = {};
  for (const [field, label] of Object.entries(fields)) {
    
    if (!formData[field]) {
      errors[field] = `${label} là bắt buộc`;
    }
  }
  return errors;
}


//Chuyển mã đơn vị quản lý về mã gốc:
export function extractMaDonVi(madonvi) {
    return madonvi.split('_')[0];
}


export function startsWithSafe(value, prefix, ignoreCase = false) {
    if (typeof value !== 'string' || typeof prefix !== 'string') return false;

    if (ignoreCase) {
        return value.toLowerCase().startsWith(prefix.toLowerCase());
    }

    return value.startsWith(prefix);
}

// Hàm chung gọi API và setState
export const fetchData = async (apiCall, setter, param) => {
    try {
        const response = param ? await apiCall(param) : await apiCall();
        setter(response?.data ?? []);
    } catch (err) {
        console.error(err);
    }
};


// Lấy trạng thái TB cập nhật đo xa:
export const getLabelTrangThaiThietBi = (tbi_trangthai_new) => {
  switch (Number(tbi_trangthai_new)) {
    case 1:
      return "Đang sử dụng";
    case 4:
      return "Đã thanh lý";
    case 5:
      return "Trong kho";
    case 9:
      return "Chờ thanh lý";
    default:
      return "";
  }
};
