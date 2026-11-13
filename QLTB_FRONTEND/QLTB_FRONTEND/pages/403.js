// pages/403.js
import Link from "next/link";

const ForbiddenPage = () => {

    return (
        <div style={{
            display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            height: "100vh", textAlign: "center"
        }}>
            <h1 className="text-orange-500" style={{ fontSize: "5rem", margin: 0 }}>403</h1>
            <h2 style={{ marginBottom: "1rem" }}>Không có quyền truy cập</h2>
            <p>Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.</p>
            <Link href="/">
                <button style={{
                    marginTop: "1.5rem", padding: "0.5rem 1rem",
                    border: "none", backgroundColor: "#0070f3",
                    color: "#fff", borderRadius: "5px", cursor: "pointer"
                }}>
                    Quay lại trang chủ
                </button>
            </Link>
        </div>
    );
}

//Không dùng layout
ForbiddenPage.getLayout = (page) => page;

export default ForbiddenPage;

