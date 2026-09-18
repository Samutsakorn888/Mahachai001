import React from 'react';

interface FloatingActionsProps {
  onLineClick: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onLineClick }) => {
  return (
    <div className="floating-actions">
      {/* Phone Call Button */}
      <a
        href="tel:0990954541"
        className="floating-btn floating-btn-phone"
        title="โทรออก 099-095-4541"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '28px', height: '28px' }}>
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.57 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.57c0-.55-.45-1-1-1z" />
        </svg>
      </a>

      {/* Facebook Button */}
      <a
        href="https://www.facebook.com/profile.php?id=61553464657033"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-btn-facebook"
        title="Contact via Facebook"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '28px', height: '28px' }}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>

      {/* Line Official App Logo Button */}
      <button
        onClick={onLineClick}
        className="floating-btn floating-btn-line"
        title="Contact via Line Official"
      >
        <svg viewBox="0 0 40 40" style={{ width: '46px', height: '46px' }}>
          <path
            fill="#ffffff"
            d="M20 5C11.72 5 5 10.6 5 17.5c0 4.9 3.8 9.1 9.4 11.1.38.09.9.27 1.03.6.14.38.09.97.05 1.34l-.22 1.25c-.07.39-.29 1.51.16 1.65.45.14 1.2-.69 1.68-1.25 2.68-3.04 4.54-5.35 6.25-6.79 3.7-.56 6.2-3.87 6.2-7.6C35 10.6 28.28 5 20 5z"
          />
          <text
            x="19.5"
            y="17.2"
            fill="#06C755"
            fontSize="9.8"
            fontWeight="900"
            fontFamily="'Outfit', 'Arial Black', Arial, sans-serif"
            letterSpacing="0.1px"
            textAnchor="middle"
            dominantBaseline="central"
          >
            LINE
          </text>
        </svg>
      </button>
    </div>
  );
};
