import React from 'react';

const ProgressModal = ({ visible, progress, label }) => {
  if (!visible) return null;
  
  return (
    <div className="progress-overlay" style={{
      position: "fixed", 
      inset: 0, 
      display: "flex", 
      alignItems: "center",
      justifyContent: "center", 
      background: "rgba(0,0,0,0.45)", 
      zIndex: 2000
    }}>
      <div style={{
        width: 360, 
        maxWidth: "90%", 
        background: "#fff", 
        padding: 16,
        borderRadius: 12, 
        boxShadow: "0 8px 30px rgba(0,0,0,0.25)", 
        textAlign: "center"
      }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>{label}</div>
        <div style={{ 
          height: 10, 
          width: "100%", 
          background: "#eee", 
          borderRadius: 999, 
          overflow: "hidden" 
        }}>
          <div style={{ 
            width: `${Math.round(progress)}%`, 
            height: "100%", 
            background: "#2563eb", 
            transition: "width .15s linear" 
          }} />
        </div>
        <div style={{ marginTop: 8, color: "#444", fontSize: 13 }}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
