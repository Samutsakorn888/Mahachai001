import React, { useState } from 'react';
import type { Language, Translations } from '../i18n/translations';

interface PromptPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
  language?: Language;
}

export const PromptPayModal: React.FC<PromptPayModalProps> = ({ isOpen, onClose, t }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bankAccount = '245-0-14238-1';

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(bankAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy account number:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content promptpay-modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="modal-back-btn" onClick={onClose} title="ย้อนกลับ" style={{ color: '#004088', position: 'absolute', top: '24px', left: '24px' }}>
          ← ย้อนกลับ
        </button>
        <div className="modal-header">
          <h3 style={{ marginLeft: '100px' }}>{t.promptPayTitle || 'ช่องทางการชำระเงิน & เงินมัดจำประกันห้อง'}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body promptpay-modal-body">
          <div className="bank-card-container">
            <div className="bank-logo-header">
              <span className="bank-icon"></span>
              <div>
                <h4 className="bank-name">{t.bankName || 'ธนาคารกรุงเทพ (Bangkok Bank)'}</h4>
                <p className="bank-note">{t.bankNote || 'บริการชำระเงินโอนผ่านบัญชีธนาคาร (ไม่รับเงินสด)'}</p>
              </div>
            </div>

            <div className="account-details-box">
              <span className="acc-label">{t.bankAccLabel || 'เลขที่บัญชี:'}</span>
              <div className="acc-num-row">
                <strong className="acc-num">{bankAccount}</strong>
                <button className="btn btn-copy-acc" onClick={handleCopyAccount}>
                  {copied ? (t.bankCopiedBtn || '✅ คัดลอกแล้ว!') : (t.bankCopyBtn || 'คัดลอกเลขบัญชี')}
                </button>
              </div>
              <p className="acc-name">{t.bankAccNameLabel || 'ชื่อบัญชี:'} <strong>{t.bankAccNameVal || 'อรอนงค์ เตชะเกษมสุข'}</strong></p>
            </div>

            <div className="deposit-info-banner">
              <div className="info-icon"></div>
              <div className="info-text">
                <strong>{t.bankDailyNoticeTitle || 'การชำระเงินห้องพักรายวัน:'}</strong>
                <p>{t.bankDailyNoticeDesc || 'ค่าห้องพัก + ค่ามัดจำประกันห้อง 500 บาท/ห้อง (ได้รับเงินคืนเต็มจำนวนทางโอนเงินหลังย้ายออกไม่เกิน 12:00 น.)'}</p>
              </div>
            </div>

            <div className="slip-steps">
              <h5>{t.bankStepsTitle || 'ขั้นตอนหลังชำระเงิน:'}</h5>
              <ol className="steps-ol">
                <li>{t.bankStep1 || 'ถ่ายรูป/เซฟสลิปโอนเงิน'}</li>
                <li>{t.bankStep2 || 'ถ่ายภาพบัตรประชาชนและแจ้งเลขห้องพัก'}</li>
                <li>{t.bankStep3 || 'ส่งสลิปแจ้งยืนยันทาง LINE ID: 0990954541'}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
