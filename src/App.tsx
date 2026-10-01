import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoomTypes } from './components/RoomTypes';
import { Facilities } from './components/Facilities';
import { NearbyPlaces } from './components/NearbyPlaces';
import { Rules } from './components/Rules';
import { Faq } from './components/Faq';
import { FloatingActions } from './components/FloatingActions';
import { LineModal } from './components/LineModal';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminBar } from './components/admin/AdminBar';
import { AdminEditModal } from './components/admin/AdminEditModal';
import { loadSiteData, saveSiteData, resetSiteData, type CustomSiteData } from './services/adminStore';
import { type Language, translations } from './i18n/translations';
import { supabase } from './services/supabaseClient';

function App() {
  const [language, setLanguage] = useState<Language>('th');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isLineModalOpen, setIsLineModalOpen] = useState<boolean>(false);
  const [adminMode, setAdminMode] = useState<'none' | 'login' | 'dashboard'>('none');
  const [roomTab, setRoomTab] = useState<'daily' | 'monthly'>('daily');

  // Dynamic admin site data state
  const [siteData, setSiteData] = useState<CustomSiteData>(() => loadSiteData());

  // Quick edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editModalSection, setEditModalSection] = useState<'hero' | 'rooms' | 'rules' | 'settings' | 'logs'>('hero');
  const [targetRoomIndex, setTargetRoomIndex] = useState<number | null>(null);
  const [targetRoomType, setTargetRoomType] = useState<'daily' | 'monthly'>('daily');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const isAdmin = adminMode === 'dashboard';

  // Active translation dictionary
  const t = translations[language];

  // Set page HTML lang attribute and document title dynamically
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${t.brand} | ${t.subheading}`;
  }, [language, t]);

  // Attempt to redirect out of in-app browsers (LINE/Messenger)
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isLine = /Line/i.test(ua);
    const isMessenger = /FBAV|FBAN|Messenger/i.test(ua);
    const isAndroid = /android/i.test(ua);
    
    // For LINE app, we can use openExternalBrowser=1
    if (isLine && !window.location.search.includes('openExternalBrowser=1')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.append('openExternalBrowser', '1');
      window.location.href = newUrl.toString();
    }
    
    // For Facebook Messenger on Android, we can force open Chrome using intent
    if (isMessenger && isAndroid && !window.location.search.includes('intent_redirect=1')) {
      // Add a parameter so we don't infinitely loop if it fails
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.append('intent_redirect', '1');
      
      const urlWithoutScheme = currentUrl.toString().replace(/^https?:\/\//, '');
      const intentUrl = `intent://${urlWithoutScheme}#Intent;scheme=https;package=com.android.chrome;end;`;
      window.location.href = intentUrl;
    }
  }, []);

  // Sync rooms from Supabase into siteData to keep AdminEditModal updated
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase.from('rooms').select('*');
        if (error) throw error;
        if (data) {
          const parseArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' ? (val.startsWith('[') ? JSON.parse(val) : val.split(',')) : []);
          const parseImageUrl = (val: any) => {
            if (typeof val === 'string' && val.startsWith('{')) {
              try {
                const parsed = JSON.parse(val);
                return { image: parsed.main || '', images: parsed.gallery || [], isNewFormat: true };
              } catch(e) {}
            }
            return { image: val || '', images: [], isNewFormat: false };
          };

          setSiteData(prev => {
            const daily = data.filter(r => r.room_type === 'daily').map(r => {
              const existingLocal = prev.dailyRooms?.find((dr: any) => dr.key === r.id);
              const imgData = parseImageUrl(r.image_url);
              return {
                key: r.id,
                name: r.name,
                desc: r.description,
                price: r.price,
                deposit: r.deposit,
                totalRooms: r.total_rooms || 0,
                occupiedRooms: r.occupied_rooms || 0,
                features: parseArray(r.features),
                image: imgData.image,
                images: imgData.isNewFormat ? imgData.images : (existingLocal?.images || [])
              };
            }).sort((a, b) => parseInt((a.price || '0').toString().replace(/,/g, '')) - parseInt((b.price || '0').toString().replace(/,/g, '')));
            
            const monthly = data.filter(r => r.room_type === 'monthly').map(r => {
              const existingLocal = prev.monthlyRooms?.find((mr: any) => mr.id === r.id);
              const imgData = parseImageUrl(r.image_url);
              return {
                id: r.id,
                name: r.name,
                desc: r.description,
                price: r.price,
                deposit: r.deposit,
                availableRoomsList: parseArray(r.available_room_numbers),
                features: parseArray(r.features),
                image: imgData.image,
                images: imgData.isNewFormat ? imgData.images : (existingLocal?.images || [])
              };
            }).sort((a, b) => parseInt((a.price || '0').toString().replace(/,/g, '')) - parseInt((b.price || '0').toString().replace(/,/g, '')));

            const newData = { ...prev, dailyRooms: daily, monthlyRooms: monthly };
            // Save merged data back to localStorage to persist images reliably
            try { localStorage.setItem('ATS_ADMIN_SITE_DATA', JSON.stringify(newData)); } catch(e){}
            return newData;
          });
        }
      } catch (err) {
        console.error('Error fetching rooms for admin sync:', err);
      }
    };
    fetchRooms();
  }, [refreshTrigger]);

  // Track active section on scroll using Intersection Observer
  useEffect(() => {
    const sections = ['home', 'rooms', 'facilities', 'nearby', 'rules', 'faq'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-40% 0px -40% 0px'
        }
      );
      
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(obs => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  // Listen for #admin hash in URL
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setAdminMode('login');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenLineModal = () => {
    setIsLineModalOpen(true);
  };

  const handleCloseLineModal = () => {
    setIsLineModalOpen(false);
  };

  const handleOpenEditSection = (section: 'hero' | 'rooms' | 'rules' | 'settings' | 'logs', roomIdx: number | null = null, roomType: 'daily' | 'monthly' = 'daily') => {
    setEditModalSection(section);
    setTargetRoomIndex(roomIdx);
    setTargetRoomType(roomType);
    setIsEditModalOpen(true);
  };

  const handleSaveSiteData = (newData: CustomSiteData, message?: string) => {
    saveSiteData(newData);
    setSiteData(newData);
    setRefreshTrigger(prev => prev + 1); // Refetch from DB to sync UI if DB changed
    showToast(message || 'บันทึกข้อมูลเรียบร้อยแล้ว!');
  };

  const handleResetData = () => {
    const reset = resetSiteData();
    setSiteData(reset);
    showToast('รีเซ็ตข้อมูลเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
  };

  if (adminMode === 'login') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setAdminMode('dashboard');
          showToast('เข้าสู่ระบบผู้ดูแลระบบสำเร็จแล้ว');
        }}
        onClose={() => {
          setAdminMode('none');
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
      />
    );
  }

  const handleSelectRoomTab = (tab: 'daily' | 'monthly') => {
    setRoomTab(tab);
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
  };

  return (
    <>
      {/* Top Admin Sticky Toolbar when in admin mode */}
      {isAdmin && (
        <AdminBar
          onEditSection={handleOpenEditSection}
          onResetData={handleResetData}
          onLogout={() => {
            setAdminMode('none');
            showToast('ออกจากระบบผู้ดูแลระบบแล้ว');
            if (window.location.hash === '#admin') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      <Navbar
        language={language}
        setLanguage={setLanguage}
        t={t}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <main>
        <Hero
          t={t}
          language={language}
          activeTab={roomTab}
          setActiveTab={setRoomTab}
          onSelectRoomTab={handleSelectRoomTab}
          siteData={siteData}
          isAdmin={isAdmin}
          onEditHero={() => handleOpenEditSection('hero')}
        />
        
        <RoomTypes
          t={t}
          language={language}
          activeTab={roomTab}
          setActiveTab={setRoomTab}
          isAdmin={isAdmin}
          onEditRoom={(index, tabType) => handleOpenEditSection('rooms', index, tabType)}
          onAddNewRoom={() => handleOpenEditSection('rooms')}
          refreshTrigger={refreshTrigger}
          onRefreshData={() => setRefreshTrigger(prev => prev + 1)}
        />

        <Facilities t={t} />

        <NearbyPlaces t={t} />

        <Rules
          t={t}
          language={language}
          siteData={siteData}
          isAdmin={isAdmin}
          onEditRules={() => handleOpenEditSection('rules')}
        />

        <Faq t={t} />
      </main>

      <Footer
        t={t}
        language={language}
        onAdminClick={() => setAdminMode('login')}
        siteData={siteData}
        isAdmin={isAdmin}
        onEditSettings={() => handleOpenEditSection('settings')}
      />

      <FloatingActions onLineClick={handleOpenLineModal} />


      <LineModal
        isOpen={isLineModalOpen}
        onClose={handleCloseLineModal}
        t={t}
      />

      {/* Quick Edit Popup Modal for Admin */}
      <AdminEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        activeSection={editModalSection}
        siteData={siteData}
        onSaveSiteData={handleSaveSiteData}
        targetRoomIndex={targetRoomIndex}
        targetRoomType={targetRoomType}
      />
    </>
  );
}

export default App;
