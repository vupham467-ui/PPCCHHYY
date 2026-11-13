import React, { useState } from "react";
import { HT_NGUOIDUNG_Service } from "../../services/quantrihethong/HT_NGUOIDUNGService";

export const MenuContext = React.createContext();

export const MenuProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState("");
  const [waitSignMap, setWaitSignMap] = useState({});

  const refreshWaitSign = async (username) => {
    if (!username) return;
    const rows = await HT_NGUOIDUNG_Service.getMenuWaitSign(username);
    const next = {};
    rows?.forEach((row) => { next[row.id] = row.so_cho_ky; });
    setWaitSignMap(next);
  };

  return (
    <MenuContext.Provider value={{ activeMenu, setActiveMenu, waitSignMap, setWaitSignMap, refreshWaitSign }}>
      {children}
    </MenuContext.Provider>
  );
};
