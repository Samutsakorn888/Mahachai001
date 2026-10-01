import React, { useState } from 'react';

interface RoomDetailsModalProps {
  room: any | null;
  onClose: () => void;
  onImageClick: (img: string) => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose, onImageClick }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!room) return null;

  const handleClose = () => {
    setActiveImgIndex(0);
    onClose();
  };

  const roomImages = room.images && room.images.length > 0
    ? room.images
    : (room.image ? [room.image] : []);
  
  const safeIndex = activeImgIndex < roomImages.length ? activeImgIndex : 0;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{room.data?.name}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          {roomImages.length > 0 && (
            <>
              {/* Featured Main Image with Side Arrow Controls */}
              <div className="slider-wrapper" style={{ position: 'relative', marginBottom: '14px' }}>
                <button
                  type="button"
                  className="slider-arrow slider-arrow-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIndex(prev => (prev === 0 ? roomImages.length - 1 : prev - 1));
                  }}
                  title="รูปก่อนหน้า"
                >
                  ‹
                </button>

                <img
                  src={roomImages[safeIndex]}
                  alt={room.data?.name}
                  className="slider-featured-img"
                  onClick={() => onImageClick(roomImages[safeIndex])}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                    display: 'block'
                  }}
                />

                <button
                  type="button"
                  className="slider-arrow slider-arrow-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIndex(prev => (prev === roomImages.length - 1 ? 0 : prev + 1));
                  }}
                  title="รูปถัดไป"
                >
                  ›
                </button>

                <div className="slider-counter-badge">
                  📷 {safeIndex + 1} / {roomImages.length}
                </div>
              </div>

              {/* Thumbnail Previews Bar */}
              <div className="slider-thumbnails-bar" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                {roomImages.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`slider-thumb-item ${safeIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      width: '70px',
                      height: '50px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: safeIndex === idx ? '2.5px solid #004088' : '2px solid #e2e8f0',
                      opacity: safeIndex === idx ? 1 : 0.65,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </>
          )}

          <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}><strong>รายละเอียด:</strong> {room.data?.desc}</p>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
            <strong>ราคา:</strong> ฿{room.data?.price} {room.isMonthly ? '/ เดือน' : '/ คืน'}
          </p>
          <p style={{ fontSize: '1.05rem', marginBottom: '16px', color: '#e63946', fontWeight: 'bold' }}>
            ต้องจ่ายค่ามัดจำห้องละ {room.data?.deposit ? `฿${room.data.deposit}` : '฿500'} บาท
          </p>
          <div className="room-features">
            {room.data?.features?.map((f: string, i: number) => (
              <span key={i} className="room-feature-badge">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
