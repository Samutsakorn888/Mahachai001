import React from 'react';
import type { Language, Translations } from '../../i18n/translations';

interface DailyRoomCardProps {
  room: any;
  roomIdx: number;
  isAdmin?: boolean;
  onEditRoom?: (index: number, tabType: 'daily') => void;
  onToggleAvailability: (room: any, tabType: 'daily') => void;
  t: Translations;
  language?: Language;
  onViewDetails: (room: any) => void;
  onBookNow: (room: any) => void;
}

export const DailyRoomCard: React.FC<DailyRoomCardProps> = ({
  room, roomIdx, isAdmin, onEditRoom, onToggleAvailability, t, language, onViewDetails, onBookNow
}) => {
  return (
    <div className="room-card" style={{ position: 'relative' }}>
      {isAdmin && onEditRoom && (
        <div style={{ padding: '8px 12px 0 12px' }}>
          <button
            className="admin-quick-edit-btn"
            style={{ width: '100%', fontSize: '0.8rem', padding: '4px 10px' }}
            onClick={() => onEditRoom(roomIdx, 'daily')}
          >
            แก้ไขข้อมูล/ราคาห้องนี้
          </button>
        </div>
      )}
      {room.image ? (
        <div className="room-image-wrapper">
          <img
            src={room.image}
            alt={room.data.name}
            className="room-image"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="room-image-wrapper placeholder-image-box" style={{
          backgroundColor: '#ebf8ff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '210px',
          color: '#004088',
          borderBottom: '1px solid #e2e8f0',
          padding: '20px'
        }}>
          <span style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🌀</span>
          <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{room.data.name}</span>
          <span style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '4px' }}>{room.data.desc}</span>
        </div>
      )}
      <div className="room-info">
        <h3 className="room-card-title">{room.data.name}</h3>
        <p className="room-card-desc">{room.data.desc}</p>
        
        <div className="room-features">
          {(room.data.features || []).map((feature: string, fIdx: number) => (
            <span key={fIdx} className="room-feature-badge">
              {feature}
            </span>
          ))}
        </div>

        <div className="room-price-row">
          <div className="room-price-val">
            ฿{room.data.price}
          </div>
          <div className="room-price-label">
            / {t.pricePerNight}
          </div>
        </div>

        {/* Room Status Box */}
        <div 
          onClick={() => onToggleAvailability(room, 'daily')}
          style={{
            margin: '14px 0 6px 0',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: (room.data.availableRooms > 0) ? '#f0fff4' : '#fff5f5',
            border: (room.data.availableRooms > 0) ? '1.5px solid #bbf7d0' : '1.5px solid #fecaca',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            cursor: isAdmin ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            boxShadow: isAdmin ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
          }}
          title={isAdmin ? 'คลิกเพื่อเปลี่ยนสถานะห้องว่าง/เต็ม' : ''}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
            <span style={{
              fontWeight: 900,
              fontSize: '1rem',
              color: room.data.availableRooms > 0 ? '#15803d' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {room.data.availableRooms > 0 ? (language === 'en' ? 'Available' : language === 'cn' ? '可入住' : language === 'mm' ? 'လစ်လပ်' : 'สถานะ: ว่าง') : (language === 'en' ? 'Full (Occupied)' : language === 'cn' ? '已满 (Occupied)' : language === 'mm' ? 'ပြည့်ပြီး' : 'สถานะ: เต็มแล้ว')}
            </span>
            {room.data.availableRooms > 0 && (
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#166534',
                backgroundColor: '#dcfce7',
                padding: '4px 14px',
                borderRadius: '20px',
                border: '2px solid #bbf7d0',
                boxShadow: '0 2px 4px rgba(22, 101, 52, 0.15)'
              }}>
                {language === 'en' ? `${room.data.availableRooms} Left` : language === 'cn' ? `剩余 ${room.data.availableRooms} 间` : language === 'mm' ? `${room.data.availableRooms} ခန်း လစ်လပ်` : `ว่าง ${room.data.availableRooms} ห้อง!`}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
            <span>{t.totalRoomsLabel || 'ทั้งหมด:'} <strong>{room.data.totalRooms}</strong> {t.roomsUnit || 'ห้อง'}</span>
            <span>{t.occupiedRoomsLabel || 'เต็มแล้ว:'} <strong>{room.data.occupiedRooms}</strong> {t.roomsUnit || 'ห้อง'}</span>
            <span>{t.availableRoomsLabel || 'เหลือว่าง:'} <strong>{room.data.availableRooms}</strong> {t.roomsUnit || 'ห้อง'}</span>
          </div>
        </div>

        <div className="room-actions">
          <button
            className="btn btn-outline"
            onClick={() => onViewDetails(room)}
          >
            {t.viewDetails}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onBookNow(room)}
            disabled={room.data.availableRooms <= 0}
            style={{
              opacity: room.data.availableRooms <= 0 ? 0.6 : 1,
              cursor: room.data.availableRooms <= 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {room.data.availableRooms > 0 ? `${t.bookNow}` : (language === 'en' ? 'Full' : language === 'cn' ? '已满' : language === 'mm' ? 'ပြည့်ပြီး' : 'เต็มแล้ว')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface MonthlyRoomCardProps {
  room: any;
  roomIdx: number;
  isAdmin?: boolean;
  onEditRoom?: (index: number, tabType: 'monthly') => void;
  onToggleAvailability: (room: any, tabType: 'monthly') => void;
  t: Translations;
  language?: Language;
  onViewDetails: (room: any) => void;
  onBookNow: (room: any) => void;
}

export const MonthlyRoomCard: React.FC<MonthlyRoomCardProps> = ({
  room, roomIdx, isAdmin, onEditRoom, onToggleAvailability, t, language, onViewDetails, onBookNow
}) => {
  const hasAvailable = room.availableRoomsList && room.availableRoomsList.length > 0;
  return (
    <div className="room-card" style={{ position: 'relative' }}>
      {isAdmin && onEditRoom && (
        <div style={{ padding: '8px 12px 0 12px' }}>
          <button
            className="admin-quick-edit-btn"
            style={{ width: '100%', fontSize: '0.8rem', padding: '4px 10px' }}
            onClick={() => onEditRoom(roomIdx, 'monthly')}
          >
            แก้ไขข้อมูล/ราคาห้องนี้
          </button>
        </div>
      )}
      {room.image ? (
        <div className="room-image-wrapper">
          <img
            src={room.image}
            alt={room.name}
            className="room-image"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="room-image-wrapper placeholder-image-box" style={{
          backgroundColor: '#f7fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '210px',
          color: '#4a5568',
          borderBottom: '1px solid #e2e8f0',
          padding: '20px'
        }}>
          <span style={{ fontSize: '3.5rem', marginBottom: '8px' }}></span>
          <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{room.name}</span>
          <span style={{ fontSize: '0.8rem', color: '#718096', marginTop: '4px' }}>{room.desc}</span>
        </div>
      )}
      <div className="room-info">
        <h3 className="room-card-title">{room.name}</h3>
        <p className="room-card-desc">{room.desc}</p>
        
        <div className="room-features">
          {(room.features || []).map((feature: string, fIdx: number) => (
            <span key={fIdx} className="room-feature-badge">
              {feature}
            </span>
          ))}
        </div>

        <div className="room-price-row">
          <div className="room-price-val">
            ฿{room.price}
          </div>
          <div className="room-price-label">
            / {t.perMonth}
          </div>
        </div>

        <div style={{ marginTop: '10px', fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: '500' }}>
          {t.depositLabel}: <strong>฿{room.deposit}</strong> {language === 'en' ? 'THB' : language === 'cn' ? '泰铢' : language === 'mm' ? 'ဘတ်' : 'บาท'}
        </div>

        {/* Monthly Room Availability Status Box */}
        <div 
          onClick={() => onToggleAvailability(room, 'monthly')}
          style={{
            margin: '14px 0 6px 0',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: hasAvailable ? '#f0fff4' : '#fff5f5',
            border: hasAvailable ? '1.5px solid #bbf7d0' : '1.5px solid #fecaca',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            cursor: isAdmin ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            boxShadow: isAdmin ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
          }}
          title={isAdmin ? 'คลิกเพื่อเปลี่ยนสถานะห้องว่าง/เต็ม' : ''}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
            <span style={{
              fontWeight: 900,
              fontSize: '1rem',
              color: hasAvailable ? '#15803d' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {hasAvailable ? (language === 'en' ? 'Ready' : language === 'cn' ? '随时可入住' : language === 'mm' ? 'အသင့်နေနိုင်သည်' : 'สถานะ: ว่าง') : (language === 'en' ? 'Full (Occupied)' : language === 'cn' ? '已满 (Occupied)' : language === 'mm' ? 'ပြည့်ပြီး' : 'สถานะ: เต็มแล้ว')}
            </span>
            {hasAvailable && (
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#166534',
                backgroundColor: '#dcfce7',
                padding: '4px 14px',
                borderRadius: '20px',
                border: '2px solid #bbf7d0',
                boxShadow: '0 2px 4px rgba(22, 101, 52, 0.15)'
              }}>
                {language === 'en' ? `${room.availableRoomsList.length} Left` : language === 'cn' ? `空房 ${room.availableRoomsList.length} 间` : language === 'mm' ? `${room.availableRoomsList.length} ခန်း လစ်လပ်` : `ว่าง ${room.availableRoomsList.length} ห้อง!`}
              </span>
            )}
          </div>

          {hasAvailable ? (
            <div style={{ fontSize: '0.82rem', color: '#1e293b', marginTop: '4px' }}>
              <strong>{language === 'en' ? 'Vacant Rooms:' : language === 'cn' ? '可用房号:' : language === 'mm' ? 'လစ်လပ်ခန်းများ:' : 'เลขห้องว่าง:'}</strong>{' '}
              {room.availableRoomsList.map((roomNo: string, i: number) => (
                <span key={i} style={{
                  display: 'inline-block',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '1px 6px',
                  margin: '2px 3px 2px 0',
                  fontWeight: 'bold',
                  color: '#0f172a',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  {language === 'en' ? `Room ${roomNo}` : language === 'cn' ? `${roomNo}房` : language === 'mm' ? `အခန်း ${roomNo}` : `ห้อง ${roomNo}`}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: '2px' }}>
              {language === 'en' ? 'Currently full for this type (Inquire for queue)' : language === 'cn' ? '目前该房型已满 (可咨询排队)' : language === 'mm' ? 'လက်ရှိတွင် ဤအခန်းပြည့်နေပါသည်' : 'ปัจจุบันไม่มีห้องว่างในโซนนี้ (สอบถามคิวล่วงหน้า)'}
            </div>
          )}
        </div>

        <div className="room-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-outline"
            onClick={() => onViewDetails({ ...room, data: room, isMonthly: true })}
            style={{ flex: 1 }}
          >
            {t.viewDetails}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onBookNow({ ...room, data: room, isMonthly: true })}
            disabled={!hasAvailable}
            style={{
              flex: 1,
              opacity: hasAvailable ? 1 : 0.6,
              cursor: hasAvailable ? 'pointer' : 'not-allowed'
            }}
          >
            {hasAvailable ? `${t.bookNow}` : (language === 'en' ? 'Full' : language === 'cn' ? '已满' : language === 'mm' ? 'ပြည့်ပြီး' : 'เต็มแล้ว')}
          </button>
        </div>
      </div>
    </div>
  );
};
