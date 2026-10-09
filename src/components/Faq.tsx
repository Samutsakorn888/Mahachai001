import React, { useState } from 'react';
import type { Translations } from '../i18n/translations';

interface FaqProps {
  t: Translations;
}

export const Faq: React.FC<FaqProps> = ({ t }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const allItems = t.faqList || [];
  const visibleItems = showAll ? allItems : allItems.slice(0, 3);

  return (
    <section id="faq" className="section" style={{ backgroundColor: 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <h2 className="section-title">{t.faqTitle}</h2>
        <p className="section-subtitle">{t.faqSubtitle}</p>

        <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {visibleItems.map((item, idx) => {
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

        {allItems.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={() => { setShowAll(!showAll); if (showAll) setOpenIdx(null); }}
              style={{
                background: '#1a4b8c',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {showAll
                ? '▲ ย่อรายการ'
                : `▼ ดูเพิ่มเติม (${allItems.length - 3})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
