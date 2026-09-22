import React, { useState } from 'react';
import type { Language, Translations } from '../i18n/translations';
import buildingHeroBg from '../assets/building_hero_bg.jpg';
import type { CustomSiteData } from '../services/adminStore';

interface HeroProps {
  t: Translations;
  language?: Language;
  activeTab?: 'daily' | 'monthly';
  setActiveTab?: (tab: 'daily' | 'monthly') => void;
  onSelectRoomTab?: (tab: 'daily' | 'monthly') => void;
  siteData?: CustomSiteData;
  isAdmin?: boolean;
  onEditHero?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  t,
  language = 'th',
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onSelectRoomTab,
  siteData,
  isAdmin,
  onEditHero
}) => {
  const [internalTab, setInternalTab] = useState<'daily' | 'monthly'>('daily');
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : setInternalTab;

  const isCustomThaiTitle = siteData?.heroTitle &&
    siteData.heroTitle !== 'ยินดีต้อนรับสู่ แอทสมุทรสาคร  สาขามหาชัย' &&
    siteData.heroTitle !== 'ยินดีต้อนรับสู่ แอทสมุทรสาคร สาขามหาชัย';
  const isCustomThaiSubtitle = siteData?.heroSubtitle && siteData.heroSubtitle !== 'ที่พักสะอาด ปลอดภัย ใจกลางเมืองมหาชัย';

  const titleText = (language === 'th' && isCustomThaiTitle) ? siteData.heroTitle! : t.welcome;
  const subtitleText = (language === 'th' && isCustomThaiSubtitle) ? siteData.heroSubtitle! : t.subheading;

  const handleScrollToRooms = (tab: 'daily' | 'monthly') => {
    setActiveTab(tab);
    if (onSelectRoomTab) {
      onSelectRoomTab(tab);
    } else {
      const element = document.getElementById('rooms');
      if (element) {
        const offset = 70; // Navbar height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section id="home" className="hero-hotel-luxury">
      {/* Real Building Exterior Luxury Background */}
      <div
        className="hero-hotel-photo-bg"
        style={{ backgroundImage: `url(${buildingHeroBg})` }}
      ></div>

      {/* Vignette & Color Overlay */}
      <div className="hero-bg-overlay"></div>

      {/* Ambient Lighting Orbs */}
      <div className="ambient-orb orb-gold"></div>
      <div className="ambient-orb orb-cyan"></div>

      <div className="container hero-hotel-container">
        {/* Main Content Centered */}
        <div className="hero-hotel-content centered" style={{ position: 'relative' }}>

          {isAdmin && (
            <div className="admin-inline-trigger-container">
              <button className="admin-quick-edit-btn" onClick={onEditHero}>
                แก้ไข Hero (ข้อความต้อนรับ & สโลแกน)
              </button>
            </div>
          )}

          {/* Top Gold Badge */}
          <div className="hero-gold-badge">
            <span className="gold-sparkle"></span>
            <span>{t.heroBadge || '@Samutsakorn Mahachai • ที่พักสมุทรสาคร'}</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="hero-hotel-title">
            {language === 'th' && (titleText.includes('สาขามหาชัย') || titleText.includes('ยินดีต้อนรับสู่ แอทสมุทรสาคร')) ? (
              <>
                <span className="hero-title-top">
                  {titleText.includes('สาขามหาชัย') ? titleText.replace('สาขามหาชัย', '').trim() : 'ยินดีต้อนรับสู่ แอทสมุทรสาคร'}
                </span>
                <span className="hero-title-bottom">สาขามหาชัย</span>
              </>
            ) : titleText.includes('\n') ? (
              titleText.split('\n').map((line, idx) => (
                <span key={idx} style={{ display: 'block' }}>{line}</span>
              ))
            ) : (
              titleText
            )}
          </h1>
          <h2 className="hero-hotel-subtitle">{subtitleText}</h2>

          {/* Luxury Feature Pills Bar */}
          <div className="hero-pills-bar">
            <div className="hero-pill-item">
              <span className="pill-icon"></span>
              <span>{t.heroOpposite || 'ตรงข้าม Big C มหาชัย'}</span>
            </div>
            <div className="hero-pill-item">
              <span className="pill-icon"></span>
              <span>{t.heroSecurity || 'คีย์การ์ด & CCTV 24 ชม.'}</span>
            </div>
            <div className="hero-pill-item">
              <span className="pill-icon"></span>
              <span>{t.heroWifi || 'ฟรี Wi-Fi'}</span>
            </div>
          </div>

          {/* Hotel Booking & Action Card */}
          <div className="hero-booking-card">
            <div className="booking-card-header">
              <div
                className={`booking-tab ${activeTab === 'daily' ? 'active' : ''}`}
                onClick={() => setActiveTab('daily')}
              >
                🏨 {t.dailyTab}
              </div>
              <div
                className={`booking-tab ${activeTab === 'monthly' ? 'active' : ''}`}
                onClick={() => setActiveTab('monthly')}
              >
                {t.monthlyTab}
              </div>
            </div>

            <div className="booking-card-body">
              {activeTab === 'daily' ? (
                <>
                  <div className="booking-info-item">
                    <span className="info-label">{t.heroLocationLabel || 'ทำเลที่ตั้ง (Location)'}</span>
                    <span className="info-val">{t.heroLocationVal || 'ใจกลางมหาชัย (ตรงข้าม Big C)'}</span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">🕒 {t.heroCheckInOutLabel || 'เวลาเช็คอิน / เช็คเอ้าท์'}</span>
                    <span className="info-val">{t.heroCheckInOutVal || 'เช็คอิน 14:00 | เช็คเอ้าท์ 12:00'}</span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">{t.heroDepositLabel || 'เงินมัดจำประกันห้อง'}</span>
                    <span className="info-val" style={{ color: '#2b6cb0' }}>{t.heroDepositVal || '500 บาท/ห้อง (คืนเต็มจำนวน)'}</span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">{t.heroContactBooking || 'ติดต่อจองห้องพัก'}</span>
                    <span className="info-val phone">{siteData?.phoneVal || '099-095-4541'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="booking-info-item">
                    <span className="info-label">{t.heroLocationLabel || 'ทำเลที่ตั้ง (Location)'}</span>
                    <span className="info-val">{t.heroLocationVal || 'ใจกลางมหาชัย (ตรงข้าม Big C)'}</span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">📄 {language === 'en' ? 'Lease Terms' : language === 'cn' ? '租赁条款' : language === 'mm' ? 'စာချုပ်စည်းကမ်းချက်' : 'เงื่อนไขสัญญาเช่า'}</span>
                    <span className="info-val">{t.heroContractTerm || 'สัญญาระยะยาว 1 ปีขึ้นไป'}</span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">{language === 'en' ? 'Short-term Note' : language === 'cn' ? '短租备注' : language === 'mm' ? 'ကာလတိုမှတ်ချက်' : 'หมายเหตุสัญญาสั้น'}</span>
                    <span className="info-val" style={{ color: '#c53030' }}>{t.heroShortTermNote || 'สั้นกว่า 1 ปี +1,000 บ./เดือน'}</span>
                  </div>
                  <div className="booking-info-item">
                    <span className="info-label">{t.heroContactBooking || 'ติดต่อจองห้องพัก'}</span>
                    <span className="info-val phone">{siteData?.phoneVal || '099-095-4541'}</span>
                  </div>
                </>
              )}

              {/* Status active badge indicator */}
              <div style={{
                gridColumn: '1 / -1',
                fontSize: '0.82rem',
                color: activeTab === 'daily' ? '#2b6cb0' : '#805ad5',
                backgroundColor: activeTab === 'daily' ? '#ebf8ff' : '#faf5ff',
                padding: '8px 14px',
                borderRadius: '8px',
                border: activeTab === 'daily' ? '1px solid #bee3f8' : '1px solid #e9d8fd',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✓</span>
                <span>
                  {activeTab === 'daily'
                    ? (t.heroStatusDaily || 'สลับข้อมูลเป็น: ห้องพักรายวัน (เช็คอิน 14:00 | เช็คเอ้าท์ 12:00 | มัดจำ 500 บาท)')
                    : (t.heroStatusMonthly || 'สลับข้อมูลเป็น: ห้องพักรายเดือน (สัญญา 1 ปีขึ้นไป | สัญญาสั้นกว่า 1 ปี +1,000 บ./เดือน)')}
                </span>
              </div>

              <div className="booking-actions">
                <button className="btn-hotel-primary" onClick={() => handleScrollToRooms(activeTab)}>
                  {activeTab === 'daily' ? (t.heroSelectDaily || '🏨 เลือกดูห้องพักรายวัน') : (t.heroSelectMonthly || 'เลือกดูห้องพักรายเดือน')}
                </button>
                <a href="tel:0990954541" className="btn-hotel-secondary">
                  {t.heroCallQuick || 'โทรจองด่วน'}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Elegant Bottom Wave Transition */}
      <div className="hero-bottom-transition">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0,32 C320,80 640,0 960,48 C1280,96 1360,32 1440,48 L1440,80 L0,80 Z" fill="var(--bg-color)" />
        </svg>
      </div>
    </section>
  );
};
