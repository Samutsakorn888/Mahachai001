import React from 'react';
import type { Language, Translations } from '../i18n/translations';
import { loadSiteData } from '../services/adminStore';

interface RoomComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
  language?: Language;
  onSelectRoom?: (roomName: string) => void;
}

export const RoomComparisonModal: React.FC<RoomComparisonModalProps> = ({
  isOpen,
  onClose,
  t,
  language = 'th',
  onSelectRoom
}) => {
  if (!isOpen) return null;

  const siteData = loadSiteData();
  const rooms = (siteData.monthlyRooms && siteData.monthlyRooms.length > 0)
    ? siteData.monthlyRooms
    : t.monthlyRooms;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content comparison-modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="modal-back-btn" onClick={onClose} title="ย้อนกลับ" style={{ color: '#004088', position: 'absolute', top: '16px', left: '16px', zIndex: 11 }}>
          ← ย้อนกลับ
        </button>
        <div className="modal-header">
          <h3 style={{ marginLeft: '100px' }}>📊 {t.compareModalTitle || 'ตารางเปรียบเทียบคุณสมบัติห้องพักรายเดือน 7 รูปแบบ'}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body comparison-modal-body">
          <p className="comparison-intro">
            {t.compareIntro || 'เลือกดูข้อแตกต่างของแต่ละรูปแบบห้องพัก เพื่อความเหมาะสมกับไลฟ์สไตล์และงบประมาณของคุณที่สุด'}
          </p>

          <div className="table-responsive">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>{t.compareHeaderRoomType || 'ประเภทห้องพักรายเดือน'}</th>
                  <th>{t.compareHeaderRent || 'อัตราค่าเช่า (บาท/เดือน)'}</th>
                  <th>{t.compareHeaderDeposit || 'เงินมัดจำแรกเข้า (บาท)'}</th>
                  <th>{t.compareHeaderStatus || 'สถานะ & เลขห้องว่าง'}</th>
                  <th>{t.compareHeaderAir || 'เครื่องปรับอากาศ'}</th>
                  <th>{t.compareHeaderFurniture || 'เฟอร์นิเจอร์'}</th>
                  <th>{t.compareHeaderHighlights || 'จุดเด่นพิเศษ'}</th>
                  <th>{t.compareHeaderAction || 'จองห้อง'}</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room: any, index: number) => {
                  const localizedRoom = (language !== 'th' && t.monthlyRooms && t.monthlyRooms[index])
                    ? t.monthlyRooms[index]
                    : null;
                  const roomName = localizedRoom?.name || room.name;
                  const roomFeatures = localizedRoom?.features || room.features || [];

                  const hasAir = index >= 2;
                  const airBadge = hasAir
                    ? (t.compareHasAir || '❄️ มีแอร์')
                    : (t.compareNoAir || '❌ ไม่มีแอร์');

                  let furnText = t.compareFurnNone || 'ไม่มี (ห้องเปล่า)';
                  if (index === 4) furnText = t.compareFurn8 || '8 ชิ้น (ชุดมาตรฐาน)';
                  else if (index === 5) furnText = t.compareFurn12 || '12 ชิ้น (ครบชุดใหญ่)';
                  else if (index >= 6) furnText = t.compareFurnYes || 'มีเฟอร์นิเจอร์';

                  const hasAvailable = room.availableRoomsList && room.availableRoomsList.length > 0;
                  const availBadgeText = (t.compareAvailableBadge || '🟢 ว่าง {count} ห้อง')
                    .replace('{count}', String(room.availableRoomsList ? room.availableRoomsList.length : 0));
                  const fullBadgeText = t.compareFullBadge || '🔴 เต็มแล้ว';

                  return (
                    <tr key={index}>
                      <td className="room-name-cell">
                        <strong>{roomName}</strong>
                      </td>
                      <td className="price-cell">฿{room.price}</td>
                      <td className="deposit-cell">฿{room.deposit}</td>
                      <td className="availability-cell">
                        {hasAvailable ? (
                          <div>
                            <span className="tag-yes" style={{ display: 'inline-block', marginBottom: '4px', fontSize: '0.8rem' }}>
                              {availBadgeText}
                            </span>
                            <div style={{ fontSize: '0.78rem', color: '#1e293b' }}>
                              {room.availableRoomsList.map((rNo: string, i: number) => (
                                <span key={i} style={{ display: 'inline-block', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0 5px', margin: '1px 2px', fontWeight: 'bold' }}>
                                  {rNo}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="tag-no" style={{ fontSize: '0.8rem' }}>{fullBadgeText}</span>
                        )}
                      </td>
                      <td className="air-cell">
                        <span className={hasAir ? 'tag-yes' : 'tag-no'}>{airBadge}</span>
                      </td>
                      <td className="furn-cell">{furnText}</td>
                      <td className="feature-cell">
                        {roomFeatures.map((f: string, i: number) => (
                          <span key={i} className="mini-badge">{f}</span>
                        ))}
                      </td>
                      <td className="action-cell">
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={!hasAvailable}
                          onClick={() => {
                            if (onSelectRoom) onSelectRoom(roomName);
                            onClose();
                          }}
                          style={{
                            opacity: hasAvailable ? 1 : 0.5,
                            cursor: hasAvailable ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {hasAvailable ? (t.compareBookRoomBtn || 'เลือกห้องนี้') : fullBadgeText}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
