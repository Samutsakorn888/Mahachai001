import React from 'react';
import type { Language, Translations } from '../../i18n/translations';

interface DailyRoomCardProps {
  room: any;
  roomIdx: number;
  isAdmin?: boolean;
  onEditRoom?: (index: number, tabType: 'daily') => void;

  t: Translations;
  language?: Language;
  onViewDetails: (room: any) => void;
  onBookNow: (room: any) => void;
}

export const DailyRoomCard: React.FC<DailyRoomCardProps> = ({
  room, roomIdx, isAdmin, onEditRoom, t, language, onViewDetails, onBookNow
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
            {room.data.price}
          </div>
          <div className="room-price-label">
            / {t.pricePerNight}
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

  t: Translations;
  language?: Language;
  onViewDetails: (room: any) => void;
  onBookNow: (room: any) => void;
}

export const MonthlyRoomCard: React.FC<MonthlyRoomCardProps> = ({
  room, roomIdx, isAdmin, onEditRoom, t, language, onViewDetails, onBookNow
}) => {

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
            {room.price}
          </div>
          <div className="room-price-label">
            / {t.perMonth}
          </div>
        </div>

        <div style={{ marginTop: '10px', fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: '500' }}>
          {t.depositLabel}: <strong>{room.deposit}</strong> {language === 'en' ? 'THB' : language === 'cn' ? '泰铢' : language === 'mm' ? 'ဘတ်' : 'บาท'}
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
            style={{ flex: 1 }}
          >
            {t.bookNow}
          </button>
        </div>
      </div>
    </div>
  );
};
