import React, { useState } from 'react';
import type { Language, Translations } from '../i18n/translations';

interface PromptPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
  language?: Language;
}

export const PromptPayModal: React.FC<PromptPayModalProps> = ({ isOpen, onClose, t }) => {
  const [copiedType, setCopiedType] = useState<'acc' | 'pp' | null>(null);

  if (!isOpen) return null;

  const bankAccount = '245-0-14238-1';

  const handleCopyAccount = async (text: string, type: 'acc' | 'pp') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
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
                <button className="btn btn-copy-acc" onClick={() => handleCopyAccount(bankAccount, 'acc')}>
                  {copiedType === 'acc' ? (t.bankCopiedBtn || '✅ คัดลอกแล้ว!') : (t.bankCopyBtn || 'คัดลอกเลขบัญชี')}
                </button>
              </div>

              <span className="acc-label" style={{ marginTop: '12px', display: 'block' }}>พร้อมเพย์ (PromptPay):</span>
              <div className="acc-num-row">
                <strong className="acc-num">066-149-6282</strong>
                <button className="btn btn-copy-acc" onClick={() => handleCopyAccount('0661496282', 'pp')}>
                  {copiedType === 'pp' ? (t.bankCopiedBtn || '✅ คัดลอกแล้ว!') : 'คัดลอกเบอร์'}
                </button>
              </div>

              <p className="acc-name" style={{ marginTop: '12px' }}>{t.bankAccNameLabel || 'ชื่อบัญชี:'} <strong>นาง อรอนงค์ เตชะเกษมสุข<br/><span style={{fontSize: '0.9em', fontWeight: 'normal'}}>ONANONG TECHAKASEMSUK</span></strong></p>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2d3748' }}>สแกน QR Code เพื่อชำระเงิน</p>
                <img src="/images/qr_payment.jpg" alt="QR Code Payment" style={{ width: '100%', maxWidth: '240px', height: 'auto', borderRadius: '12px', border: '2px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
              </div>
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
                <li>ส่งสลิปโอนเงิน ทางไลน์ (LINE ID: 099-095-4541)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
