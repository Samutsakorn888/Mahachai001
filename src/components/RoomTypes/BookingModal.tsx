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

  
  const allLocs = {
    th: {
      back: '← ย้อนกลับ',
      title: 'สรุปรายการจองห้องพัก',
      docTitle: 'ใบสรุปการจอง / ใบเสนอราคา',
      docEng: 'QUOTATION & BOOKING SUMMARY',
      address: '1/9 ถนนกิโลเมตร 28 ต.มหาชัย อ.เมืองสมุทรสาคร จ.สมุทรสาคร 74000 (ตรงข้าม Big C มหาชัย)',
      contact: 'โทรติดต่อ',
      ref: 'เลขที่เอกสาร',
      date: 'วันที่ออกเอกสาร',
      monthlyPill: 'ห้องพักรายเดือน (Monthly)',
      dailyPill: 'ห้องพักรายวัน (Daily)',
      summaryTotal: 'สรุปรายการจองห้องพัก (รวม',
      roomCount: 'ห้อง)',
      allCount: 'รวมทั้งสิ้น:',
      location: 'ใจกลางมหาชัย (ตรงข้าม Big C)',
      typeUnit: 'ประเภท',
      inList: 'ห้องในรายการ',
      checkInDate: 'วันที่เริ่มเข้าพัก (Check-in Date)',
      durationMonthly: 'ระยะเวลาเข้าพักตั้งต้น (สัญญาขั้นต่ำ 12 เดือน / 1 ปี)',
      durationDaily: 'จำนวนคืน (Nights)',
      min12Msg: 'สัญญาเช่ารายเดือนขั้นต่ำ 12 เดือน (1 ปี)',
      checkInPrefix: 'เช็คอิน:',
      checkOutPrefix: 'เช็คเอ้าท์ (ถึงวันที่):',
      max12Msg: 'สูงสุด 12 เดือน',
      guestName: 'ชื่อผู้เข้าพัก (Guest Name) *',
      guestNamePh: 'ระบุชื่อ-นามสกุล',
      guestPhone: 'เบอร์โทรติดต่อ (Phone Number) *',
      guestPhonePh: 'ระบุเบอร์โทรศัพท์',
      listRoomsMsg: 'รายการห้องพักที่ต้องการจอง',
      canAddMore: 'สามารถเลือกเพิ่มประเภทห้องและปรับจำนวนคืน/เดือนแยกได้',
      shortTermWarn: 'สัญญาน้อยกว่า 12 เดือน (+1,000 บ./เดือน)',
      qty: 'จำนวน:',
      roomUnit: 'ห้อง',
      durPrefix: isMonthly ? 'ระยะเวลา:' : 'จำนวนคืน:',
      durUnit: isMonthly ? 'เดือน' : 'คืน',
      delTitle: 'ลบประเภทห้องพักนี้',
      addAnother: 'เลือกเพิ่มประเภทห้องพักอื่น...',
      depTitle: 'ยอดเงินมัดจำเพื่อยืนยันการจอง (ขั้นต่ำ 2,000 บาท):',
      keycardTitle: 'ค่าซื้อคีย์การ์ดเข้าอาคาร (ใบละ 100 บาท สูงสุด 3 ใบ):',
      keycard0: 'ไม่รับคีย์การ์ด (0 ใบ)',
      keycard1: '1 ใบ',
      keycard2: '2 ใบ',
      keycard3: '3 ใบ',
      totalLock: 'ยอดรวมที่ต้องชำระเพื่อล็อคสิทธิ์จอง:',
      payDepositLabel: 'การชำระค่ามัดจำประกันห้อง',
      payOffice: 'จ่ายหน้าออฟฟิศ',
      payOfficeSub: 'ชำระวันเข้าพักที่เคาน์เตอร์',
      payNow: 'จ่ายพร้อมค่าห้อง',
      payNowSub: 'รวมยอดมัดจำในสลิปโอนนี้',
      thNo: 'ลำดับ',
      thDesc: 'รายการรายละเอียด (Description)',
      thQty: 'จำนวน',
      thUnit: 'ราคา/หน่วย',
      thAmt: 'จำนวนเงิน',
      descRent: 'ค่าเช่าห้องพัก',
      descCheckIn: 'กำหนดเข้าพัก:',
      descShortWarn: 'สัญญาน้อยกว่า 12 เดือน: ปรับราคาเพิ่ม +1,000 บ./เดือน (จากราคาปกติ',
      descGuest: 'ผู้เข้าพัก:',
      descNotSpec: 'ยังไม่ระบุ',
      descPayMonth: 'ชำระรายเดือน',
      descDepMonthly: 'เงินมัดจำประกันห้องพักเพื่อการจอง/เข้าพัก',
      descDepMonthlySub: '✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่ออยู่ครบสัญญาและตรวจสอบห้องพักเรียบร้อย',
      descKeycard: 'ค่าซื้อคีย์การ์ดเข้าอาคาร (Keycard Fee)',
      descKeycardSub: 'ค่าคีย์การ์ดสำหรับเข้า-ออกอาคารและห้องพัก (100 บาท / ใบ)',
      descDepDaily: 'ค่ามัดจำประกันห้องพัก',
      descDepDailySub: '✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่อตรวจสอบห้องพักเรียบร้อย',
      totalToPay: 'ยอดรวมที่ต้องชำระ (เพื่อยืนยันการจอง)',
      remainDep: '* ค้างชำระเงินมัดจำส่วนที่เหลืออีก',
      remainDepSub: 'บาท (ชำระในวันทำสัญญา/เข้าพัก)',
      termTitle: 'ข้อกำหนดการเข้าพักและเงื่อนไข (Terms & Guidelines):',
      termMon1: 'สัญญาเช่ารายเดือน: สัญญาเช่าขั้นต่ำ 12 เดือน (1 ปี) | กรณีสัญญาน้อยกว่า 12 เดือน ค่าเช่าห้องจะปรับเพิ่มขึ้น +1,000 บาท/เดือน ทุกประเภทห้อง (พักอาศัยครบตามสัญญา ได้รับคืนเงินมัดจำประกันครบถ้วน)',
      termDaily1: 'เวลาเช็คอิน: ตั้งแต่ 14:00 น. เป็นต้นไป | เวลาเช็คเอ้าท์: ไม่เกิน 12:00 น. (เที่ยงวัน)',
      termDaily2: 'สงวนสิทธิ์ไม่คืนเงินมัดจำกรณีเกิดความเสียหายในห้องพัก สูบบุหรี่ หรือทำผิดกฎระเบียบที่พัก',
      termGen1: 'ห้ามเลี้ยงสัตว์เลี้ยงทุกชนิด และห้ามสูบบุหรี่ภายในห้องพักและตัวอาคาร',
      btnBank: '🏧 ชำระเงิน / ดูเลขบัญชีโอน',
      btnPrint: '🖨️ พิมพ์ / บันทึก PDF ใบจอง',
      validationErr: 'กรุณากรอกชื่อผู้เข้าพัก และ เบอร์โทรติดต่อ ให้ครบถ้วนก่อนทำการบันทึกหรือพิมพ์ใบจอง'
    },
    en: {
      back: '← Back',
      title: 'Booking Summary',
      docTitle: 'QUOTATION & BOOKING SUMMARY',
      docEng: '',
      address: '1/9 Km.28 Rd, Mahachai, Mueang Samut Sakhon 74000 (Opposite Big C)',
      contact: 'Tel',
      ref: 'Ref No.',
      date: 'Date',
      monthlyPill: '🏨 Monthly Room',
      dailyPill: '🏨 Daily Room',
      summaryTotal: 'Booking Summary (Total',
      roomCount: 'Rooms)',
      allCount: 'Total:',
      location: 'Heart of Mahachai (Opposite Big C)',
      typeUnit: 'Types',
      inList: 'Rooms Listed',
      checkInDate: 'Check-in Date',
      durationMonthly: 'Contract Duration (Min 12 Months / 1 Year)',
      durationDaily: 'Number of Nights',
      min12Msg: 'Minimum 12 Months Contract',
      checkInPrefix: 'Check-in:',
      checkOutPrefix: 'Check-out (Until):',
      max12Msg: 'Max 12 Months',
      guestName: 'Guest Name *',
      guestNamePh: 'Enter full name',
      guestPhone: 'Phone Number *',
      guestPhonePh: 'Enter phone number',
      listRoomsMsg: 'Selected Rooms to Book',
      canAddMore: 'You can add more room types and adjust duration separately',
      shortTermWarn: 'Contract < 12 Months (+1,000 THB/m)',
      qty: 'Qty:',
      roomUnit: 'Room(s)',
      durPrefix: isMonthly ? 'Duration:' : 'Nights:',
      durUnit: isMonthly ? 'Month(s)' : 'Night(s)',
      delTitle: 'Remove this room type',
      addAnother: 'Select another room type to add...',
      depTitle: 'Deposit to confirm booking (Min 2,000 THB):',
      keycardTitle: 'Keycard Fee (100 THB each, Max 3):',
      keycard0: 'No keycard (0)',
      keycard1: '1 Card',
      keycard2: '2 Cards',
      keycard3: '3 Cards',
      totalLock: 'Total Amount to Confirm Booking:',
      payDepositLabel: 'Deposit Payment Method',
      payOffice: 'Pay at Office',
      payOfficeSub: 'Pay upon check-in at counter',
      payNow: 'Pay Now',
      payNowSub: 'Include deposit in this transfer',
      thNo: 'No.',
      thDesc: 'Description',
      thQty: 'Qty',
      thUnit: 'Unit Price',
      thAmt: 'Amount',
      descRent: 'Room Rental:',
      descCheckIn: 'Check-in:',
      descShortWarn: 'Contract < 12 Months: Price adjusted +1,000 THB/month (from base rate',
      descGuest: 'Guest:',
      descNotSpec: 'Not specified',
      descPayMonth: 'Pay Monthly',
      descDepMonthly: 'Room Deposit for Booking/Stay',
      descDepMonthlySub: '✓ Full deposit refundable upon check-out if contract completed and room undamaged',
      descKeycard: 'Building Access Keycard Fee',
      descKeycardSub: 'Keycard for building and room access (100 THB / card)',
      descDepDaily: 'Room Deposit',
      descDepDailySub: '✓ Full deposit refundable upon check-out if room undamaged',
      totalToPay: 'Total Amount Due (To Confirm Booking)',
      remainDep: '* Remaining deposit to pay:',
      remainDepSub: 'THB (Pay on check-in day)',
      termTitle: 'Terms & Guidelines:',
      termMon1: 'Monthly Contract: Minimum 12 months. Contracts < 12 months incur a +1,000 THB/month surcharge. Full deposit refunded upon contract completion.',
      termDaily1: 'Check-in: From 14:00 onwards | Check-out: By 12:00 (Noon)',
      termDaily2: 'Deposit is strictly non-refundable in cases of room damage, smoking indoors, or rule violations.',
      termGen1: 'No pets allowed. Smoking is strictly prohibited inside the room and building.',
      btnBank: '🏧 Payment / Bank Account',
      btnPrint: '🖨️ Print / Save PDF',
      validationErr: 'Please fill in Guest Name and Phone Number before saving or printing.'
    },
    cn: {
      back: '← 返回',
      title: '预订摘要',
      docTitle: '报价单及预订摘要',
      docEng: '',
      address: '1/9 Km.28 Rd, Mahachai, Mueang Samut Sakhon 74000 (Big C 玛哈猜对面)',
      contact: '联系电话',
      ref: '参考编号',
      date: '日期',
      monthlyPill: '🏨 月租客房',
      dailyPill: '🏨 日租客房',
      summaryTotal: '预订摘要 (共',
      roomCount: '间)',
      allCount: '总计:',
      location: '玛哈猜市中心 (Big C 对面)',
      typeUnit: '类型',
      inList: '已选客房',
      checkInDate: '入住日期',
      durationMonthly: '租期 (最短 12 个月 / 1 年)',
      durationDaily: '晚数',
      min12Msg: '最少 12 个月合同',
      checkInPrefix: '入住:',
      checkOutPrefix: '退房 (至):',
      max12Msg: '最多 12 个月',
      guestName: '住客姓名 *',
      guestNamePh: '输入全名',
      guestPhone: '电话号码 *',
      guestPhonePh: '输入电话号码',
      listRoomsMsg: '要预订的客房',
      canAddMore: '您可以添加更多房型并分别调整租期',
      shortTermWarn: '合同 < 12 个月 (+1,000 泰铢/月)',
      qty: '数量:',
      roomUnit: '间',
      durPrefix: isMonthly ? '时长:' : '晚数:',
      durUnit: isMonthly ? '个月' : '晚',
      delTitle: '删除此房型',
      addAnother: '选择其他房型添加...',
      depTitle: '确认预订的押金 (最少 2,000 泰铢):',
      keycardTitle: '门禁卡费 (每张 100 泰铢，最多 3 张):',
      keycard0: '不需要门禁卡 (0)',
      keycard1: '1 张卡',
      keycard2: '2 张卡',
      keycard3: '3 张卡',
      totalLock: '确认预订总额:',
      payDepositLabel: '押金支付方式',
      payOffice: '前台支付',
      payOfficeSub: '办理入住时在前台支付',
      payNow: '立即支付',
      payNowSub: '将押金包含在此次转账中',
      thNo: '序号',
      thDesc: '说明',
      thQty: '数量',
      thUnit: '单价',
      thAmt: '金额',
      descRent: '客房租金:',
      descCheckIn: '入住:',
      descShortWarn: '合同 < 12 个月: 价格调整 +1,000 泰铢/月 (基于原价',
      descGuest: '住客:',
      descNotSpec: '未指定',
      descPayMonth: '月付',
      descDepMonthly: '客房预订/入住押金',
      descDepMonthlySub: '✓ 合同完成且房间无损坏，退房时全额退还押金',
      descKeycard: '大楼门禁卡费',
      descKeycardSub: '用于进出大楼和房间的门禁卡 (100 泰铢 / 张)',
      descDepDaily: '客房押金',
      descDepDailySub: '✓ 房间无损坏，退房时全额退还押金',
      totalToPay: '应付总额 (以确认预订)',
      remainDep: '* 剩余需付押金:',
      remainDepSub: '泰铢 (入住当天支付)',
      termTitle: '入住条款与指南:',
      termMon1: '月租合同: 最短 12 个月。合同期 < 12 个月加收 1,000 泰铢/月。合同期满后全额退还押金。',
      termDaily1: '入住: 14:00 起 | 退房: 12:00 (中午) 前',
      termDaily2: '如有损坏房间、室内吸烟或违规行为，押金概不退还。',
      termGen1: '禁止携带宠物。房间及大楼内严禁吸烟。',
      btnBank: '🏧 付款 / 银行账户',
      btnPrint: '🖨️ 打印 / 保存 PDF',
      validationErr: '请在保存或打印前填写住客姓名和电话号码。'
    },
    mm: {
      back: '← နောက်သို့',
      title: 'ကြိုတင်မှာယူမှု အကျဉ်းချုပ်',
      docTitle: 'QUOTATION & BOOKING SUMMARY',
      docEng: '',
      address: '1/9 Km.28 Rd, Mahachai, Mueang Samut Sakhon 74000 (Big C မျက်စောင်းထိုး)',
      contact: 'ဖုန်း',
      ref: 'Ref No.',
      date: 'ရက်စွဲ',
      monthlyPill: '🏨 လစဉ်အခန်း',
      dailyPill: '🏨 နေ့စဉ်အခန်း',
      summaryTotal: 'ကြိုတင်မှာယူမှု အကျဉ်းချုပ် (စုစုပေါင်း',
      roomCount: 'ခန်း)',
      allCount: 'စုစုပေါင်း:',
      location: 'မဟာချိုင်မြို့လယ်ခေါင် (Big C မျက်စောင်းထိုး)',
      typeUnit: 'အမျိုးအစားများ',
      inList: 'ရွေးချယ်ထားသော အခန်းများ',
      checkInDate: 'ဝင်ရောက်မည့်ရက်စွဲ',
      durationMonthly: 'စာချုပ်ကာလ (အနည်းဆုံး ၁၂ လ / ၁ နှစ်)',
      durationDaily: 'ညအရေအတွက်',
      min12Msg: 'အနည်းဆုံး ၁၂ လ စာချုပ်',
      checkInPrefix: 'Check-in:',
      checkOutPrefix: 'Check-out (အထိ):',
      max12Msg: 'အများဆုံး ၁၂ လ',
      guestName: 'ဧည့်သည်အမည် *',
      guestNamePh: 'အမည်အပြည့်အစုံထည့်ပါ',
      guestPhone: 'ဖုန်းနံပါတ် *',
      guestPhonePh: 'ဖုန်းနံပါတ်ထည့်ပါ',
      listRoomsMsg: 'မှာယူမည့် အခန်းများ',
      canAddMore: 'အခြားအခန်းများကို ထပ်မံရွေးချယ်နိုင်သည်',
      shortTermWarn: '၁၂ လအောက် စာချုပ် (+၁,၀၀၀ ဘတ်/လ)',
      qty: 'အရေအတွက်:',
      roomUnit: 'ခန်း',
      durPrefix: isMonthly ? 'ကာလ:' : 'ညအရေအတွက်:',
      durUnit: isMonthly ? 'လ' : 'ည',
      delTitle: 'ဤအခန်းအမျိုးအစားကို ဖယ်ရှားမည်',
      addAnother: 'အခြားအခန်းအမျိုးအစားကို ရွေးချယ်ပါ...',
      depTitle: 'ကြိုတင်မှာယူရန် စပေါ်ငွေ (အနည်းဆုံး ၂,၀၀၀ ဘတ်):',
      keycardTitle: 'ကီးကဒ်ဖိုး (၁ ကဒ်လျှင် ၁၀၀ ဘတ်၊ အများဆုံး ၃ ကဒ်):',
      keycard0: 'ကီးကဒ်မလိုပါ (၀)',
      keycard1: '၁ ကဒ်',
      keycard2: '၂ ကဒ်',
      keycard3: '၃ ကဒ်',
      totalLock: 'ကြိုတင်မှာယူရန် စုစုပေါင်းပမာဏ:',
      payDepositLabel: 'စပေါ်ငွေ ပေးချေရန်နည်းလမ်း',
      payOffice: 'ရုံးခန်းတွင်ပေးမည်',
      payOfficeSub: 'Check-in ဝင်သည့်နေ့တွင် ပေးချေရန်',
      payNow: 'ယခုပေးချေမည်',
      payNowSub: 'စပေါ်ငွေကို ယခု ငွေလွှဲပြေစာတွင် ထည့်သွင်းမည်',
      thNo: 'စဉ်',
      thDesc: 'အကြောင်းအရာ',
      thQty: 'အရေအတွက်',
      thUnit: 'ဈေးနှုန်း',
      thAmt: 'ပမာဏ',
      descRent: 'အခန်းငှားရမ်းခ:',
      descCheckIn: 'Check-in:',
      descShortWarn: '၁၂ လအောက် စာချုပ်: ဈေးနှုန်း +၁,၀၀၀ ဘတ်/လ တိုးပါမည် (မူလဈေးနှုန်းမှ',
      descGuest: 'ဧည့်သည်:',
      descNotSpec: 'မသတ်မှတ်ရသေးပါ',
      descPayMonth: 'လစဉ်ပေးချေရန်',
      descDepMonthly: 'ကြိုတင်မှာယူခြင်း/တည်းခိုခြင်းအတွက် စပေါ်ငွေ',
      descDepMonthlySub: '✓ စာချုပ်ပြည့်ပြီး အခန်းပျက်စီးမှုမရှိပါက Check-out တွင် အပြည့်အဝ ပြန်လည်ရရှိမည်',
      descKeycard: 'အဆောက်အဦဝင်ခွင့် ကီးကဒ်ဖိုး',
      descKeycardSub: 'အဆောက်အဦနှင့် အခန်းဝင်ခွင့်အတွက် ကီးကဒ် (၁ ကဒ်လျှင် ၁၀၀ ဘတ်)',
      descDepDaily: 'အခန်းစပေါ်ငွေ',
      descDepDailySub: '✓ အခန်းပျက်စီးမှုမရှိပါက Check-out တွင် အပြည့်အဝ ပြန်လည်ရရှိမည်',
      totalToPay: 'ပေးချေရမည့် စုစုပေါင်းပမာဏ (ကြိုတင်မှာယူရန်)',
      remainDep: '* ကျန်ရှိနေသော စပေါ်ငွေပမာဏ:',
      remainDepSub: 'ဘတ် (Check-in နေ့တွင် ပေးချေရန်)',
      termTitle: 'စည်းမျဉ်းစည်းကမ်းများ:',
      termMon1: 'လစဉ်စာချုပ်: အနည်းဆုံး ၁၂ လ။ ၁၂ လအောက် စာချုပ်အတွက် ၁ လလျှင် +၁,၀၀၀ ဘတ် တိုးပါမည်။ စာချုပ်ပြည့်ပါက စပေါ်ငွေ အပြည့်အဝ ပြန်အမ်းမည်။',
      termDaily1: 'Check-in: ၁၄:၀၀ နာရီမှစတင်၍ | Check-out: ၁၂:၀၀ နာရီ (မွန်းတည့်) နောက်ဆုံး',
      termDaily2: 'အခန်းပျက်စီးခြင်း၊ အခန်းတွင်း ဆေးလိပ်သောက်ခြင်း သို့မဟုတ် စည်းမျဉ်းချိုးဖောက်ပါက စပေါ်ငွေ လုံးဝပြန်မအမ်းပါ။',
      termGen1: 'အိမ်မွေးတိရစ္ဆာန် မွေးမြူခွင့်မပြုပါ။ အခန်းနှင့် အဆောက်အဦအတွင်း ဆေးလိပ်သောက်ခြင်း လုံးဝတားမြစ်ထားသည်။',
      btnBank: '🏧 ငွေပေးချေရန် / ဘဏ်အကောင့်',
      btnPrint: '🖨️ ပရင့်ထုတ်ရန် / PDF သိမ်းရန်',
      validationErr: 'ကျေးဇူးပြု၍ မသိမ်းဆည်းမီ ဧည့်သည်အမည်နှင့် ဖုန်းနံပါတ်ကို ဖြည့်စွက်ပါ။'
    },
    jp: {
      back: '← 戻る',
      title: '予約の概要',
      docTitle: '見積書・予約概要',
      docEng: '',
      address: '1/9 Km.28 Rd, Mahachai, Mueang Samut Sakhon 74000 (Big Cの向かい)',
      contact: '電話番号',
      ref: '参照番号',
      date: '日付',
      monthlyPill: '🏨 マンスリールーム',
      dailyPill: '🏨 デイリールーム',
      summaryTotal: '予約の概要 (計',
      roomCount: '部屋)',
      allCount: '合計:',
      location: 'マハチャイの中心 (Big Cの向かい)',
      typeUnit: 'タイプ',
      inList: '選択された部屋',
      checkInDate: 'チェックイン日',
      durationMonthly: '契約期間 (最低12ヶ月 / 1年)',
      durationDaily: '宿泊数',
      min12Msg: '最低12ヶ月契約',
      checkInPrefix: 'チェックイン:',
      checkOutPrefix: 'チェックアウト (まで):',
      max12Msg: '最大12ヶ月',
      guestName: '宿泊者名 *',
      guestNamePh: 'フルネームを入力',
      guestPhone: '電話番号 *',
      guestPhonePh: '電話番号を入力',
      listRoomsMsg: '予約する部屋',
      canAddMore: '他の部屋タイプを追加したり、期間を個別に調整できます',
      shortTermWarn: '12ヶ月未満の契約 (+1,000 バーツ/月)',
      qty: '数量:',
      roomUnit: '部屋',
      durPrefix: isMonthly ? '期間:' : '宿泊数:',
      durUnit: isMonthly ? 'ヶ月' : '泊',
      delTitle: 'この部屋タイプを削除',
      addAnother: '他の部屋タイプを追加...',
      depTitle: '予約確定のためのデポジット (最低 2,000 バーツ):',
      keycardTitle: 'キーカード料金 (1枚100バーツ、最大3枚):',
      keycard0: 'キーカードなし (0)',
      keycard1: '1 枚',
      keycard2: '2 枚',
      keycard3: '3 枚',
      totalLock: '予約確定のための合計金額:',
      payDepositLabel: 'デポジットの支払い方法',
      payOffice: '現地で支払う',
      payOfficeSub: 'チェックイン時にカウンターで支払う',
      payNow: '今すぐ支払う',
      payNowSub: '今回の送金にデポジットを含める',
      thNo: 'No.',
      thDesc: '詳細',
      thQty: '数量',
      thUnit: '単価',
      thAmt: '金額',
      descRent: '部屋の家賃:',
      descCheckIn: 'チェックイン:',
      descShortWarn: '12ヶ月未満の契約: +1,000バーツ/月の追加料金 (基本料金から',
      descGuest: '宿泊者:',
      descNotSpec: '未指定',
      descPayMonth: '月払い',
      descDepMonthly: '予約/滞在用のデポジット',
      descDepMonthlySub: '✓ 契約完了時に部屋に破損がなければ、チェックアウト時に全額返金されます',
      descKeycard: 'キーカード料金',
      descKeycardSub: '建物および部屋用のキーカード (100 バーツ / 枚)',
      descDepDaily: '部屋のデポジット',
      descDepDailySub: '✓ 部屋に破損がなければ、チェックアウト時に全額返金されます',
      totalToPay: 'お支払い合計 (予約確定のため)',
      remainDep: '* 残りのデポジット支払い:',
      remainDepSub: 'バーツ (チェックイン時に支払い)',
      termTitle: '利用規約とガイドライン:',
      termMon1: '月極契約: 最低12ヶ月。12ヶ月未満の契約は月額+1,000バーツの追加料金がかかります。契約完了時にデポジットは全額返金されます。',
      termDaily1: 'チェックイン: 14:00以降 | チェックアウト: 12:00 (正午) まで',
      termDaily2: '部屋の破損、室内での喫煙、または規約違反の場合、デポジットは一切返金されません。',
      termGen1: 'ペットはご遠慮ください。部屋および建物内は完全禁煙です。',
      btnBank: '🏧 お支払い / 銀行口座',
      btnPrint: '🖨️ 印刷 / PDFを保存',
      validationErr: '保存または印刷する前に、宿泊者名と電話番号を入力してください。'
    },
    ru: {
      back: '← Назад',
      title: 'Сводка по бронированию',
      docTitle: 'ЦИТАТА И СВОДКА ПО БРОНИРОВАНИЮ',
      docEng: '',
      address: '1/9 Km.28 Rd, Mahachai, Mueang Samut Sakhon 74000 (напротив Big C)',
      contact: 'Тел.',
      ref: 'Ссылка №',
      date: 'Дата',
      monthlyPill: '🏨 Номер на месяц',
      dailyPill: '🏨 Номер на день',
      summaryTotal: 'Сводка по бронированию (Всего',
      roomCount: 'номеров)',
      allCount: 'Итого:',
      location: 'Центр Махачая (напротив Big C)',
      typeUnit: 'Тип',
      inList: 'Выбранные номера',
      checkInDate: 'Дата заезда',
      durationMonthly: 'Срок договора (Мин. 12 месяцев / 1 год)',
      durationDaily: 'Количество ночей',
      min12Msg: 'Минимум 12 месяцев договора',
      checkInPrefix: 'Заезд:',
      checkOutPrefix: 'Выезд (до):',
      max12Msg: 'Максимум 12 месяцев',
      guestName: 'Имя гостя *',
      guestNamePh: 'Введите полное имя',
      guestPhone: 'Номер телефона *',
      guestPhonePh: 'Введите номер телефона',
      listRoomsMsg: 'Номера для бронирования',
      canAddMore: 'Вы можете добавить другие типы номеров и настроить продолжительность',
      shortTermWarn: 'Договор < 12 месяцев (+1,000 бат/мес)',
      qty: 'Кол-во:',
      roomUnit: 'Номер(а)',
      durPrefix: isMonthly ? 'Продолжительность:' : 'Ночи:',
      durUnit: isMonthly ? 'Месяц(ев)' : 'Ночь(и)',
      delTitle: 'Удалить этот тип номера',
      addAnother: 'Выбрать другой тип номера...',
      depTitle: 'Депозит для подтверждения бронирования (Мин. 2,000 бат):',
      keycardTitle: 'Плата за ключ-карту (100 бат/шт, макс 3):',
      keycard0: 'Без ключ-карты (0)',
      keycard1: '1 карта',
      keycard2: '2 карты',
      keycard3: '3 карты',
      totalLock: 'Общая сумма для подтверждения бронирования:',
      payDepositLabel: 'Способ оплаты депозита',
      payOffice: 'Оплата на месте',
      payOfficeSub: 'Оплата при заезде на стойке',
      payNow: 'Оплатить сейчас',
      payNowSub: 'Включить депозит в этот перевод',
      thNo: '№',
      thDesc: 'Описание',
      thQty: 'Кол-во',
      thUnit: 'Цена за ед.',
      thAmt: 'Сумма',
      descRent: 'Аренда номера:',
      descCheckIn: 'Заезд:',
      descShortWarn: 'Договор < 12 месяцев: цена увеличена на +1,000 бат/мес (от базовой ставки',
      descGuest: 'Гость:',
      descNotSpec: 'Не указано',
      descPayMonth: 'Ежемесячная оплата',
      descDepMonthly: 'Депозит за бронирование/проживание',
      descDepMonthlySub: '✓ Полный возврат депозита при выезде, если договор завершен и комната не повреждена',
      descKeycard: 'Плата за ключ-карту доступа',
      descKeycardSub: 'Ключ-карта для доступа в здание и номер (100 бат / шт)',
      descDepDaily: 'Депозит за номер',
      descDepDailySub: '✓ Полный возврат депозита при выезде, если комната не повреждена',
      totalToPay: 'Итого к оплате (Для подтверждения бронирования)',
      remainDep: '* Оставшаяся сумма депозита к оплате:',
      remainDepSub: 'Бат (Оплатить в день заезда)',
      termTitle: 'Правила и условия:',
      termMon1: 'Ежемесячный договор: минимум 12 месяцев. При договоре < 12 месяцев взимается доплата +1,000 бат/мес. Депозит полностью возвращается по завершении договора.',
      termDaily1: 'Заезд: с 14:00 | Выезд: до 12:00 (Полдень)',
      termDaily2: 'Депозит не возвращается в случае повреждения номера, курения в помещении или нарушения правил.',
      termGen1: 'Проживание с животными запрещено. Курение строго запрещено в номере и здании.',
      btnBank: '🏧 Оплата / Банковский счет',
      btnPrint: '🖨️ Печать / Сохранить PDF',
      validationErr: 'Пожалуйста, укажите имя гостя и номер телефона перед сохранением или печатью.'
    }
  };
  
  const loc = allLocs[language] || allLocs.en;

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
                          {isMonthly ? loc.roomUnit + 'พักรายเดือน (Monthly)' : loc.dailyPill}
                        </span>
                        <h4 className="room-banner-title">
                          {selectedBookingItems.length === 1 
                            ? selectedBookingItems[0]?.roomData?.name 
                            : `สรุปรายการจอง${loc.roomUnit}พัก (รวม ${totalRoomsCount} ${loc.roomUnit})`}
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
                                    <span className="room-item-price">{effectivePriceNum.toLocaleString()} บาท / {isMonthly ? 'เดือน' : 'คืน'}</span>
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
                                        title={`ลบประเภท${loc.roomUnit}พักนี้`}
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
                                    {roomObj.name} ({roomObj.price} บาท/{isMonthly ? 'เดือน' : 'คืน'})
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
                                ? `สัญญาน้อยกว่า 12 เดือน: คิดอัตราค่า${loc.roomUnit}เพิ่ม +1,000 บาท/เดือน`
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
                                      <option value={1}>{loc.keycard1} (100 บาท)</option>
                                      <option value={2}>{loc.keycard2} (200 บาท)</option>
                                      <option value={3}>{loc.keycard3} (300 บาท)</option>
                                    </select>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed #93c5fd', marginTop: '6px' }}>
                                <span>💰 {loc.totalLock}</span>
                                <span style={{ fontSize: '1.25rem', color: '#004088', fontWeight: 800 }}>{grandTotalCalc.toLocaleString()} บาท</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="booking-input-group full-width">
                            <label>การชำระค่ามัดจำประกัน{loc.roomUnit} (รวม {totalDeposit.toLocaleString()} บาท / {totalRoomsCount} {loc.roomUnit})</label>
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
                                        {loc.descShortWarn} {basePriceNum.toLocaleString()} บาท)
                                      </div>
                                    )}
                                    <div className="table-sub-detail">
                                      <span>{loc.descGuest} </span>
                                      <span translate="no" className="notranslate">{guestName.trim() || 'ยังไม่ระบุ'}</span>
                                      <span> (</span>
                                      <span translate="no" className="notranslate">{guestPhone.trim() || 'ยังไม่ระบุ'}</span>
                                      <span>)</span>
                                    </div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.count} {loc.roomUnit} ({itemDur} {isMonthly ? 'เดือน' : 'คืน'})
                                  </td>
                                  <td style={{ textAlign: 'right' }}>{effectivePriceNum.toLocaleString()} บาท / {isMonthly ? 'เดือน' : 'คืน'}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                    {isMonthly ? (
                                      <span style={{ color: '#475569', fontSize: '0.82rem' }}>{loc.descPayMonth}</span>
                                    ) : (
                                      `${itemRoomTotal.toLocaleString()} บาท`
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
                                  <td style={{ textAlign: 'right' }}>{totalRoomsCount > 0 ? (totalDeposit / totalRoomsCount).toLocaleString() : '0'} บาท</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#004088', fontSize: '0.95rem' }}>{effectiveDepositToPay.toLocaleString()} บาท</td>
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
                                    <td style={{ textAlign: 'right' }}>100 บาท</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#004088', fontSize: '0.95rem' }}>{totalKeycardFee.toLocaleString()} บาท</td>
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
                                  <td style={{ textAlign: 'right' }}>{totalRoomsCount > 0 ? (totalDeposit / totalRoomsCount).toLocaleString() : '0'} บาท</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{effectiveDepositToPay.toLocaleString()} บาท</td>
                                </tr>
                              ) : (
                                <tr>
                                  <td style={{ textAlign: 'center' }}>{selectedBookingItems.length + 1}</td>
                                  <td>
                                    <strong>ค่ามัดจำประกัน{loc.roomUnit}พัก (ชำระวันเข้าพัก รวม {totalRoomsCount} {loc.roomUnit})</strong>
                                    <div className="table-sub-detail" style={{ color: '#d97706', fontWeight: 600 }}>
                                      ชำระ {totalDeposit.toLocaleString()} บาท หน้าเคาน์เตอร์วันเช็คอิน (คืนเงินมัดจำวันเช็คเอ้าท์)
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
                                    ? `(รวมเงินมัดจำประกัน{loc.roomUnit} ${totalDeposit.toLocaleString()} บาท + ค่าคีย์การ์ด ${totalKeycardFee.toLocaleString()} บาท | ค่าเช่า{loc.descPayMonth} ณ วันเข้าพัก)`
                                    : (payDepositNow ? '(รวมค่า{loc.roomUnit}และค่ามัดจำประกัน{loc.roomUnit}แล้ว)' : '(ยังไม่รวมค่ามัดจำประกัน{loc.roomUnit}ที่ชำระวันเช็คอิน)')}
                                </span>
                              </td>
                              <td colSpan={2} className="total-amount-cell">
                                {grandTotalCalc.toLocaleString()} บาท
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {(typeof customDeposit === 'number' && customDeposit < totalDeposit) && (
                        <div className="no-print" style={{ textAlign: 'right', color: '#b91c1c', fontSize: '0.9rem', marginTop: '4px', fontWeight: 'bold' }}>
                          {loc.remainDep} {(totalDeposit - customDeposit).toLocaleString()} บาท {loc.remainDepSub}
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
