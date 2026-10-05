const fs = require('fs');

let content = fs.readFileSync('src/components/RoomTypes/BookingModal.tsx', 'utf8');

// Insert loc object and localized formatters
const setupLocText = `
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
    back: isThai ? '← ย้อนกลับ' : '← Back',
    title: isThai ? 'สรุปรายการจองห้องพัก' : 'Booking Summary',
    docTitle: isThai ? 'ใบสรุปการจอง / ใบเสนอราคา' : 'QUOTATION & BOOKING SUMMARY',
    address: isThai ? '1/9 ถนนกิโลเมตร 28 ต.มหาชัย อ.เมืองสมุทรสาคร จ.สมุทรสาคร 74000 (ตรงข้าม Big C มหาชัย)' : '1/9 Km.28 Rd, Mahachai, Mueang Samut Sakhon 74000 (Opposite Big C)',
    contact: isThai ? 'โทรติดต่อ' : 'Tel',
    ref: isThai ? 'เลขที่เอกสาร' : 'Ref No.',
    date: isThai ? 'วันที่ออกเอกสาร' : 'Date',
    monthlyPill: isThai ? 'ห้องพักรายเดือน (Monthly)' : '🏨 Monthly Room',
    dailyPill: isThai ? 'ห้องพักรายวัน (Daily)' : '🏨 Daily Room',
    summaryTotal: isThai ? 'สรุปรายการจองห้องพัก (รวม' : 'Booking Summary (Total',
    roomCount: isThai ? 'ห้อง)' : 'Rooms)',
    allCount: isThai ? 'รวมทั้งสิ้น:' : 'Total:',
    location: isThai ? 'ใจกลางมหาชัย (ตรงข้าม Big C)' : 'Heart of Mahachai (Opposite Big C)',
    typeUnit: isThai ? 'ประเภท' : 'Types',
    inList: isThai ? 'ห้องในรายการ' : 'Rooms Listed',
    checkInDate: isThai ? 'วันที่เริ่มเข้าพัก (Check-in Date)' : 'Check-in Date',
    durationMonthly: isThai ? 'ระยะเวลาเข้าพักตั้งต้น (สัญญาขั้นต่ำ 12 เดือน / 1 ปี)' : 'Contract Duration (Min 12 Months / 1 Year)',
    durationDaily: isThai ? 'จำนวนคืน (Nights)' : 'Number of Nights',
    min12Msg: isThai ? 'สัญญาเช่ารายเดือนขั้นต่ำ 12 เดือน (1 ปี)' : 'Minimum 12 Months Contract',
    checkInPrefix: isThai ? 'เช็คอิน:' : 'Check-in:',
    checkOutPrefix: isThai ? 'เช็คเอ้าท์ (ถึงวันที่):' : 'Check-out (Until):',
    max12Msg: isThai ? 'สูงสุด 12 เดือน' : 'Max 12 Months',
    guestName: isThai ? 'ชื่อผู้เข้าพัก (Guest Name) *' : 'Guest Name *',
    guestNamePh: isThai ? 'ระบุชื่อ-นามสกุล' : 'Enter full name',
    guestPhone: isThai ? 'เบอร์โทรติดต่อ (Phone Number) *' : 'Phone Number *',
    guestPhonePh: isThai ? 'ระบุเบอร์โทรศัพท์' : 'Enter phone number',
    listRoomsMsg: isThai ? 'รายการห้องพักที่ต้องการจอง' : 'Selected Rooms to Book',
    canAddMore: isThai ? 'สามารถเลือกเพิ่มประเภทห้องและปรับจำนวนคืน/เดือนแยกได้' : 'You can add more room types and adjust duration separately',
    shortTermWarn: isThai ? 'สัญญาน้อยกว่า 12 เดือน (+1,000 บ./เดือน)' : 'Contract < 12 Months (+1,000 THB/m)',
    qty: isThai ? 'จำนวน:' : 'Qty:',
    roomUnit: isThai ? 'ห้อง' : 'Room(s)',
    durPrefix: isThai ? (isMonthly ? 'ระยะเวลา:' : 'จำนวนคืน:') : (isMonthly ? 'Duration:' : 'Nights:'),
    durUnit: isThai ? (isMonthly ? 'เดือน' : 'คืน') : (isMonthly ? 'Month(s)' : 'Night(s)'),
    delTitle: isThai ? 'ลบประเภทห้องพักนี้' : 'Remove this room type',
    addAnother: isThai ? 'เลือกเพิ่มประเภทห้องพักอื่น...' : 'Select another room type to add...',
    depTitle: isThai ? 'ยอดเงินมัดจำเพื่อยืนยันการจอง (ขั้นต่ำ 2,000 บาท):' : 'Deposit to confirm booking (Min 2,000 THB):',
    keycardTitle: isThai ? 'ค่าซื้อคีย์การ์ดเข้าอาคาร (ใบละ 100 บาท สูงสุด 3 ใบ):' : 'Keycard Fee (100 THB each, Max 3):',
    keycard0: isThai ? 'ไม่รับคีย์การ์ด (0 ใบ)' : 'No keycard (0)',
    keycard1: isThai ? '1 ใบ' : '1 Card',
    keycard2: isThai ? '2 ใบ' : '2 Cards',
    keycard3: isThai ? '3 ใบ' : '3 Cards',
    totalLock: isThai ? 'ยอดรวมที่ต้องชำระเพื่อล็อคสิทธิ์จอง:' : 'Total Amount to Confirm Booking:',
    payDepositLabel: isThai ? 'การชำระค่ามัดจำประกันห้อง' : 'Deposit Payment Method',
    payOffice: isThai ? 'จ่ายหน้าออฟฟิศ' : 'Pay at Office',
    payOfficeSub: isThai ? 'ชำระวันเข้าพักที่เคาน์เตอร์' : 'Pay upon check-in at counter',
    payNow: isThai ? 'จ่ายพร้อมค่าห้อง' : 'Pay Now',
    payNowSub: isThai ? 'รวมยอดมัดจำในสลิปโอนนี้' : 'Include deposit in this transfer',
    thNo: isThai ? 'ลำดับ' : 'No.',
    thDesc: isThai ? 'รายการรายละเอียด (Description)' : 'Description',
    thQty: isThai ? 'จำนวน' : 'Qty',
    thUnit: isThai ? 'ราคา/หน่วย' : 'Unit Price',
    thAmt: isThai ? 'จำนวนเงิน' : 'Amount',
    descRent: isThai ? 'ค่าเช่าห้องพัก' : 'Room Rental:',
    descCheckIn: isThai ? 'กำหนดเข้าพัก:' : 'Check-in:',
    descShortWarn: isThai ? 'สัญญาน้อยกว่า 12 เดือน: ปรับราคาเพิ่ม +1,000 บ./เดือน (จากราคาปกติ' : 'Contract < 12 Months: Price adjusted +1,000 THB/month (from base rate',
    descGuest: isThai ? 'ผู้เข้าพัก:' : 'Guest:',
    descNotSpec: isThai ? 'ยังไม่ระบุ' : 'Not specified',
    descPayMonth: isThai ? 'ชำระรายเดือน' : 'Pay Monthly',
    descDepMonthly: isThai ? 'เงินมัดจำประกันห้องพักเพื่อการจอง/เข้าพัก' : 'Room Deposit for Booking/Stay',
    descDepMonthlySub: isThai ? '✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่ออยู่ครบสัญญาและตรวจสอบห้องพักเรียบร้อย' : '✓ Full deposit refundable upon check-out if contract completed and room undamaged',
    descKeycard: isThai ? 'ค่าซื้อคีย์การ์ดเข้าอาคาร (Keycard Fee)' : 'Building Access Keycard Fee',
    descKeycardSub: isThai ? 'ค่าคีย์การ์ดสำหรับเข้า-ออกอาคารและห้องพัก (100 บาท / ใบ)' : 'Keycard for building and room access (100 THB / card)',
    descDepDaily: isThai ? 'ค่ามัดจำประกันห้องพัก' : 'Room Deposit',
    descDepDailySub: isThai ? '✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่อตรวจสอบห้องพักเรียบร้อย' : '✓ Full deposit refundable upon check-out if room undamaged',
    totalToPay: isThai ? 'ยอดรวมที่ต้องชำระ (เพื่อยืนยันการจอง)' : 'Total Amount Due (To Confirm Booking)',
    remainDep: isThai ? '* ค้างชำระเงินมัดจำส่วนที่เหลืออีก' : '* Remaining deposit to pay:',
    remainDepSub: isThai ? 'บาท (ชำระในวันทำสัญญา/เข้าพัก)' : 'THB (Pay on check-in day)',
    termTitle: isThai ? 'ข้อกำหนดการเข้าพักและเงื่อนไข (Terms & Guidelines):' : 'Terms & Guidelines:',
    termMon1: isThai ? 'สัญญาเช่ารายเดือน: สัญญาเช่าขั้นต่ำ 12 เดือน (1 ปี) | กรณีสัญญาน้อยกว่า 12 เดือน ค่าเช่าห้องจะปรับเพิ่มขึ้น +1,000 บาท/เดือน ทุกประเภทห้อง (พักอาศัยครบตามสัญญา ได้รับคืนเงินมัดจำประกันครบถ้วน)' : 'Monthly Contract: Minimum 12 months. Contracts < 12 months incur a +1,000 THB/month surcharge. Full deposit refunded upon contract completion.',
    termDaily1: isThai ? 'เวลาเช็คอิน: ตั้งแต่ 14:00 น. เป็นต้นไป | เวลาเช็คเอ้าท์: ไม่เกิน 12:00 น. (เที่ยงวัน)' : 'Check-in: From 14:00 onwards | Check-out: By 12:00 (Noon)',
    termDaily2: isThai ? 'สงวนสิทธิ์ไม่คืนเงินมัดจำกรณีเกิดความเสียหายในห้องพัก สูบบุหรี่ หรือทำผิดกฎระเบียบที่พัก' : 'Deposit is strictly non-refundable in cases of room damage, smoking indoors, or rule violations.',
    termGen1: isThai ? 'ห้ามเลี้ยงสัตว์เลี้ยงทุกชนิด และห้ามสูบบุหรี่ภายในห้องพักและตัวอาคาร' : 'No pets allowed. Smoking is strictly prohibited inside the room and building.',
    btnBank: isThai ? '🏧 ชำระเงิน / ดูเลขบัญชีโอน' : '🏧 Payment / Bank Account',
    btnPrint: isThai ? '🖨️ พิมพ์ / บันทึก PDF ใบจอง' : '🖨️ Print / Save PDF',
    validationErr: isThai ? 'กรุณากรอกชื่อผู้เข้าพัก และ เบอร์โทรติดต่อ ให้ครบถ้วนก่อนทำการบันทึกหรือพิมพ์ใบจอง' : 'Please fill in Guest Name and Phone Number before saving or printing.'
  };
`;

// Insert loc at the beginning of the component, just after `const selectedBookingRoom = room;`
content = content.replace(/(const selectedBookingRoom = room;)/, "$1\n" + setupLocText);

// Now replace all the hardcoded strings with loc properties
content = content.replace(/alert\('กรุณากรอกชื่อผู้เข้าพัก และ เบอร์โทรติดต่อ ให้ครบถ้วนก่อนทำการบันทึกหรือพิมพ์ใบจอง'\);/g, "alert(loc.validationErr);");
content = content.replace(/← ย้อนกลับ/g, "{loc.back}");
content = content.replace(/<span>สรุปรายการจองห้องพัก<\/span>/g, "<span>{loc.title}</span>");
content = content.replace(/<h2 style={{ margin: 0, color: '#1e3a8a', fontSize: '1.5rem', fontWeight: 800 }}>\s*ใบสรุปการจอง \/ ใบเสนอราคา\s*<\/h2>/, "<h2 style={{ margin: 0, color: '#1e3a8a', fontSize: '1.5rem', fontWeight: 800 }}>{loc.docTitle}</h2>");
content = content.replace(/<div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px', letterSpacing: '1px' }}>\s*QUOTATION & BOOKING SUMMARY\s*<\/div>/, "{loc.docEng && <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px', letterSpacing: '1px' }}>{loc.docEng}</div>}");
content = content.replace(/1\/9 ถนนกิโลเมตร 28 ต\.มหาชัย อ\.เมืองสมุทรสาคร จ\.สมุทรสาคร 74000 \(ตรงข้าม Big C มหาชัย\)/g, "{loc.address}");
content = content.replace(/<strong>โทรติดต่อ:<\/strong>/g, "<strong>{loc.contact}:</strong>");
content = content.replace(/<strong>เลขที่เอกสาร:<\/strong>/g, "<strong>{loc.ref}:</strong>");
content = content.replace(/<strong>วันที่ออกเอกสาร:<\/strong>/g, "<strong>{loc.date}:</strong>");
content = content.replace(/formatThaiDate\(new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\]\)/g, "formatDateLocalized(new Date().toISOString().split('T')[0])");

content = content.replace(/🏨 ห้องพักรายเดือน \(Monthly\)/g, "{loc.monthlyPill}");
content = content.replace(/🏨 ห้องพักรายวัน \(Daily\)/g, "{loc.dailyPill}");
content = content.replace(/<span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>สรุปรายการจองห้องพัก \(รวม {totalRoomsCount} ห้อง\)<\/span>/g, "<span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{loc.summaryTotal} {totalRoomsCount} {loc.roomCount}</span>");
content = content.replace(/<span style={{ fontSize: '0.85rem', color: '#64748b' }}>รวมทั้งสิ้น:<\/span>/g, "<span style={{ fontSize: '0.85rem', color: '#64748b' }}>{loc.allCount}</span>");
content = content.replace(/<div style={{ fontSize: '0.85rem', color: '#004088', fontWeight: 600, marginTop: '2px' }}>\s*📍 ใจกลางมหาชัย \(ตรงข้าม Big C\)\s*<\/div>/, "<div style={{ fontSize: '0.85rem', color: '#004088', fontWeight: 600, marginTop: '2px' }}>📍 {loc.location}</div>");

content = content.replace(/>ประเภท</g, ">{loc.typeUnit}<");
content = content.replace(/>ห้องในรายการ</g, ">{loc.inList}<");
content = content.replace(/วันที่เริ่มเข้าพัก \(Check-in Date\)/g, "{loc.checkInDate}");
content = content.replace(/ระยะเวลาเข้าพักตั้งต้น \(สัญญาขั้นต่ำ 12 เดือน \/ 1 ปี\)/g, "{loc.durationMonthly}");
content = content.replace(/จำนวนคืน \(Nights\)/g, "{loc.durationDaily}");
content = content.replace(/\* สัญญาเช่ารายเดือนขั้นต่ำ 12 เดือน \(1 ปี\)/g, "* {loc.min12Msg}");
content = content.replace(/เช็คอิน: <strong>\{formatThaiDate\(checkInDate\)\}<\/strong>/g, "{loc.checkInPrefix} <strong>{formatDateLocalized(checkInDate)}</strong>");
content = content.replace(/เช็คเอ้าท์ \(ถึงวันที่\): <strong>\{formatThaiDateObj\(globalCheckOutDate\)\}<\/strong>/g, "{loc.checkOutPrefix} <strong>{formatDateObjLocalized(globalCheckOutDate)}</strong>");
content = content.replace(/สูงสุด 12 เดือน/g, "{loc.max12Msg}");
content = content.replace(/<label>ชื่อผู้เข้าพัก \(Guest Name\) \*<\/label>/g, "<label>{loc.guestName}</label>");
content = content.replace(/placeholder="ระบุชื่อ-นามสกุล"/g, "placeholder={loc.guestNamePh}");

content = content.replace(/<label>เบอร์โทรติดต่อ \(Phone Number\) \*<\/label>/g, "<label>{loc.guestPhone}</label>");
content = content.replace(/placeholder="ระบุเบอร์โทรศัพท์"/g, "placeholder={loc.guestPhonePh}");

content = content.replace(/รายการห้องพักที่ต้องการจอง/g, "{loc.listRoomsMsg}");
content = content.replace(/สามารถเลือกเพิ่มประเภทห้องและปรับจำนวนคืน\/เดือนแยกได้/g, "{loc.canAddMore}");
content = content.replace(/<div className="warning-text">สัญญาน้อยกว่า 12 เดือน \(\+1,000 บ\.\/เดือน\)<\/div>/g, "<div className=\"warning-text\">{loc.shortTermWarn}</div>");
content = content.replace(/<span>จำนวน: <\/span>/g, "<span>{loc.qty} </span>");
content = content.replace(/ห้อง/g, "{loc.roomUnit}");
// Watch out for global replace of 'ห้อง', so maybe be specific:
content = content.replace(/> {item.count} ห้อง<\/span>/g, "> {item.count} {loc.roomUnit}</span>");

content = content.replace(/<span className="info-label">ระยะเวลา:<\/span>/g, "<span className=\"info-label\">{loc.durPrefix}</span>");
content = content.replace(/<span className="info-label">จำนวนคืน:<\/span>/g, "<span className=\"info-label\">{loc.durPrefix}</span>");
// month/night suffix
content = content.replace(/> เดือน<\/span>/g, "> {loc.durUnit}</span>");
content = content.replace(/> คืน<\/span>/g, "> {loc.durUnit}</span>");
content = content.replace(/title="ลบประเภทห้องพักนี้"/g, "title={loc.delTitle}");
content = content.replace(/>\+ เลือกเพิ่มประเภทห้องพักอื่น\.\.\.<\/button>/g, ">+ {loc.addAnother}</button>");

// Deposit
content = content.replace(/ยอดเงินมัดจำเพื่อยืนยันการจอง \(ขั้นต่ำ 2,000 บาท\):/g, "{loc.depTitle}");
content = content.replace(/ค่าซื้อคีย์การ์ดเข้าอาคาร \(ใบละ 100 บาท สูงสุด 3 ใบ\):/g, "{loc.keycardTitle}");
content = content.replace(/>1 ใบ \(฿100\)</g, ">{loc.keycard1} (฿100)<");
content = content.replace(/>2 ใบ \(฿200\)</g, ">{loc.keycard2} (฿200)<");
content = content.replace(/>3 ใบ \(฿300\)</g, ">{loc.keycard3} (฿300)<");
content = content.replace(/ยอดรวมที่ต้องชำระเพื่อล็อคสิทธิ์จอง:/g, "{loc.totalLock}");
content = content.replace(/การชำระค่ามัดจำประกันห้อง/g, "{loc.payDepositLabel}");
content = content.replace(/>จ่ายหน้าออฟฟิศ</g, ">{loc.payOffice}<");
content = content.replace(/>ชำระวันเข้าพักที่เคาน์เตอร์</g, ">{loc.payOfficeSub}<");
content = content.replace(/>จ่ายพร้อมค่าห้อง</g, ">{loc.payNow}<");
content = content.replace(/>รวมยอดมัดจำในสลิปโอนนี้</g, ">{loc.payNowSub}<");

// Table Headers
content = content.replace(/>ลำดับ</g, ">{loc.thNo}<");
content = content.replace(/>รายการรายละเอียด \(Description\)</g, ">{loc.thDesc}<");
content = content.replace(/>ราคา\/หน่วย</g, ">{loc.thUnit}<");
content = content.replace(/>จำนวนเงิน</g, ">{loc.thAmt}<");
// There might be a thQty missing
content = content.replace(/>จำนวน</g, ">{loc.thQty}<");

// Table body
content = content.replace(/<strong>ค่าเช่าห้องพัก/g, "<strong>{loc.descRent}");
content = content.replace(/กำหนดเข้าพัก:/g, "{loc.descCheckIn}");
content = content.replace(/formatThaiDate\(/g, "formatDateLocalized(");
content = content.replace(/formatThaiDateObj\(/g, "formatDateObjLocalized(");

content = content.replace(/สัญญาน้อยกว่า 12 เดือน: ปรับราคาเพิ่ม \+1,000 บ\.\/เดือน \(จากราคาปกติ/g, "{loc.descShortWarn}");
content = content.replace(/ผู้เข้าพัก:/g, "{loc.descGuest}");
content = content.replace(/>ยังไม่ระบุ</g, ">{loc.descNotSpec}<");
content = content.replace(/ชำระรายเดือน/g, "{loc.descPayMonth}");
content = content.replace(/<strong>เงินมัดจำประกันห้องพักเพื่อการจอง\/เข้าพัก/g, "<strong>{loc.descDepMonthly}");
content = content.replace(/✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่ออยู่ครบสัญญาและตรวจสอบห้องพักเรียบร้อย/g, "{loc.descDepMonthlySub}");
content = content.replace(/<strong>ค่าซื้อคีย์การ์ดเข้าอาคาร \(Keycard Fee\)/g, "<strong>{loc.descKeycard}");
content = content.replace(/ค่าคีย์การ์ดสำหรับเข้า-ออกอาคารและห้องพัก \(100 บาท \/ ใบ\)/g, "{loc.descKeycardSub}");
content = content.replace(/<strong>ค่ามัดจำประกันห้องพัก/g, "<strong>{loc.descDepDaily}");
content = content.replace(/✓ ได้รับเงินมัดจำคืนเต็มจำนวน ณ วันเช็คเอ้าท์เมื่อตรวจสอบห้องพักเรียบร้อย/g, "{loc.descDepDailySub}");

content = content.replace(/ยอดรวมที่ต้องชำระ \(เพื่อยืนยันการจอง\)/g, "{loc.totalToPay}");
content = content.replace(/\* ค้างชำระเงินมัดจำส่วนที่เหลืออีก/g, "{loc.remainDep}");
content = content.replace(/บาท \(ชำระในวันทำสัญญา\/เข้าพัก\)/g, "{loc.remainDepSub}");

// Terms
content = content.replace(/ข้อกำหนดการเข้าพักและเงื่อนไข \(Terms & Guidelines\):/g, "{loc.termTitle}");
content = content.replace(/<strong>สัญญาเช่ารายเดือน:<\/strong> สัญญาเช่าขั้นต่ำ 12 เดือน \(1 ปี\) \| กรณีสัญญาน้อยกว่า 12 เดือน ค่าเช่าห้องจะปรับเพิ่มขึ้น <strong>\+1,000 บาท\/เดือน<\/strong> ทุกประเภทห้อง \(พักอาศัยครบตามสัญญา ได้รับคืนเงินมัดจำประกันครบถ้วน\)/g, "{loc.termMon1}");
content = content.replace(/<strong>เวลาเช็คอิน:<\/strong> ตั้งแต่ 14:00 น\. เป็นต้นไป \| <strong>เวลาเช็คเอ้าท์:<\/strong> ไม่เกิน 12:00 น\. \(เที่ยงวัน\)/g, "{loc.termDaily1}");
content = content.replace(/สงวนสิทธิ์ไม่คืนเงินมัดจำกรณีเกิดความเสียหายในห้องพัก สูบบุหรี่ หรือทำผิดกฎระเบียบที่พัก/g, "{loc.termDaily2}");
content = content.replace(/<strong>ห้ามเลี้ยงสัตว์เลี้ยงทุกชนิด<\/strong> และห้ามสูบบุหรี่ภายในห้องพักและตัวอาคาร/g, "{loc.termGen1}");
content = content.replace(/🏧 ชำระเงิน \/ ดูเลขบัญชีโอน/g, "{loc.btnBank}");
content = content.replace(/🖨️ พิมพ์ \/ บันทึก PDF ใบจอง/g, "{loc.btnPrint}");

content = content.replace(/onChange=\\{e => setGuestName\\(e.target.value\\)\\}/, "onChange={e => {\\n" +
"                      let val = e.target.value;\\n" +
"                      if (!isThai) {\\n" +
"                        val = val.replace(/[^A-Za-z0-9\\\\s\\\\.,-]/g, '');\\n" +
"                      }\\n" +
"                      setGuestName(val);\\n" +
"                    }}");


fs.writeFileSync('src/components/RoomTypes/BookingModal.tsx', content, 'utf8');
console.log('Transform complete.');
