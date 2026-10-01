import React, { useState } from 'react';
import type { Language, Translations } from '../i18n/translations';
import { LeaseModal } from './LeaseModal';
import type { CustomSiteData } from '../services/adminStore';

interface RulesProps {
  t: Translations;
  language?: Language;
  siteData?: CustomSiteData;
  isAdmin?: boolean;
  onEditRules?: () => void;
}

export const Rules: React.FC<RulesProps> = ({ t, language = 'th', siteData, isAdmin, onEditRules }) => {
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);

  const getRuleIcon = (text: string) => {
    if (text.includes('บุหรี่') || text.toLowerCase().includes('smoking')) return '🚭';
    if (text.includes('สุรา') || text.includes('เหล้า') || text.toLowerCase().includes('alcohol')) return '🚫🍺';
    if (text.includes('ทะเลาะ') || text.includes('วิวาท') || text.toLowerCase().includes('quarrel')) return '💢';
    if (text.includes('เสียงดัง') || text.includes('รบกวน') || text.toLowerCase().includes('noise')) return '🔇';
    if (text.includes('รองเท้า') || text.toLowerCase().includes('shoes')) return '👟';
    if (text.includes('แก๊ส') || text.toLowerCase().includes('gas')) return '🔥';
    if (text.includes('สัตว์') || text.toLowerCase().includes('pet')) return '🚫🐈';
    if (text.includes('ชักโครก') || text.includes('ท่อ') || text.toLowerCase().includes('toilet')) return '🚽';
    if (text.includes('เจาะ') || text.includes('สติกเกอร์') || text.includes('ผนัง')) return '🔨';
    if (text.includes('ประตู') || text.toLowerCase().includes('door')) return '🚪';
    return '⚠️';
  };

  const rulesList = (language === 'th' && siteData?.rulesList && siteData.rulesList.length > 0) ? siteData.rulesList : (t.rulesList || []);
  const rulesNotice = (language === 'th' && siteData?.rulesNotice) ? siteData.rulesNotice : t.rulesNotice;

  return (
    <section id="rules" className="section" style={{ backgroundColor: 'var(--bg-offset)', position: 'relative' }}>
      <div className="container">
        {isAdmin && (
          <div className="admin-inline-trigger-container" style={{ marginBottom: '16px', textAlign: 'center' }}>
            <button className="admin-quick-edit-btn" onClick={onEditRules}>
              แก้ไขกฎระเบียบ & ประกาศของหอพัก
            </button>
          </div>
        )}

        {/* Tenant Regulations Section */}
        <h2 className="section-title">{t.rulesTitle}</h2>
        <p className="section-subtitle">{t.rulesSubtitle || 'ข้อปฏิบัติตามมาตรฐานเพื่อความสะอาด ความปลอดภัย และความเป็นส่วนตัวของผู้พักอาศัยทุกท่าน'}</p>

        <div className="rules-container">
          <div className="rules-grid-layout">
            {rulesList.map((ruleText, idx) => (
              <div key={idx} className="rule-item-card">
                <div className="rule-icon-badge" style={{ fontSize: '1.4rem' }}>
                  {getRuleIcon(ruleText)}
                </div>
                <span className="rule-text" style={{ fontSize: '1rem', fontWeight: 500, color: '#2d3748' }}>{ruleText}</span>
              </div>
            ))}
          </div>

          <div className="rules-notice-card" style={{ 
            backgroundColor: '#fff5f5', 
            borderLeft: '4px solid #f56565',
            padding: '16px 20px',
            marginTop: '28px',
            marginBottom: '28px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>🚨</div>
            <div className="rules-notice-text" style={{ color: '#c53030', fontWeight: 'bold', fontSize: '1.05rem', margin: 0 }}>
              {rulesNotice}
            </div>
          </div>

          {/* Button to view full official contract document */}
          <div className="rules-action-center" style={{ textAlign: 'center' }}>
            <button
              onClick={() => setIsLeaseModalOpen(true)}
              className="btn-hotel-secondary"
              style={{
                padding: '14px 32px',
                fontSize: '1.05rem',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#0056b3', // Deep blue makes it look more professional
                color: '#ffffff'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>📄</span>
              <span>{t.leaseAgreementBtn || 'ดูฉบับเต็ม: สัญญาและกฎข้อระเบียบการเช่าหอพัก (Official Lease Agreement)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Lease Agreement Modal */}
      <LeaseModal
        isOpen={isLeaseModalOpen}
        onClose={() => setIsLeaseModalOpen(false)}
      />
    </section>
  );
};
