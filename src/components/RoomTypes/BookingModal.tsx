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
  const [customDeposit, setCustomDeposit] = useState<number | ''>('');
  const [keycardCount, setKeycardCount] = useState<number>(1);
  const summaryRef = useRef<HTMLDivElement>(null);
  const selectedBookingRoom = room;

  const isThai = language === 'th';
  
  const formatDateLocalized = (dateStr: string) => {
    if (!dateStr) return isThai ? 'ยังไม่ระบุ' : 'Not specified';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return dateStr;
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString(isThai ? 'th-TH' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  const formatDateObjLocalized = (date: Date | null) => {
    if (!date) return isThai ? 'ยังไม่ระบุ' : 'Not specified';
    return date.toLocaleDateString(isThai ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const loc = {
    back: isThai ? '{loc.back}' : '← Back',
    title: isThai ? 'สรุปรายการจอง{loc.roomUnit}พัก' : 'Booking Summary',
    docTitle: isThai ? 'ใบสรุปการจอง / ใบเสนอราคา' : 'QUOTATION & BOOKING SUMMARY',
    address: isThai ? '{loc.address}' : '1/9 Km.28 Rd, Mahachai, Mueang Samut Sakhon 74000 (Opposite Big C)',
    contact: isThai ? 'โทรติดต่อ' : 'Tel',
    ref: isThai ? 'เลขที่เอกสาร' : 'Ref No.',
    date: isThai ? 'วันที่ออกเอกสาร' : 'Date',
    monthlyPill: isThai ? '{loc.roomUnit}พักรายเดือน (Monthly)' : '🏨 Monthly Room',
    dailyPill: isThai ? '{loc.roomUnit}พักรายวัน (Daily)' : '🏨 Daily Room',
    summaryTotal: isThai ? 'สรุปรายการจอง{loc.roomUnit}พัก (รวม' : 'Booking Summary (Total',
    roomCount: isThai ? '{loc.roomUnit})' : 'Rooms)',
    allCount: isThai ? 'รวมทั้งสิ้น:' : 'Total:',
    location: isThai ? 'ใจกลางมหาชัย (ตรงข้าม Big C)' : 'Heart of Mahachai (Opposite Big C)',
    typeUnit: isThai ? 'ประเภท' : 'Types',
    inList: isThai ? '{loc.roomUnit}ในรายการ' : 'Rooms Listed',
    checkInDate: isThai ? '{loc.checkInDate}' : 'Check-in Date',
    durationMonthly: isThai ? '{loc.durationMonthly}' : 'Contract Duration (Min 12 Months / 1 Year)',
    durationDaily: isThai ? '{loc.durationDaily}' : 'Number of Nights',
    min12Msg: isThai ? 'สัญญาเช่ารายเดือนขั้นต่ำ 12 เดือน (1 ปี)' : 'Minimum 12 Months Contract',
    checkInPrefix: isThai ? 'เช็คอิน:' : 'Check-in:',
    checkOutPrefix: isThai ? 'เช็คเอ้าท์ (ถึงวันที่):' : 'Check-out (Until):',
    max12Msg: isThai ? '{loc.max12Msg}' : 'Max 12 Months',
    guestName: isThai ? 'ชื่อผู้เข้าพัก (Guest Name) *' : 'Guest Name *',
    guestNamePh: isThai ? 'ระบุชื่อ-นามสกุล' : 'Enter full name',
    guestPhone: isThai ? 'เบอร์โทรติดต่อ (Phone Number) *' : 'Phone Number *',
    guestPhonePh: isThai ? 'ระบุเบอร์โทรศัพท์' : 'Enter phone number',
    listRoomsMsg: isThai ? '{loc.listRoomsMsg}' : 'Selected Rooms to Book',
    canAddMore: isThai ? '{loc.canAddMore}' : 'You can add more room types and adjust duration separately',
    shortTermWarn: isThai ? 'สัญญาน้อยกว่า 12 เดือน (+1,000 บ./เดือน)' : 'Contract < 12 Months (+1,000 THB/m)',
    qty: isThai ? 'จำนวน:' : 'Qty:',
    roomUnit: isThai ? '{loc.roomUnit}' : 'Room(s)',
    durPrefix: isThai ? (isMonthly ? 'ระยะเวลา:' : 'จำนวนคืน:') : (isMonthly ? 'Duration:' : 'Nights:'),
    durUnit: isThai ? (isMonthly ? 'เดือน' : 'คืน') : (isMonthly ? 'Month(s)' : 'Night(s)'),
    delTitle: isThai ? 'ลบประเภท{loc.roomUnit}พักนี้' : 'Remove this room type',
    addAnother: isThai ? 'เลือกเพิ่มประเภท{loc.roomUnit}พักอื่น...' : 'Select another room type to add...',
    depTitle: isThai ? '{loc.depTitle}' : 'Deposit to confirm booking (Min 2,000 THB):',
    keycardTitle: isThai ? '{loc.keycardTitle}' : 'Keycard Fee (100 THB each, Max 3):',
    keycard0: isThai ? 'ไม่รับคีย์การ์ด (0 ใบ)' : 'No keycard (0)',
    keycard1: isThai ? '1 ใบ' : '1 Card',
    keycard2: isThai ? '2 ใบ' : '2 Cards',
    keycard3: isThai ? '3 ใบ' : '3 Cards',
    totalLock: isThai ? '{loc.totalLock}' : 'Total Amount to Confirm Booking:',
    payDepositLabel: isThai ? 'การชำระค่ามัดจำประกัน{loc.roomUnit}' : 'Deposit Payment Method',
    payOffice: isThai ? 'จ่ายหน้าออฟฟิศ' : 'Pay at Office',
    payOfficeSub: isThai ? 'ชำระวันเข้าพักที่เคาน์เตอร์' : 'Pay upon check-in at counter',
    payNow: isThai ? 'จ่ายพร้อมค่า{loc.roomUnit}' : 'Pay Now',
    payNowSub: isThai ? 'รวมยอดมัดจำในสลิปโอนนี้' : 'Include deposit in this transfer',
    thNo: isThai ? 'ลำดับ' : 'No.',
    thDesc: isThai ? 'รายการรายละเอียด (Description)' : 'Description',
    thQty: isThai ? 'จำนวน' : 'Qty',
    thUnit: isThai ? 'ราคา/หน่วย' : 'Unit Price',
    thAmt: isThai ? 'จำนวนเงิน' : 'Amount',
    descRent: isThai ? 'ค่าเช่า{loc.roomUnit}พัก' : 'Room Rental:',
    descCheckIn: isThai ? '{loc.descCheckIn}' : 'Check-in:',
    descShortWarn: isThai ? '{loc.descShortWarn}' : 'Contract < 12 Months: Price adjusted +1,000 THB/month (from base rate',
    descGuest: isThai ? '{loc.descGuest}' : 'Guest:',
    descNotSpec: isThai ? 'ยังไม่ระบุ' : 'Not specified',
    descPayMonth: isThai ? '{loc.descPayMonth}' : 'Pay Monthly',
    descDepMonthly: isThai ? 'เงินมัดจำประกัน{loc.roomUnit}พักเพื่อการจอง/เข้าพัก' : 'Room Deposit for Booking/Stay',
    descDepMonthlySub: isThai ? '✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่ออยู่ครบสัญญาและตรวจสอบ{loc.roomUnit}พักเรียบร้อย' : '✓ Full deposit refundable upon check-out if contract completed and room undamaged',
    descKeycard: isThai ? 'ค่าซื้อคีย์การ์ดเข้าอาคาร (Keycard Fee)' : 'Building Access Keycard Fee',
    descKeycardSub: isThai ? 'ค่าคีย์การ์ดสำหรับเข้า-ออกอาคารและ{loc.roomUnit}พัก (100 บาท / ใบ)' : 'Keycard for building and room access (100 THB / card)',
    descDepDaily: isThai ? 'ค่ามัดจำประกัน{loc.roomUnit}พัก' : 'Room Deposit',
    descDepDailySub: isThai ? '✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่อตรวจสอบ{loc.roomUnit}พักเรียบร้อย' : '✓ Full deposit refundable upon check-out if room undamaged',
    totalToPay: isThai ? '{loc.totalToPay}' : 'Total Amount Due (To Confirm Booking)',
    remainDep: isThai ? '{loc.remainDep}' : '* Remaining deposit to pay:',
    remainDepSub: isThai ? '{loc.remainDepSub}' : 'THB (Pay on check-in day)',
    termTitle: isThai ? '{loc.termTitle}' : 'Terms & Guidelines:',
    termMon1: isThai ? 'สัญญาเช่ารายเดือน: สัญญาเช่าขั้นต่ำ 12 เดือน (1 ปี) | กรณีสัญญาน้อยกว่า 12 เดือน ค่าเช่า{loc.roomUnit}จะปรับเพิ่มขึ้น +1,000 บาท/เดือน ทุกประเภท{loc.roomUnit} (พักอาศัยครบตามสัญญา ได้รับคืนเงินมัดจำประกันครบถ้วน)' : 'Monthly Contract: Minimum 12 months. Contracts < 12 months incur a +1,000 THB/month surcharge. Full deposit refunded upon contract completion.',
    termDaily1: isThai ? 'เวลาเช็คอิน: ตั้งแต่ 14:00 น. เป็นต้นไป | เวลาเช็คเอ้าท์: ไม่เกิน 12:00 น. (เที่ยงวัน)' : 'Check-in: From 14:00 onwards | Check-out: By 12:00 (Noon)',
    termDaily2: isThai ? 'สงวนสิทธิ์ไม่คืนเงินมัดจำกรณีเกิดความเสียหายใน{loc.roomUnit}พัก สูบบุหรี่ หรือทำผิดกฎระเบียบที่พัก' : 'Deposit is strictly non-refundable in cases of room damage, smoking indoors, or rule violations.',
    termGen1: isThai ? 'ห้ามเลี้ยงสัตว์เลี้ยงทุกชนิด และห้ามสูบบุหรี่ภายใน{loc.roomUnit}พักและตัวอาคาร' : 'No pets allowed. Smoking is strictly prohibited inside the room and building.',
    btnBank: isThai ? '{loc.btnBank}' : '🏧 Payment / Bank Account',
    btnPrint: isThai ? '{loc.btnPrint}' : '🖨️ Print / Save PDF',
    validationErr: isThai ? 'กรุณากรอกชื่อผู้เข้าพัก และ เบอร์โทรติดต่อ ให้ครบถ้วนก่อนทำการบันทึกหรือพิมพ์ใบจอง' : 'Please fill in Guest Name and Phone Number before saving or printing.'
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
    if (!guestName.trim() || !guestPhone.trim()) {
      alert(loc.validationErr);
      return;
    }
    
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
          <div className="modal-overlay" onClick={onClose}>
            <div className="booking-modal-card" onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="booking-modal-header no-print">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button className="modal-back-btn" onClick={onClose} title="ย้อนกลับ">
                    {loc.back}
                  </button>
                  <div className="modal-header-brand">
                    <span className="hotel-badge-pill">@Samutsakorn Mahachai</span>
                    <h3>สรุปรายการจอง{loc.roomUnit}พัก</h3>
                  </div>
                </div>
                <button className="modal-close-circle" onClick={onClose} title="ปิดหน้าต่าง">
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
                      <p><strong>{loc.contact}:</strong> 099-095-4541, 065-464-7459 &nbsp;|&nbsp; <strong>Line ID:</strong> 0990954541</p>
                    </div>
                  </div>

                  <div className="formal-header-right">
                    <div className="formal-doc-badge">ใบสรุปการจอง / ใบเสนอราคา</div>
                    <div className="formal-doc-english">QUOTATION & BOOKING SUMMARY</div>
                    <div className="formal-doc-meta">
                      <div><strong>เลขที่เอกสาร (REF):</strong> <span className="ref-highlight">#AT-{(Date.now() % 10000).toString().padStart(4, '0')}</span></div>
                      <div><strong>{loc.date}:</strong> {formatDateLocalized(new Date().toISOString().split('T')[0])}</div>
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
                          {isMonthly ? '{loc.roomUnit}พักรายเดือน (Monthly)' : '{loc.dailyPill}'}
                        </span>
                        <h4 className="room-banner-title">
                          {selectedBookingItems.length === 1 
                            ? selectedBookingItems[0]?.roomData?.name 
                            : `สรุปรายการจอง{loc.roomUnit}พัก (รวม ${totalRoomsCount} {loc.roomUnit})`}
                        </h4>
                        <div className="room-banner-meta">
                          <span>👥 รวมทั้งสิ้น: {totalRoomsCount} {loc.roomUnit}</span>
                          <span>ใจกลางมหาชัย (ตรงข้าม Big C)</span>
                        </div>
                      </div>
                      <div className="room-banner-price-tag">
                        <span className="price-amount">{selectedBookingItems.length} ประเภท</span>
                        <span className="price-unit">{totalRoomsCount} {loc.roomUnit}ในรายการ</span>
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

                  const effectiveDepositToPay = customDeposit !== '' ? customDeposit : totalDeposit;
                  const totalKeycardFee = isMonthly ? (100 * keycardCount) : 0;

                  const grandTotalCalc = isMonthly ? (effectiveDepositToPay + totalKeycardFee) : (totalRoomRental + (payDepositNow ? effectiveDepositToPay : 0));

                  const availableRoomsList = isMonthly ? monthlyRoomsData : dailyRooms;

                  return (
                    <>
                      <div className="booking-inputs-grid no-print">
                        
                        {/* Multi-Room Item Selector */}
                        <div className="booking-input-group full-width">
                          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                            <span>{loc.listRoomsMsg} (รวม {totalRoomsCount} {loc.roomUnit})</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>{loc.canAddMore}</span>
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
                                        <span className="counter-val-display">{item.count} {loc.roomUnit}</span>
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
                                        title="ลบประเภท{loc.roomUnit}พักนี้"
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
                              <option value="">เลือกเพิ่มประเภท{loc.roomUnit}พักอื่น...</option>
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
                          <label>{loc.checkInDate}</label>
                          <input
                            type="date"
                            className="booking-text-input"
                            value={checkInDate}
                            onChange={e => setCheckInDate(e.target.value)}
                          />
                        </div>

                        {isMonthly ? (
                          <div className="booking-input-group">
                            <label>{loc.durationMonthly}</label>
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
                                ? 'สัญญาน้อยกว่า 12 เดือน: คิดอัตราค่า{loc.roomUnit}เพิ่ม +1,000 บาท/เดือน'
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
                              <span><strong>เช็คอิน:</strong> <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '1.05rem' }}>{formatDateLocalized(checkInDate)}</span></span>
                            </div>
                            <div style={{ color: '#0284c7', fontWeight: 'bold', fontSize: '1.3rem' }}>➔</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '1.2rem' }}></span>
                              <span><strong>เช็คเอ้าท์ (ถึงวันที่):</strong> <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.15rem' }}>{formatDateObjLocalized(checkOutDateObj)}</span></span>
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
                          <label>ชื่อผู้เข้าพัก (Guest Name) <span style={{color: 'red'}}>*</span></label>
                          <input
                            type="text"
                            className="booking-text-input"
                            placeholder={loc.guestNamePh}
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                          />
                        </div>

                        <div className="booking-input-group">
                          <label>เบอร์โทรติดต่อ (Phone Number) <span style={{color: 'red'}}>*</span></label>
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
                            <label>ยอดเงินมัดจำประกัน{loc.roomUnit}และค่าคีย์การ์ดเพื่อยืนยันการจอง (รวม {totalRoomsCount} {loc.roomUnit})</label>
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
                                  <span>{loc.depTitle}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                      type="number" 
                                      min="2000" 
                                      max={totalDeposit} 
                                      value={customDeposit === '' ? totalDeposit : customDeposit}
                                      onChange={e => {
                                        const val = parseInt(e.target.value);
                                        if (isNaN(val)) setCustomDeposit('');
                                        else setCustomDeposit(val);
                                      }}
                                      onBlur={() => {
                                        if (typeof customDeposit === 'number') {
                                          if (customDeposit < 2000) setCustomDeposit(2000);
                                          else if (customDeposit > totalDeposit) setCustomDeposit(totalDeposit);
                                        }
                                      }}
                                      style={{ width: '100px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'right', fontSize: '0.9rem' }}
                                    />
                                    <span>บาท</span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                  <span>{loc.keycardTitle}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <select 
                                      value={keycardCount}
                                      onChange={e => setKeycardCount(Number(e.target.value))}
                                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                                    >
                                      <option value={1}>{loc.keycard1} (฿100)</option>
                                      <option value={2}>{loc.keycard2} (฿200)</option>
                                      <option value={3}>{loc.keycard3} (฿300)</option>
                                    </select>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed #93c5fd', marginTop: '6px' }}>
                                <span>💰 {loc.totalLock}</span>
                                <span style={{ fontSize: '1.25rem', color: '#004088', fontWeight: 800 }}>฿{grandTotalCalc.toLocaleString()} บาท</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="booking-input-group full-width">
                            <label>การชำระค่ามัดจำประกัน{loc.roomUnit} (รวม ฿{totalDeposit.toLocaleString()} บาท / {totalRoomsCount} {loc.roomUnit})</label>
                            <div className="deposit-toggle-group">
                              <div
                                className={`deposit-toggle-card ${!payDepositNow ? 'active' : ''}`}
                                onClick={() => setPayDepositNow(false)}
                              >
                                <div className="radio-dot"></div>
                                <div className="toggle-info">
                                  <strong>{loc.payOffice}</strong>
                                  <span>{loc.payOfficeSub}</span>
                                </div>
                              </div>

                              <div
                                className={`deposit-toggle-card ${payDepositNow ? 'active' : ''}`}
                                onClick={() => setPayDepositNow(true)}
                              >
                                <div className="radio-dot"></div>
                                <div className="toggle-info">
                                  <strong>จ่ายพร้อมค่า{loc.roomUnit}</strong>
                                  <span>{loc.payNowSub}</span>
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
                              <th style={{ width: '8%', textAlign: 'center' }}>{loc.thNo}</th>
                              <th style={{ width: '47%' }}>{loc.thDesc}</th>
                              <th style={{ width: '15%', textAlign: 'center' }}>{loc.thQty}</th>
                              <th style={{ width: '15%', textAlign: 'right' }}>{loc.thUnit}</th>
                              <th style={{ width: '15%', textAlign: 'right' }}>{loc.thAmt}</th>
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
                                    <strong>ค่าเช่า{loc.roomUnit}พัก {item.roomData?.name}</strong> ({isMonthly ? 'รายเดือน' : 'รายวัน'})
                                    <div className="table-sub-detail">
                                      {loc.descCheckIn} {formatDateLocalized(checkInDate)} ➔ {formatDateObjLocalized(itemCheckOutDate)} ({itemDur} {isMonthly ? 'เดือน' : 'คืน'})
                                    </div>
                                    {isShortTerm && (
                                      <div className="table-sub-detail" style={{ color: '#c53030', fontWeight: 'bold' }}>
                                        {loc.descShortWarn} ฿{basePriceNum.toLocaleString()})
                                      </div>
                                    )}
                                    <div className="table-sub-detail">
                                      {loc.descGuest} {guestName.trim() || 'ยังไม่ระบุ'} ({guestPhone.trim() || 'ยังไม่ระบุ'})
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.count} {loc.roomUnit} ({itemDur} {isMonthly ? 'เดือน' : 'คืน'})
                                  </td>
                                  <td style={{ textAlign: 'right' }}>฿{effectivePriceNum.toLocaleString()} / {isMonthly ? 'เดือน' : 'คืน'}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                    {isMonthly ? (
                                      <span style={{ color: '#475569', fontSize: '0.82rem' }}>{loc.descPayMonth}</span>
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
                                    <strong>เงินมัดจำประกัน{loc.roomUnit}พักเพื่อการจอง/เข้าพัก (รวม {totalRoomsCount} {loc.roomUnit})</strong>
                                    <div className="table-sub-detail" style={{ color: '#059669', fontWeight: 600 }}>
                                      ✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่ออยู่ครบสัญญาและตรวจสอบ{loc.roomUnit}พักเรียบร้อย
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{totalRoomsCount} {loc.roomUnit}</td>
                                  <td style={{ textAlign: 'right' }}>฿{totalRoomsCount > 0 ? (totalDeposit / totalRoomsCount).toLocaleString() : '0'}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#004088', fontSize: '0.95rem' }}>฿{effectiveDepositToPay.toLocaleString()}</td>
                                </tr>
                                {keycardCount > 0 && (
                                  <tr>
                                    <td style={{ textAlign: 'center' }}>{selectedBookingItems.length + 2}</td>
                                    <td>
                                      <strong>{loc.descKeycard}</strong>
                                      <div className="table-sub-detail" style={{ color: '#475569' }}>
                                        ค่าคีย์การ์ดสำหรับเข้า-ออกอาคารและ{loc.roomUnit}พัก (100 บาท / ใบ)
                                      </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{keycardCount} ใบ</td>
                                    <td style={{ textAlign: 'right' }}>฿100</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#004088', fontSize: '0.95rem' }}>฿{totalKeycardFee.toLocaleString()}</td>
                                  </tr>
                                )}
                              </>
                            ) : (
                              payDepositNow ? (
                                <tr>
                                  <td style={{ textAlign: 'center' }}>{selectedBookingItems.length + 1}</td>
                                  <td>
                                    <strong>ค่ามัดจำประกัน{loc.roomUnit}พัก (รวม {totalRoomsCount} {loc.roomUnit})</strong>
                                    <div className="table-sub-detail" style={{ color: '#059669', fontWeight: 600 }}>
                                      ✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่อตรวจสอบ{loc.roomUnit}พักเรียบร้อย
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{totalRoomsCount} {loc.roomUnit}</td>
                                  <td style={{ textAlign: 'right' }}>฿{totalRoomsCount > 0 ? (totalDeposit / totalRoomsCount).toLocaleString() : '0'}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>฿{effectiveDepositToPay.toLocaleString()}</td>
                                </tr>
                              ) : (
                                <tr>
                                  <td style={{ textAlign: 'center' }}>{selectedBookingItems.length + 1}</td>
                                  <td>
                                    <strong>ค่ามัดจำประกัน{loc.roomUnit}พัก (ชำระวันเข้าพัก รวม {totalRoomsCount} {loc.roomUnit})</strong>
                                    <div className="table-sub-detail" style={{ color: '#d97706', fontWeight: 600 }}>
                                      ชำระ ฿{totalDeposit.toLocaleString()} หน้าเคาน์เตอร์วันเช็คอิน (คืนเงินมัดจำวันเช็คเอ้าท์)
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{totalRoomsCount} {loc.roomUnit}</td>
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
                                    ? `(รวมเงินมัดจำประกัน{loc.roomUnit} ฿${totalDeposit.toLocaleString()} + ค่าคีย์การ์ด ฿${totalKeycardFee.toLocaleString()} | ค่าเช่า{loc.descPayMonth} ณ วันเข้าพัก)`
                                    : (payDepositNow ? '(รวมค่า{loc.roomUnit}และค่ามัดจำประกัน{loc.roomUnit}แล้ว)' : '(ยังไม่รวมค่ามัดจำประกัน{loc.roomUnit}ที่ชำระวันเช็คอิน)')}
                                </span>
                              </td>
                              <td colSpan={2} className="total-amount-cell">
                                ฿{grandTotalCalc.toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {(typeof customDeposit === 'number' && customDeposit < totalDeposit) && (
                        <div className="no-print" style={{ textAlign: 'right', color: '#b91c1c', fontSize: '0.9rem', marginTop: '4px', fontWeight: 'bold' }}>
                          {loc.remainDep} ฿{(totalDeposit - customDeposit).toLocaleString()} {loc.remainDepSub}
                        </div>
                      )}

                      {/* Terms & Guidelines Box */}
                      <div className="formal-terms-box">
                        <div className="terms-title">{loc.termTitle}</div>
                        <ul>
                          {isMonthly && (
                            <li style={{ color: '#004088', fontWeight: 'bold' }}>
                              <strong>สัญญาเช่ารายเดือน:</strong> สัญญาเช่าขั้นต่ำ 12 เดือน (1 ปี) | กรณีสัญญาน้อยกว่า 12 เดือน ค่าเช่า{loc.roomUnit}จะปรับเพิ่มขึ้น <strong>+1,000 บาท/เดือน</strong> ทุกประเภท{loc.roomUnit} (พักอาศัยครบตามสัญญา ได้รับคืนเงินมัดจำประกันครบถ้วน)
                            </li>
                          )}
                          {!isMonthly && (
                            <li><strong>เวลาเช็คอิน (Check-in):</strong> ตั้งแต่ 14:00 น. เป็นต้นไป | <strong>เวลาเช็คเอ้าท์ (Check-out):</strong> ไม่เกิน 12:00 น.</li>
                          )}
                          
                          {isMonthly ? (
                            <>
                              <li><strong>เงินมัดจำประกัน{loc.roomUnit}:</strong> จะได้รับคืนเต็มจำนวนในวันเช็คเอ้าท์เมื่อลูกบ้านพักอยู่ครบสัญญาและออกตามสัญญา</li>
                              <li><strong>การทำสัญญา:</strong> สามารถทำสัญญาได้หลังจากจ่ายค่ามัดจำ{loc.roomUnit}ครบ</li>
                            </>
                          ) : (
                            <li><strong>เงินมัดจำประกัน{loc.roomUnit}:</strong> จะได้รับคืนเต็มจำนวนในวันเช็คเอ้าท์ หลังเจ้าหน้าที่ตรวจสอบความเรียบร้อยของ{loc.roomUnit}พัก</li>
                          )}
                          
                          <li><strong>การยืนยันจอง:</strong> ติดต่อเจ้าหน้าที่แผนกต้อนรับทาง LINE Official: <code>0990954541</code> หรือโทร <code>099-095-4541</code></li>
                        </ul>
                      </div>

                      {/* Signature & Issuer Seal */}
                      <div className="formal-signature-bar" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <div className="no-print" style={{ color: '#e11d48', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4 }}>
                          * รบกวนตรวจสอบข้อมูลลูกค้าให้ถูกต้องและกด "บันทึกเอกสาร" ก่อนส่งเข้าไลน์
                        </div>
                      </div>
                    </>
                  );
                })()}

              </div>

              {/* Modal Footer Buttons */}
              <div className="booking-modal-footer no-print">
                <button className="btn-modal-close" onClick={onClose}>
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
