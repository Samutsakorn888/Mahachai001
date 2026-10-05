import React, { useState } from 'react';
import type { Translations, Language } from '../i18n/translations';

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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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

  const handleLanguageChange = (lang: Language | 'auto') => {
    setLanguage(lang);
    setLangDropdownOpen(false);
    
    // Manage googtrans cookie based on selection
    if (lang === 'auto') {
      // Don't auto-set here, let index.html or Google Translate widget handle it, but wait, if they select "auto", we should clear any manually set ATS_LANGUAGE ? No, ATS_LANGUAGE = 'auto'.
      // If we want Google Translate widget to show up, we just let it be. But to force it, maybe we should reload.
      window.location.reload();
    } else {
      // Clear google translate cookie
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.' + window.location.hostname + '; path=/;';
      window.location.reload();
    }
  };

  // Flag map
  const getFlag = (l: string) => {
    switch (l) {
      case 'th': return '🇹🇭';
      case 'en': return '🇬🇧';
      case 'cn': return '🇨🇳';
      case 'mm': return '🇲🇲';
      case 'auto': return '🌍';
      default: return '🇹🇭';
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

        {/* 3. Right: Language Switcher */}
        <div className="lang-switcher">
          <div className="lang-dropdown">
            <button 
              className="lang-btn-main"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            >
              <span className="lang-flag">{getFlag(language)}</span>
              <span className="lang-code">{language === 'auto' ? 'Auto' : language.toUpperCase()}</span>
              <svg className={`chevron ${langDropdownOpen ? 'up' : 'down'}`} viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>
            
            {langDropdownOpen && (
              <div className="lang-dropdown-menu">
                <button className={`lang-option ${language === 'th' ? 'active' : ''}`} onClick={() => handleLanguageChange('th')}>
                  <span className="lang-flag">🇹🇭</span> Thai
                </button>
                <button className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => handleLanguageChange('en')}>
                  <span className="lang-flag">🇬🇧</span> English
                </button>
                <button className={`lang-option ${language === 'cn' ? 'active' : ''}`} onClick={() => handleLanguageChange('cn')}>
                  <span className="lang-flag">🇨🇳</span> 中文
                </button>
                <button className={`lang-option ${language === 'mm' ? 'active' : ''}`} onClick={() => handleLanguageChange('mm')}>
                  <span className="lang-flag">🇲🇲</span> မြန်မာ
                </button>
                <div className="lang-divider" style={{height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0'}}></div>
                <button className={`lang-option ${language === 'auto' ? 'active' : ''}`} onClick={() => handleLanguageChange('auto')}>
                  <span className="lang-flag">🌍</span> Google Translate
                </button>
              </div>
            )}
          </div>
          
          {/* Always mount Google Translate so it can auto-translate if cookie is set */}
          <div id="google_translate_element" style={{ display: language === 'auto' ? 'block' : 'none', marginTop: '10px', position: 'absolute', right: 0, top: '40px' }}></div>
        </div>

      </div>
    </header>
  );
};
