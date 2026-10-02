import React from 'react';

interface AdminBarProps {
  onEditSection: (section: 'hero' | 'rooms' | 'rules' | 'settings' | 'logs') => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onEditSection,
  onResetData,
  onLogout
}) => {
  return (
    <div className="admin-top-bar">
      <div className="container admin-top-bar-container">
        <div className="admin-status-badge">
          <span className="pulse-dot"></span>
          <strong>🔑 โหมดผู้ดูแลระบบ (Admin Mode)</strong>
          <span className="admin-status-hint">— แก้ไขข้อมูลบนหน้าเว็บได้ทันที</span>
        </div>

        <div className="admin-actions-group">
          <button
            className="admin-bar-btn hero-btn"
            onClick={() => onEditSection('hero')}
            title="แก้ไขข้อความต้อนรับและสโลแกน"
          >
            ✏️ แก้ไข Hero
          </button>

          <button
            className="admin-bar-btn rooms-btn"
            onClick={() => onEditSection('rooms')}
            title="แก้ไขห้องพัก ราคา รูปภาพ จำนวนห้อง"
          >
            🛏️ แก้ไขห้องพัก
          </button>

          <button
            className="admin-bar-btn rules-btn"
            onClick={() => onEditSection('rules')}
            title="แก้ไขกฎระเบียบการเช่า"
          >
            📜 แก้ไขกฎระเบียบ
          </button>

          <button
            className="admin-bar-btn settings-btn"
            onClick={() => onEditSection('settings')}
            title="แก้ไขเบอร์โทร Line บัญชีธนาคาร รหัส Wi-Fi"
          >
            📞 ติดต่อ / การเงิน
          </button>


          <button
            className="admin-bar-btn reset-btn"
            onClick={() => {
              if (window.confirm('คุณต้องการรีเซ็ตข้อมูลเป็นค่าเริ่มต้นใช่หรือไม่?')) {
                onResetData();
              }
            }}
            title="คืนค่าเป็นข้อมูลเริ่มต้น"
          >
            🔄 รีเซ็ตข้อมูล
          </button>

          <button
            className="admin-bar-btn logout-btn"
            onClick={onLogout}
            title="ออกจากระบบแอดมิน"
          >
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
};
