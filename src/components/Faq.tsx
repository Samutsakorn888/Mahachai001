import React, { useState } from 'react';
import type { Translations } from '../i18n/translations';

interface FaqProps {
  t: Translations;
}

export const Faq: React.FC<FaqProps> = ({ t }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="section" style={{ backgroundColor: 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <h2 className="section-title">{t.faqTitle}</h2>
        <p className="section-subtitle">{t.faqSubtitle}</p>

        <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(t.faqList || []).map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-offset)',
                  borderRadius: 'var(--border-radius-md)',
                  border: isOpen ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '1.05rem',
                    fontWeight: 'bold',
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '16px'
                  }}
                >
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: 0, padding: 0 }}>❓ {item.q}</h3>
                  <span style={{ fontSize: '1.2rem', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    color: 'var(--text-color)',
                    fontSize: '0.98rem',
                    lineHeight: '1.6',
                    borderTop: '1px solid var(--primary-light)',
                    paddingTop: '16px'
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
