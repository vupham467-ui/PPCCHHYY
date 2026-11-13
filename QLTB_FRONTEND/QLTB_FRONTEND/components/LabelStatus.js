
const LabelStatus = ({ ...props }) => {
    let  backgroundColor = "e6f0ff";
    let textColor = "#000";
    switch (props?.trang_thai) {
        case 1:
            backgroundColor = "#00bc2a"; //xanh lá
            textColor = "#fff";
            break;
        case 2:
            backgroundColor = "#ff0000"; //đỏ
            textColor = "#fff";
            break;
        case -1:
            backgroundColor = "blue";
            textColor = "#fff";
            break;
        default:
            backgroundColor = "#e6f0ff"; //ghi nhạt
            textColor = "#000";
            break;
    }
    return (
        <div
            style={{
                color: textColor,
                backgroundColor: backgroundColor, 
                borderRadius: "2rem",        
                padding: "4px 8px",
                textAlign: "center"
            }}
        >
            {props?.label || ""}
        </div>
    );
}

export default LabelStatus;