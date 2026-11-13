import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import {
  get_All_HT_MENU,
  create_HT_MENU,
  update_HT_MENU,
  delete_HT_MENU,
  create_HT_MENU_v2,
  update_HT_MENU_v2,
} from "../../../services/quantrihethong/HT_MENUService";

import { HT_MENU } from "../../../models/HT_MENU";
import { headerStyleColumn, pageSizeSelect, rowsPagination } from "../../../constants/propGlobal";

const Menu = () => {
  const toast = useRef(null);

  /* ================= STATE ================= */
  const [menuRaw, setMenuRaw] = useState([]);
  const [treeData, setTreeData] = useState([]);

  const [expandedKeys, setExpandedKeys] = useState({});
  const [selectedNodeKeys, setSelectedNodeKeys] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const [globalFilter, setGlobalFilter] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [formData, setFormData] = useState(HT_MENU);
  const [isSaving, setIsSaving] = useState(false);

  /* ================= LOAD ================= */
  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const res = await get_All_HT_MENU();

      setMenuRaw(res);
      setTreeData(buildTree(res));
      setExpandedKeys({}); // KHÔNG xổ sẵn
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không tải được danh sách menu",
      });
    }
  };

  /* ================= TREE ================= */
  const buildTree = (data) => {
    const map = {};
    const roots = [];
    let sttRoot = 0;

    data.forEach((m) => {
      map[m.id] = {
        key: m.id,
        data: { ...m, stt: "" },
        children: [],
      };
    });

    data.forEach((m) => {
      if (m.parent_id == null) {
        sttRoot++;
        map[m.id].data.stt = sttRoot.toString();
        roots.push(map[m.id]);
      } else if (map[m.parent_id]) {
        const parent = map[m.parent_id];
        const idx = parent.children.length + 1;
        map[m.id].data.stt = `${parent.data.stt}.${idx}`;
        parent.children.push(map[m.id]);
      }
    });

    return roots;
  };

  /* ================= SELECTION ================= */
  useEffect(() => {
    const ids = Object.keys(selectedNodeKeys)
      .filter((k) => selectedNodeKeys[k]?.checked)
      .map(Number);
    setSelectedIds(ids);
  }, [selectedNodeKeys]);

  /* ================= MENU CHA ================= */
  const parentMenuOptions = useMemo(() => {
    return (currentId) => [
      { id: -1, ten_menu: "Là Menu Cấp Cha" },
      ...menuRaw.filter((m) => m.id !== currentId),
    ];
  }, [menuRaw]);

  /* ================= CRUD ================= */
  const openAdd = () => {
    setFormData(HT_MENU);
    setIsAdd(true);
    setShowDialog(true);
  };

  const openEdit = (rowData) => {
    const full = menuRaw.find((m) => m.id === rowData.id);
    setFormData(full ? { ...full, parent_id: full.parent_id == null ? -1 : full.parent_id } : HT_MENU);
    setIsAdd(false);
    setShowDialog(true);
  };

  const saveMenu = async () => {
    if (isSaving) return; 
    setIsSaving(true);
    try {
      const params = {
        ...formData,
        parent_id: formData.parent_id === -1 ? null : formData.parent_id
      }

      isAdd
        ? await create_HT_MENU_v2(params)
        : await update_HT_MENU_v2(params);

      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: isAdd ? "Đã thêm menu" : "Đã cập nhật menu",
      });

      setShowDialog(false);
      loadMenus();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: err?.response?.data || "Không lưu được menu",
      });
    }  finally {
      setIsSaving(false);
    }
  };

  const deleteOne = (node) => {
    confirmDialog({
      message: `Xóa menu "${node.data.ten_menu}"?`,
      header: "Xác nhận",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        await delete_HT_MENU(node.data.id);
        loadMenus();
      },
    });
  };

  const deleteMultiple = () => {
    confirmDialog({
      message: "Xóa các menu đã chọn?",
      header: "Xác nhận",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        await Promise.all(selectedIds.map((id) => delete_HT_MENU(id)));
        setSelectedNodeKeys({});
        loadMenus();
      },
    });
  };

  /* ================= HEADER ================= */
  const headerList = (options) => (
    <div className={`${options.className} flex justify-content-between align-items-center`}>
      <span className="font-bold text-2xl">Danh sách Menu</span>
      <div className="flex gap-2">
        {selectedIds.length > 0 && (
          <Button
            label="Xóa nhiều"
            severity="danger"
            onClick={deleteMultiple}
          />
        )}
        <Button
          label="Thêm mới"
          style={{ backgroundColor: "#1445a7" }}
          onClick={openAdd}
        />
      </div>
    </div>
  );

  /* ================= RENDER ================= */
  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      <Panel headerTemplate={headerList} className="mt-3">
        <div className="flex justify-content-end mb-2">
          <InputText
            className="w-3"
            placeholder="Tìm kiếm"
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <TreeTable
          value={treeData}
          expandedKeys={expandedKeys}
          onToggle={(e) => setExpandedKeys(e.value)}
          selectionMode="checkbox"
          selectionKeys={selectedNodeKeys}
          onSelectionChange={(e) => setSelectedNodeKeys(e.value)}
          globalFilter={globalFilter}
          paginator
          rows={pageSizeSelect}
          rowsPerPageOptions={rowsPagination}
          style={{ width: window.innerWidth < 700 ? "900px" : "100%" }}
        >
          <Column field="stt" headerStyle={headerStyleColumn} header="STT" expander />
          <Column field="ten_menu" headerStyle={headerStyleColumn} header="Tên Menu" />
          <Column
            field="icon"
            headerStyle={headerStyleColumn}
            header="Icon"
            body={(r) => <i className={r.data.icon} />}
          />
          <Column
            header="Thao tác"
            headerStyle={headerStyleColumn}
            body={(r) => (
              <div className="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  onClick={() => openEdit(r.data)}
                  style={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  onClick={() => deleteOne(r)}
                />
              </div>
            )}
          />
        </TreeTable>
      </Panel>

      {showDialog && (
        <Dialog
          visible
          header="Thông tin Menu"
          className="p-fluid w-11 md:w-8 lg:w-6"
          onHide={() => setShowDialog(false)}
          footer={
            <div className="flex justify-content-center gap-2">
              <Button label="Lưu" onClick={saveMenu} loading={isSaving}/>
              <Button label="Đóng" severity="secondary" onClick={() => setShowDialog(false)} />
            </div>
          }
        >
          <div className="grid">
            <div className="col-12 md:col-6">
              <label>Tên menu</label>
              <InputText
                placeholder="Nhập tên menu"
                value={formData.ten_menu || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ten_menu: e.target.value })
                }
              />
            </div>

            <div className="col-12 md:col-6">
              <label>Icon</label>
              <InputText
                placeholder="Nhập icon"
                value={formData.icon || ""}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />
            </div>

            <div className="col-12 md:col-6">
              <label>Mã menu <span style={{ color: 'red' }}>(* Nhập nếu là Menu cấp Cha)</span></label>
              <InputText
                placeholder="Nhập mã menu"
                value={formData.ma_menu || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ma_menu: e.target.value })
                }
              />
            </div>

            <div className="col-12 md:col-6">
              <label>Menu cha</label>
              <Dropdown
                filter
                value={formData.parent_id}
                placeholder="Chọn menu"
                options={parentMenuOptions(formData.id)}
                optionLabel={(item) => {
                  return item?.ghi_chu ? `${item.ten_menu} [${item.ghi_chu}]` : item.ten_menu
                }}
                optionValue="id"
                onChange={(e) =>
                  setFormData({ ...formData, parent_id: e.value })
                }
              />
            </div>

            <div className="col-12">
              <label>Đường dẫn <span style={{ color: 'red' }}>(* Bỏ qua nếu là Menu cấp cha)</span></label>
              <InputText
                value={formData.duong_dan || ""}
                placeholder="Nhập đường dẫn menu bắt đầu với /{ma_menu}"
                onChange={(e) =>
                  setFormData({ ...formData, duong_dan: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <label>Ghi chú</label>
              <InputText
                value={formData.ghi_chu || ""}
                placeholder="Nhập ghi chú"
                onChange={(e) =>
                  setFormData({ ...formData, ghi_chu: e.target.value })
                }
              />
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default Menu;
