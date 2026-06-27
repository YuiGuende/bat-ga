import React from "react";
import howToLockChickenVid from "../asset/how_to_lock_chicken.mp4";

export default function InstructionModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="instruction-title" style={{ zIndex: 2000 }}>
      <div className="completionModal" style={{ width: "min(480px, 95vw)", maxHeight: "90vh", overflow: "auto" }}>
        <p className="eyebrow" style={{ color: "#66714b", fontWeight: "800", fontSize: "0.8rem", textTransform: "uppercase" }}>Hướng Dẫn</p>
        <h2 id="instruction-title" style={{ fontSize: "1.4rem", color: "#253222", marginBottom: "16px" }}>Cách Chơi Bắt Gà</h2>

        {/* Looping Tutorial Video */}
        <div style={{ marginBottom: "16px" }}>
          <video 
            src={howToLockChickenVid} 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ 
              width: "100%", 
              borderRadius: "8px", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "1px solid rgba(0, 0, 0, 0.1)"
            }} 
          />
        </div>

        <div style={{ display: "grid", gap: "12px", fontSize: "0.88rem", color: "#3c463b", marginBottom: "20px", textAlign: "left" }}>
          <div>
            <strong> Mục Tiêu: Cố gắng lùa và nhốt được tất cả con gà vào chuồng.</strong>
            <br></br>
            Tips: dụ các con gà lại gần cửa chuồng và đẩy chúng vào
          </div>
          <div>
            <strong>🚶 Di chuyển:</strong> Dùng các phím <strong>W, A, S, D</strong> hoặc <strong>Phím mũi tên</strong> để điều khiển nhân vật chạy.
          </div>
          <div>
            <strong>🚪 Đóng/Mở chuồng:</strong> Nhấn phím <strong>L</strong> để khóa/mở cửa lồng. Gà chỉ chui vào và được nhốt khi lồng mở.
          </div>
          <div>
            <strong>🏃 Chạy nhanh:</strong> Giữ <strong>Shift</strong> khi di chuyển để tăng tốc (Sprint).
          </div>
          <div>
            <strong>🌾 Thả thóc:</strong> Nhấn phím <strong>Space</strong> (Phím cách) để thả thóc nhử gà lại ăn.
          </div>
          <div>
            <strong>🗣️ Gọi gà:</strong> Nhấn phím <strong>Q</strong> để nhân vật hét "quác!" dụ gà chạy nhanh đến vị trí của bạn.
          </div>
          <div>
            <strong>🔔 Vỗ tay:</strong> Nhấn phím <strong>K</strong> để vỗ tay tạo sóng âm làm gà hoảng sợ chạy ra xa.
          </div>
          <div style={{ borderTop: "1px solid rgba(0, 0, 0, 0.1)", paddingTop: "8px", fontSize: "0.8rem", color: "#66714b", fontStyle: "italic" }}>
            * Nhấn phím <strong>ESC</strong> hoặc nút <strong>ESC</strong> ở góc trên bên trái bất kỳ lúc nào để ẩn/hiện bảng hướng dẫn này. Khi bảng mở game sẽ tự động tạm dừng.
          </div>
        </div>

        <button type="button" onClick={onClose} style={{ width: "100%" }}>
          Bắt đầu chơi
        </button>
      </div>
    </div>
  );
}
