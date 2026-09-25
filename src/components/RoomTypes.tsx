import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../services/supabaseClient';
import html2canvas from 'html2canvas';
import type { Language, Translations } from '../i18n/translations';

import { LeaseModal } from './LeaseModal';
import { RoomComparisonModal } from './RoomComparisonModal';
import { PromptPayModal } from './PromptPayModal';
import { UtilityCalculator } from './UtilityCalculator';

import type { CustomSiteData } from '../services/adminStore';

interface RoomTypesProps {
  t: Translations;
  language?: Language;
  activeTab?: 'daily' | 'monthly';
  setActiveTab?: (tab: 'daily' | 'monthly') => void;
  siteData?: CustomSiteData;
  isAdmin?: boolean;
  onEditRoom?: (index: number, tabType: 'daily' | 'monthly') => void;
  onAddNewRoom?: () => void;
  refreshTrigger?: number;
  onRefreshData?: () => void;
}

export const RoomTypes: React.FC<RoomTypesProps> = ({
  t,
  language = 'th',
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  isAdmin,
  onEditRoom,
  onAddNewRoom,
  refreshTrigger = 0,
  onRefreshData
}) => {
  const [internalTab, setInternalTab] = useState<'daily' | 'monthly'>('daily');
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : setInternalTab;
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [selectedDetailsRoom, setSelectedDetailsRoom] = useState<any | null>(null);
  const [selectedBookingRoom, setSelectedBookingRoom] = useState<any | null>(null);
  const [selectedBookingItems, setSelectedBookingItems] = useState<Array<{ roomData: any; count: number; duration?: number }>>([]);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isPromptPayModalOpen, setIsPromptPayModalOpen] = useState(false);
  const [bookingNights, setBookingNights] = useState<number | ''>(1);
  const [bookingMonths, setBookingMonths] = useState<number | ''>(1);
  const [payDepositNow, setPayDepositNow] = useState<boolean>(false);
  const [checkInDate, setCheckInDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const [dbDailyRooms, setDbDailyRooms] = useState<any[]>([]);
  const [dbMonthlyRooms, setDbMonthlyRooms] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // Prevent background scrolling on mobile when modals are open
  useEffect(() => {
    const isAnyModalOpen = selectedDetailsRoom || selectedBookingRoom || isLeaseModalOpen || isComparisonModalOpen || isPromptPayModalOpen || expandedImage;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDetailsRoom, selectedBookingRoom, isLeaseModalOpen, isComparisonModalOpen, isPromptPayModalOpen, expandedImage]);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const { data, error } = await supabase.from('rooms').select('*');
        if (error) throw error;
        if (data) {
          const parseArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' ? (val.startsWith('[') ? JSON.parse(val) : val.split(',')) : []);

          const daily = data.filter(r => r.room_type === 'daily').map(r => {
            const features = parseArray(r.features);
            const translated = getLocalizedDailyRoomInfo({ name: r.name, desc: r.description, features: features });
            return {
              key: r.id,
              data: {
                name: translated.name,
                desc: translated.desc,
                price: r.price,
                deposit: r.deposit,
                totalRooms: r.total_rooms || 0,
                occupiedRooms: r.occupied_rooms || 0,
                availableRooms: Math.max(0, (r.total_rooms || 0) - (r.occupied_rooms || 0)),
                features: translated.features
              },
              image: r.image_url
            };
          }).sort((a, b) => parseInt((a.data.price || '0').toString().replace(/,/g, '')) - parseInt((b.data.price || '0').toString().replace(/,/g, '')));
          
          const monthly = data.filter(r => r.room_type === 'monthly').map(r => {
            // Find index match for translations if needed, but for simplicity use db data
            let trans = null;
            if (language !== 'th') {
              const matchedIdx = t.monthlyRooms.findIndex(tr => tr.name === r.name);
              if (matchedIdx >= 0) trans = t.monthlyRooms[matchedIdx];
            }
            const features = parseArray(r.features);
            return {
              id: r.id,
              name: trans ? trans.name : r.name,
              desc: trans ? trans.desc : r.description,
              price: r.price,
              deposit: r.deposit,
              availableRoomsList: parseArray(r.available_room_numbers),
              features: trans ? trans.features : features,
              image: r.image_url
            };
          }).sort((a, b) => parseInt((a.price || '0').toString().replace(/,/g, '')) - parseInt((b.price || '0').toString().replace(/,/g, '')));

          setDbDailyRooms(daily);
          setDbMonthlyRooms(monthly);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setIsLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [language, t, refreshTrigger]);

  const handleToggleAvailability = async (room: any, type: 'daily' | 'monthly') => {
    if (!isAdmin) return;
    try {
      if (type === 'daily') {
        const isCurrentlyAvailable = room.data.availableRooms > 0;
        // If available, set occupied = total (so available = 0). If not available, set occupied = 0 (so available = total)
        const newOccupied = isCurrentlyAvailable ? room.data.totalRooms : 0;
        const { error } = await supabase.from('rooms').update({ occupied_rooms: newOccupied }).eq('id', room.key);
        if (error) throw error;
      } else {
        const hasAvailable = room.availableRoomsList && room.availableRoomsList.length > 0;
        // If available, clear list. If not available, set a generic room number '1'
        const newList = hasAvailable ? [] : ['1'];
        const { error } = await supabase.from('rooms').update({ available_room_numbers: newList }).eq('id', room.id);
        if (error) throw error;
      }
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Error toggling room availability:', err);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะห้องพัก');
    }
  };

  const handleOpenBooking = (room: any) => {
    const roomData = room.data || room;
    const isMonthly = room.isMonthly || (roomData?.name && (roomData.name.includes('เดือน') || roomData.name.includes('Monthly'))) || activeTab === 'monthly';
    const initialDuration = isMonthly ? 12 : 1;
    setSelectedBookingRoom({ ...room, isMonthly });
    setSelectedBookingItems([{ roomData, count: 1, duration: initialDuration }]);
    setBookingNights(1);
    setBookingMonths(initialDuration);
  };

  const handleAddRoomType = (roomData: any) => {
    const currentDur = selectedBookingRoom?.isMonthly ? ((bookingMonths as number) || 1) : ((bookingNights as number) || 1);
    setSelectedBookingItems(prev => {
      const existingIndex = prev.findIndex(item => item.roomData?.name === roomData?.name);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].count += 1;
        return updated;
      }
      return [...prev, { roomData, count: 1, duration: currentDur }];
    });
  };

  const handleUpdateRoomCount = (index: number, newCount: number) => {
    if (newCount <= 0) {
      if (selectedBookingItems.length > 1) {
        handleRemoveRoomItem(index);
      }
      return;
    }
    setSelectedBookingItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], count: newCount };
      return updated;
    });
  };

  const handleUpdateItemDuration = (index: number, newDuration: number) => {
    if (newDuration < 1) return;
    setSelectedBookingItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], duration: newDuration };
      return updated;
    });
  };

  const handleSetGlobalNights = (val: number | '') => {
    setBookingNights(val);
    if (typeof val === 'number' && val >= 1) {
      setSelectedBookingItems(prev => prev.map(item => ({ ...item, duration: val })));
    }
  };

  const handleSetGlobalMonths = (val: number | '') => {
    setBookingMonths(val);
    if (typeof val === 'number' && val >= 1) {
      setSelectedBookingItems(prev => prev.map(item => ({ ...item, duration: val })));
    }
  };

  const handleRemoveRoomItem = (index: number) => {
    if (selectedBookingItems.length <= 1) return;
    setSelectedBookingItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const formatThaiDate = (dateStr: string) => {
    if (!dateStr) return 'ยังไม่ระบุ';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return dateStr;
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const calculateCheckOutDate = (checkInStr: string, duration: number, isMonthly: boolean) => {
    if (!checkInStr) return null;
    try {
      const [y, m, d] = checkInStr.split('-').map(Number);
      if (!y || !m || !d || isNaN(y) || isNaN(m) || isNaN(d)) return null;
      const date = new Date(y, m - 1, d);
      if (isMonthly) {
        date.setMonth(date.getMonth() + (duration || 1));
      } else {
        date.setDate(date.getDate() + (duration || 1));
      }
      return date;
    } catch {
      return null;
    }
  };

  const formatThaiDateObj = (date: Date | null) => {
    if (!date) return 'ยังไม่ระบุ';
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToast(label);
      setTimeout(() => setCopiedToast(null), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!summaryRef.current) return;
    
    // Temporarily show the print header
    const printHeader = summaryRef.current.querySelector('.print-only') as HTMLElement;
    if (printHeader) printHeader.style.display = 'block';
    
    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const image = canvas.toDataURL(`image/${format}`, 1.0);
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        setExpandedImage(image);
        alert('ระบบได้สร้างรูปภาพแล้ว\nกรุณา "แตะค้างที่รูปภาพ" เพื่อบันทึกลงเครื่องครับ');
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = `booking-summary.${format === 'jpeg' ? 'jpg' : 'png'}`;
        link.click();
      }
    } catch (err) {
      console.error('Error generating image:', err);
      alert('เกิดข้อผิดพลาดในการสร้างรูปภาพ');
    } finally {
      if (printHeader) printHeader.style.display = 'none';
    }
  };



  const getLocalizedDailyRoomInfo = (r: any) => {
    if (language === 'th') {
      return { name: r.name, desc: r.desc, features: r.features || [] };
    }
    const key = (r.key || '').toLowerCase();
    const name = (r.name || '').toLowerCase();
    if (key === 'fanfuton' || name.includes('พัดลม') || name.includes('fan') || name.includes('futon')) {
      return {
        name: t.fanFutonRoom?.name || r.name,
        desc: t.fanFutonRoom?.desc || r.desc,
        features: t.fanFutonRoom?.features || r.features || []
      };
    }
    if (key === 'single' || name.includes('เดี่ยว') || name.includes('single')) {
      return {
        name: t.singleRoom.name,
        desc: t.singleRoom.desc,
        features: t.singleRoom.features
      };
    }
    if (key === 'twin' || name.includes('คู่') || name.includes('twin')) {
      return {
        name: t.twinRoom.name,
        desc: t.twinRoom.desc,
        features: t.twinRoom.features
      };
    }
    if (key === 'extra' || name.includes('เสริม') || name.includes('extra')) {
      return {
        name: t.extraRoom.name,
        desc: t.extraRoom.desc,
        features: t.extraRoom.features
      };
    }
    if (key === 'suite' || name.includes('สูท') || name.includes('suite')) {
      return {
        name: t.suiteRoom?.name || r.name,
        desc: t.suiteRoom?.desc || r.desc,
        features: t.suiteRoom?.features || r.features || []
      };
    }
    return { name: r.name, desc: r.desc, features: r.features || [] };
  };

  const dailyRooms = dbDailyRooms;

  const totalDailyRoomsCount = dailyRooms.reduce((acc, r) => acc + (r.data.totalRooms || 0), 0);
  const totalDailyOccupiedCount = dailyRooms.reduce((acc, r) => acc + (r.data.occupiedRooms || 0), 0);
  const totalDailyAvailableCount = dailyRooms.reduce((acc, r) => acc + (r.data.availableRooms || 0), 0);

  const monthlyRoomsData = dbMonthlyRooms;

  const totalMonthlyAvailableCount = monthlyRoomsData.reduce((acc, r) => acc + (r.availableRoomsList?.length || 0), 0);

  const utilityFees = [
    { label: t.electricityLabel, val: t.electricityVal, icon: '' },
    { label: t.waterLabel, val: t.waterVal, icon: '' },
    { label: t.maintenanceLabel, val: t.maintenanceVal, icon: '' },
    { label: t.keycardFeeLabel || 'ค่าซื้อคีย์การ์ดเข้าอาคาร', val: t.keycardFeeVal || '100 บาท / ใบ', icon: '' },
    { label: t.carParkingLabel, val: t.carParkingVal, icon: '' },
    { label: t.motoParkingLabel, val: t.motoParkingVal, icon: '' },
    { label: t.keyUnlockFeeLabel || (t as any).keyUnlockLabel || 'ค่าบริการเปิดห้อง (กรณีลืมกุญแจ)', val: t.keyUnlockFeeVal || (t as any).keyUnlockVal || '300 บาท / ครั้ง', icon: '' }
  ];

  return (
    <section id="rooms" className="section" style={{ backgroundColor: 'var(--bg-color)', position: 'relative' }}>
      <div className="container">
        {isAdmin && (
          <div className="admin-inline-trigger-container" style={{ marginBottom: '16px' }}>
            <button
              className="admin-quick-edit-btn"
              onClick={() => onAddNewRoom ? onAddNewRoom() : (onEditRoom && onEditRoom(0, activeTab))}
            >
              จัดการประเภทห้องพัก & เพิ่มห้องใหม่
            </button>
          </div>
        )}

        <h2 className="section-title">{t.roomSectionTitle}</h2>
        <p className="section-subtitle">{t.roomSectionSubtitle}</p>

        {/* Tab Switcher Selector */}
        <div className="room-tabs-container">
          <button
            className={`room-tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            {t.dailyTab}
          </button>
          <button
            className={`room-tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            {t.monthlyTab}
          </button>
        </div>

        {/* Quick Actions Bar */}
        <div className="room-quick-actions">
          {activeTab === 'monthly' && (
            <button
              className="btn btn-quick-action"
              onClick={() => setIsComparisonModalOpen(true)}
            >
              {t.compareRoomsBtn || 'ตารางเปรียบเทียบห้องพักรายเดือน'}
            </button>
          )}
          <button
            className="btn btn-quick-action"
            onClick={() => setIsPromptPayModalOpen(true)}
          >
            {t.promptPayBtn || 'สแกน PromptPay / บัญชีโอนเงิน'}
          </button>
        </div>

        {/* Daily Rooms Tab View */}
        {activeTab === 'daily' && (
          <div className="animate-fade">
            {isLoadingRooms ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3182ce', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '16px', color: '#4a5568' }}>กำลังโหลดข้อมูลห้องพัก...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                {/* Daily Rooms Availability Overview Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #004088 0%, #1e56a0 100%)',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(0, 64, 136, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}></span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#ffffff' }}>
                    {(t.dailyRoomsOverviewTitle || 'สถานะห้องพักรายวัน (รวมทั้งหมด {total} ห้อง)').replace('{total}', String(totalDailyRoomsCount))}
                  </h4>
                  <span style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                    {t.dailyRoomsOverviewSub || 'เช็คความพร้อม จำนวนห้องทั้งหมด เต็มแล้วกี่ห้อง และเหลือว่างกี่ห้อง'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.18)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 'bold' }}>
                  {t.totalRoomsLabel || 'ทั้งหมด:'} <strong>{totalDailyRoomsCount}</strong> {t.roomsUnit || 'ห้อง'}
                </div>
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.3)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 'bold' }}>
                  {t.occupiedRoomsLabel || 'เต็มแล้ว:'} <strong>{totalDailyOccupiedCount}</strong> {t.roomsUnit || 'ห้อง'}
                </div>
                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 'bold' }}>
                  {t.availableRoomsLabel || 'เหลือว่าง:'} <strong>{totalDailyAvailableCount}</strong> {t.roomsUnit || 'ห้อง'}
                </div>
              </div>
            </div>

            <div className="rooms-grid">
              {dailyRooms.map((room, roomIdx) => (
                <div key={room.key} className="room-card" style={{ position: 'relative' }}>
                  {isAdmin && onEditRoom && (
                    <div style={{ padding: '8px 12px 0 12px' }}>
                      <button
                        className="admin-quick-edit-btn"
                        style={{ width: '100%', fontSize: '0.8rem', padding: '4px 10px' }}
                        onClick={() => onEditRoom(roomIdx, 'daily')}
                      >
                        แก้ไขข้อมูล/ราคาห้องนี้
                      </button>
                    </div>
                  )}
                  {room.image ? (
                    <div className="room-image-wrapper">
                      <img
                        src={room.image}
                        alt={room.data.name}
                        className="room-image"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="room-image-wrapper placeholder-image-box" style={{
                      backgroundColor: '#ebf8ff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '210px',
                      color: '#004088',
                      borderBottom: '1px solid #e2e8f0',
                      padding: '20px'
                    }}>
                      <span style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🌀</span>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{room.data.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '4px' }}>{room.data.desc}</span>
                    </div>
                  )}
                  <div className="room-info">
                    <h3 className="room-card-title">{room.data.name}</h3>
                    <p className="room-card-desc">{room.data.desc}</p>
                    
                    <div className="room-features">
                      {(room.data.features || []).map((feature: string, idx: number) => (
                        <span key={idx} className="room-feature-badge">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="room-price-row">
                      <div className="room-price-val">
                        ฿{room.data.price}
                      </div>
                      <div className="room-price-label">
                        / {t.pricePerNight}
                      </div>
                    </div>

                    {/* Room Status Box */}
                    <div 
                      onClick={() => handleToggleAvailability(room, 'daily')}
                      style={{
                        margin: '14px 0 6px 0',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: (room.data.availableRooms > 0) ? '#f0fff4' : '#fff5f5',
                        border: (room.data.availableRooms > 0) ? '1.5px solid #bbf7d0' : '1.5px solid #fecaca',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        cursor: isAdmin ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        boxShadow: isAdmin ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                      }}
                      title={isAdmin ? 'คลิกเพื่อเปลี่ยนสถานะห้องว่าง/เต็ม' : ''}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                        <span style={{
                          fontWeight: 900,
                          fontSize: '1rem',
                          color: room.data.availableRooms > 0 ? '#15803d' : '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {room.data.availableRooms > 0 ? (language === 'en' ? 'Available' : language === 'cn' ? '可入住' : language === 'mm' ? 'လစ်လပ်' : 'สถานะ: ว่าง') : (language === 'en' ? 'Full (Occupied)' : language === 'cn' ? '已满 (Occupied)' : language === 'mm' ? 'ပြည့်ပြီး' : 'สถานะ: เต็มแล้ว')}
                        </span>
                        {room.data.availableRooms > 0 && (
                          <span style={{
                            fontSize: '1.25rem',
                            fontWeight: 900,
                            color: '#166534',
                            backgroundColor: '#dcfce7',
                            padding: '4px 14px',
                            borderRadius: '20px',
                            border: '2px solid #bbf7d0',
                            boxShadow: '0 2px 4px rgba(22, 101, 52, 0.15)'
                          }}>
                            {language === 'en' ? `${room.data.availableRooms} Left` : language === 'cn' ? `剩余 ${room.data.availableRooms} 间` : language === 'mm' ? `${room.data.availableRooms} ခန်း လစ်လပ်` : `ว่าง ${room.data.availableRooms} ห้อง!`}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                        <span>{t.totalRoomsLabel || 'ทั้งหมด:'} <strong>{room.data.totalRooms}</strong> {t.roomsUnit || 'ห้อง'}</span>
                        <span>{t.occupiedRoomsLabel || 'เต็มแล้ว:'} <strong>{room.data.occupiedRooms}</strong> {t.roomsUnit || 'ห้อง'}</span>
                        <span>{t.availableRoomsLabel || 'เหลือว่าง:'} <strong>{room.data.availableRooms}</strong> {t.roomsUnit || 'ห้อง'}</span>
                      </div>
                    </div>

                    <div className="room-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => setSelectedDetailsRoom(room)}
                      >
                        {t.viewDetails}
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOpenBooking(room)}
                        disabled={room.data.availableRooms <= 0}
                        style={{
                          opacity: room.data.availableRooms <= 0 ? 0.6 : 1,
                          cursor: room.data.availableRooms <= 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {room.data.availableRooms > 0 ? `${t.bookNow}` : (language === 'en' ? 'Full' : language === 'cn' ? '已满' : language === 'mm' ? 'ပြည့်ပြီး' : 'เต็มแล้ว')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Check-in & Check-out Section - ONLY for Daily Rooms */}
            <div style={{ marginTop: '56px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', textAlign: 'center', marginBottom: '8px' }}>
                {t.checkInTitle.split('(')[0]} & {t.checkOutTitle.split('(')[0]} (สำหรับห้องพักรายวัน)
              </h3>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
                ขั้นตอนการเข้าพัก การชำระเงิน และการคืนห้องพักสำหรับผู้เข้าพักรายวัน
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {/* Check-in Card */}
                <div style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--border-radius-lg)',
                  border: '2px solid #3182ce',
                  padding: '28px',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#2b6cb0' }}>
                      <span style={{ fontSize: '1.8rem' }}></span>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{t.checkInTitle}</h4>
                    </div>

                    {/* Bank Account Details Box */}
                    <div style={{
                      backgroundColor: '#ebf8ff',
                      border: '1px solid #bee3f8',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#2c5282', fontSize: '0.95rem', marginBottom: '4px' }}>
                        {t.bankAccountTitle}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#c53030' }}>
                        {t.bankNameVal}: {t.bankAccountVal}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#4a5568', marginTop: '2px' }}>
                        {t.bankAccountName}
                      </div>
                      <button
                        className="btn btn-outline"
                        style={{ marginTop: '10px', padding: '6px 14px', fontSize: '0.85rem', borderColor: '#3182ce', color: '#3182ce' }}
                        onClick={() => handleCopyText(t.bankAccountVal, 'เลขบัญชี')}
                      >
                        คัดลอกเลขบัญชี ({t.bankAccountVal})
                      </button>
                    </div>

                    {/* Steps list */}
                    <ol style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(t.checkInSteps || []).map((step: string, idx: number) => (
                        <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ebf8ff', color: '#2b6cb0', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Wi-Fi Info Box */}
                  <div style={{
                    backgroundColor: '#f7fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>{t.wifiTitle}:</span> <code style={{ backgroundColor: '#edf2f7', padding: '2px 8px', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', color: '#2d3748' }}>{t.wifiPass}</code>
                    </div>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => handleCopyText(t.wifiPass, 'รหัส Wi-Fi')}
                    >
                      คัดลอกรหัส Wi-Fi
                    </button>
                  </div>
                </div>

                {/* Check-out Card */}
                <div style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--border-radius-lg)',
                  border: '2px solid #38a169',
                  padding: '28px',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#276749' }}>
                      <span style={{ fontSize: '1.8rem' }}></span>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{t.checkOutTitle}</h4>
                    </div>

                    <ol style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                      {(t.checkOutSteps || []).map((step: string, idx: number) => (
                        <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f0fff4', color: '#276749', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div style={{
                    backgroundColor: '#f0fff4',
                    border: '1px solid #c6f6d5',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '24px',
                    textAlign: 'center',
                    color: '#22543d',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    ขอบคุณที่เข้าพักกับ <strong>@samutsakorn mahachai</strong>
                  </div>
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {/* Monthly Rooms Tab View */}
        {activeTab === 'monthly' && (
          <div className="animate-fade">
            {isLoadingRooms ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3182ce', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '16px', color: '#4a5568' }}>กำลังโหลดข้อมูลห้องพัก...</p>
              </div>
            ) : (
              <>
                {/* Monthly Rooms Availability Overview Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #2b6cb0 0%, #1a365d 100%)',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(43, 108, 176, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}></span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#ffffff' }}>
                    {t.monthlyOverviewTitle || `สถานะห้องพักรายเดือน (${monthlyRoomsData.length} รูปแบบห้องพัก)`}
                  </h4>
                  <span style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                    {t.monthlyOverviewSub || 'เช็คเลขห้องที่ว่างพร้อมเข้าอยู่ได้ทันที อัตราค่าเช่า และเงินมัดจำแรกเข้า'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.18)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 'bold' }}>
                  {language === 'en' ? 'Room Types:' : language === 'cn' ? '房型种类:' : language === 'mm' ? 'အခန်းပုံစံ:' : 'รูปแบบห้อง:'} <strong>{monthlyRoomsData.length}</strong> {language === 'en' ? 'types' : language === 'cn' ? '种' : language === 'mm' ? 'မျိုး' : 'แบบ'}
                </div>
                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 'bold' }}>
                  {(t.monthlyAvailableBadge || 'มีห้องว่างทั้งหมด {count} ห้อง').replace('{count}', String(totalMonthlyAvailableCount))}
                </div>
              </div>
            </div>

            <div className="rooms-grid">
              {monthlyRoomsData.map((room, idx) => {
                const hasAvailable = room.availableRoomsList && room.availableRoomsList.length > 0;
                return (
                  <div key={idx} className="room-card">
                    {room.image ? (
                      <div className="room-image-wrapper">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="room-image"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="room-image-wrapper placeholder-image-box" style={{
                        backgroundColor: '#f7fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '210px',
                        color: '#4a5568',
                        borderBottom: '1px solid #e2e8f0',
                        padding: '20px'
                      }}>
                        <span style={{ fontSize: '3.5rem', marginBottom: '8px' }}></span>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{room.name}</span>
                        <span style={{ fontSize: '0.8rem', color: '#718096', marginTop: '4px' }}>{room.desc}</span>
                      </div>
                    )}
                    <div className="room-info">
                      <h3 className="room-card-title">{room.name}</h3>
                      <p className="room-card-desc">{room.desc}</p>
                      
                      <div className="room-features">
                        {(room.features || []).map((feature: string, fIdx: number) => (
                          <span key={fIdx} className="room-feature-badge">
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="room-price-row">
                        <div className="room-price-val">
                          ฿{room.price}
                        </div>
                        <div className="room-price-label">
                          / {t.perMonth}
                        </div>
                      </div>

                      <div style={{ marginTop: '10px', fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                        {t.depositLabel}: <strong>฿{room.deposit}</strong> {language === 'en' ? 'THB' : language === 'cn' ? '泰铢' : language === 'mm' ? 'ဘတ်' : 'บาท'}
                      </div>

                      {/* Monthly Room Availability Status Box */}
                      <div 
                        onClick={() => handleToggleAvailability(room, 'monthly')}
                        style={{
                          margin: '14px 0 6px 0',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: hasAvailable ? '#f0fff4' : '#fff5f5',
                          border: hasAvailable ? '1.5px solid #bbf7d0' : '1.5px solid #fecaca',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          cursor: isAdmin ? 'pointer' : 'default',
                          transition: 'all 0.2s ease',
                          boxShadow: isAdmin ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                        }}
                        title={isAdmin ? 'คลิกเพื่อเปลี่ยนสถานะห้องว่าง/เต็ม' : ''}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                          <span style={{
                            fontWeight: 900,
                            fontSize: '1rem',
                            color: hasAvailable ? '#15803d' : '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            {hasAvailable ? (language === 'en' ? 'Ready' : language === 'cn' ? '随时可入住' : language === 'mm' ? 'အသင့်နေနိုင်သည်' : 'สถานะ: ว่าง') : (language === 'en' ? 'Full (Occupied)' : language === 'cn' ? '已满 (Occupied)' : language === 'mm' ? 'ပြည့်ပြီး' : 'สถานะ: เต็มแล้ว')}
                          </span>
                          {hasAvailable && (
                            <span style={{
                              fontSize: '1.25rem',
                              fontWeight: 900,
                              color: '#166534',
                              backgroundColor: '#dcfce7',
                              padding: '4px 14px',
                              borderRadius: '20px',
                              border: '2px solid #bbf7d0',
                              boxShadow: '0 2px 4px rgba(22, 101, 52, 0.15)'
                            }}>
                              {language === 'en' ? `${room.availableRoomsList.length} Left` : language === 'cn' ? `空房 ${room.availableRoomsList.length} 间` : language === 'mm' ? `${room.availableRoomsList.length} ခန်း လစ်လပ်` : `ว่าง ${room.availableRoomsList.length} ห้อง!`}
                            </span>
                          )}
                        </div>

                        {hasAvailable ? (
                          <div style={{ fontSize: '0.82rem', color: '#1e293b', marginTop: '4px' }}>
                            <strong>{language === 'en' ? 'Vacant Rooms:' : language === 'cn' ? '可用房号:' : language === 'mm' ? 'လစ်လပ်ခန်းများ:' : 'เลขห้องว่าง:'}</strong>{' '}
                            {room.availableRoomsList.map((roomNo: string, i: number) => (
                              <span key={i} style={{
                                display: 'inline-block',
                                backgroundColor: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                padding: '1px 6px',
                                margin: '2px 3px 2px 0',
                                fontWeight: 'bold',
                                color: '#0f172a',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                              }}>
                                {language === 'en' ? `Room ${roomNo}` : language === 'cn' ? `${roomNo}房` : language === 'mm' ? `အခန်း ${roomNo}` : `ห้อง ${roomNo}`}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: '2px' }}>
                            {language === 'en' ? 'Currently full for this type (Inquire for queue)' : language === 'cn' ? '目前该房型已满 (可咨询排队)' : language === 'mm' ? 'လက်ရှိတွင် ဤအခန်းပြည့်နေပါသည်' : 'ปัจจุบันไม่มีห้องว่างในโซนนี้ (สอบถามคิวล่วงหน้า)'}
                          </div>
                        )}
                      </div>

                      <div className="room-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-outline"
                          onClick={() => setSelectedDetailsRoom({ ...room, data: room, isMonthly: true })}
                          style={{ flex: 1 }}
                        >
                          {t.viewDetails}
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleOpenBooking({ ...room, data: room, isMonthly: true })}
                          disabled={!hasAvailable}
                          style={{
                            flex: 1,
                            opacity: hasAvailable ? 1 : 0.6,
                            cursor: hasAvailable ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {hasAvailable ? `${t.bookNow}` : (language === 'en' ? 'Full' : language === 'cn' ? '已满' : language === 'mm' ? 'ပြည့်ပြီး' : 'เต็มแล้ว')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </>
            )}

            {/* Surcharges / Option Notes Banner */}
            <div style={{
              marginTop: '24px',
              backgroundColor: '#fffbebfb',
              border: '1.5px solid #fef08a',
              borderRadius: '12px',
              padding: '16px 20px',
              color: '#854d0e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.92rem',
              boxShadow: '0 2px 8px rgba(234, 179, 8, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}></span>
                <span><strong>{language === 'en' ? 'Additional Option Terms (Surcharges):' : language === 'cn' ? '附加选项费用 (Surcharges):' : language === 'mm' ? 'အပိုထပ်ဆောင်းကုန်ကျစရိတ်များ (Surcharges):' : 'ข้อกำหนดรายละเอียดยิบย่อยเพิ่มเติม (Surcharges):'}</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontWeight: 'bold' }}>
                <span style={{ backgroundColor: '#fef3c7', padding: '4px 12px', borderRadius: '8px', border: '1px solid #fde047' }}>
                  {language === 'en' ? 'Corner Room:' : language === 'cn' ? '角房:' : language === 'mm' ? 'ဒေါင့်ခန်း:' : 'ห้องมุม:'} <strong>{language === 'en' ? '+500 THB / month' : language === 'cn' ? '+500 泰铢 / 月' : language === 'mm' ? '+၅၀၀ ဘတ် / လ' : '+500 บาท / เดือน'}</strong>
                </span>
                <span style={{ backgroundColor: '#fef3c7', padding: '4px 12px', borderRadius: '8px', border: '1px solid #fde047' }}>
                  {language === 'en' ? 'Large Balcony:' : language === 'cn' ? '超大阳台:' : language === 'mm' ? 'လသာဆောင်ကြီး:' : 'ระเบียงใหญ่:'} <strong>{language === 'en' ? '+500 THB / month' : language === 'cn' ? '+500 泰铢 / 月' : language === 'mm' ? '+၅၀၀ ဘတ် / လ' : '+500 บาท / เดือน'}</strong>
                </span>
              </div>
            </div>

            {/* Utility & Other Fees Section */}
            <div className="utility-section">
              <h3 className="utility-title-header">{t.utilityTitle}</h3>
              <div className="utility-grid">
                {utilityFees.map((fee, idx) => (
                  <div key={idx} className="utility-item">
                    <span className="utility-icon">{fee.icon}</span>
                    <span className="utility-name">{fee.label}</span>
                    <span className="utility-val">{fee.val}</span>
                  </div>
                ))}
              </div>

              {/* Official Lease Agreement Modal Button */}
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                  onClick={() => setIsLeaseModalOpen(true)}
                  className="btn-hotel-secondary"
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 64, 136, 0.15)'
                  }}
                >
                  <span>📄</span>
                  <span>{t.leaseAgreementBtn || 'ดูสัญญา & กฎระเบียบห้องเช่ารายเดือน (Official Lease Agreement)'}</span>
                </button>
              </div>

              {/* Monthly Utility & Expense Estimator Calculator */}
              <div style={{ marginTop: '48px' }}>
                <UtilityCalculator t={t} language={language} />
              </div>
            </div>
          </div>
        )}

        {/* Lease Contract Document Modal */}
        <LeaseModal
          isOpen={isLeaseModalOpen}
          onClose={() => setIsLeaseModalOpen(false)}
        />

        {/* Modals */}
        {selectedDetailsRoom && (
          <div className="modal-overlay" onClick={() => { setSelectedDetailsRoom(null); setActiveImgIndex(0); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedDetailsRoom.data?.name}</h3>
                <button className="modal-close" onClick={() => { setSelectedDetailsRoom(null); setActiveImgIndex(0); }}>×</button>
              </div>
              <div className="modal-body">
                {(() => {
                  const isTwinRoom = (selectedDetailsRoom.key === 'twin') || 
                    (selectedDetailsRoom.data?.name || '').toLowerCase().includes('คู่') || 
                    (selectedDetailsRoom.data?.name || '').toLowerCase().includes('twin') ||
                    (selectedDetailsRoom.image || '').includes('twin');

                  const isSingleRoom = (selectedDetailsRoom.key === 'single') ||
                    (selectedDetailsRoom.data?.name || '').toLowerCase().includes('เดี่ยว') ||
                    (selectedDetailsRoom.data?.name || '').toLowerCase().includes('single') ||
                    (selectedDetailsRoom.image || '').includes('single');

                  const roomImages = selectedDetailsRoom.images && selectedDetailsRoom.images.length > 0
                    ? selectedDetailsRoom.images
                    : isTwinRoom
                      ? [
                          '/images/twin_beds.jpg',
                          '/images/twin_overview.jpg',
                          '/images/twin_desk.jpg',
                          '/images/twin_bathroom.jpg'
                        ]
                      : isSingleRoom
                        ? [
                            '/images/single_main.jpg',
                            '/images/single_wide_view.jpg',
                            '/images/single_bed_close.jpg',
                            '/images/single_desk.jpg'
                          ]
                        : [
                            selectedDetailsRoom.image || '/images/single.png',
                            '/images/building_bg1.jpg',
                            '/images/building_bg2.jpg'
                          ];
                  const safeIndex = activeImgIndex < roomImages.length ? activeImgIndex : 0;

                  return (
                    <>
                      {/* Featured Main Image with Side Arrow Controls */}
                      <div className="slider-wrapper" style={{ position: 'relative', marginBottom: '14px' }}>
                        {/* Left Arrow Button */}
                        <button
                          type="button"
                          className="slider-arrow slider-arrow-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImgIndex(prev => (prev === 0 ? roomImages.length - 1 : prev - 1));
                          }}
                          title="รูปก่อนหน้า"
                        >
                          ‹
                        </button>

                        {/* Featured Image */}
                        <img
                          src={roomImages[safeIndex]}
                          alt={selectedDetailsRoom.data?.name}
                          className="slider-featured-img"
                          onClick={() => setExpandedImage(roomImages[safeIndex])}
                          style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                            display: 'block'
                          }}
                        />

                        {/* Right Arrow Button */}
                        <button
                          type="button"
                          className="slider-arrow slider-arrow-right"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImgIndex(prev => (prev === roomImages.length - 1 ? 0 : prev + 1));
                          }}
                          title="รูปถัดไป"
                        >
                          ›
                        </button>

                        {/* Image Counter Badge */}
                        <div className="slider-counter-badge">
                          📷 {safeIndex + 1} / {roomImages.length}
                        </div>
                      </div>

                      {/* Thumbnail Previews Bar */}
                      <div className="slider-thumbnails-bar" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                        {roomImages.map((img: string, idx: number) => (
                          <div
                            key={idx}
                            className={`slider-thumb-item ${safeIndex === idx ? 'active' : ''}`}
                            onClick={() => setActiveImgIndex(idx)}
                            style={{
                              width: '70px',
                              height: '50px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: safeIndex === idx ? '2.5px solid #004088' : '2px solid #e2e8f0',
                              opacity: safeIndex === idx ? 1 : 0.65,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <img src={img} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}

                <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}><strong>รายละเอียด:</strong> {selectedDetailsRoom.data?.desc}</p>
                <p style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  <strong>ราคา:</strong> ฿{selectedDetailsRoom.data?.price} {selectedDetailsRoom.isMonthly ? '/ เดือน' : '/ คืน'}
                </p>
                <p style={{ fontSize: '1.05rem', marginBottom: '16px', color: '#e63946', fontWeight: 'bold' }}>
                  ต้องจ่ายค่ามัดจำห้องละ {selectedDetailsRoom.data?.deposit ? `฿${selectedDetailsRoom.data.deposit}` : '฿500'} บาท
                </p>
                <div className="room-features">
                  {selectedDetailsRoom.data?.features?.map((f: string, i: number) => (
                    <span key={i} className="room-feature-badge">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedBookingRoom && createPortal(
          <div className="modal-overlay" onClick={() => setSelectedBookingRoom(null)}>
            <div className="booking-modal-card" onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="booking-modal-header no-print">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button className="modal-back-btn" onClick={() => setSelectedBookingRoom(null)} title="ย้อนกลับ">
                    ← ย้อนกลับ
                  </button>
                  <div className="modal-header-brand">
                    <span className="hotel-badge-pill">@Samutsakorn Mahachai</span>
                    <h3>สรุปรายการจองห้องพัก</h3>
                  </div>
                </div>
                <button className="modal-close-circle" onClick={() => setSelectedBookingRoom(null)} title="ปิดหน้าต่าง">
                  ✕
                </button>
              </div>

              {/* Printable & Downloadable Modal Body */}
              <div className="booking-modal-body" ref={summaryRef}>
                
                {/* Formal Document Header */}
                <div className="formal-quotation-header">
                  <div className="formal-header-left">
                    <div className="formal-brand-logo-row">
                      <img src="/images/logo.png" alt="At Samutsakorn Logo" className="formal-logo-img" />
                      <div>
                        <h2 className="formal-hotel-title">แอทสมุทรสาคร (มหาชัย)</h2>
                        <span className="formal-hotel-subtitle">AT SAMUTSAKORN MAHACHAI CONDO & HOTEL</span>
                      </div>
                    </div>
                    <div className="formal-hotel-address">
                      <p><strong>ที่อยู่โครงการ:</strong> 1/9 ถนนกิโลเมตร 28 ต.มหาชัย อ.เมืองสมุทรสาคร จ.สมุทรสาคร 74000 (ตรงข้าม Big C มหาชัย ถนนเศรษฐกิจ 1)</p>
                      <p><strong>โทรติดต่อ:</strong> 099-095-4541, 064-138-0777 &nbsp;|&nbsp; <strong>Line ID:</strong> 0990954541</p>
                    </div>
                  </div>

                  <div className="formal-header-right">
                    <div className="formal-doc-badge">ใบสรุปการจอง / ใบเสนอราคา</div>
                    <div className="formal-doc-english">QUOTATION & BOOKING SUMMARY</div>
                    <div className="formal-doc-meta">
                      <div><strong>เลขที่เอกสาร (REF):</strong> <span className="ref-highlight">#AT-{(Date.now() % 10000).toString().padStart(4, '0')}</span></div>
                      <div><strong>วันที่ออกเอกสาร:</strong> {formatThaiDate(new Date().toISOString().split('T')[0])}</div>
                    </div>
                  </div>
                </div>

                {/* Selected Room Header Banner Card */}
                {(() => {
                  const isMonthly = selectedBookingRoom.isMonthly || false;
                  const totalRoomsCount = selectedBookingItems.reduce((acc, item) => acc + (item.count || 1), 0);
                  
                  return (
                    <div className="booking-room-banner">
                      <div className="room-banner-info">
                        <span className="room-type-pill">
                          {isMonthly ? 'ห้องพักรายเดือน (Monthly)' : '🏨 ห้องพักรายวัน (Daily)'}
                        </span>
                        <h4 className="room-banner-title">
                          {selectedBookingItems.length === 1 
                            ? selectedBookingItems[0]?.roomData?.name 
                            : `สรุปรายการจองห้องพัก (รวม ${totalRoomsCount} ห้อง)`}
                        </h4>
                        <div className="room-banner-meta">
                          <span>👥 รวมทั้งสิ้น: {totalRoomsCount} ห้อง</span>
                          <span>ใจกลางมหาชัย (ตรงข้าม Big C)</span>
                        </div>
                      </div>
                      <div className="room-banner-price-tag">
                        <span className="price-amount">{selectedBookingItems.length} ประเภท</span>
                        <span className="price-unit">{totalRoomsCount} ห้องในรายการ</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Booking Input Fields Grid & Calculations */}
                {(() => {
                  const isMonthly = selectedBookingRoom.isMonthly || false;
                  const defaultDuration = isMonthly ? ((bookingMonths as number) || 12) : ((bookingNights as number) || 1);

                  const maxDuration = selectedBookingItems.reduce((max, item) => {
                    const dur = item.duration !== undefined ? item.duration : defaultDuration;
                    return dur > max ? dur : max;
                  }, 1);

                  const checkOutDateObj = calculateCheckOutDate(checkInDate, maxDuration, isMonthly);

                  const totalRoomsCount = selectedBookingItems.reduce((acc, item) => acc + (item.count || 1), 0);

                  const totalRoomRental = selectedBookingItems.reduce((acc, item) => {
                    const basePriceNum = parseInt(String(item.roomData?.price || '0').replace(/,/g, ''));
                    const dur = item.duration !== undefined ? item.duration : defaultDuration;
                    const isShortTerm = isMonthly && dur < 12;
                    const effectivePrice = isShortTerm ? (basePriceNum + 1000) : basePriceNum;
                    return acc + (effectivePrice * (item.count || 1) * dur);
                  }, 0);

                  const totalDeposit = selectedBookingItems.reduce((acc, item) => {
                    const depVal = item.roomData?.deposit
                      ? parseInt(item.roomData.deposit.toString().replace(/,/g, ''))
                      : ((item.roomData?.name || '').includes('สูท') ? 1000 : 500);
                    return acc + (depVal * (item.count || 1));
                  }, 0);

                  const totalKeycardFee = isMonthly ? (100 * totalRoomsCount) : 0;

                  const grandTotalCalc = isMonthly ? (totalDeposit + totalKeycardFee) : (totalRoomRental + (payDepositNow ? totalDeposit : 0));

                  const availableRoomsList = isMonthly ? monthlyRoomsData : dailyRooms;

                  return (
                    <>
                      <div className="booking-inputs-grid no-print">
                        
                        {/* Multi-Room Item Selector */}
                        <div className="booking-input-group full-width">
                          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>รายการห้องพักที่ต้องการจอง (รวม {totalRoomsCount} ห้อง)</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>สามารถเลือกเพิ่มประเภทห้องและปรับจำนวนคืน/เดือนแยกได้</span>
                          </label>
                          
                          <div className="selected-rooms-list">
                            {selectedBookingItems.map((item, idx) => {
                              const itemDur = item.duration !== undefined ? item.duration : defaultDuration;
                              const basePriceNum = parseInt(String(item.roomData?.price || '0').replace(/,/g, ''));
                              const isShortTerm = isMonthly && itemDur < 12;
                              const effectivePriceNum = isShortTerm ? (basePriceNum + 1000) : basePriceNum;
                              return (
                                <div key={idx} className="room-item-row-card">
                                  <div className="room-item-info">
                                    <strong>{item.roomData.name}</strong>
                                    <span className="room-item-price">฿{effectivePriceNum.toLocaleString()} / {isMonthly ? 'เดือน' : 'คืน'}</span>
                                    {isShortTerm && (
                                      <span style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>
                                        สัญญาน้อยกว่า 12 เดือน (+1,000 บ./เดือน)
                                      </span>
                                    )}
                                  </div>
                                  <div className="room-item-actions">
                                    {/* Room Count Selector */}
                                    <div className="counter-wrapper">
                                      <span className="counter-label-sm">จำนวน:</span>
                                      <div className="counter-input-box compact">
                                        <button
                                          type="button"
                                          className="counter-btn"
                                          onClick={() => handleUpdateRoomCount(idx, item.count - 1)}
                                        >-</button>
                                        <span className="counter-val-display">{item.count} ห้อง</span>
                                        <button
                                          type="button"
                                          className="counter-btn"
                                          onClick={() => handleUpdateRoomCount(idx, item.count + 1)}
                                        >+</button>
                                      </div>
                                    </div>

                                    {/* Nights / Months Selector for THIS room */}
                                    <div className="counter-wrapper">
                                      <span className="counter-label-sm">{isMonthly ? 'ระยะเวลา:' : 'จำนวนคืน:'}</span>
                                      <div className="counter-input-box compact duration-box">
                                        <button
                                          type="button"
                                          className="counter-btn"
                                          onClick={() => handleUpdateItemDuration(idx, itemDur - 1)}
                                        >-</button>
                                        <span className="counter-val-display highlight">{itemDur} {isMonthly ? 'เดือน' : 'คืน'}</span>
                                        <button
                                          type="button"
                                          className="counter-btn"
                                          onClick={() => handleUpdateItemDuration(idx, itemDur + 1)}
                                        >+</button>
                                      </div>
                                    </div>

                                    {selectedBookingItems.length > 1 && (
                                      <button
                                        type="button"
                                        className="btn-remove-room"
                                        onClick={() => handleRemoveRoomItem(idx)}
                                        title="ลบประเภทห้องพักนี้"
                                      >
                                        🗑️
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Dropdown to Add Another Room Type */}
                          <div className="add-room-type-bar" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <select
                              className="booking-text-input"
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  const found = availableRoomsList.find((r: any) => (r.data?.name || r.name) === e.target.value);
                                  if (found) {
                                    handleAddRoomType((found as any).data || found);
                                  }
                                }
                              }}
                              style={{ flex: 1, fontSize: '0.9rem', padding: '8px 12px' }}
                            >
                              <option value="">เลือกเพิ่มประเภทห้องพักอื่น...</option>
                              {availableRoomsList.map((r: any, i: number) => {
                                const roomObj = (r as any).data || r;
                                return (
                                  <option key={i} value={roomObj.name}>
                                    {roomObj.name} (฿{roomObj.price}/{isMonthly ? 'เดือน' : 'คืน'})
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>

                        <div className="booking-input-group">
                          <label>วันที่เริ่มเข้าพัก (Check-in Date)</label>
                          <input
                            type="date"
                            className="booking-text-input"
                            value={checkInDate}
                            onChange={e => setCheckInDate(e.target.value)}
                          />
                        </div>

                        {isMonthly ? (
                          <div className="booking-input-group">
                            <label>ระยะเวลาเข้าพักตั้งต้น (สัญญาขั้นต่ำ 12 เดือน / 1 ปี)</label>
                            <div className="counter-input-box">
                              <button
                                type="button"
                                className="counter-btn"
                                onClick={() => handleSetGlobalMonths(Math.max(1, ((bookingMonths as number) || 12) - 1))}
                              >-</button>
                              <input
                                type="number"
                                min="1"
                                className="counter-val"
                                value={bookingMonths}
                                onChange={e => handleSetGlobalMonths(e.target.value === '' ? '' : parseInt(e.target.value))}
                                onBlur={() => { if (bookingMonths === '' || (bookingMonths as number) < 1) handleSetGlobalMonths(12); }}
                              />
                              <button
                                type="button"
                                className="counter-btn"
                                onClick={() => handleSetGlobalMonths(((bookingMonths as number) || 12) + 1)}
                              >+</button>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: ((bookingMonths as number) || 12) < 12 ? '#dc2626' : '#0284c7', fontWeight: 'bold', marginTop: '4px', display: 'block' }}>
                              {((bookingMonths as number) || 12) < 12
                                ? 'สัญญาน้อยกว่า 12 เดือน: คิดอัตราค่าห้องเพิ่ม +1,000 บาท/เดือน'
                                : 'สัญญาเช่ารายเดือนขั้นต่ำ 12 เดือน (1 ปี)'}
                            </span>
                          </div>
                        ) : (
                          <div className="booking-input-group">
                            <label>จำนวนคืนที่พักตั้งต้น (Nights)</label>
                            <div className="counter-input-box">
                              <button
                                type="button"
                                className="counter-btn"
                                onClick={() => handleSetGlobalNights(Math.max(1, ((bookingNights as number) || 1) - 1))}
                              >-</button>
                              <input
                                type="number"
                                min="1"
                                className="counter-val"
                                value={bookingNights}
                                onChange={e => handleSetGlobalNights(e.target.value === '' ? '' : parseInt(e.target.value))}
                                onBlur={() => { if (bookingNights === '' || (bookingNights as number) < 1) handleSetGlobalNights(1); }}
                              />
                              <button
                                type="button"
                                className="counter-btn"
                                onClick={() => handleSetGlobalNights(((bookingNights as number) || 1) + 1)}
                              >+</button>
                            </div>
                          </div>
                        )}

                        {/* Live calculated date range banner */}
                        <div className="booking-input-group full-width" style={{ margin: '8px 0' }}>
                          <div style={{
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                            border: '2.5px solid #0284c7',
                            borderRadius: '14px',
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            fontSize: '1rem',
                            color: '#0f172a',
                            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.15)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '1.2rem' }}></span>
                              <span><strong>เช็คอิน:</strong> <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '1.05rem' }}>{formatThaiDate(checkInDate)}</span></span>
                            </div>
                            <div style={{ color: '#0284c7', fontWeight: 'bold', fontSize: '1.3rem' }}>➔</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '1.2rem' }}></span>
                              <span><strong>เช็คเอ้าท์ (ถึงวันที่):</strong> <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.15rem' }}>{formatThaiDateObj(checkOutDateObj)}</span></span>
                            </div>
                            <div style={{
                              backgroundColor: '#0284c7',
                              padding: '4px 14px',
                              borderRadius: '20px',
                              fontSize: '0.9rem',
                              fontWeight: 800,
                              color: '#ffffff',
                              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                            }}>
                              {isMonthly ? `สูงสุด ${maxDuration} เดือน` : `สูงสุด ${maxDuration} คืน`}
                            </div>
                          </div>
                        </div>

                        <div className="booking-input-group">
                          <label>ชื่อผู้เข้าพัก (Guest Name)</label>
                          <input
                            type="text"
                            className="booking-text-input"
                            placeholder="ระบุชื่อ-นามสกุล"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                          />
                        </div>

                        <div className="booking-input-group">
                          <label>เบอร์โทรติดต่อ (Phone Number)</label>
                          <input
                            type="tel"
                            className="booking-text-input"
                            placeholder="08X-XXX-XXXX"
                            value={guestPhone}
                            onChange={e => setGuestPhone(e.target.value)}
                          />
                        </div>

                        {isMonthly ? (
                          <div className="booking-input-group full-width">
                            <label>ยอดเงินมัดจำประกันห้องและค่าคีย์การ์ดเพื่อยืนยันการจอง (รวม {totalRoomsCount} ห้อง)</label>
                            <div style={{
                              backgroundColor: '#ebf8ff',
                              border: '1.5px solid #93c5fd',
                              borderRadius: '10px',
                              padding: '12px 16px',
                              color: '#1e3a8a',
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>เงินมัดจำประกันห้องพัก ({totalRoomsCount} ห้อง):</span>
                                <span>฿{totalDeposit.toLocaleString()} บาท</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>ค่าซื้อคีย์การ์ดเข้าอาคาร ({totalRoomsCount} ใบ):</span>
                                <span>฿{totalKeycardFee.toLocaleString()} บาท</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed #93c5fd', marginTop: '2px' }}>
                                <span>💰 ยอดรวมที่ต้องชำระเพื่อล็อคสิทธิ์จอง:</span>
                                <span style={{ fontSize: '1.25rem', color: '#004088', fontWeight: 800 }}>฿{grandTotalCalc.toLocaleString()} บาท</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="booking-input-group full-width">
                            <label>การชำระค่ามัดจำประกันห้อง (รวม ฿{totalDeposit.toLocaleString()} บาท / {totalRoomsCount} ห้อง)</label>
                            <div className="deposit-toggle-group">
                              <div
                                className={`deposit-toggle-card ${!payDepositNow ? 'active' : ''}`}
                                onClick={() => setPayDepositNow(false)}
                              >
                                <div className="radio-dot"></div>
                                <div className="toggle-info">
                                  <strong>จ่ายหน้าออฟฟิศ</strong>
                                  <span>ชำระวันเข้าพักที่เคาน์เตอร์</span>
                                </div>
                              </div>

                              <div
                                className={`deposit-toggle-card ${payDepositNow ? 'active' : ''}`}
                                onClick={() => setPayDepositNow(true)}
                              >
                                <div className="radio-dot"></div>
                                <div className="toggle-info">
                                  <strong>จ่ายพร้อมค่าห้อง</strong>
                                  <span>รวมยอดมัดจำในสลิปโอนนี้</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Calculation Breakdown Receipt Table */}
                      <div className="formal-table-container">
                        <table className="formal-table">
                          <thead>
                            <tr>
                              <th style={{ width: '8%', textAlign: 'center' }}>ลำดับ</th>
                              <th style={{ width: '47%' }}>รายการรายละเอียด (Description)</th>
                              <th style={{ width: '15%', textAlign: 'center' }}>จำนวน</th>
                              <th style={{ width: '15%', textAlign: 'right' }}>ราคา/หน่วย</th>
                              <th style={{ width: '15%', textAlign: 'right' }}>จำนวนเงิน</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBookingItems.map((item, index) => {
                              const itemDur = item.duration !== undefined ? item.duration : defaultDuration;
                              const itemCheckOutDate = calculateCheckOutDate(checkInDate, itemDur, isMonthly);
                              const basePriceNum = parseInt(String(item.roomData?.price || '0').replace(/,/g, ''));
                              const isShortTerm = isMonthly && itemDur < 12;
                              const effectivePriceNum = isShortTerm ? (basePriceNum + 1000) : basePriceNum;
                              const itemRoomTotal = effectivePriceNum * (item.count || 1) * itemDur;
                              return (
                                <tr key={index}>
                                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                  <td>
                                    <strong>ค่าเช่าห้องพัก {item.roomData?.name}</strong> ({isMonthly ? 'รายเดือน' : 'รายวัน'})
                                    <div className="table-sub-detail">
                                      กำหนดเข้าพัก: {formatThaiDate(checkInDate)} ➔ {formatThaiDateObj(itemCheckOutDate)} ({itemDur} {isMonthly ? 'เดือน' : 'คืน'})
                                    </div>
                                    {isShortTerm && (
                                      <div className="table-sub-detail" style={{ color: '#c53030', fontWeight: 'bold' }}>
                                        สัญญาน้อยกว่า 12 เดือน: ปรับราคาเพิ่ม +1,000 บ./เดือน (จากราคาปกติ ฿{basePriceNum.toLocaleString()})
                                      </div>
                                    )}
                                    <div className="table-sub-detail">
                                      ผู้เข้าพัก: {guestName.trim() || 'ยังไม่ระบุ'} ({guestPhone.trim() || 'ยังไม่ระบุ'})
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.count} ห้อง ({itemDur} {isMonthly ? 'เดือน' : 'คืน'})
                                  </td>
                                  <td style={{ textAlign: 'right' }}>฿{effectivePriceNum.toLocaleString()} / {isMonthly ? 'เดือน' : 'คืน'}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                    {isMonthly ? (
                                      <span style={{ color: '#475569', fontSize: '0.82rem' }}>ชำระรายเดือน</span>
                                    ) : (
                                      `฿${itemRoomTotal.toLocaleString()}`
                                    )}
                                  </td>
                                </tr>
                              );
                            })}

                            {isMonthly ? (
                              <>
                                <tr>
                                  <td style={{ textAlign: 'center' }}>{selectedBookingItems.length + 1}</td>
                                  <td>
                                    <strong>เงินมัดจำประกันห้องพักเพื่อการจอง/เข้าพัก (รวม {totalRoomsCount} ห้อง)</strong>
                                    <div className="table-sub-detail" style={{ color: '#059669', fontWeight: 600 }}>
                                      ✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่ออยู่ครบสัญญาและตรวจสอบห้องพักเรียบร้อย
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{totalRoomsCount} ห้อง</td>
                                  <td style={{ textAlign: 'right' }}>฿{totalRoomsCount > 0 ? (totalDeposit / totalRoomsCount).toLocaleString() : '0'}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#004088', fontSize: '0.95rem' }}>฿{totalDeposit.toLocaleString()}</td>
                                </tr>
                                <tr>
                                  <td style={{ textAlign: 'center' }}>{selectedBookingItems.length + 2}</td>
                                  <td>
                                    <strong>ค่าซื้อคีย์การ์ดเข้าอาคาร (Keycard Fee)</strong>
                                    <div className="table-sub-detail" style={{ color: '#475569' }}>
                                      ค่าคีย์การ์ดสำหรับเข้า-ออกอาคารและห้องพัก (100 บาท / ใบ)
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{totalRoomsCount} ใบ</td>
                                  <td style={{ textAlign: 'right' }}>฿100</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#004088', fontSize: '0.95rem' }}>฿{totalKeycardFee.toLocaleString()}</td>
                                </tr>
                              </>
                            ) : (
                              payDepositNow ? (
                                <tr>
                                  <td style={{ textAlign: 'center' }}>{selectedBookingItems.length + 1}</td>
                                  <td>
                                    <strong>ค่ามัดจำประกันห้องพัก (รวม {totalRoomsCount} ห้อง)</strong>
                                    <div className="table-sub-detail" style={{ color: '#059669', fontWeight: 600 }}>
                                      ✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่อตรวจสอบห้องพักเรียบร้อย
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{totalRoomsCount} ห้อง</td>
                                  <td style={{ textAlign: 'right' }}>฿{totalRoomsCount > 0 ? (totalDeposit / totalRoomsCount).toLocaleString() : '0'}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>฿{totalDeposit.toLocaleString()}</td>
                                </tr>
                              ) : (
                                <tr>
                                  <td style={{ textAlign: 'center' }}>{selectedBookingItems.length + 1}</td>
                                  <td>
                                    <strong>ค่ามัดจำประกันห้องพัก (ชำระวันเข้าพัก รวม {totalRoomsCount} ห้อง)</strong>
                                    <div className="table-sub-detail" style={{ color: '#d97706', fontWeight: 600 }}>
                                      ชำระ ฿{totalDeposit.toLocaleString()} หน้าเคาน์เตอร์วันเช็คอิน (คืนเงินมัดจำวันเช็คเอ้าท์)
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{totalRoomsCount} ห้อง</td>
                                  <td style={{ textAlign: 'right' }}>-</td>
                                  <td style={{ textAlign: 'right', color: '#64748b', fontSize: '0.82rem' }}>ชำระหน้าเคาน์เตอร์</td>
                                </tr>
                              )
                            )}
                          </tbody>
                          <tfoot>
                            <tr className="grand-total-row">
                              <td colSpan={3} className="total-label-cell">
                                <strong>
                                  {isMonthly
                                    ? 'ยอดเงินมัดจำและค่าคีย์การ์ดที่ต้องชำระในการจอง (TOTAL AMOUNT DUE)'
                                    : 'ยอดเงินรวมทั้งสิ้นที่ต้องชำระ (TOTAL AMOUNT DUE)'}
                                </strong>
                                <span className="total-subtext">
                                  {isMonthly
                                    ? `(รวมเงินมัดจำประกันห้อง ฿${totalDeposit.toLocaleString()} + ค่าคีย์การ์ด ฿${totalKeycardFee.toLocaleString()} | ค่าเช่าชำระรายเดือน ณ วันเข้าพัก)`
                                    : (payDepositNow ? '(รวมค่าห้องและค่ามัดจำประกันห้องแล้ว)' : '(ยังไม่รวมค่ามัดจำประกันห้องที่ชำระวันเช็คอิน)')}
                                </span>
                              </td>
                              <td colSpan={2} className="total-amount-cell">
                                ฿{grandTotalCalc.toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Terms & Guidelines Box */}
                      <div className="formal-terms-box">
                        <div className="terms-title">ข้อกำหนดการเข้าพักและเงื่อนไข (Terms & Guidelines):</div>
                        <ul>
                          {isMonthly && (
                            <li style={{ color: '#004088', fontWeight: 'bold' }}>
                              <strong>สัญญาเช่ารายเดือน:</strong> สัญญาเช่าขั้นต่ำ 12 เดือน (1 ปี) | กรณีสัญญาน้อยกว่า 12 เดือน ค่าเช่าห้องจะปรับเพิ่มขึ้น <strong>+1,000 บาท/เดือน</strong> ทุกประเภทห้อง (พักอาศัยครบตามสัญญา ได้รับคืนเงินมัดจำประกันครบถ้วน)
                            </li>
                          )}
                          <li><strong>เวลาเช็คอิน (Check-in):</strong> ตั้งแต่ 14:00 น. เป็นต้นไป | <strong>เวลาเช็คเอ้าท์ (Check-out):</strong> ไม่เกิน 12:00 น.</li>
                          <li><strong>เงินมัดจำประกันห้อง:</strong> จะได้รับคืนเต็มจำนวนในวันเช็คเอ้าท์ หลังเจ้าหน้าที่ตรวจสอบความเรียบร้อยของห้องพัก</li>
                          <li><strong>การยืนยันจอง:</strong> ติดต่อเจ้าหน้าที่แผนกต้อนรับทาง LINE Official: <code>0990954541</code> หรือโทร <code>099-095-4541</code></li>
                        </ul>
                      </div>

                      {/* Signature & Issuer Seal */}
                      <div className="formal-signature-bar" style={{ justifyContent: 'flex-end' }}>
                        <div className="signature-col">
                          <div className="stamp-seal-badge">
                            <span>VERIFIED DOCUMENT</span>
                            <strong>แอทสมุทรสาคร (มหาชัย)</strong>
                          </div>
                          <div className="sig-line-container" style={{ position: 'relative', minHeight: '52px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <img
                              src="/images/signature_thitaree.png"
                              alt="ลายเซ็น นางสาวฐิตารีย์ ธวัชเลิศวงศ์"
                              style={{ height: '48px', objectFit: 'contain', marginBottom: '-14px', zIndex: 2 }}
                            />
                            <div className="sig-line" style={{ width: '100%', margin: 0 }}></div>
                          </div>
                          <p style={{ margin: '6px 0 2px 0', fontSize: '0.85rem' }}><strong>(นางสาวฐิตารีย์ ธวัชเลิศวงศ์)</strong></p>
                          <p style={{ margin: 0 }}><strong>ผู้ออกใบเสนอราคา / ผู้รับเงิน</strong></p>
                          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>สำนักงาน แอทสมุทรสาคร มหาชัย</p>
                        </div>
                      </div>
                    </>
                  );
                })()}

              </div>

              {/* Modal Footer Buttons */}
              <div className="booking-modal-footer no-print">
                <button className="btn-modal-close" onClick={() => setSelectedBookingRoom(null)}>
                  ปิดหน้าต่าง
                </button>
                <div className="modal-btn-group">
                  <button className="btn-modal-outline" onClick={() => handleDownload('png')}>
                    บันทึกรูปภาพ (PNG)
                  </button>
                  <button className="btn-modal-outline" onClick={() => {
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                      handleDownload('png');
                    } else {
                      window.print();
                    }
                  }}>
                    พิมพ์เอกสาร / PDF
                  </button>
                  {(() => {
                    const isMonthly = selectedBookingRoom.isMonthly || false;
                    const defaultDuration = isMonthly ? ((bookingMonths as number) || 1) : ((bookingNights as number) || 1);

                    const maxDuration = selectedBookingItems.reduce((max, item) => {
                      const dur = item.duration !== undefined ? item.duration : defaultDuration;
                      return dur > max ? dur : max;
                    }, 1);

                    const checkOutDateObj = calculateCheckOutDate(checkInDate, maxDuration, isMonthly);
                    const totalRoomsCount = selectedBookingItems.reduce((acc, item) => acc + (item.count || 1), 0);

                    const totalRoomRental = selectedBookingItems.reduce((acc, item) => {
                      const priceNum = parseInt(String(item.roomData?.price || '0').replace(/,/g, ''));
                      const dur = item.duration !== undefined ? item.duration : defaultDuration;
                      return acc + (priceNum * (item.count || 1) * dur);
                    }, 0);

                    const totalDeposit = selectedBookingItems.reduce((acc, item) => {
                      const depVal = item.roomData?.deposit
                        ? parseInt(item.roomData.deposit.toString().replace(/,/g, ''))
                        : ((item.roomData?.name || '').includes('สูท') ? 1000 : 500);
                      return acc + (depVal * (item.count || 1));
                    }, 0);

                    const grandTotalCalc = totalRoomRental + (payDepositNow ? totalDeposit : 0);

                    const roomItemsText = selectedBookingItems.map(item => {
                      const dur = item.duration !== undefined ? item.duration : defaultDuration;
                      const itemOutDate = formatThaiDateObj(calculateCheckOutDate(checkInDate, dur, isMonthly));
                      return `- ${item.roomData.name}: ${item.count} ห้อง × ${dur} ${isMonthly ? 'เดือน' : 'คืน'} (ถึง ${itemOutDate}) (฿${item.roomData.price}/${isMonthly ? 'เดือน' : 'คืน'})`;
                    }).join('\n');

                    const lineText = `สวัสดีครับ/ค่ะ สนใจจองห้องพัก:
${roomItemsText}
(รวมทั้งสิ้น ${totalRoomsCount} ห้อง)
วันที่เข้าพัก: ${formatThaiDate(checkInDate)}
เช็คเอ้าท์ชุดสุดท้าย: ${formatThaiDateObj(checkOutDateObj)}
ชื่อผู้เข้าพัก: ${guestName.trim() || 'ไม่ระบุ'}
เบอร์โทรติดต่อ: ${guestPhone.trim() || 'ไม่ระบุ'}
💰 ยอดรวมทั้งสิ้น: ฿${grandTotalCalc.toLocaleString()}`;

                    return (
                      <a
                        href={`https://line.me/ti/p/~0990954541?text=${encodeURIComponent(lineText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-modal-line-booking"
                      >
                        ยืนยันจองทาง LINE
                      </a>
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>,
          document.body
        )}

        {/* Lightbox for expanded images */}
        {expandedImage && (
          <div className="lightbox-overlay no-print" onClick={() => setExpandedImage(null)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button className="modal-close" style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '2.5rem' }} onClick={() => setExpandedImage(null)}>×</button>
            <img src={expandedImage} alt="Expanded view" className="lightbox-content" onClick={e => e.stopPropagation()} />
            <div style={{ color: 'white', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              แตะค้างที่รูปภาพเพื่อบันทึกลงเครื่อง
            </div>
          </div>
        )}

        <RoomComparisonModal
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
          t={t}
          language={language}
          onSelectRoom={(roomName) => {
            const matched = monthlyRoomsData.find((r: any) => r.name === roomName);
            if (matched) {
              setSelectedBookingRoom({ data: matched, isMonthly: true });
            }
          }}
        />

        <PromptPayModal
          isOpen={isPromptPayModalOpen}
          onClose={() => setIsPromptPayModalOpen(false)}
          t={t}
          language={language}
        />

        {copiedToast && (
          <div className="alert-toast">
            คัดลอก{copiedToast}สำเร็จแล้ว!
          </div>
        )}
      </div>
    </section>
  );
};
