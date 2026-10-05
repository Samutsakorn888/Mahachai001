import React, { useState, useRef, useEffect } from 'react';
import type { Language, Translations } from '../i18n/translations';

interface NavbarProps {
  language: Language | 'auto';
  setLanguage: (lang: Language | 'auto') => void;
  t: Translations;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  t,
  activeSection,
  setActiveSection
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language | 'auto'; label: string; flagImg: string }[] = [
    { code: 'th', label: 'ไทย', flagImg: 'https://flagcdn.com/w20/th.png' },
    { code: 'en', label: 'English', flagImg: 'https://flagcdn.com/w20/gb.png' },
    { code: 'cn', label: '中文', flagImg: 'https://flagcdn.com/w20/cn.png' },
    { code: 'mm', label: 'မြန်မာ', flagImg: 'https://flagcdn.com/w20/mm.png' },
    { code: 'auto', label: '🌐 อื่นๆ (Auto Translate)', flagImg: '' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];



  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 70; // Height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">

        {/* 1. Left: Brand Logo */}
        <a href="#" className="navbar-logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
          <img src="/images/logo.png" alt="Logo" className="navbar-logo-img" />
          <span>{t.brand}</span>
        </a>

        {/* 2. Center: Navigation Menu Links */}
        <ul className="navbar-menu">
          <li>
            <a
              href="#home"
              className={`navbar-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            >
              {t.navHome}
            </a>
          </li>
          <li>
            <a
              href="#rooms"
              className={`navbar-link ${activeSection === 'rooms' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('rooms'); }}
            >
              {t.navRooms}
            </a>
          </li>
          <li>
            <a
              href="#facilities"
              className={`navbar-link ${activeSection === 'facilities' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('facilities'); }}
            >
              {t.navFacilities}
            </a>
          </li>
          <li>
            <a
              href="#nearby"
              className={`navbar-link ${activeSection === 'nearby' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('nearby'); }}
            >
              {t.navNearby}
            </a>
          </li>
          <li>
            <a
              href="#rules"
              className={`navbar-link ${activeSection === 'rules' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('rules'); }}
            >
              {t.navRules}
            </a>
          </li>
          <li>
            <a
              href="#faq"
              className={`navbar-link ${activeSection === 'faq' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}
            >
              {t.navFaq}
            </a>
          </li>
        </ul>

        {/* 3. Right: Language Switcher (Hybrid) */}
        <div className="lang-switcher" ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="lang-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {currentLang.flagImg ? (
              <img src={currentLang.flagImg} width="20" alt={currentLang.code} style={{ borderRadius: '2px' }} />
            ) : (
              <span style={{ fontSize: '1rem' }}>🌐</span>
            )}
            <span>{currentLang.label.replace('🌐 ', '')}</span>
            <span style={{ fontSize: '0.8rem', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
          </button>

          {dropdownOpen && (
            <div className="lang-dropdown">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-option ${language === lang.code ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setDropdownOpen(false);
                    if (lang.code !== 'auto') {
                      setTimeout(() => window.location.reload(), 100);
                    }
                  }}
                >
                  {lang.flagImg ? (
                    <img src={lang.flagImg} width="20" alt={lang.code} style={{ borderRadius: '2px' }} />
                  ) : (
                    <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>🌐</span>
                  )}
                  <span>{lang.label.replace('🌐 ', '')}</span>
                </button>
              ))}
            </div>
          )}
          
          <div style={{ display: language === 'auto' ? 'block' : 'none' }}>
            <div id="google_translate_element" className="translate-widget"></div>
          </div>
        </div>

      </div>
    </header>
  );
};
