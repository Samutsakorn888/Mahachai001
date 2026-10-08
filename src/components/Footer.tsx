import React from 'react';
import type { Language, Translations } from '../i18n/translations';
import type { CustomSiteData } from '../services/adminStore';

interface FooterProps {
  t: Translations;
  language?: Language;
  onAdminClick?: () => void;
  siteData?: CustomSiteData;
  isAdmin?: boolean;
  onEditSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  t,
  language = 'th',
  onAdminClick,
  siteData,
  isAdmin,
  onEditSettings
}) => {
  const phoneVal = siteData?.phoneVal || t.phoneVal;
  const lineId = siteData?.lineId || '0990954541';
  const facebookUrl = siteData?.facebookUrl || 'https://www.facebook.com/profile.php?id=61553464657033';

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-info">
          {isAdmin && (
            <div style={{ marginBottom: '12px' }}>
              <button className="admin-quick-edit-btn" onClick={onEditSettings}>
                แก้ไขข้อมูลติดต่อ & การเงิน
              </button>
            </div>
          )}
          <div className="footer-brand-logo-container">
            <img src="/images/logo.png" alt="Logo" className="footer-logo-img" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{t.brand}</h3>
          </div>
          <div className="footer-contact-details">
            <div className="footer-contact-item">
              <span className="footer-contact-label">{t.addressLabel}</span>
              <span className="footer-contact-val">{t.addressVal}</span>
            </div>
            
            <div className="footer-contact-item">
              <span className="footer-contact-label">{t.phoneLabel}</span>
              <span className="footer-contact-val">{phoneVal}</span>
            </div>
            
            <div className="footer-contact-item">
              <span className="footer-contact-label">LINE</span>
              <span className="footer-contact-val">{lineId}</span>
            </div>

            <div className="footer-contact-item">
              <span className="footer-contact-label">Facebook Page</span>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-val"
                style={{ color: '#90cdf4', textDecoration: 'underline' }}
              >
                @samutsakorn mahachai ↗
              </a>
            </div>
          </div>
        </div>

        <div className="footer-map">
          <div className="footer-contact-label" style={{ marginBottom: '12px', color: 'var(--white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span>🗺️ {t.mapLabel}</span>
            <a 
              href="https://maps.app.goo.gl/x2v1CSky2nLNr7gZ9" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#90cdf4', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'underline' }}
            >
              Open in Google Maps ↗
            </a>
          </div>
          <div className="footer-map-container">
            <iframe
              src="https://maps.google.com/maps?q=13.5650,100.2715&z=16&output=embed"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="@samutsakorn mahachai Location Map"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p>{t.copyright}</p>
          {onAdminClick && (
            <button
              onClick={onAdminClick}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#cbd5e0',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🔐 {language === 'en' ? 'Admin Access' : language === 'cn' ? '管理员入口' : language === 'mm' ? 'အက်ဒမင်ဝင်ရောက်ရန်' : 'ระบบผู้ดูแลระบบ (Admin)'}
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
