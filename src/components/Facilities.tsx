import React from 'react';
import type { Translations } from '../i18n/translations';

interface FacilitiesProps {
  t: Translations;
}

export const Facilities: React.FC<FacilitiesProps> = ({ t }) => {
  return (
    <section id="facilities" className="section" style={{ backgroundColor: 'var(--white)' }}>
      <div className="container">
        <h2 className="section-title">{t.facilitiesTitle}</h2>
        <p className="section-subtitle">{t.facilitiesSubtitle}</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '40px'
        }}>
          {(t.facilitiesList || []).map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-offset)',
                padding: '28px 24px',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--primary-light)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '2.5rem', lineHeight: '1', marginBottom: '14px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {t.securityList && (
          <div style={{ marginTop: '60px' }}>
            <h2 className="section-title">{t.securityTitle}</h2>
            <p className="section-subtitle">{t.securitySubtitle}</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginTop: '40px'
            }}>
              {t.securityList.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-offset)',
                    padding: '28px 24px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--primary-light)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', lineHeight: '1', marginBottom: '14px' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
