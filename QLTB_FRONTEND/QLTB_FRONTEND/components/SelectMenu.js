import { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { TieredMenu } from "primereact/tieredmenu";

const SelectMenu = ({ items, label, backgroundColor="#1445a7", color="#fff", icon="" }) => {
    const menu = useRef(null);
    return (
        <div className="flex flex-col items-center">
            <Button icon={icon} style={{ backgroundColor: backgroundColor, color: color }} label={label} onClick={(e) => menu.current?.toggle(e)} />
            <TieredMenu model={items} popup ref={menu} style={{ minWidth: '200px', whiteSpace: 'nowrap' }}/>
        </div>
    );
};

export default SelectMenu;
