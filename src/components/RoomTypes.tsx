import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { jsPDF } from 'jspdf';

import { LeaseModal } from './LeaseModal';
import { RoomComparisonModal } from './RoomComparisonModal';
import { PromptPayModal } from './PromptPayModal';
import { UtilityCalculator } from './UtilityCalculator';
import { RoomDetailsModal } from './RoomTypes/RoomDetailsModal';
import { DailyRoomCard, MonthlyRoomCard } from './RoomTypes/RoomCard';
import { BookingModal } from './RoomTypes/BookingModal';
import { parseArray, parseImageUrl } from './RoomTypes/utils';
import type { RoomTypesProps } from './RoomTypes/types';

export const RoomTypes: React.FC<RoomTypesProps> = ({
  t,
  language = 'th',
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  isAdmin,
  onEditRoom,
  onAddNewRoom,
  refreshTrigger = 0
}) => {
  const [internalTab, setInternalTab] = useState<'daily' | 'monthly'>('daily');
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : setInternalTab;
  const [selectedDetailsRoom, setSelectedDetailsRoom] = useState<any | null>(null);
  const [selectedBookingRoom, setSelectedBookingRoom] = useState<any | null>(null);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isPromptPayModalOpen, setIsPromptPayModalOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

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
          const daily = data.filter(r => r.room_type === 'daily').map(r => {
            const features = parseArray(r.features);
            const translated = getLocalizedDailyRoomInfo({ name: r.name, desc: r.description, features: features });
            const imgData = parseImageUrl(r.image_url);
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
              image: imgData.image,
              images: imgData.images
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
            const imgData = parseImageUrl(r.image_url);
            return {
              id: r.id,
              name: trans ? trans.name : r.name,
              desc: trans ? trans.desc : r.description,
              price: r.price,
              deposit: r.deposit,
              availableRoomsList: parseArray(r.available_room_numbers),
              features: trans ? trans.features : features,
              image: imgData.image,
              images: imgData.images
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



  const handleOpenBooking = (room: any) => {
    const roomData = room.data || room;
    const isMonthly = room.isMonthly || (roomData?.name && (roomData.name.includes('เดือน') || roomData.name.includes('Monthly'))) || activeTab === 'monthly';
    setSelectedBookingRoom({ ...room, isMonthly });
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

  const handleDownloadPDF = async () => {
    if (!expandedImage) return;
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(expandedImage);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(expandedImage, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const filename = `Booking_Summary_AT_${Date.now()}.pdf`;
      const blob = pdf.output('blob');
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let shared = false;
      
      if (isMobile && navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], filename, { type: 'application/pdf' });
          if (navigator.canShare({ files: [file] })) {
             await navigator.share({
               files: [file],
               title: 'ใบสรุปการจอง / ใบเสนอราคา',
               text: 'รายละเอียดการจองห้องพัก'
             });
             shared = true;
          }
        } catch (shareError) {
          console.warn('Share API failed, falling back to download:', shareError);
        }
      }
      
      if (!shared) {
         try {
            pdf.save(filename);
         } catch (e) {
            // Ultimate fallback for strict in-app browsers
            const blobUrl = URL.createObjectURL(blob);
            window.location.href = blobUrl;
         }
      }
      
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
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
                <DailyRoomCard
                  key={room.key}
                  room={room}
                  roomIdx={roomIdx}
                  isAdmin={isAdmin}
                  onEditRoom={onEditRoom}

                  t={t}
                  language={language}
                  onViewDetails={setSelectedDetailsRoom}
                  onBookNow={handleOpenBooking}
                />
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
              {monthlyRoomsData.map((room, idx) => (
                <MonthlyRoomCard
                  key={idx}
                  room={room}
                  roomIdx={idx}
                  isAdmin={isAdmin}
                  onEditRoom={onEditRoom}

                  t={t}
                  language={language}
                  onViewDetails={setSelectedDetailsRoom}
                  onBookNow={handleOpenBooking}
                />
              ))}
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

              {/* Highlight of Important Monthly Rules */}
              <div style={{
                backgroundColor: '#fff5f5',
                border: '1px solid #feb2b2',
                borderRadius: '12px',
                padding: '24px',
                marginTop: '32px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(229, 62, 62, 0.08)'
              }}>
                <h4 style={{ 
                  color: '#c53030', 
                  fontSize: '1.15rem', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '1.4rem' }}>⚠️</span> 
                  {language === 'en' ? 'Important Lease Agreement Details' : language === 'cn' ? '重要租赁协议详情' : language === 'mm' ? 'အရေးကြီးသော အိမ်ငှားစာချုပ်အချက်အလက်များ' : 'ข้อกำหนดและเงื่อนไขสำคัญของสัญญาเช่า'}
                </h4>
                
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  color: '#2d3748',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📅</span>
                    <div><strong>ระยะเวลาสัญญา:</strong> ขั้นต่ำ 1 ปี (หากอยู่ไม่ครบตามสัญญา จะไม่ได้รับเงินประกันคืน)</div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💰</span>
                    <div><strong>การชำระค่าเช่า:</strong> ชำระภายในวันที่ 25-30 ของทุกเดือน (หากเกินวันที่ 3 ของเดือนถัดไป มีค่าปรับวันละ 50 บาท)</div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📦</span>
                    <div><strong>การแจ้งย้ายออก:</strong> ต้องแจ้งล่วงหน้าไม่น้อยกว่า 30 วัน และขนย้ายได้เฉพาะเวลา 08:00 - 15:00 น.</div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🚫</span>
                    <div><strong>ข้อห้ามสำคัญ:</strong> ห้ามใช้เตาแก๊ส (ใช้ได้เฉพาะเตาไฟฟ้า), ห้ามเลี้ยงสัตว์ทุกชนิด, และ ห้ามสูบบุหรี่ในอาคาร (ฝ่าฝืนปรับ 2,000 บาท)</div>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>👥</span>
                    <div><strong>ผู้พักอาศัย:</strong> อนุญาตให้พักอาศัยได้สูงสุดไม่เกิน 2 ท่านต่อห้อง</div>
                  </li>
                </ul>
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
        <RoomDetailsModal
          room={selectedDetailsRoom}
          onClose={() => setSelectedDetailsRoom(null)}
          onImageClick={setExpandedImage}
        />

        {selectedBookingRoom && (
          <BookingModal
            room={selectedBookingRoom}
            dailyRooms={dailyRooms}
            monthlyRoomsData={monthlyRoomsData}
            onClose={() => setSelectedBookingRoom(null)}
            language={language}
            t={t}
            setExpandedImage={setExpandedImage}
          />
        )}

        {/* Lightbox for expanded images */}
        {expandedImage && (
          <div className="lightbox-overlay no-print" onClick={() => setExpandedImage(null)} style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <button className="modal-close" style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '2.5rem' }} onClick={() => setExpandedImage(null)}>×</button>
            <img src={expandedImage} alt="Expanded view" className="lightbox-content" onClick={e => e.stopPropagation()} style={{ maxHeight: '75vh', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadPDF();
                }}
                className="btn-primary"
                style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  padding: '12px 24px', borderRadius: '25px', backgroundColor: '#3182ce',
                  color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer', border: 'none'
                }}
              >
                📄 ดาวน์โหลดเป็น PDF (Save PDF)
              </button>
              <div style={{ color: 'white', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                หรือ แตะค้างที่รูปภาพเพื่อบันทึก
              </div>
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
