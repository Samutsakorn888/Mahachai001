import React from 'react';
import type { Translations } from '../i18n/translations';

interface NavbarProps {
  t: Translations;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  t,
  activeSection,
  setActiveSection
}) => {



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

        {/* 3. Right: Language Switcher (Google Translate) */}
        <div className="lang-switcher">
          <div id="google_translate_element" className="translate-widget"></div>
        </div>

      </div>
    </header>
  );
};
