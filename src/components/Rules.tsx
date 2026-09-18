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

  const ruleIcons = [
    '🚭', '🍺', '👊', '🤫', '🥾',
    '🔥', '🐕', '🚽', '🔨', '🚪'
  ];

  const rulesList = (language === 'th' && siteData?.rulesList && siteData.rulesList.length > 0) ? siteData.rulesList : (t.rulesList || []);
  const rulesNotice = (language === 'th' && siteData?.rulesNotice) ? siteData.rulesNotice : t.rulesNotice;

  return (
    <section id="rules" className="section" style={{ backgroundColor: 'var(--bg-offset)', position: 'relative' }}>
      <div className="container">
        {isAdmin && (
          <div className="admin-inline-trigger-container" style={{ marginBottom: '16px', textAlign: 'center' }}>
            <button className="admin-quick-edit-btn" onClick={onEditRules}>
              ✏️ แก้ไขกฎระเบียบ & ประกาศของหอพัก
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
                <div className="rule-icon-badge">
                  <span>{ruleIcons[idx] || '📝'}</span>
                </div>
                <span className="rule-text">{ruleText}</span>
              </div>
            ))}
          </div>

          <div className="rules-notice-card">
            <div className="notice-icon-box">⚠️</div>
            <div className="rules-notice-text">
              {rulesNotice}
            </div>
          </div>

          {/* Button to view full official contract document */}
          <div className="rules-action-center">
            <button
              onClick={() => setIsLeaseModalOpen(true)}
              className="btn btn-primary btn-lease-doc"
            >
              <span>{t.leaseAgreementBtn || '📄 ดูฉบับเต็ม: สัญญาและกฎข้อระเบียบการเช่าหอพัก (Official Lease Agreement)'}</span>
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
