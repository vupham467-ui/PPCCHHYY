
const CardInfo = ({
    value,
    label,
    icon,
    bgIconColor = "bg-blue-100",
    iconColor = "text-blue-600",
    valueClass = "text-3xl",
}) => {
    return (
        <div className="col-12 md:col-6 xl:col-3">
            <div
                className="card flex h-full justify-content-between align-items-center p-3"
                style={{
                    borderRadius: "16px",
                    background: "#ffffff",
                    boxShadow:
                        "0 6px 18px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.04)",
                }}
            >
                <div>
                    <div className="text-600 text-md mb-2">
                        {label}
                    </div>
                    <div className={`text-900 font-semibold ${valueClass}`}>
                        {value ?? 0}
                    </div>
                </div>

                <div
                    className={`flex align-items-center justify-content-center ${bgIconColor} border-round`}
                    style={{
                        width: "3.75rem",
                        height: "3.75rem",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                    }}
                >
                    <i className={`pi ${icon} ${iconColor} text-2xl`} />
                </div>
            </div>
        </div>
    );
};

export default CardInfo;
