import React from "react";
import howToLockChickenVid from "../asset/how_to_lock_chicken.mp4";

export default function TutorialVideoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="tutorial-title" style={{ zIndex: 2100 }}>
      <div className="completionModal" style={{ width: "min(560px, 95vw)", maxHeight: "90vh", overflow: "auto" }}>
        <p className="eyebrow" style={{ color: "#66714b", fontWeight: "800", fontSize: "0.8rem", textTransform: "uppercase" }}>Hướng Dẫn</p>
        <h2 id="tutorial-title" style={{ fontSize: "1.4rem", color: "#253222", marginBottom: "16px" }}>Cách Lùa và Khóa Gà</h2>
        
        <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
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
          <p style={{ fontSize: "0.88rem", color: "#3c463b", margin: "4px 0", lineHeight: "1.45", textAlign: "left" }}>
            Xem video hướng dẫn trên để biết cách lùa gà vào chuồng và nhấn phím <strong>L</strong> để đóng cửa nhốt gà lại!
          </p>
        </div>

        <button type="button" onClick={onClose} style={{ width: "100%" }}>
          OK, tôi đã hiểu
        </button>
      </div>
    </div>
  );
}
