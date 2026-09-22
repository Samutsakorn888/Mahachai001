import React, { useState } from 'react';
import type { Translations } from '../i18n/translations';
import lineQr from '../assets/line_qr.jpg';

interface LineModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export const LineModal: React.FC<LineModalProps> = ({ isOpen, onClose, t }) => {
  const [showToast, setShowToast] = useState(false);
  const lineId = '0990954541';

  if (!isOpen) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(lineId);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
          <button className="modal-back-btn" onClick={onClose} title="ย้อนกลับ" style={{ color: '#004088', position: 'absolute', top: '24px', left: '24px' }}>
            ← ย้อนกลับ
          </button>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
          
          <h3 className="modal-title">{t.lineModalTitle}</h3>
          
          <div className="modal-qr-container">
            <img
              src={lineQr}
              alt="Line Official QR Code"
              className="modal-qr-img"
            />
          </div>
          
          <p className="modal-text">
            {t.lineModalDesc}
          </p>


          
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleCopyId}>
              📋 {t.copyIdBtn}
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="alert-toast">
          ✨ {t.copiedAlert}
        </div>
      )}
    </>
  );
};
