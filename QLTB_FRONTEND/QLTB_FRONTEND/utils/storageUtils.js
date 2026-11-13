export const storageHelper = {
    get_normal(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw;
      } catch (err) {
        console.error(`Lỗi khi đọc sessionStorage[${key}]:`, err);
        return null;
      }
    },
    get(key) {
      try {
        // const raw = sessionStorage.getItem(key);
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        console.error(`Lỗi khi đọc sessionStorage[${key}]:`, err);
        return null;
      }
    },
    set_normal(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error(`Lỗi khi lưu sessionStorage[${key}]:`, err);
      }
    },
  
    set(key, value) {
      try {
        // sessionStorage.setItem(key, JSON.stringify(value));
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error(`Lỗi khi lưu sessionStorage[${key}]:`, err);
      }
    },
  
    remove(key) {
      // sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    },
  
    clear() {
      // sessionStorage.clear();
      localStorage.clear();
    }
  };
  