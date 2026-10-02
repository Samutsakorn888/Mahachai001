// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { calculateCheckOutDate, formatThaiDate, formatThaiDateObj } from './utils';
import type { Translations, Language } from '../../i18n/translations';
import type { BookingItem } from './types';

interface BookingModalProps {
  room: any;
  dailyRooms: any[];
  monthlyRoomsData: any[];
  onClose: () => void;
  language: Language;
  t: Translations;
  setExpandedImage: (img: string | null) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  dailyRooms,
  monthlyRoomsData,
  onClose,
  language,
  t,
  setExpandedImage
}) => {
  const isMonthly = room.isMonthly || false;
  const initialDuration = isMonthly ? 12 : 1;
  const roomData = room.data || room;
  const [selectedBookingItems, setSelectedBookingItems] = useState<Array<{ roomData: any; count: number; duration?: number }>>([{ roomData, count: 1, duration: initialDuration }]);
  const [bookingNights, setBookingNights] = useState<number | ''>(1);
  const [bookingMonths, setBookingMonths] = useState<number | ''>(initialDuration);
  const [payDepositNow, setPayDepositNow] = useState<boolean>(false);
  const [checkInDate, setCheckInDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const selectedBookingRoom = room;
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



  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToast(label);
      setTimeout(() => setCopiedToast(null), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handlePrintOrDownload = async () => {
    if (!summaryRef.current) return;
    const printHeader = summaryRef.current.querySelector('.print-only') as HTMLElement;
    if (printHeader) printHeader.style.display = 'block';
    const originalStyle = summaryRef.current.getAttribute('style') || '';
    
    // Set fixed width and styles to match the A4/PDF print layout
    summaryRef.current.style.width = '800px';
    summaryRef.current.style.maxWidth = '800px';
    summaryRef.current.style.padding = '30px';
    summaryRef.current.style.backgroundColor = '#ffffff';
    summaryRef.current.style.color = '#000000';
    
    const noPrintElements = summaryRef.current.querySelectorAll('.no-print');
    noPrintElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        windowWidth: 800,
      });
      const image = canvas.toDataURL('image/png', 1.0);
      
      const link = document.createElement('a');
      link.download = `Booking_Summary_AT_Samutsakorn_${Date.now()}.png`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการสร้างเอกสาร');
    } finally {
      summaryRef.current.setAttribute('style', originalStyle);
      if (printHeader) printHeader.style.display = 'none';
      noPrintElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
    }
  };
        return createPortal(
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
                      <p><strong>โทรติดต่อ:</strong> 099-095-4541, 065-464-7459 &nbsp;|&nbsp; <strong>Line ID:</strong> 0990954541</p>
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
                          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
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
                          {!isMonthly && (
                            <li><strong>เวลาเช็คอิน (Check-in):</strong> ตั้งแต่ 14:00 น. เป็นต้นไป | <strong>เวลาเช็คเอ้าท์ (Check-out):</strong> ไม่เกิน 12:00 น.</li>
                          )}
                          
                          {isMonthly ? (
                            <>
                              <li><strong>เงินมัดจำประกันห้อง:</strong> จะได้รับคืนเต็มจำนวนในวันเช็คเอ้าท์เมื่อลูกบ้านพักอยู่ครบสัญญาและออกตามสัญญา</li>
                              <li><strong>การทำสัญญา:</strong> สามารถทำสัญญาได้หลังจากจ่ายค่ามัดจำห้องครบ</li>
                            </>
                          ) : (
                            <li><strong>เงินมัดจำประกันห้อง:</strong> จะได้รับคืนเต็มจำนวนในวันเช็คเอ้าท์ หลังเจ้าหน้าที่ตรวจสอบความเรียบร้อยของห้องพัก</li>
                          )}
                          
                          <li><strong>การยืนยันจอง:</strong> ติดต่อเจ้าหน้าที่แผนกต้อนรับทาง LINE Official: <code>0990954541</code> หรือโทร <code>099-095-4541</code></li>
                        </ul>
                      </div>

                      {/* Signature & Issuer Seal */}
                      <div className="formal-signature-bar" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div className="no-print" style={{ flex: 1, paddingRight: '20px', color: '#e11d48', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4 }}>
                          * รบกวนตรวจสอบข้อมูลลูกค้าให้ถูกต้องและกด "บันทึกเอกสาร" ก่อนส่งเข้าไลน์
                        </div>
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
                  <button className="btn-modal-outline" onClick={handlePrintOrDownload}>
                    บันทึกเอกสาร (PNG)
                  </button>
                  {(() => {
                    return (
                      <a
                        href="https://line.me/ti/p/~0990954541"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-modal-line-booking"
                      >
                        ช่องทางส่งใบจองLine
                      </a>
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>,
    document.body
  );
};
