export type Language = 'th' | 'en' | 'cn' | 'mm';

export interface RoomTranslation {
  name: string;
  desc: string;
  features: string[];
  price: string;
}

export interface MonthlyRoomTranslation {
  id?: number;
  name: string;
  desc: string;
  price: string;
  deposit: string;
  availableRoomsList?: string[];
  features: string[];
}

export interface Translations {
  brand: string;
  navHome: string;
  navRooms: string;
  navFacilities: string;
  navNearby: string;
  navRules: string;
  navFaq: string;
  navReviews: string;
  welcome: string;
  subheading: string;
  selectRoomBtn: string;
  roomSectionTitle: string;
  roomSectionSubtitle: string;
  viewDetails: string;
  bookNow: string;
  pricePerNight: string;
  dailyTab: string;
  monthlyTab: string;
  depositLabel: string;
  perMonth: string;
  singleRoom: RoomTranslation;
  twinRoom: RoomTranslation;
  extraRoom: RoomTranslation;
  fanFutonRoom?: RoomTranslation;
  suiteRoom?: RoomTranslation;
  monthlyRooms: MonthlyRoomTranslation[];
  utilityTitle: string;
  electricityLabel: string;
  electricityVal: string;
  waterLabel: string;
  waterVal: string;
  maintenanceLabel: string;
  maintenanceVal: string;
  carParkingLabel: string;
  carParkingVal: string;
  motoParkingLabel: string;
  motoParkingVal: string;
  keyUnlockLabel?: string;
  keyUnlockVal?: string;
  rulesTitle: string;
  rulesList: string[];
  rulesNotice: string;
  checkInTitle: string;
  checkInSteps: string[];
  checkOutTitle: string;
  checkOutSteps: string[];
  bankAccountTitle: string;
  bankAccountVal: string;
  bankNameVal: string;
  bankAccountName: string;
  wifiTitle: string;
  wifiPass: string;
  lineModalTitle: string;
  lineModalDesc: string;
  copyIdBtn: string;
  copiedAlert: string;
  facilitiesTitle: string;
  facilitiesSubtitle: string;
  facilitiesList: { icon: string; title: string; desc: string }[];
  securityTitle?: string;
  securitySubtitle?: string;
  securityList?: { icon: string; title: string; desc: string }[];
  nearbyTitle: string;
  nearbySubtitle: string;
  nearbyList: { icon: string; image?: string; title: string; distance: string; desc: string }[];
  nearbyShowMore?: string;
  nearbyShowLess?: string;
  faqTitle: string;
  faqSubtitle: string;
  faqList: { q: string; a: string }[];
  faqShowMore?: string;
  faqShowLess?: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  reviewsList: { name: string; role: string; text: string; rating: number }[];
  contactUs: string;
  addressLabel: string;
  addressVal: string;
  phoneLabel: string;
  phoneVal: string;
  mapLabel: string;
  copyright: string;
  calculatorTitle?: string;
  calculatorSubtitle?: string;
  calcRoomTypeLabel?: string;
  calcElecLabel?: string;
  calcWaterLabel?: string;
  calcCarLabel?: string;
  calcMotoLabel?: string;
  calcTotalMonthly?: string;
  calcMoveInDeposit?: string;
  calcCopySummary?: string;
  calcCopiedToast?: string;
  compareRoomsBtn?: string;
  compareModalTitle?: string;
  promptPayBtn?: string;
  promptPayTitle?: string;
  chatbotTitle?: string;
  chatbotSubtitle?: string;
  chatbotBadge?: string;
  heroBadge?: string;
  heroRating?: string;
  heroOpposite?: string;
  heroSecurity?: string;
  heroWifi?: string;
  heroElevatorParking?: string;
  heroLocationLabel?: string;
  heroLocationVal?: string;
  heroCheckInOutLabel?: string;
  heroCheckInOutVal?: string;
  heroDepositLabel?: string;
  heroDepositVal?: string;
  heroContractTerm?: string;
  heroShortTermNote?: string;
  heroContactBooking?: string;
  heroCallQuick?: string;
  heroSelectDaily?: string;
  heroSelectMonthly?: string;
  heroStatusDaily?: string;
  heroStatusMonthly?: string;
  rulesSubtitle?: string;
  leaseAgreementBtn?: string;
  dailyRoomsOverviewTitle?: string;
  dailyRoomsOverviewSub?: string;
  totalRoomsLabel?: string;
  occupiedRoomsLabel?: string;
  availableRoomsLabel?: string;
  monthlyOverviewTitle?: string;
  monthlyOverviewSub?: string;
  monthlyAvailableBadge?: string;
  roomsUnit?: string;
  keycardFeeLabel?: string;
  keycardFeeVal?: string;
  keyUnlockFeeLabel?: string;
  keyUnlockFeeVal?: string;
  officialAgreementTitle?: string;
  mapHeading?: string;
  mapSubheading?: string;
  openGoogleMapsBtn?: string;

  // Comparison Modal
  compareIntro?: string;
  compareHeaderRoomType?: string;
  compareHeaderRent?: string;
  compareHeaderDeposit?: string;
  compareHeaderStatus?: string;
  compareHeaderAir?: string;
  compareHeaderFurniture?: string;
  compareHeaderHighlights?: string;
  compareHeaderAction?: string;
  compareAvailableBadge?: string;
  compareFullBadge?: string;
  compareHasAir?: string;
  compareNoAir?: string;
  compareFurn12?: string;
  compareFurn8?: string;
  compareFurnYes?: string;
  compareFurnNone?: string;
  compareBookRoomBtn?: string;

  // Calculator
  calcUnitsBadge?: string;
  calcParkingTitle?: string;
  calcSummaryTitle?: string;
  calcRentBreakdown?: string;
  calcElecBreakdown?: string;
  calcWaterBreakdown?: string;
  calcCommonFeeBreakdown?: string;
  calcCarBreakdown?: string;
  calcMotoBreakdown?: string;
  calcTotalMoveIn?: string;
  calcEco?: string;
  calcAvg?: string;
  calcAirconOften?: string;
  calcHighUsage?: string;
  calcWaterRangeMin?: string;
  calcWaterRangeMid?: string;
  calcWaterRangeMax?: string;
  thbUnit?: string;

  // PromptPay / Bank Modal
  bankName?: string;
  bankNote?: string;
  bankAccLabel?: string;
  bankCopyBtn?: string;
  bankCopiedBtn?: string;
  bankAccNameLabel?: string;
  bankAccNameVal?: string;
  bankDailyNoticeTitle?: string;
  bankDailyNoticeDesc?: string;
  bankStepsTitle?: string;
  bankStep1?: string;
  bankStep2?: string;
  bankStep3?: string;
}

export const translations: Record<Language, Translations> = {
  th: {
    brand: "แอทสมุทรสาคร สาขามหาชัย",
    navHome: "หน้าแรก",
    navRooms: "ประเภทห้องพัก",
    navFacilities: "สิ่งอำนวยความสะดวก",
    navNearby: "สถานที่ใกล้เคียง",
    navRules: "กฎระเบียบ",
    navFaq: "คำถามที่พบบ่อย",
    navReviews: "รีวิวผู้เข้าพัก",
    welcome: "ยินดีต้อนรับสู่ แอทสมุทรสาคร สาขามหาชัย",
    subheading: "ที่พักสะอาด ปลอดภัย ใจกลางเมืองมหาชัย",
    selectRoomBtn: "เลือกดูห้องพัก",
    roomSectionTitle: "ประเภทห้องพักรายวันและรายเดือน",
    roomSectionSubtitle: "พักผ่อนสบาย เป็นส่วนตัว แอร์เย็นฉ่ำ สิ่งอำนวยความสะดวกครบครัน พร้อมอัตราค่าเช่าสุดคุ้ม",
    viewDetails: "ดูรายละเอียด",
    bookNow: "จองห้องพัก",
    pricePerNight: "บาท / คืน",
    dailyTab: "รายวัน (Daily)",
    monthlyTab: "รายเดือน (Monthly)",
    depositLabel: "ค่ามัดจำ",
    perMonth: "บาท / เดือน",
    singleRoom: {
      name: "ห้องพักเตียงเดี่ยว (Single Bed)",
      desc: "พักผ่อนสบาย เป็นส่วนตัว แอร์เย็นฉ่ำ",
      features: ["📶 Wi-Fi ฟรี", "❄️ แอร์", "📺 ทีวี", "ตู้เสื้อผ้าบิ้วอิน", "เครื่องทำน้ำอุ่น", "เครื่องเป่าผม", "ตู้เย็น"],
      price: "799"
    },
    twinRoom: {
      name: "ห้องพักเตียงคู่ (Twin Bed)",
      desc: "กว้างขวาง เหมาะสำหรับมาเป็นคู่หรือเพื่อนซี้",
      features: ["📶 Wi-Fi ฟรี", "❄️ แอร์", "📺 ทีวี", "ตู้เสื้อผ้าบิ้วอิน", "เครื่องทำน้ำอุ่น", "เครื่องเป่าผม", "ตู้เย็น"],
      price: "799"
    },
    extraRoom: {
      name: "ห้องพักที่นอนเสริม (Extra Bed)",
      desc: "รองรับครอบครัวหรือกลุ่มเพื่อน เพิ่มพื้นที่พักผ่อน",
      features: ["📶 Wi-Fi ฟรี", "❄️ แอร์", "📺 ทีวี", "ตู้เสื้อผ้าบิ้วอิน", "เครื่องทำน้ำอุ่น", "เครื่องเป่าผม", "ตู้เย็น"],
      price: "899"
    },
    monthlyRooms: [
      {
        id: 0,
        name: "ห้องเปล่า ไม่มีแอร์",
        desc: "ห้องพักราคาประหยัด สำหรับผู้ที่ต้องการความเป็นส่วนตัว",
        price: "3,100",
        deposit: "8,000",
        availableRoomsList: ["307", "504"],
        features: ["❌ แอร์", "❌ เฟอร์นิเจอร์", "🚿 ห้องน้ำในตัว"]
      },
      {
        id: 1,
        name: "ห้องเปล่า ไม่มีแอร์ + มุม",
        desc: "ห้องพักมุมส่วนตัว อากาศถ่ายเทสะดวก (รวมค่าห้องมุม +500 บาทแล้ว)",
        price: "3,400",
        deposit: "8,000",
        availableRoomsList: [],
        features: ["❌ แอร์", "❌ เฟอร์นิเจอร์", "📐 ห้องมุม"]
      },
      {
        id: 2,
        name: "ห้องเปล่า มีแอร์",
        desc: "ห้องพักห้องเปล่า ติดตั้งแอร์เย็นฉ่ำพร้อมใช้งาน",
        price: "3,600",
        deposit: "8,500",
        availableRoomsList: [],
        features: ["❄️ เครื่องปรับอากาศ", "❌ เฟอร์นิเจอร์"]
      },
      {
        id: 3,
        name: "ห้องเปล่า มีแอร์ + มุม",
        desc: "ห้องพักมุมส่วนตัว พร้อมแอร์เย็นสบาย (รวมค่าห้องมุม)",
        price: "3,600",
        deposit: "8,500",
        availableRoomsList: [],
        features: ["❄️ เครื่องปรับอากาศ", "❌ เฟอร์นิเจอร์", "📐 ห้องมุม"]
      },
      {
        id: 4,
        name: "ห้องเฟอร์นิเจอร์ 8 ชิ้น (มีแอร์)",
        desc: "พร้อมเข้าอยู่ ด้วยเฟอร์นิเจอร์พื้นฐาน 8 ชิ้น และเครื่องปรับอากาศ",
        price: "5,000",
        deposit: "10,000",
        availableRoomsList: ["809", "603", "804", "807"],
        features: ["❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์ 8 ชิ้น"]
      },
      {
        id: 5,
        name: "ห้องเฟอร์นิเจอร์ 12 ชิ้น (มีแอร์)",
        desc: "ครบครันและสะดวกสบายขึ้นด้วยเฟอร์นิเจอร์จัดเต็ม 12 ชิ้น (ครบชุดใหญ่)",
        price: "5,500",
        deposit: "10,000",
        availableRoomsList: ["208", "203", "605", "802", "809", "609"],
        features: ["❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์ 12 ชิ้น (ครบชุด)"]
      },
      {
        id: 6,
        name: "ห้องเฟอร์นิเจอร์ เตียงคู่ + มุม (มีแอร์)",
        desc: "ห้องมุมส่วนตัวกว้างขวาง พิเศษด้วยเตียงคู่นอนสบาย พร้อมแอร์",
        price: "6,000",
        deposit: "15,000",
        availableRoomsList: ["709", "209", "509"],
        features: ["❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์", "📐 ห้องมุม", "🛏️ เตียงคู่"]
      },
      {
        id: 7,
        name: "ห้องเฟอร์นิเจอร์ เตียงคู่ ระเบียงใหญ่ + มุม",
        desc: "ห้องมุม วิวสวย พร้อมระเบียงขนาดใหญ่สำหรับพักผ่อนภายนอก",
        price: "6,500",
        deposit: "15,000",
        availableRoomsList: ["501", "801", "601"],
        features: ["❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์", "📐 ห้องมุม", "🛏️ เตียงคู่", "🌅 ระเบียงใหญ่"]
      },
      {
        id: 8,
        name: "ห้องสูทเฟอร์นิเจอร์ + เตียง + แอร์",
        desc: "ห้องสูทขนาดใหญ่ 2 ห้องเชื่อมกัน (Connecting Suite) พร้อมเฟอร์นิเจอร์และแอร์ครบชุด",
        price: "8,400",
        deposit: "18,500",
        availableRoomsList: ["206 เชื่อมกับ 207"],
        features: ["🚪 2 ห้องเชื่อมกัน (Connecting Suite)", "❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์ครบชุด", "🛏️ เตียงนอน"]
      }
    ],
    utilityTitle: "ค่าบริการและอัตราค่าสาธารณูปโภคเพิ่มเติม",
    electricityLabel: "ค่าไฟฟ้า (Electricity)",
    electricityVal: "หน่วยละ 9 บาท",
    waterLabel: "ค่าน้ำประปา (Water)",
    waterVal: "1-5 หน่วยแรก 200 บาท (หน่วยถัดไป หน่วยละ 35 บาท)",
    maintenanceLabel: "ค่าส่วนกลาง (Maintenance)",
    maintenanceVal: "200 บาท / เดือน",
    carParkingLabel: "ค่าจอดรถยนต์ (Car Parking)",
    carParkingVal: "1,000 บาท / เดือน",
    motoParkingLabel: "ค่าจอดรถมอเตอร์ไซค์ (Motorcycle Parking)",
    motoParkingVal: "100 บาท / เดือน",
    keyUnlockLabel: "ค่าบริการเปิดห้อง (กรณีลืมกุญแจ)",
    keyUnlockVal: "300 บาท / ครั้ง",
    rulesTitle: "กฎระเบียบการพักอาศัยของผู้เช่า (Tenant Regulations)",
    rulesList: [
      "ห้ามสูบบุหรี่ในอาคาร",
      "ห้ามดื่มสุราในพื้นที่ส่วนกลาง",
      "ห้ามทะเลาะวิวาท",
      "ห้ามส่งเสียงดังรบกวนผู้อื่น",
      "ห้ามถอดรองเท้าไว้หน้าห้อง",
      "ห้ามใช้แก๊ส",
      "ห้ามเลี้ยงสัตว์",
      "ห้ามทิ้งสิ่งของลงชักโครกและท่อระบายน้ำ",
      "ห้ามเจาะผนังหรือติดสติกเกอร์",
      "ห้ามเปิดปิดประตูเสียงดัง"
    ],
    rulesNotice: "ฝ่าฝืนครั้งที่ 1 เตือนด้วยวาจา | ครั้งที่ 2 ปรับครั้งละ 2,000 บาท/ครั้ง",
    checkInTitle: "วิธีการเช็คอิน (Daily Check-in)",
    checkInSteps: [
      "กรุณาแอด LINE ID: 099-095-4541",
      "สแกนจ่ายเงินผ่านเลขที่บัญชี 245-0-14238-1 ธนาคารกรุงเทพ หรือ พร้อมเพย์ 066-149-6282 ชื่อ นาง อรอนงค์ เตชะเกษมสุข (ไม่รับเงินสด)",
      "ค่าที่พัก + เงินประกัน ห้องละ 500 บาท",
      "ชำระแล้วส่งสลิป พร้อมถ่ายบัตรประชาชนและแจ้งเลขห้องที่เข้าพัก LINE ID: 099-095-4541",
      "ให้พนักงานตรวจสอบความถูกต้องและรับกุญแจห้องพัก",
      "ลูกค้าต้องพกคีย์การ์ดเพื่อเปิดประตู",
      "Wi-Fi: กรุณาเลือก User ตามชั้นที่ท่านพัก"
    ],
    checkOutTitle: "วิธีการเช็คเอ้าท์ (Daily Check-out)",
    checkOutSteps: [
      "ลูกค้าปิดแอร์ ปิดไฟ ปิดประตู (ประตูไม่ต้องล็อก)",
      "นำกุญแจมาใส่ไว้ที่กล่องคืนกุญแจ พร้อมถ่ายรูปแจ้งใน LINE",
      "แจ้งเลขบัญชีใน LINE 099-095-4541",
      "หลังจากแม่บ้านตรวจสอบห้องแล้วพบว่าเรียบร้อย ไม่มีอะไรเสียหาย ทางที่พักจะโอนเงินประกันคืนให้ไม่เกินเวลา 12:00 น. (เที่ยงตรง) ของวันที่ย้ายออกค่ะ"
    ],
    bankAccountTitle: "เลขที่บัญชีชำระเงิน (ไม่รับเงินสด)",
    bankAccountVal: "245-0-14238-1",
    bankNameVal: "ธนาคารกรุงเทพ",
    bankAccountName: "ชื่อบัญชี: นาง อรอนงค์ เตชะเกษมสุข",
    wifiTitle: "รหัส Wi-Fi",
    wifiPass: "",
    lineModalTitle: "ติดต่อเราผ่าน Line Official",
    lineModalDesc: "สแกนเพื่อติดต่อเรา หรือแอด ID: 0990954541",
    copyIdBtn: "คัดลอก ID Line",
    copiedAlert: "คัดลอก ID Line สำเร็จแล้ว!",
    facilitiesTitle: "สิ่งอำนวยความสะดวกส่วนกลาง",
    facilitiesSubtitle: "ครบครัน เพื่อความสะดวกสบาย ปลอดภัย และเป็นส่วนตัวที่สุด",
    facilitiesList: [
      { icon: "📶", title: "อินเทอร์เน็ตความเร็วสูง (Free Wi-Fi)", desc: "สัญญาณครอบคลุมทุกชั้น ใช้งานฟรีตลอด 24 ชั่วโมง" },
      { icon: "🛡️", title: "ระบบรักษาความปลอดภัย 24 ชม.", desc: "เข้า-ออกด้วยระบบคีย์การ์ด พร้อมกล้อง CCTV ทุกชั้น" },
      { icon: "🅿️", title: "ที่จอดรถเป็นสัดส่วน", desc: "มีพื้นที่จอดรถยนต์และรถมอเตอร์ไซค์สะดวก ปลอดภัย" },
      { icon: "❄️", title: "เครื่องปรับอากาศ & เฟอร์นิเจอร์ครบ", desc: "พร้อมเข้าอยู่อาศัยทันที ของใช้อย่างดี" },
      { icon: "🧺", title: "จุดบริการเครื่องซักผ้า", desc: "มีเครื่องซักผ้าหยอดเหรียญให้บริการ" },
      { icon: "📍", title: "ทำเลใจกลางเมืองมหาชัย", desc: "ตรงข้าม Big C มหาชัย ถนนเศรษฐกิจ การเดินทางสะดวกสบาย" }
    ],
    securityTitle: "ระบบรักษาความปลอดภัย",
    securitySubtitle: "มั่นใจและปลอดภัยตลอดการเข้าพัก ด้วยระบบรักษาความปลอดภัยมาตรฐาน",
    securityList: [
      { icon: "👮", title: "เจ้าหน้าที่ตำรวจ", desc: "ดูแลรักษาความปลอดภัยตลอด 24 ชั่วโมง" },
      { icon: "💳", title: "ระบบตัดไฟด้วยคีย์การ์ด", desc: "ปลอดภัยและประหยัดพลังงาน ตัดไฟอัตโนมัติเมื่อออกจากห้อง" },
      { icon: "🧯", title: "ตู้ดับเพลิงทุกชั้น", desc: "อุปกรณ์ดับเพลิงติดตั้งครอบคลุมทุกพื้นที่" },
      { icon: "🔥", title: "Heat & Smoke Detector", desc: "ระบบตรวจจับความร้อนและควันไฟตลอด 24 ชั่วโมง พร้อมกริ่งเหตุเพลิงไหม้ทุกชั้น" },
      { icon: "📹", title: "กล้องวงจรปิด CCTV 24 ชั่วโมง", desc: "บันทึกภาพตลอดเวลา ทุกชั้นและรอบอาคาร" },
      { icon: "⚡", title: "เสาล่อฟ้าป้องกัน", desc: "ติดตั้งระบบป้องกันฟ้าผ่า เพื่อความปลอดภัยสูงสุด" }
    ],
    nearbyTitle: "สถานที่สำคัญใกล้เคียง",
    nearbySubtitle: "ทำเลศักยภาพ เชื่อมต่อทุกการเดินทาง แหล่งช้อปปิ้ง และสถานบริการสาธารณะ",
    nearbyList: [
      { icon: "🛒", title: "Big C มหาชัย", distance: "ตรงข้ามที่พัก (เดิน 2 นาที)", desc: "ศูนย์การค้า ห้างสรรพสินค้า และซูเปอร์มาร์เก็ตครบวงจร" },
      { image: "/images/nearby_hospital.png", icon: "🏥", title: "โรงพยาบาลมหาชัย / รพ.สมุทรสาคร", distance: "5 นาที (1.5 กม.)", desc: "สถานพยาบาลชั้นนำ ดูแลสุขภาพตลอด 24 ชั่วโมง" },
      { image: "/images/nearby_central.png", icon: "🛍️", title: "เซ็นทรัล มหาชัย (Central Mahachai)", distance: "8 นาที (3.2 กม.)", desc: "ศูนย์การค้าขนาดใหญ่ ร้านอาหาร แฟชั่น และโรงภาพยนตร์" },
      { icon: "🚆", title: "สถานีรถไฟมหาชัย & ตลาดสดมหาชัย", distance: "10 นาที (2.5 กม.)", desc: "แหล่งอาหารทะเลสดๆ และจุดเดินทางเข้าสู่กรุงเทพฯ" },
      { image: "/images/nearby_homepro.jpg", icon: "🏠", title: "โฮมโปร มหาชัย (HomePro)", distance: "ขับรถประมาณ 3 นาที", desc: "ศูนย์รวมสินค้าเกี่ยวกับบ้านและของตกแต่งบ้านครบวงจร" },
      { image: "/images/nearby_makro.png", icon: "🛒", title: "แม็คโคร มหาชัย (Makro)", distance: "ขับรถประมาณ 5 นาที", desc: "ศูนย์จำหน่ายสินค้าอุปโภคบริโภคขนาดใหญ่" },
      { image: "/images/nearby_lotus.png", icon: "🛍️", title: "โลตัส มหาชัย (Lotus's)", distance: "ขับรถประมาณ 5 นาที", desc: "ซูเปอร์มาร์เก็ตและศูนย์การค้าครบวงจร" },
      { image: "/images/nearby_talaythai.jpg", icon: "🦐", title: "ตลาดทะเลไทย มหาชัย", distance: "ขับรถประมาณ 10 นาที", desc: "ศูนย์กลางอาหารทะเลสดและแปรรูปที่ใหญ่ที่สุด" },
      { image: "/images/nearby_bus.png", icon: "🚌", title: "สถานีรถโดยสารประจำทาง", distance: "ใกล้เคียง", desc: "จุดขึ้นรถประจำทาง เดินทางสะดวกสบาย" },
      { image: "/images/nearby_tops.png", icon: "🛒", title: "Top supermarket", distance: "1 นาที", desc: "ซูเปอร์มาร์เก็ตสำหรับซื้อของใช้และอาหาร" },
      { image: "/images/nearby_thaiunion.png", icon: "🏪", title: "ตลาดไทยยูเนี่ยน", distance: "1 นาที", desc: "ตลาดสดและแหล่งรวมของกินใกล้ที่พัก" },
      { image: "/images/nearby_ghbank.png", icon: "🏦", title: "ธนาคารธอส สาขาสมุทรสาคร", distance: "1 นาที", desc: "ธนาคารอาคารสงเคราะห์" },
      { image: "/images/nearby_kasikorn.png", icon: "🏦", title: "ธนาคารกสิกร สาขาถนนเศรษฐกิจ 1", distance: "2 นาที", desc: "ธนาคารกสิกรไทย" },
      { image: "/images/nearby_bangchak.png", icon: "⛽", title: "ปั๊มน้ำมันบางจาก", distance: "0.5 นาที", desc: "สถานีบริการน้ำมันบางจาก" },
      { image: "/images/nearby_ptt.png", icon: "⛽", title: "ปั๊มน้ำมัน ปตท", distance: "0.5 นาที", desc: "สถานีบริการน้ำมัน PTT" },
      { image: "/images/nearby_amazon.png", icon: "☕", title: "กาแฟอเมซอน (Café Amazon)", distance: "0.5 นาที", desc: "ร้านกาแฟสด" },
      { image: "/images/nearby_7eleven.png", icon: "🏪", title: "7-Eleven", distance: "0.5 นาที", desc: "ร้านสะดวกซื้อเปิดตลอด 24 ชั่วโมง" },
      { image: "/images/nearby_cj.png", icon: "🏪", title: "CJ MORE", distance: "5 นาที", desc: "ซูเปอร์มาร์เก็ตและร้านสะดวกซื้อ" },
      { image: "/images/nearby_thasai.png", icon: "🏛️", title: "อบต. ท่าทราย", distance: "5 นาที", desc: "องค์การบริหารส่วนตำบลท่าทราย" }
    ],
    nearbyShowMore: "▼ ดูสถานที่ใกล้เคียงเพิ่มเติม",
    nearbyShowLess: "▲ ย่อรายการ",
    faqTitle: "คำถามที่พบบ่อย (FAQ)",
    faqSubtitle: "ไขข้อข้องใจเกี่ยวกับการเข้าพักและการเช่าห้องพักรายวัน / รายเดือน",
    faqList: [
      { q: "เวลาเช็คอินและเช็คเอ้าท์สำหรับห้องพักรายวันคือช่วงไหน?", a: "เช็คอินได้ตั้งแต่เวลา 14:00 น. เป็นต้นไป และเช็คเอ้าท์ก่อนเวลา 12:00 น. (เที่ยงวัน) ของวันถัดไปค่ะ" },
      { q: "ได้รับเงินมัดจำประกันห้องคืนตอนไหน?", a: "หลังจากแม่บ้าน/พนักงานตรวจเช็คห้องพักเสร็จสิ้นและไม่พบสิ่งของเสียหาย ทางที่พักจะดำเนินการโอนเงินมัดจำคืนให้ท่านไม่เกินเวลา 12:00 น. (เที่ยงตรง) ของวันที่ลูกค้าเช็คเอ้าท์ย้ายออกครับ" },
      { q: "การจองห้องพักรายวันต้องจ่ายเงินมัดจำเท่าไหร่?", a: "มีค่ามัดจำประกันห้องพักรายวันละ 500 บาท/ห้อง ซึ่งจะได้รับเงินคืนเต็มจำนวนทางโอนเงินไม่เกินเวลา 12:00 น. ของวันที่เช็คเอ้าท์ หลังแม่บ้านตรวจสอบห้องเรียบร้อยค่ะ" },
      { q: "สัญญาเช่าห้องพักรายเดือนมีระยะเวลากี่เดือน?", a: "สัญญาเช่าระยะยาว 1 ปีค่ะ (หากทำสัญญาเช่าสั้นกว่า 1 ปี จะมีการบวกค่าเช่ารายเดือนของห้องเพิ่ม 1,000 บาท/เดือนค่ะ)" },
      { q: "สามารถเลี้ยงสัตว์เลี้ยงภายในห้องพักได้หรือไม่?", a: "เพื่อความเป็นระเบียบเรียบร้อยและความเงียบสงบของผู้พักอาศัยทุกท่าน ทางที่พักไม่อนุญาตให้เลี้ยงสัตว์เลี้ยงทุกชนิดค่ะ" },
      { q: "มีบริการที่จอดรถยนต์และมอเตอร์ไซค์หรือไม่?", a: "มีพื้นที่จอดรถยนต์ (1,000 บาท/เดือน) และมอเตอร์ไซค์ (100 บาท/เดือน) พร้อมระบบกล้องวงจรปิดดูแลตลอด 24 ชั่วโมงค่ะ" },
      { q: "หากลืมกุญแจห้องพัก มีค่าบริการเปิดห้องเท่าไหร่?", a: "หากลูกห้องท่านใดลืมกุญแจห้อง ทางที่พักจะมีค่าใช้จ่ายเปิดห้องครั้งละ 300 บาทค่ะ" }
    ],
    reviewsTitle: "ความประทับใจจากผู้เข้าพัก",
    reviewsSubtitle: "รีวิวและเสียงตอบรับจากลูกค้าจริงที่เคยเข้าพักกับ แอทสมุทรสาคร มหาชัย",
    reviewsList: [
      { name: "คุณกิตติศักดิ์ พ.", role: "ผู้เข้าพักรายวัน", text: "ห้องพักสะอาดมากครับ แอร์เย็นฉ่ำ อยู่ตรงข้าม Big C มหาชัยเลย เดินทางสะดวกมาก พนักงานบริการดีและรวดเร็วครับ", rating: 5 },
      { name: "คุณนภาวรรณ ส.", role: "ผู้เช่ารายเดือน", text: "พักรายเดือนที่นี่มา 1 ปีแล้วค่ะ ปลอดภัย เงียบสงบ ไม่มีเสียงรบกวน ระบบคีย์การ์ดแน่นหนามาก ทำเลดีหาของกินง่าย", rating: 5 },
      { name: "คุณอนันต์ ต.", role: "ผู้เข้าพักรายวัน", text: "จองง่าย ระบบเช็คอินสะดวกมากครับ มีที่จอดรถกว้างขวาง คุ้มค่าคุ้มราคามากครับ มีโอกาสกลับมาพักอีกแน่นอน", rating: 5 }
    ],
    contactUs: "ติดต่อเรา",
    addressLabel: "ที่อยู่",
    addressVal: "อยู่ในเมือง ตรงข้ามบิ๊กซี มหาชัย ถนนเศรษฐกิจ1",
    phoneLabel: "เบอร์ติดต่อ",
    phoneVal: "099 095 4541, 065 464 7459",
    mapLabel: "แผนที่เดินทาง Google Maps",
    copyright: "สงวนลิขสิทธิ์ © 2026 แอทสมุทรสาคร สาขามหาชัย (@samutsakorn mahachai)",
    calculatorTitle: "เครื่องมือคำนวณค่าใช้จ่ายรายเดือนสุทธิ",
    calculatorSubtitle: "ประเมินค่าใช้จ่ายประจำเดือน (ค่าเช่า + ค่าน้ำ + ค่าไฟ + ค่าบริการ) ได้ทันทีแบบเรียลไทม์",
    calcRoomTypeLabel: "เลือกรูปแบบห้องพักรายเดือน",
    calcElecLabel: "ประมาณการหน่วยไฟฟ้าที่ใช้ (หน่วยละ 9 บาท)",
    calcWaterLabel: "ประมาณการหน่วยน้ำประปาที่ใช้",
    calcCarLabel: "ค่าจอดรถยนต์ (1,000 บาท/เดือน)",
    calcMotoLabel: "ค่าจอดรถมอเตอร์ไซค์ (100 บาท/เดือน)",
    calcTotalMonthly: "ยอดรวมค่าใช้จ่ายประเมินรายเดือน",
    calcMoveInDeposit: "เงินมัดจำแรกเข้าพัก",
    calcCopySummary: "คัดลอกสรุปรายการคำนวณ",
    calcCopiedToast: "คัดลอกสรุปรายการคำนวณเรียบร้อยแล้ว!",
    promptPayBtn: "💳 สแกน PromptPay / บัญชีโอนเงิน",
    promptPayTitle: "ข้อมูลบัญชีโอนเงินชำระค่าที่พัก & มัดจำ",
    chatbotTitle: "ผู้ช่วยตอบคำถามอัตโนมัติ 24 ชม.",
    chatbotSubtitle: "สอบถามข้อมูลห้องพัก กฎระเบียบ การคืนมัดจำ หรือการเดินทาง",
    chatbotBadge: "แชทสด Chatbot",
    fanFutonRoom: {
      name: "ห้องเตียงพัดลม (Fan Bed Room)",
      desc: "ห้องพักราคาประหยัด บรรยากาศสบาย พร้อมพัดลมและเตียงนอน",
      features: ["🌀 พัดลม", "🛏️ เตียงนอน", "📶 ฟรี Wi-Fi", "🚿 ห้องน้ำในตัว"],
      price: "450"
    },
    suiteRoom: {
      name: "ห้องสูทเฟอร์นิเจอร์ + ฟูก (Connecting Suite Room)",
      desc: "ห้องพัก 2 ห้องเชื่อมกัน (Connecting Rooms) พร้อมเฟอร์นิเจอร์ครบชุดและฟูกที่นอน",
      features: ["🚪 2 ห้องเชื่อมกัน", "❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์ครบชุด", "🛏️ ชุดฟูกที่นอน", "📶 ฟรี Wi-Fi"],
      price: "1,299"
    },
    heroBadge: "@Samutsakorn Mahachai • ที่พักสมุทรสาคร",
    heroRating: "คะแนนรีวิวผู้เข้าพัก",
    heroOpposite: "ตรงข้าม Big C มหาชัย",
    heroSecurity: "คีย์การ์ด & CCTV 24 ชม.",
    heroWifi: "ฟรี Wi-Fi",
    heroElevatorParking: "มีลิฟต์โดยสาร & ที่จอดรถในอาคาร",
    heroLocationLabel: "ทำเลที่ตั้ง (Location)",
    heroLocationVal: "ใจกลางมหาชัย (ตรงข้าม Big C)",
    heroCheckInOutLabel: "เวลาเช็คอิน / เช็คเอ้าท์",
    heroCheckInOutVal: "เช็คอิน 14:00 | เช็คเอ้าท์ 12:00",
    heroDepositLabel: "เงินมัดจำประกันห้อง",
    heroDepositVal: "500 บาท/ห้อง (คืนเต็มจำนวน)",
    heroContractTerm: "สัญญาระยะยาว 1 ปีขึ้นไป",
    heroShortTermNote: "สั้นกว่า 1 ปี +1,000 บ./เดือน",
    heroContactBooking: "ติดต่อจองห้องพัก",
    heroCallQuick: "โทรจองด่วน",
    heroSelectDaily: "🏨 เลือกดูห้องพักรายวัน",
    heroSelectMonthly: "🏢 เลือกดูห้องพักรายเดือน",
    heroStatusDaily: "สลับข้อมูลเป็น: ห้องพักรายวัน (เช็คอิน 14:00 | เช็คเอ้าท์ 12:00 | มัดจำ 500 บาท)",
    heroStatusMonthly: "สลับข้อมูลเป็น: ห้องพักรายเดือน (สัญญา 1 ปีขึ้นไป | สัญญาสั้นกว่า 1 ปี +1,000 บ./เดือน)",
    rulesSubtitle: "ข้อปฏิบัติตามมาตรฐานเพื่อความสะอาด ความปลอดภัย และความเป็นส่วนตัวของผู้พักอาศัยทุกท่าน",
    leaseAgreementBtn: "📄 ดูฉบับเต็ม: สัญญาและกฎข้อระเบียบการเช่าหอพัก (Official Lease Agreement)",
    dailyRoomsOverviewTitle: "สถานะห้องพักรายวัน (รวมทั้งหมด {total} ห้อง)",
    dailyRoomsOverviewSub: "เช็คความพร้อม จำนวนห้องทั้งหมด เต็มแล้วกี่ห้อง และเหลือว่างกี่ห้อง",
    totalRoomsLabel: "ทั้งหมด:",
    occupiedRoomsLabel: "เต็มแล้ว:",
    availableRoomsLabel: "เหลือว่าง:",
    monthlyOverviewTitle: "สถานะห้องพักรายเดือนว่างพร้อมเข้าอยู่",
    monthlyOverviewSub: "อัปเดตหมายเลขห้องพักที่ว่างแบบเรียลไทม์ สอบถามหรือจองห้องได้ทันที",
    monthlyAvailableBadge: "มีห้องว่างทั้งหมด {count} ห้อง",
    roomsUnit: "ห้อง",
    keycardFeeLabel: "ค่าซื้อคีย์การ์ดเข้าอาคาร",
    keycardFeeVal: "100 บาท / ใบ",
    keyUnlockFeeLabel: "ค่าบริการเปิดห้อง (กรณีลืมกุญแจ)",
    keyUnlockFeeVal: "300 บาท / ครั้ง",
    officialAgreementTitle: "สัญญาและกฎข้อระเบียบข้อบังคับในการเช่าหอพัก",
    mapHeading: "🗺️ แผนที่ตั้ง แอทสมุทรสาคร สาขามหาชัย",
    mapSubheading: "ตรงข้าม Big C มหาชัย ถนนเศรษฐกิจ อำเภอเมือง จังหวัดสมุทรสาคร",
    openGoogleMapsBtn: "📍 นำทางด้วย Google Maps",
    thbUnit: "บาท",
    compareRoomsBtn: "📊 ตารางเปรียบเทียบห้องพักรายเดือน 7 รูปแบบ",
    compareModalTitle: "ตารางเปรียบเทียบคุณสมบัติห้องพักรายเดือน 7 รูปแบบ",
    compareIntro: "เลือกดูข้อแตกต่างของแต่ละรูปแบบห้องพัก เพื่อความเหมาะสมกับไลฟ์สไตล์และงบประมาณของคุณที่สุด",
    compareHeaderRoomType: "ประเภทห้องพักรายเดือน",
    compareHeaderRent: "อัตราค่าเช่า (บาท/เดือน)",
    compareHeaderDeposit: "เงินมัดจำแรกเข้า (บาท)",
    compareHeaderStatus: "สถานะ & เลขห้องว่าง",
    compareHeaderAir: "เครื่องปรับอากาศ",
    compareHeaderFurniture: "เฟอร์นิเจอร์",
    compareHeaderHighlights: "จุดเด่นพิเศษ",
    compareHeaderAction: "จองห้อง",
    compareAvailableBadge: "🟢 ว่าง {count} ห้อง",
    compareFullBadge: "🔴 เต็มแล้ว",
    compareHasAir: "❄️ มีแอร์",
    compareNoAir: "❌ ไม่มีแอร์",
    compareFurn12: "12 ชิ้น (ครบชุดใหญ่)",
    compareFurn8: "8 ชิ้น (ชุดมาตรฐาน)",
    compareFurnYes: "มีเฟอร์นิเจอร์",
    compareFurnNone: "ไม่มี (ห้องเปล่า)",
    compareBookRoomBtn: "จองห้องนี้",

    calcEco: "0 (ประหยัด)",
    calcAvg: "100 (เฉลี่ย)",
    calcAirconOften: "250 (เปิดแอร์บ่อย)",
    calcHighUsage: "400 (ใช้มาก)",
    calcWaterRangeMin: "1-5 หน่วย (ขั้นต่ำ 200บ.)",
    calcWaterRangeMid: "15 หน่วย",
    calcWaterRangeMax: "30 หน่วย",
    calcParkingTitle: "🅿️ บริการที่จอดรถเพิ่มเติม",
    calcSummaryTitle: "สรุปรายการคำนวณประเมินผล",
    calcRentBreakdown: "ค่าเช่าห้องพัก",
    calcElecBreakdown: "ค่าไฟฟ้าประมาณการ",
    calcWaterBreakdown: "ค่าน้ำประปาประมาณการ",
    calcCommonFeeBreakdown: "ค่าส่วนกลางอาคาร",
    calcCarBreakdown: "ค่าจอดรถยนต์",
    calcMotoBreakdown: "ค่าจอดรถมอเตอร์ไซค์",
    calcTotalMoveIn: "งบรวมแรกเข้าพัก (มัดจำ + เดือนแรก)",
    calcUnitsBadge: "หน่วย",

    bankName: "ธนาคารกรุงเทพ (Bangkok Bank)",
    bankNote: "บริการชำระเงินโอนผ่านบัญชีธนาคาร (ไม่รับเงินสด)",
    bankAccLabel: "เลขที่บัญชี:",
    bankCopyBtn: "📋 คัดลอกเลขบัญชี",
    bankCopiedBtn: "✅ คัดลอกแล้ว!",
    bankAccNameLabel: "ชื่อบัญชี:",
    bankAccNameVal: "นาง อรอนงค์ เตชะเกษมสุข",
    bankDailyNoticeTitle: "การชำระเงินห้องพักรายวัน:",
    bankDailyNoticeDesc: "ค่าห้องพัก + ค่ามัดจำประกันห้อง 500 บาท/ห้อง (ได้รับคืนเต็มจำนวนเวลา 12:00 น)",
    bankStepsTitle: "ขั้นตอนหลังชำระเงิน:",
    bankStep1: "ถ่ายรูป/เซฟสลิปโอนเงิน",
    bankStep2: "ถ่ายภาพบัตรประชาชนและแจ้งเลขห้องพัก",
    bankStep3: "ส่งสลิปแจ้งยืนยันทาง LINE ID: 0990954541",
  },
  en: {
    brand: "@samutsakorn mahachai",
    navHome: "Home",
    navRooms: "Room Types",
    navFacilities: "Facilities",
    navNearby: "Nearby Places",
    navRules: "Rules",
    navFaq: "FAQ",
    navReviews: "Reviews",
    welcome: "Welcome to @samutsakorn mahachai",
    subheading: "Clean, Safe, and Convenient in the Heart of Mahachai",
    selectRoomBtn: "Explore Rooms",
    roomSectionTitle: "Daily & Monthly Room Types",
    roomSectionSubtitle: "Relax in comfort and privacy with complete amenities at great rates",
    viewDetails: "View Details",
    bookNow: "Book Now",
    pricePerNight: "THB / Night",
    dailyTab: "Daily",
    monthlyTab: "Monthly",
    depositLabel: "Deposit",
    perMonth: "THB / Month",
    singleRoom: {
      name: "Single Bed Room",
      desc: "Comfortable and private with chilled air conditioning",
      features: ["📶 Free Wi-Fi", "❄️ Air Con", "📺 TV", "Built-in Wardrobe", "Water Heater", "Hair Dryer", "Refrigerator"],
      price: "799"
    },
    twinRoom: {
      name: "Twin Bed Room",
      desc: "Spacious layout, perfect for couples or friends",
      features: ["📶 Free Wi-Fi", "❄️ Air Con", "📺 TV", "Built-in Wardrobe", "Water Heater", "Hair Dryer", "Refrigerator"],
      price: "799"
    },
    extraRoom: {
      name: "Extra Bed Room",
      desc: "Accommodates families or groups with extra living space",
      features: ["📶 Free Wi-Fi", "❄️ Air Con", "📺 TV", "Built-in Wardrobe", "Water Heater", "Hair Dryer", "Refrigerator"],
      price: "899"
    },
    fanFutonRoom: {
      name: "Fan Bed Room",
      desc: "Budget-friendly comfortable room with fan and bed",
      features: ["🌀 Fan", "🛏️ Bed", "📶 Free Wi-Fi", "🚿 Private Bathroom"],
      price: "450"
    },
    suiteRoom: {
      name: "Connecting Suite Room (Furnished + Futon)",
      desc: "Spacious 2 connecting rooms with full furniture set and futon bedding",
      features: ["🚪 2 Connecting Rooms", "❄️ Air Con", "🛋️ Full Furniture", "🛏️ Futon Bed", "📶 Free Wi-Fi"],
      price: "1,299"
    },
    monthlyRooms: [
      {
        id: 0,
        name: "Empty Room, No Air Con",
        desc: "Budget-friendly option for those seeking a private room",
        price: "3,100",
        deposit: "8,000",
        availableRoomsList: ["307", "504"],
        features: ["❌ Air Con", "❌ Furniture", "🚿 Private Bathroom"]
      },
      {
        id: 1,
        name: "Empty Room, No Air Con + Corner",
        desc: "Private corner room with good natural ventilation (Corner fee included)",
        price: "3,400",
        deposit: "8,000",
        availableRoomsList: [],
        features: ["❌ Air Con", "❌ Furniture", "📐 Corner Room"]
      },
      {
        id: 2,
        name: "Empty Room with Air Con",
        desc: "Standard empty room fitted with chilled air conditioning",
        price: "3,600",
        deposit: "8,500",
        availableRoomsList: [],
        features: ["❄️ Air Conditioning", "❌ Furniture"]
      },
      {
        id: 3,
        name: "Empty Room with Air Con + Corner",
        desc: "Private corner room with cool air conditioning (Corner fee included)",
        price: "3,600",
        deposit: "8,500",
        availableRoomsList: [],
        features: ["❄️ Air Conditioning", "❌ Furniture", "📐 Corner Room"]
      },
      {
        id: 4,
        name: "8-Piece Furnished Room (with Air Con)",
        desc: "Ready to move in with 8 essential quality furniture pieces and air conditioning",
        price: "5,000",
        deposit: "10,000",
        availableRoomsList: ["809", "603", "804", "807"],
        features: ["❄️ Air Conditioning", "🛋️ 8-Piece Furniture"]
      },
      {
        id: 5,
        name: "12-Piece Furnished Room (with Air Con)",
        desc: "More complete and luxurious with 12 full set furniture pieces",
        price: "5,500",
        deposit: "10,000",
        availableRoomsList: ["208", "203", "605", "802", "809", "609"],
        features: ["❄️ Air Conditioning", "🛋️ 12-Piece Furniture (Full Set)"]
      },
      {
        id: 6,
        name: "Twin Bed Furnished Room + Corner (with Air Con)",
        desc: "Spacious private corner room with comfortable twin beds and air conditioning",
        price: "6,000",
        deposit: "15,000",
        availableRoomsList: ["709", "209", "509"],
        features: ["❄️ Air Conditioning", "🛋️ Furniture", "📐 Corner Room", "🛏️ Twin Bed"]
      },
      {
        id: 7,
        name: "Twin Bed Furnished, Large Balcony + Corner",
        desc: "Scenic corner unit featuring a very large private outdoor relaxation balcony",
        price: "6,500",
        deposit: "15,000",
        availableRoomsList: ["501", "801", "601"],
        features: ["❄️ Air Conditioning", "🛋️ Furniture", "📐 Corner Room", "🛏️ Twin Bed", "🌅 Large Balcony"]
      },
      {
        id: 8,
        name: "Connecting Suite (Furnished + Bed + Air Con)",
        desc: "Spacious Connecting Suite (2 rooms connected) with complete furniture and air conditioning",
        price: "8,400",
        deposit: "18,500",
        availableRoomsList: ["206 connected with 207"],
        features: ["🚪 2 Connecting Rooms (Suite)", "❄️ Air Conditioning", "🛋️ Full Furniture", "🛏️ Bed Set"]
      }
    ],
    utilityTitle: "Utility & Additional Service Fees",
    electricityLabel: "Electricity",
    electricityVal: "9 THB per Unit",
    waterLabel: "Water Supply",
    waterVal: "First 1-5 Units: 200 THB (Next units: 35 THB/unit)",
    maintenanceLabel: "Common Area Fee (Maintenance)",
    maintenanceVal: "200 THB / Month",
    carParkingLabel: "Car Parking",
    carParkingVal: "1,000 THB / Month",
    motoParkingLabel: "Motorcycle Parking",
    motoParkingVal: "100 THB / Month",
    keyUnlockLabel: "Unlock Room Fee (Forgotten Key)",
    keyUnlockVal: "300 THB / time",
    rulesTitle: "Tenant Housing Regulations",
    rulesList: [
      "Smoking is prohibited in the building",
      "Do not drink alcohol in common areas",
      "Don't quarrel / fight",
      "Do not make loud noises to disturb others",
      "Do not take off your shoes in front of the room",
      "Do not use gas",
      "No pets are allowed",
      "Do not throw things into the toilet or drain",
      "Do not pierce walls or stick stickers",
      "Do not open or close the door loudly"
    ],
    rulesNotice: "First offense: Verbal warning | Second offense: Fine of 2,000 Baht per offense",
    checkInTitle: "Daily Check-in Process",
    checkInSteps: [
      "Please add LINE ID: 0990954541",
      "Scan/Transfer payment to Bangkok Bank A/C: 245-0-14238-1 Name: Onanong Techakasemsook (No cash accepted)",
      "Room rate + Deposit 500 THB per room",
      "Send payment slip, ID card photo, and room number via LINE ID: 0990954541",
      "Staff will verify details and hand over the room keys",
      "Please carry your keycard to unlock the door",
      "Wi-Fi: Please select User according to your floor"
    ],
    checkOutTitle: "Daily Check-out Process",
    checkOutSteps: [
      "Turn off AC, lights, and close the door (Do not lock the door)",
      "Put the keys into the key return box and send a photo notification in LINE",
      "Send your bank account details in LINE: 0990954541",
      "After housekeeper inspects the room with no damages found, your deposit will be refunded via bank transfer"
    ],
    bankAccountTitle: "Payment Bank Account (No Cash)",
    bankAccountVal: "245-0-14238-1",
    bankNameVal: "Bangkok Bank",
    bankAccountName: "Account Name: Onanong Techakasemsook",
    wifiTitle: "Wi-Fi Password",
    wifiPass: "",
    lineModalTitle: "Contact via Line Official",
    lineModalDesc: "Scan to chat or add ID: 0990954541",
    copyIdBtn: "Copy Line ID",
    copiedAlert: "Line ID Copied Successfully!",
    facilitiesTitle: "Building Facilities",
    facilitiesSubtitle: "Fully equipped for your convenience, safety, and utmost privacy",
    facilitiesList: [
      { icon: "📶", title: "High-Speed Wi-Fi", desc: "Coverage on every floor, free 24/7" },
      { icon: "🛡️", title: "24/7 Security System", desc: "Keycard access control with CCTV on all floors" },
      { icon: "🅿️", title: "Dedicated Parking", desc: "Spacious car and motorcycle parking spaces" },
      { icon: "❄️", title: "Air Con & Full Furniture", desc: "Move-in ready with premium amenities" },
      { icon: "🧺", title: "Laundry Service Area", desc: "Coin washing machines available on-site" },
      { icon: "📍", title: "Prime Location in Mahachai", desc: "Opposite Big C Mahachai, Sethakit Road, easy transportation" }
    ],
    securityTitle: "Security System",
    securitySubtitle: "Rest assured with our standard security systems during your stay",
    securityList: [
      { icon: "👮", title: "Police / Security Guards", desc: "24/7 security personnel on site" },
      { icon: "💳", title: "Keycard Power Cut-off", desc: "Safe and energy-saving automatic power cut-off" },
      { icon: "🧯", title: "Fire Extinguishers", desc: "Fire extinguishing equipment installed on every floor" },
      { icon: "🔥", title: "Heat & Smoke Detector", desc: "24-hour heat and smoke detection system with fire alarm bells on all floors" },
      { icon: "📹", title: "24/7 CCTV", desc: "Continuous recording on all floors and around the building" },
      { icon: "⚡", title: "Lightning Rod", desc: "Lightning protection system installed for maximum safety" }
    ],
    nearbyTitle: "Nearby Key Locations",
    nearbySubtitle: "Prime location connecting transportation, shopping centers, and public services",
    nearbyList: [
      { icon: "🛒", title: "Big C Mahachai", distance: "Opposite (2 mins walk)", desc: "Hypermarket, shopping mall, and complete supermarket" },
      { image: "/images/nearby_hospital.png", icon: "🏥", title: "Mahachai Hospital / Samutsakorn Hosp.", distance: "5 mins (1.5 km)", desc: "Leading healthcare facilities available 24 hours" },
      { image: "/images/nearby_central.png", icon: "🛍️", title: "Central Mahachai", distance: "8 mins (3.2 km)", desc: "Major shopping center, restaurants, fashion, and cinema" },
      { icon: "🚆", title: "Mahachai Railway & Fresh Market", distance: "10 mins (2.5 km)", desc: "Fresh seafood market and train transport to Bangkok" },
      { image: "/images/nearby_homepro.jpg", icon: "🏠", title: "HomePro Mahachai", distance: "3 mins drive", desc: "Comprehensive home improvement and decor center" },
      { image: "/images/nearby_makro.png", icon: "🛒", title: "Makro Mahachai", distance: "5 mins drive", desc: "Large wholesale consumer goods supermarket" },
      { image: "/images/nearby_lotus.png", icon: "🛍️", title: "Lotus's Mahachai", distance: "5 mins drive", desc: "Complete supermarket and shopping mall" },
      { image: "/images/nearby_talaythai.jpg", icon: "🦐", title: "Talay Thai Market", distance: "10 mins drive", desc: "Largest fresh and processed seafood market" },
      { image: "/images/nearby_bus.png", icon: "🚌", title: "Bus Terminal", distance: "Nearby", desc: "Easy access to public bus transportation" },
      { image: "/images/nearby_tops.png", icon: "🛒", title: "Tops Supermarket", distance: "1 min", desc: "Supermarket for groceries and essentials" },
      { image: "/images/nearby_thaiunion.png", icon: "🏪", title: "Thai Union Market", distance: "1 min", desc: "Fresh market and local food hub" },
      { image: "/images/nearby_ghbank.png", icon: "🏦", title: "GH Bank (Samut Sakhon)", distance: "1 min", desc: "Government Housing Bank" },
      { image: "/images/nearby_kasikorn.png", icon: "🏦", title: "Kasikorn Bank (Sethakit 1 Rd)", distance: "2 mins", desc: "KBank Branch" },
      { image: "/images/nearby_bangchak.png", icon: "⛽", title: "Bangchak Gas Station", distance: "0.5 min", desc: "Bangchak petrol station" },
      { image: "/images/nearby_ptt.png", icon: "⛽", title: "PTT Gas Station", distance: "0.5 min", desc: "PTT petrol station" },
      { image: "/images/nearby_amazon.png", icon: "☕", title: "Café Amazon", distance: "0.5 min", desc: "Fresh coffee shop" },
      { image: "/images/nearby_7eleven.png", icon: "🏪", title: "7-Eleven", distance: "0.5 min", desc: "24-hour convenience store" },
      { image: "/images/nearby_cj.png", icon: "🏪", title: "CJ MORE", distance: "5 mins", desc: "Supermarket and convenience store" },
      { image: "/images/nearby_thasai.png", icon: "🏛️", title: "Tha Sai Subdistrict Administrative Organization", distance: "5 mins", desc: "Local government office" }
    ],
    nearbyShowMore: "▼ See More Nearby Places",
    nearbyShowLess: "▲ Show Less",
    faqTitle: "Frequently Asked Questions (FAQ)",
    faqSubtitle: "Find answers regarding daily stays and monthly room rentals",
    faqList: [
      { q: "What are the check-in and check-out times for daily stays?", a: "Check-in is available from 2:00 PM onwards, and check-out is before 12:00 PM (noon) the following day." },
      { q: "When will I receive my security deposit refund?", a: "After room inspection is completed and no damages are found, your deposit will be refunded via bank transfer no later than 12:00 PM (noon) on your check-out day." },
      { q: "How much is the security deposit for daily room bookings?", a: "The daily security deposit is 500 THB/room, fully refunded via bank transfer no later than 12:00 PM on check-out day after inspection." },
      { q: "What is the minimum lease term for monthly rentals?", a: "Standard long-term lease agreement is 1 year. (For lease terms under 1 year, an additional 1,000 THB/month will be added to the monthly room rate)." },
      { q: "Are pets allowed in the rooms?", a: "For the tranquility and orderliness of all guests, pets of any kind are strictly not allowed." },
      { q: "Is there car and motorcycle parking available?", a: "Car parking (1,000 THB/month) and motorcycle parking (100 THB/month) are available with 24h CCTV." }
    ],
    reviewsTitle: "Guest Impressions & Reviews",
    reviewsSubtitle: "Real feedback from guests who stayed at @samutsakorn mahachai",
    reviewsList: [
      { name: "Kittisak P.", role: "Daily Guest", text: "Very clean room, cold air con! Located right opposite Big C Mahachai. Extremely convenient and fast service.", rating: 5 },
      { name: "Napawan S.", role: "Monthly Resident", text: "Living here for 1 year now. Safe, quiet, no disturbing noise. High keycard security and great food options around.", rating: 5 },
      { name: "Anan T.", role: "Daily Guest", text: "Easy booking and very smooth check-in. Spacious parking, great value for money. Will definitely return!", rating: 5 }
    ],
    contactUs: "Contact Us",
    addressLabel: "Address",
    addressVal: "In town, opposite Big C Mahachai, Sethakit 1 Road",
    phoneLabel: "Phone",
    phoneVal: "099 095 4541, 065 464 7459",
    mapLabel: "Google Maps Route Map",
    copyright: "Copyright © 2026 @samutsakorn mahachai. All Rights Reserved.",
    heroBadge: "@Samutsakorn Mahachai • Accommodation in Samutsakorn",
    heroRating: "Guest Review Score",
    heroOpposite: "Opposite Big C Mahachai",
    heroSecurity: "Keycard & 24h CCTV",
    heroWifi: "Free High-Speed Wi-Fi",
    heroElevatorParking: "Elevator & Indoor Parking",
    heroLocationLabel: "Prime Location",
    heroLocationVal: "Center of Mahachai (Opposite Big C)",
    heroCheckInOutLabel: "Check-in / Check-out Time",
    heroCheckInOutVal: "Check-in 14:00 | Check-out 12:00",
    heroDepositLabel: "Room Security Deposit",
    heroDepositVal: "500 THB / room (100% Refundable)",
    heroContractTerm: "Long-term Lease 1 Year+",
    heroShortTermNote: "Shorter than 1 year: +1,000 THB/month",
    heroContactBooking: "Book Your Room",
    heroCallQuick: "Call Now",
    heroSelectDaily: "🏨 View Daily Rooms",
    heroSelectMonthly: "🏢 View Monthly Rooms",
    heroStatusDaily: "Switched to: Daily Rooms (Check-in 14:00 | Check-out 12:00 | Deposit 500 THB)",
    heroStatusMonthly: "Switched to: Monthly Rooms (1-Year Contract | Under 1-year +1,000 THB/month)",
    rulesSubtitle: "Standard community guidelines for cleanliness, safety, and privacy for all residents",
    leaseAgreementBtn: "📄 Full Document: Official Apartment Lease Agreement & Regulations",
    dailyRoomsOverviewTitle: "Daily Rooms Overview ({total} Total Rooms)",
    dailyRoomsOverviewSub: "Check current live status, total capacity, occupied count, and available units",
    totalRoomsLabel: "Total:",
    occupiedRoomsLabel: "Occupied:",
    availableRoomsLabel: "Available:",
    monthlyOverviewTitle: "Monthly Rooms Ready for Move-In",
    monthlyOverviewSub: "Real-time list of available room numbers. Inquire or reserve immediately.",
    monthlyAvailableBadge: "{count} Rooms Currently Available",
    roomsUnit: "Rooms",
    keycardFeeLabel: "Keycard Access Purchase",
    keycardFeeVal: "100 THB / card",
    keyUnlockFeeLabel: "Room Unlock Assistance (Forgotten key)",
    keyUnlockFeeVal: "300 THB / incident",
    officialAgreementTitle: "Apartment Lease Agreement and Community Regulations",
    mapHeading: "🗺️ Location Map @samutsakorn mahachai",
    mapSubheading: "Opposite Big C Mahachai, Sethakit Road, Mueang Samut Sakhon",
    openGoogleMapsBtn: "📍 Navigate with Google Maps",

    compareRoomsBtn: "📊 Compare All 7 Monthly Room Models",
    compareModalTitle: "Monthly Room Types Comparison Table",
    compareIntro: "Compare features and amenities of each room model to find the best match for your lifestyle and budget.",
    compareHeaderRoomType: "Monthly Room Model",
    compareHeaderRent: "Rent (THB/Month)",
    compareHeaderDeposit: "Move-In Deposit (THB)",
    compareHeaderStatus: "Status & Available Rooms",
    compareHeaderAir: "Air Conditioning",
    compareHeaderFurniture: "Furniture",
    compareHeaderHighlights: "Key Features",
    compareHeaderAction: "Book",
    compareAvailableBadge: "🟢 Available ({count} rooms)",
    compareFullBadge: "🔴 Fully Booked",
    compareHasAir: "❄️ Air Con Included",
    compareNoAir: "❌ No Air Con",
    compareFurn12: "12 Pieces (Full Suite)",
    compareFurn8: "8 Pieces (Standard Set)",
    compareFurnYes: "Furnished",
    compareFurnNone: "None (Empty Room)",
    compareBookRoomBtn: "Book This Room",

    calculatorTitle: "Net Monthly Cost Estimator",
    calculatorSubtitle: "Calculate your estimated total monthly expenses (Rent + Water + Electricity + Services) in real time",
    calcRoomTypeLabel: "Select Monthly Room Model",
    calcElecLabel: "Estimated Electricity Usage (9 THB / unit)",
    calcWaterLabel: "Estimated Water Usage",
    calcCarLabel: "🚗 Car Parking (1,000 THB/month)",
    calcMotoLabel: "🏍️ Motorcycle Parking (100 THB/month)",
    calcTotalMonthly: "Estimated Monthly Expenses",
    calcMoveInDeposit: "Security Deposit",
    calcCopySummary: "Copy Estimation Summary",
    calcCopiedToast: "Cost summary copied to clipboard!",
    calcUnitsBadge: "Units",
    calcParkingTitle: "🅿️ Additional Parking Services",
    calcSummaryTitle: "Estimated Cost Breakdown",
    calcRentBreakdown: "Room Rental Fee",
    calcElecBreakdown: "Estimated Electricity",
    calcWaterBreakdown: "Estimated Water Supply",
    calcCommonFeeBreakdown: "Common Area Maintenance Fee",
    calcCarBreakdown: "Car Parking Fee",
    calcMotoBreakdown: "Motorcycle Parking Fee",
    calcTotalMoveIn: "Total Initial Move-In Budget (Deposit + 1st Month)",
    calcEco: "0 (Eco)",
    calcAvg: "100 (Average)",
    calcAirconOften: "250 (Frequent AC)",
    calcHighUsage: "400 (High Usage)",
    calcWaterRangeMin: "1-5 units (Min 200 THB)",
    calcWaterRangeMid: "15 units",
    calcWaterRangeMax: "30 units",
    thbUnit: "THB",

    promptPayBtn: "💳 Payment Channels & Deposit Info",
    promptPayTitle: "Payment Channels & Security Deposit",
    bankName: "Bangkok Bank",
    bankNote: "Bank transfer service only (Cash is not accepted)",
    bankAccLabel: "Account Number:",
    bankCopyBtn: "📋 Copy Account No.",
    bankCopiedBtn: "✅ Copied!",
    bankAccNameLabel: "Account Name:",
    bankAccNameVal: "Onanong Techakasemsook",
    bankDailyNoticeTitle: "Daily Stay Payment:",
    bankDailyNoticeDesc: "Room fee + Security deposit 500 THB/room (100% refunded at 12:00 PM).",
    bankStepsTitle: "Next Steps After Transfer:",
    bankStep1: "Take screenshot / save transfer slip",
    bankStep2: "Take photo of ID card or passport & mention room number",
    bankStep3: "Send payment confirmation via LINE ID: 0990954541",
  },
  cn: {
    brand: "@samutsakorn mahachai",
    navHome: "首页",
    navRooms: "客房类型",
    navFacilities: "公共设施",
    navNearby: "周边景点",
    navRules: "住宿规则",
    navFaq: "常见问题",
    navReviews: "住客评价",
    welcome: "欢迎光临 @samutsakorn mahachai",
    subheading: "玛哈猜市中心干净、安全、舒适的选择",
    selectRoomBtn: "选择客房",
    roomSectionTitle: "每日和每月客房类型",
    roomSectionSubtitle: "在私密舒适的环境中放松，享受齐全的设备与超值的租金",
    viewDetails: "查看详情",
    bookNow: "立即预订",
    pricePerNight: "泰铢 / 晚",
    dailyTab: "日租 (Daily)",
    monthlyTab: "月租 (Monthly)",
    depositLabel: "押金",
    perMonth: "泰铢 / 月",
    singleRoom: {
      name: "单人床房 (Single Bed)",
      desc: "舒适私密，配有清凉空调",
      features: ["📶 免费 Wi-Fi", "❄️ 空调", "📺 电视", "嵌入式衣柜", "热水器", "吹风机", "冰箱"],
      price: "799"
    },
    twinRoom: {
      name: "双人床房 (Twin Bed)",
      desc: "宽敞的格局，非常适合伴侣或好友",
      features: ["📶 免费 Wi-Fi", "❄️ 空调", "📺 电视", "嵌入式衣柜", "热水器", "吹风机", "冰箱"],
      price: "799"
    },
    extraRoom: {
      name: "加床房 (Extra Bed)",
      desc: "适合家庭或团体，增加更多休息空间",
      features: ["📶 免费 Wi-Fi", "❄️ 空调", "📺 电视", "嵌入式衣柜", "热水器", "吹风机", "冰箱"],
      price: "899"
    },
    monthlyRooms: [
      {
        id: 0,
        name: "无空调空房",
        desc: "经济实惠的私密客房选择",
        price: "3,100",
        deposit: "8,000",
        availableRoomsList: ["307", "504"],
        features: ["❌ 空调", "❌ 家具", "🚿 独立卫浴"]
      },
      {
        id: 1,
        name: "无空调边间空房 (角房)",
        desc: "私密角房，通风采光极佳 (已含角房费)",
        price: "3,400",
        deposit: "8,000",
        availableRoomsList: [],
        features: ["❌ 空调", "❌ 家具", "📐 角房"]
      },
      {
        id: 2,
        name: "带空调空房",
        desc: "标准空房，配备凉爽冷气空调",
        price: "3,600",
        deposit: "8,500",
        availableRoomsList: [],
        features: ["❄️ 空调", "❌ 家具"]
      },
      {
        id: 3,
        name: "带空调边间空房 (角房)",
        desc: "舒适私密角房，配备冷气空调",
        price: "3,600",
        deposit: "8,500",
        availableRoomsList: [],
        features: ["❄️ 空调", "❌ 家具", "📐 角房"]
      },
      {
        id: 4,
        name: "8件家具精装房 (带空调)",
        desc: "拎包入住，配备8件必备优质家具与空调",
        price: "5,000",
        deposit: "10,000",
        availableRoomsList: ["809", "603", "804", "807"],
        features: ["❄️ 空调", "🛋️ 8件家具"]
      },
      {
        id: 5,
        name: "12件家具豪华房 (带空调)",
        desc: "全套12件豪华家具，更加完备舒适",
        price: "5,500",
        deposit: "10,000",
        availableRoomsList: ["208", "203", "605", "802", "809", "609"],
        features: ["❄️ 空调", "🛋️ 12件全套家具"]
      },
      {
        id: 6,
        name: "双床精装边间房 (带空调)",
        desc: "宽敞私密角房，配备舒适双人床/双床及空调",
        price: "6,000",
        deposit: "15,000",
        availableRoomsList: ["709", "209", "509"],
        features: ["❄️ 空调", "🛋️ 家具", "📐 角房", "🛏️ 双床"]
      },
      {
        id: 7,
        name: "大阳台双床精装角房",
        desc: "景观角房，配有超大私人休闲阳台",
        price: "6,500",
        deposit: "15,000",
        availableRoomsList: ["501", "801", "601"],
        features: ["❄️ 空调", "🛋️ 家具", "📐 角房", "🛏️ 双床", "🌅 超大阳台"]
      },
      {
        id: 8,
        name: "全配连通套房 (家具 + 床 + 空调)",
        desc: "超大连通套房 (2间客房打通连接)，配备全套高档家具与空调",
        price: "8,400",
        deposit: "18,500",
        availableRoomsList: ["206连通207"],
        features: ["🚪 2间连通套房", "❄️ 空调", "🛋️ 全套家具", "🛏️ 舒适床铺"]
      }
    ],
    utilityTitle: "额外公用事业与服务费用",
    electricityLabel: "电费",
    electricityVal: "每度电 9 泰铢",
    waterLabel: "水费",
    waterVal: "前 1-5 度固定 200 泰铢 (超出后每度 35 泰铢)",
    maintenanceLabel: "公共区管理费",
    maintenanceVal: "每月 200 泰铢",
    carParkingLabel: "汽车停车位费",
    carParkingVal: "每月 1,000 泰铢",
    motoParkingLabel: "摩托车停车位费",
    motoParkingVal: "每月 100 泰铢",
    rulesTitle: "入住规则与条例",
    rulesList: [
      "客房内严禁吸烟",
      "请勿在公共区域饮酒",
      "严禁殴斗 / 别吵架",
      "请勿大声喧哗打扰他人",
      "请勿在房间前面脱鞋",
      "请勿使用煤气",
      "请勿饲养宠物",
      "请勿将物品扔进厕所或排水沟",
      "不要穿墙壁或粘贴贴纸",
      "请勿用力开关门"
    ],
    rulesNotice: "初犯：口头警告 | 再犯：每次罚款 2,000 泰铢",
    checkInTitle: "日租入住流程 (Daily Check-in)",
    checkInSteps: [
      "请添加 LINE ID: 0990954541",
      "转账至盘谷银行账号 245-0-14238-1 户名: Onanong Techakasemsook (不接受现金)",
      "房费 + 押金每间 500 泰铢",
      "付款后将凭证、身份证件照片及房间号发送至 LINE ID: 0990954541",
      "工作人员核对无误后发放房间钥匙",
      "请随身携带感应卡开门",
      "Wi-Fi: 请根据所在楼层选择对应用户名"
    ],
    checkOutTitle: "日租退房流程 (Daily Check-out)",
    checkOutSteps: [
      "关闭空调、电灯并关上房门 (无需锁门)",
      "将钥匙放入钥匙回收箱，拍照并在 LINE 通知",
      "在 LINE (0990954541) 发送您的收款银行账号",
      "查房确认无物品损坏后，住宿方将转账退还押金"
    ],
    bankAccountTitle: "付款银行账号 (不接受现金)",
    bankAccountVal: "245-0-14238-1",
    bankNameVal: "盘谷银行 (Bangkok Bank)",
    bankAccountName: "户名: Onanong Techakasemsook",
    wifiTitle: "Wi-Fi 密码",
    wifiPass: "",
    lineModalTitle: "通过 Line 官方联系",
    lineModalDesc: "扫描二维码或添加账号: 0990954541",
    copyIdBtn: "复制 Line ID",
    copiedAlert: "Line ID 复制成功！",
    facilitiesTitle: "公共设施与服务",
    facilitiesSubtitle: "设施齐全，保障您的舒适、安全与极致私密",
    facilitiesList: [
      { icon: "📶", title: "高速 Wi-Fi 全覆盖", desc: "每层楼信号覆盖，24小时免费使用" },
      { icon: "🛡️", title: "24小时安保系统", desc: "门禁卡进出系统及全楼层 CCTV 监控" },
      { icon: "🅿️", title: "专用停车场", desc: "提供宽敞的汽车及摩托车停车位" },
      { icon: "❄️", title: "空调与全套家具", desc: "优质设施，拎包即可入住" },
      { icon: "🧺", title: "自助洗衣点", desc: "提供自助投币洗衣机" },
      { icon: "📍", title: "玛哈猜市中心优越位置", desc: "Big C 玛哈猜正对面，瑟塔吉路，交通便捷" }
    ],
    securityTitle: "安保系统",
    securitySubtitle: "提供标准的安全保护系统，让您安心入住",
    securityList: [
      { icon: "👮", title: "警察 / 安保人员", desc: "24小时安保人员值守" },
      { icon: "💳", title: "房卡断电系统", desc: "安全节能的自动断电系统" },
      { icon: "🧯", title: "消防栓", desc: "每层楼均配备消防灭火设备" },
      { icon: "🔥", title: "热量与烟雾探测器", desc: "24小时热量与烟雾探测系统，每层均配备消防警铃" },
      { icon: "📹", title: "24小时监控录像", desc: "所有楼层及建筑周围全天候录像" },
      { icon: "⚡", title: "避雷针防护", desc: "安装避雷系统，确保最大安全" }
    ],
    nearbyTitle: "周边重要地标",
    nearbySubtitle: "优越地理位置，轻松连接交通、购物中心及公共服务",
    nearbyList: [
      { icon: "🛒", title: "Big C 玛哈猜", distance: "正对面 (步行2分钟)", desc: "大型超市、购物商场与全方位便利店" },
      { image: "/images/nearby_hospital.png", icon: "🏥", title: "玛哈猜医院 / 龙仔厝医院", distance: "5分钟 (1.5公里)", desc: "24小时全天候顶尖医疗保障" },
      { image: "/images/nearby_central.png", icon: "🛍️", title: "Central 玛哈猜 (Central Mahachai)", distance: "8分钟 (3.2公里)", desc: "大型综合购物中心、餐饮、时尚与电影院" },
      { icon: "🚆", title: "玛哈猜火车站 & 鲜活海鲜市场", distance: "10分钟 (2.5公里)", desc: "新鲜海鲜市场及前往曼谷的火车站点" },
      { image: "/images/nearby_homepro.jpg", icon: "🏠", title: "HomePro 玛哈猜", distance: "车程约 3 分钟", desc: "全面的家居建材与装饰中心" },
      { image: "/images/nearby_makro.png", icon: "🛒", title: "万客隆 (Makro) 玛哈猜", distance: "车程约 5 分钟", desc: "大型批发与生活消费品超市" },
      { image: "/images/nearby_lotus.png", icon: "🛍️", title: "莲花超市 (Lotus's) 玛哈猜", distance: "车程约 5 分钟", desc: "综合超市与购物商场" },
      { image: "/images/nearby_talaythai.jpg", icon: "🦐", title: "Talay Thai 玛哈猜海鲜市场", distance: "车程约 10 分钟", desc: "最大的新鲜与加工海鲜市场" },
      { image: "/images/nearby_bus.png", icon: "🚌", title: "公交汽车站", distance: "附近", desc: "方便乘坐公共巴士出行" },
      { image: "/images/nearby_tops.png", icon: "🛒", title: "Tops 超市", distance: "1分钟", desc: "购买日常用品和食品的超市" },
      { image: "/images/nearby_thaiunion.png", icon: "🏪", title: "Thai Union 市场", distance: "1分钟", desc: "生鲜市场与当地美食" },
      { image: "/images/nearby_ghbank.png", icon: "🏦", title: "泰国政府住房银行 (GH Bank)", distance: "1分钟", desc: "沙没沙空分行" },
      { image: "/images/nearby_kasikorn.png", icon: "🏦", title: "开泰银行 (Kasikorn)", distance: "2分钟", desc: "瑟塔吉1路分行" },
      { image: "/images/nearby_bangchak.png", icon: "⛽", title: "Bangchak 加油站", distance: "0.5分钟", desc: "Bangchak 加油站" },
      { image: "/images/nearby_ptt.png", icon: "⛽", title: "PTT 加油站", distance: "0.5分钟", desc: "PTT 加油站" },
      { image: "/images/nearby_amazon.png", icon: "☕", title: "Café Amazon", distance: "0.5分钟", desc: "咖啡店" },
      { image: "/images/nearby_7eleven.png", icon: "🏪", title: "7-Eleven", distance: "0.5分钟", desc: "24小时便利店" },
      { image: "/images/nearby_cj.png", icon: "🏪", title: "CJ MORE", distance: "5分钟", desc: "超市和便利店" },
      { image: "/images/nearby_thasai.png", icon: "🏛️", title: "Tha Sai 街道办事处", distance: "5分钟", desc: "当地政府办事处" }
    ],
    nearbyShowMore: "▼ 查看更多附近地点",
    nearbyShowLess: "▲ 收起",
    faqTitle: "常见问题解答 (FAQ)",
    faqSubtitle: "了解关于日租入住与月租租赁的解答",
    faqList: [
      { q: "日租客房的入住与退房时间是什么时候？", a: "入住时间为下午 14:00 以后，退房时间为次日中午 12:00 以前。" },
      { q: "什么时候能收到押金退款？", a: "退房检查完毕且确认没有物品损坏后，押金将在退房当天中午 12:00 前通过银行转账全额退还。" },
      { q: "预订日租客房需要支付多少押金？", a: "日租押金为每间房 500 泰铢，退房后经查房无误于退房当日中午12:00前全额转账退还。" },
      { q: "月租客房的最短租期是多久？", a: "标准长租合同为 1 年。（如租赁期限少于 1 年，每月房租需额外增加 1,000 泰铢）。" },
      { q: "房间内可以饲养宠物吗？", a: "为确保所有住客的安静与整洁，严禁携带与饲养任何宠物。" },
      { q: "是否提供汽车与摩托车停车位？", a: "提供汽车位（1,000 泰铢/月）与摩托车位（100 泰铢/月），配有24小时监控。" }
    ],
    reviewsTitle: "住客真实评价",
    reviewsSubtitle: "来自入住 @samutsakorn mahachai 客户的真实反馈",
    reviewsList: [
      { name: "Kittisak P.", role: "日租住客", text: "房间非常干净，空调很冷！就在 Big C 玛哈猜正对面，出行非常方便，员工服务态度很好效率很高。", rating: 5 },
      { name: "Napawan S.", role: "月租住客", text: "在这里月租一年了，非常安全安静，没有噪音干扰，门禁卡非常安全，周边买吃的很方便。", rating: 5 },
      { name: "Anan T.", role: "日租住客", text: "预订简单，办理入住非常方便。停车场很大，物超所值，有时间一定会再来住！", rating: 5 }
    ],
    contactUs: "联系我们",
    addressLabel: "地址",
    addressVal: "市中心，玛哈猜 Big C 对面，瑟塔吉 1 路",
    phoneLabel: "电话",
    phoneVal: "099 095 4541, 065 464 7459",
    mapLabel: "谷歌地图位置",
    copyright: "版权所有 © 2026 At Samutsakorn。保留所有权利。",
    heroBadge: "@Samutsakorn Mahachai • 龙仔厝优质公寓",
    heroRating: "住客好评指数",
    heroOpposite: "Big C 玛哈猜正对面",
    heroSecurity: "门禁刷卡 & 24小时监控",
    heroWifi: "全覆盖高速免费 Wi-Fi",
    heroElevatorParking: "电梯 & 室内停车场",
    heroLocationLabel: "地理位置",
    heroLocationVal: "玛哈猜市中心 (Big C 正对面)",
    heroCheckInOutLabel: "入住 / 退房时间",
    heroCheckInOutVal: "入住 14:00 | 退房 12:00",
    heroDepositLabel: "房间押金",
    heroDepositVal: "500 泰铢/间 (全额退还)",
    heroContractTerm: "长期租约 1 年起",
    heroShortTermNote: "短于 1 年租约每月 +1,000 泰铢",
    heroContactBooking: "联系预订房间",
    heroCallQuick: "电话快速预订",
    heroSelectDaily: "🏨 查看日租客房",
    heroSelectMonthly: "🏢 查看月租客房",
    heroStatusDaily: "已切换为: 日租客房 (入住 14:00 | 退房 12:00 | 押金 500 泰铢)",
    heroStatusMonthly: "已切换为: 月租客房 (1年起租约 | 租约少于1年每月 +1,000 泰铢)",
    rulesSubtitle: "为了所有住客的干净、安全和私密性，请共同遵守标准规章",
    leaseAgreementBtn: "📄 查看完整版: 正式公寓租赁合同及管理规章 (Official Lease Agreement)",
    dailyRoomsOverviewTitle: "日租客房状态一览 (共 {total} 间)",
    dailyRoomsOverviewSub: "实时查看房间准备状态、满房数量及当前剩余空房",
    totalRoomsLabel: "总房间:",
    occupiedRoomsLabel: "已满房:",
    availableRoomsLabel: "剩余空房:",
    monthlyOverviewTitle: "月租空房随时拎包入住",
    monthlyOverviewSub: "实时更新可用房号，欢迎随时咨询或预订",
    monthlyAvailableBadge: "目前共有 {count} 间空房",
    roomsUnit: "间",
    keycardFeeLabel: "大门门禁卡费用",
    keycardFeeVal: "100 泰铢 / 张",
    keyUnlockFeeLabel: "开门协助费 (忘带钥匙)",
    keyUnlockFeeVal: "300 泰铢 / 次",
    officialAgreementTitle: "公寓租赁合同及各项管理制度",
    mapHeading: "🗺️ 地理位置地图 @samutsakorn mahachai",
    mapSubheading: "Big C 玛哈猜正对面，Sethakit 路，龙仔厝府治县",
    openGoogleMapsBtn: "📍 在 Google 地图上导航",

    compareRoomsBtn: "📊 比较全部 7 种月租房型",
    compareModalTitle: "月租客房类型详细对比表",
    compareIntro: "对比各房型特点与配备，选择最契合您生活方式与预算的理想居所。",
    compareHeaderRoomType: "月租客房类型",
    compareHeaderRent: "月租金 (泰铢/月)",
    compareHeaderDeposit: "入住押金 (泰铢)",
    compareHeaderStatus: "状态与可用房号",
    compareHeaderAir: "空调设备",
    compareHeaderFurniture: "家具配置",
    compareHeaderHighlights: "房间亮点",
    compareHeaderAction: "预订",
    compareAvailableBadge: "🟢 剩余 {count} 间",
    compareFullBadge: "🔴 已满房",
    compareHasAir: "❄️ 配有空调",
    compareNoAir: "❌ 无空调",
    compareFurn12: "12件 (豪华全套)",
    compareFurn8: "8件 (标准套组)",
    compareFurnYes: "配备家具",
    compareFurnNone: "无 (空房)",
    compareBookRoomBtn: "预订此房",

    calculatorTitle: "月度净支出费用计算器",
    calculatorSubtitle: "实时估算您每月的总开销 (房租 + 水费 + 电费 + 公共服务费)",
    calcRoomTypeLabel: "选择月租客房类型",
    calcElecLabel: "预估用电度数 (每度 9 泰铢)",
    calcWaterLabel: "预估用水度数",
    calcCarLabel: "🚗 汽车停车位 (1,000 泰铢/月)",
    calcMotoLabel: "🏍️ 摩托车停车位 (100 泰铢/月)",
    calcTotalMonthly: "预估月度总支出",
    calcMoveInDeposit: "初始入住押金",
    calcCopySummary: "复制估算清单",
    calcCopiedToast: "费用估算清单已复制到剪贴板！",
    calcUnitsBadge: "度",
    calcParkingTitle: "🅿️ 附加停车服务",
    calcSummaryTitle: "估算费用明细汇总",
    calcRentBreakdown: "客房租金",
    calcElecBreakdown: "预估电费",
    calcWaterBreakdown: "预估水费",
    calcCommonFeeBreakdown: "公共管理费",
    calcCarBreakdown: "汽车停车费",
    calcMotoBreakdown: "摩托车停车费",
    calcTotalMoveIn: "首月入住总预算 (押金 + 首月租金与杂费)",
    calcEco: "0 (节能)",
    calcAvg: "100 (平均)",
    calcAirconOften: "250 (常开空调)",
    calcHighUsage: "400 (用电较多)",
    calcWaterRangeMin: "1-5度 (最低 200 铢)",
    calcWaterRangeMid: "15度",
    calcWaterRangeMax: "30度",
    thbUnit: "泰铢",

    promptPayBtn: "💳 付款渠道与押金说明",
    promptPayTitle: "支付方式及押金说明",
    bankName: "盘谷银行 (Bangkok Bank)",
    bankNote: "仅支持银行转账 (不接受现金)",
    bankAccLabel: "银行账号:",
    bankCopyBtn: "📋 复制账号",
    bankCopiedBtn: "✅ 已复制！",
    bankAccNameLabel: "账户姓名:",
    bankAccNameVal: "Onanong Techakasemsook",
    bankDailyNoticeTitle: "日租客房支付说明:",
    bankDailyNoticeDesc: "房费 + 押金 500 泰铢/间 (12:00 全额退还)。",
    bankStepsTitle: "转账后步骤:",
    bankStep1: "截图/保存转账凭证",
    bankStep2: "拍摄身份证/护照照片并说明房号",
    bankStep3: "通过 LINE ID: 0990954541 发送确认凭证",
  },
  mm: {
    brand: "@samutsakorn mahachai",
    navHome: "ပင်မစာမျက်နှာ",
    navRooms: "အခန်းအမျိုးအစားများ",
    navFacilities: "အဆောက်အဦအဆင်ပြေမှုများ",
    navNearby: "အနီးအနားနေရာများ",
    navRules: "စည်းမျဉ်းများ",
    navFaq: "မေးလေ့ရှိသောမေးခွန်းများ",
    navReviews: "သုံးသပ်ချက်များ",
    welcome: "@samutsakorn mahachai မှ ကြိုဆိုပါသည်",
    subheading: "မဟာချိုင်မြို့လယ်ခေါင်ရှိ သန့်ရှင်း၊ ဘေးကင်းပြီး သက်တောင့်သက်သာရှိသော တည်းခိုခန်း",
    selectRoomBtn: "အခန်းများကိုကြည့်ရန်",
    roomSectionTitle: "နေ့စဉ်နှင့် လစဉ် အခန်းအမျိုးအစားများ",
    roomSectionSubtitle: "အထူးသက်သာသောဈေးနှုန်းများဖြင့် လွတ်လပ်အေးချမ်းစွာ အနားယူပါ",
    viewDetails: "အသေးစိတ်ကြည့်ရန်",
    bookNow: "ယခုပဲ ကြိုတင်မှာယူပါ",
    pricePerNight: "ဘတ် / ည",
    dailyTab: "နေ့စဉ် (Daily)",
    monthlyTab: "လစဉ် (Monthly)",
    depositLabel: "စပေါ်ငွေ",
    perMonth: "ဘတ် / လ",
    singleRoom: {
      name: "တစ်ယောက်အိပ်ကုတင်ခန်း (Single Bed)",
      desc: "အေးမြသော အဲကွန်းဖြင့် လွတ်ลပ်အေးချမ်းစွာ အနားယူပါ",
      features: ["📶 အခမဲ့ Wi-Fi", "❄️ အဲကွန်း", "📺 တီဗီ", "နံရံကပ်ဗီရို", "ရေပူစက်", "ဆံပင်လေမှုတ်စက်", "ရေခဲသေတ္တာ"],
      price: "799"
    },
    twinRoom: {
      name: "နှစ်ယောက်အိပ်ကုတင်ခန်း (Twin Bed)",
      desc: "ကျယ်ဝန်းပြီး စုံတွဲများ သို့မဟုတ် မိတ်ဆွေများအတွက် သင့်တော်သည်",
      features: ["📶 အခမဲ့ Wi-Fi", "❄️ အဲကွန်း", "📺 တီဗီ", "နံရံကပ်ဗီရို", "ရေပူစက်", "ဆံပင်လေမှုတ်စက်", "ရေခဲသေတ္တာ"],
      price: "799"
    },
    extraRoom: {
      name: "အပိုကုတင်ပါသောအခန်း (Extra Bed)",
      desc: "မိသားစု သို့မဟုတ် သူငယ်ချင်းအဖွဲ့များအတွက် ပိုမိုကျယ်ဝန်းသော အနားယူစရာနေရာ",
      features: ["📶 အခမဲ့ Wi-Fi", "❄️ အဲကွန်း", "📺 တီဗီ", "နံရံကပ်ဗီရို", "ရေပူစက်", "ဆံပင်လေမှုတ်စက်", "ရေခဲသေတ္တာ"],
      price: "899"
    },
    monthlyRooms: [
      {
        id: 0,
        name: "လေအေးပေးစက်မပါ အခန်းလွတ်",
        desc: "သီးသန့်နေလိုသူများအတွက် သက်သာသောဈေးနှုန်းဖြင့်အခန်း",
        price: "3,100",
        deposit: "8,000",
        availableRoomsList: ["307", "504"],
        features: ["❌ လေအေးပေးစက်", "❌ ပရိဘောဂ", "🚿 သီးသန့်ရေချိုးခန်း"]
      },
      {
        id: 1,
        name: "လေအေးပေးစက်မပါ ဒေါင့်ခန်းလွတ်",
        desc: "လေဝင်လေထွက်ကောင်းမွန်သော သီးသန့်ဒေါင့်ခန်း",
        price: "3,400",
        deposit: "8,000",
        availableRoomsList: [],
        features: ["❌ လေအေးပေးစက်", "❌ ပရိဘောဂ", "📐 ဒေါင့်ခန်း"]
      },
      {
        id: 2,
        name: "လေအေးပေးစက်ပါ အခန်းလွတ်",
        desc: "အေးမြသောလေအေးပေးစက်တပ်ဆင်ထားသည့် စံနှုန်းမီအခန်းလွတ်",
        price: "3,600",
        deposit: "8,500",
        availableRoomsList: [],
        features: ["❄️ လေအေးပေးစက်", "❌ ပရိဘောဂ"]
      },
      {
        id: 3,
        name: "လေအေးပေးစက်ပါ ဒေါင့်ခန်းလွတ်",
        desc: "လေအေးပေးစက်ပါဝင်သော သီးသန့်ဒေါင့်ခန်း",
        price: "3,600",
        deposit: "8,500",
        availableRoomsList: [],
        features: ["❄️ လေအေးပေးစက်", "❌ ပရိဘောဂ", "📐 ဒေါင့်ခန်း"]
      },
      {
        id: 4,
        name: "ပရိဘောဂ ၈ မျိုးပါ အခန်း (လေအေးပေးစက်ပါ)",
        desc: "အခြေခံပရိဘောဂ ၈ မျိုးနှင့် လေအေးပေးစက်ပါဝင်ပြီး အသင့်နေထိုင်နိုင်ပါသည်",
        price: "5,000",
        deposit: "10,000",
        availableRoomsList: ["809", "603", "804", "807"],
        features: ["❄️ လေအေးပေးစက်", "🛋️ ပရိဘောဂ ၈ မျိုး"]
      },
      {
        id: 5,
        name: "ပရိဘောဂ ၁၂ မျိုးပါ အခန်း (လေအေးပေးစက်ပါ)",
        desc: "ပရိဘောဂအစုံ ၁၂ မျိုးဖြင့် ပိုမိုပြည့်စုံသက်သောင့်သက်သာရှိသောအခန်း",
        price: "5,500",
        deposit: "10,000",
        availableRoomsList: ["208", "203", "605", "802", "809", "609"],
        features: ["❄️ လေအေးပေးစက်", "🛋️ ပရိဘောဂ ၁၂ မျိုး (အစုံ)"]
      },
      {
        id: 6,
        name: "ကုတင်နှစ်လုံးပါ ပရိဘောဂစုံ ဒေါင့်ခန်း (လေအေးပေးစက်ပါ)",
        desc: "ကျယ်ဝန်းသောဒေါင့်ခန်း၊ သက်သောင့်သက်သာကုတင်နှစ်လုံးနှင့် လေအေးပေးစက်ပါဝင်ပါသည်",
        price: "6,000",
        deposit: "15,000",
        availableRoomsList: ["709", "209", "509"],
        features: ["❄️ လေအေးပေးစက်", "🛋️ ပရိဘောဂ", "📐 ဒေါင့်ခန်း", "🛏️ ကုတင်နှစ်လုံး"]
      },
      {
        id: 7,
        name: "လသာဆောင်ကြီးပါ ကုတင်နှစ်လုံးဒေါင့်ခန်း",
        desc: "ရှုခင်းလှပပြီး အပန်းဖြေနိုင်သော လသာဆောင်ကျယ်ကြီးပါဝင်သည့် ဒေါင့်ခန်း",
        price: "6,500",
        deposit: "15,000",
        availableRoomsList: ["501", "801", "601"],
        features: ["❄️ လေအေးပေးစက်", "🛋️ ပရိဘောဂ", "📐 ဒေါင့်ခန်း", "🛏️ ကုတင်နှစ်လုံး", "🌅 လသာဆောင်ကြီး"]
      },
      {
        id: 8,
        name: "ချိတ်ဆက်အခန်းတွဲ (ပရိဘောဂ + ကုတင် + လေအေးပေးစက်)",
        desc: "အခန်း ၂ ခန်းဆက် ကျယ်ဝန်းသောအခန်းတွဲ၊ ပရိဘောဂနှင့် လေအေးပေးစက်အပြည့်အစုံပါဝင်ပါသည်",
        price: "8,400",
        deposit: "18,500",
        availableRoomsList: ["206 နှင့် 207 ချိတ်ဆက်ထားသည်"],
        features: ["🚪 ၂ ခန်းဆက် (Connecting Suite)", "❄️ လေအေးပေးစက်", "🛋️ ပရိဘောဂစုံ", "🛏️ ကုတင်စုံ"]
      }
    ],
    utilityTitle: "အခြား ကုန်ကျစရိတ်များနှင့် ဝန်ဆောင်ခနှုန်းထားများ",
    electricityLabel: "လျှပ်စစ်မီတာခ",
    electricityVal: "၁ ယူနစ်လျှင် ၉ ဘတ်",
    waterLabel: "ရေဖိုး",
    waterVal: "ပထမ ၁-၅ ယူနစ်အထိ ၂၀၀ ဘတ် (ထို့နောက် တစ်ယူနစ်လျှင် ၃၅ ဘတ်)",
    maintenanceLabel: "ဘုံရန်ပုံငွေ ထိန်းသိမ်းခ",
    maintenanceVal: "တစ်လလျှင် ၂၀၀ ဘတ်",
    carParkingLabel: "ကားပါကင်ခ",
    carParkingVal: "တစ်လလျှင် ၁,၀၀၀ ဘတ်",
    motoParkingLabel: "ဆိုင်ကယ်ပါကင်ခ",
    motoParkingVal: "တစ်လလျှင် ၁၀၀ ဘတ်",
    rulesTitle: "တည်းခိုနေထိုင်မှု စည်းမျဉ်းစည်းကမ်းများ",
    rulesList: [
      "အခန်းအတွင်း ဆေးလိပ်သောက်ခြင်းကို လုံးဝတားမြစ်သည်",
      "ဘုံနေရာများတွင် အရက်သောက်ခြင်း မပြုရ",
      "ရန်ဖြစ်ခြင်း မပြုရ",
      "အခြားသူများကို အနှောင့်အယှက်ဖြစ်စေမည့် ဆူညံသံများ မပြုလုပ်ရ",
      "အခန်းရှေ့တွင် ဖိနပ်များ မချွတ်ထားရ",
      "ဂတ်စ်မီးဖို သုံးစွဲခြင်း မပြုရ",
      "အိမ်မွေးတိရစ္ဆာန် မွေးမြူခွင့်မပြု",
      "အိမ်သာ သို့မဟုတ် ရေနုတ်မြောင်းထဲသို့ ပစ္စည်းများ မပစ်ချရ",
      "နံရံများကို ဖောက်ခြင်း သို့မဟုတ် စတစ်ကာများ ကပ်ခြင်း မပြုရ",
      "တံခါးကို အသံကျယ်ကျယ် ဖွင့်ခြင်း/ပိတ်ခြင်း မပြုရ"
    ],
    rulesNotice: "ပထမအကြိမ်- နှုတ်ဖြင့် သတိပေးမည် | ဒုတိယအကြိမ်မှစ၍: တစ်ကြိမ်လျှင် ဒဏ်ငွေ ၂,၀၀၀ ဘတ် ပေးဆောင်ရမည်",
    checkInTitle: "နေ့စဉ် Check-in ပြုလုပ်ရန် အဆင့်များ",
    checkInSteps: [
      "LINE ID: 0990954541 ကို Add ပါ",
      "Bangkok Bank အကောင့် 245-0-14238-1 အမည် Onanong Techakasemsook သို့ ငွေလွှဲပါ (လက်ငင်းငွေ မလက်ခံပါ)",
      "အခန်းခ + စပေါ်ငွေ တစ်ခန်းလျှင် ၅၀၀ ဘတ်",
      "ငွေလွှဲပြီးပါက ပြေစာ၊ မှတ်ပုံတင်ဓာတ်ပုံနှင့် အခန်းနံပါတ်ကို LINE ID: 0990954541 သို့ ပို့ပါ",
      "ဝန်ထမ်းမှ စစ်ဆေးပြီးပါက အခန်းသော့ ထုတ်ယူပါ",
      "တံခါးဖွင့်ရန် ကီးကဒ်ကို ယူဆောင်ထားပါ",
      "Wi-Fi: သင်တည်းခိုသည့် အထပ်အလိုက် User ကိုရွေးချယ်ပါ"
    ],
    checkOutTitle: "နေ့စဉ် Check-out ပြုလုပ်ရန် အဆင့်များ",
    checkOutSteps: [
      "အဲကွန်း၊ မီးပိတ်ပြီး တံခါးပိတ်ပါ (တံခါးသော့ခတ်ရန် မလိုပါ)",
      "သော့ကို သော့ပြန်အပ်သည့် ဘူးထဲသို့ ထည့်ပြီး LINE သို့ ဓာတ်ပုံရိုက်ပို့ပါ",
      "စပေါ်ငွေ ပြန်လည်ရယူရန် ဘဏ်အကောင့်နံပါတ်ကို LINE: 0990954541 သို့ ပို့ပေးပါ",
      "အခန်းစစ်ဆေးပြီး ပျက်စီးဆုံးရှုံးမှုမရှိပါက စပေါ်ငွေအား ဘဏ်မှတစ်ဆင့် ပြန်လည်လွှဲပေးပါမည်"
    ],
    bankAccountTitle: "ငွေပေးချေရန် ဘဏ်အကောင့် (လက်ငင်းငွေ မလက်ခံပါ)",
    bankAccountVal: "245-0-14238-1",
    bankNameVal: "Bangkok Bank",
    bankAccountName: "အကောင့်အမည်: Onanong Techakasemsook",
    wifiTitle: "Wi-Fi Password",
    wifiPass: "",
    lineModalTitle: "Line Official မှတဆင့် ဆက်သွယ်ပါ",
    lineModalDesc: "ဆက်သွယ်ရန် စကန်ဖတ်ပါ သို့မဟုတ် ID: 0990954541 ကို ထည့်ပါ",
    copyIdBtn: "Line ID ကူးယူပါ",
    copiedAlert: "Line ID ကို အောင်မြင်စွာ ကူးယူပြီးပါပြီ။",
    facilitiesTitle: "အဆောက်အဦဆိုင်ရာ အဆင်ပြေမှုများ",
    facilitiesSubtitle: "လူကြီးမင်းတို့၏ သက်တောင့်သက်သာရှိမှုနှင့် လုံခြုံရေးအတွက် အပြည့်အစုံ ပြင်ဆင်ထားပါသည်",
    facilitiesList: [
      { icon: "📶", title: "မြန်နှုန်းမြင့် Wi-Fi (အခမဲ့)", desc: "အထပ်တိုင်းတွင် အချက်ပြစနစ်ရရှိပြီး ၂၄ နာရီ အခမဲ့သုံးနိုင်သည်" },
      { icon: "🛡️", title: "၂၄ နာရီ လုံခြုံရေးစနစ်", desc: "ကီးကဒ်စနစ်နှင့် အထပ်တိုင်းတွင် CCTV ကင်မရာများ တပ်ဆင်ထားသည်" },
      { icon: "🅿️", title: "ကျယ်ဝန်းသော ကားပါကင်", desc: "ကားနှင့် ဆိုင်ကယ်များအတွက် သီးသန့် ပါကင်နေရာများ ရှိသည်" },
      { icon: "❄️", title: "အဲကွန်းနှင့် ပရိဘောဂအပြည့်အစုံ", desc: "အသင့်နေထိုင်နိုင်ရန် အရည်အသွေးမြင့် ပစ္စည်းများ ပါဝင်သည်" },
      { icon: "🧺", title: "အဝတ်လျှော်စက် ဝန်ဆောင်မှု", desc: "အကြွေစေ့သုံး အဝတ်လျှော်စက်များ ရှိသည်" },
      { icon: "📍", title: "မဟာချိုင်မြို့လယ်ခေါင် နေရာကောင်း", desc: "Big C မဟာချိုင် မျက်စောင်းထိုး၊ သွားလာရ လွယ်ကူသည်" }
    ],
    securityTitle: "လုံခြုံရေးစနစ်",
    securitySubtitle: "စံချိန်မီ လုံခြုံရေးစနစ်များဖြင့် စိတ်ချမ်းသာစွာ တည်းခိုပါ",
    securityList: [
      { icon: "👮", title: "ရဲ / လုံခြုံရေး", desc: "၂၄ နာရီ လုံခြုံရေး ဝန်ထမ်းများ ရှိသည်" },
      { icon: "💳", title: "ကီးကဒ် မီးဖြတ်စနစ်", desc: "လုံခြုံပြီး လျှပ်စစ်ချွေတာသော အလိုအလျောက် မီးဖြတ်စနစ်" },
      { icon: "🧯", title: "မီးသတ်ဘူးများ", desc: "အထပ်တိုင်းတွင် မီးသတ်ပစ္စည်းများ တပ်ဆင်ထားသည်" },
      { icon: "🔥", title: "အပူနှင့် မီးခိုးရှာဖွေရေးကိရိယာ", desc: "၂၄ နာရီ အပူနှင့် မီးခိုးရှာဖွေရေး စနစ်၊ အထပ်တိုင်းတွင် မီးသတ်ခေါင်းလောင်းများ ပါရှိသည်" },
      { icon: "📹", title: "၂၄ နာရီ CCTV", desc: "အထပ်တိုင်းနှင့် အဆောက်အဦပတ်လည်တွင် အမြဲမှတ်တမ်းတင်နေသည်" },
      { icon: "⚡", title: "မိုးကြိုးလွှဲစနစ်", desc: "အမြင့်ဆုံး လုံခြုံရေးအတွက် မိုးကြိုးလွှဲစနစ် တပ်ဆင်ထားသည်" }
    ],
    nearbyTitle: "အနီးအနားရှိ အရေးကြီးသောနေရာများ",
    nearbySubtitle: "သွားလာရေး၊ စျေးဝယ်စင်တာများနှင့် အများသုံးဝန်ဆောင်မှုများ သွားလာရ လွယ်ကူသော နေရာကောင်း",
    nearbyList: [
      { icon: "🛒", title: "Big C မဟာချိုင်", distance: "မျက်စောင်းထိုး (လမ်းလျှောက် ၂ မိနစ်)", desc: "ကုန်တိုက်နှင့် စူပါမားကတ် အပြည့်အစုံ" },
      { image: "/images/nearby_hospital.png", icon: "🏥", title: "မဟာချိုင် ဆေးရုံ / စမုတ်စာခွန် ဆေးရုံ", distance: "၅ မိနစ် (၁.၅ ကီလိုမီတာ)", desc: "၂၄ နာရီ အဆင့်မြင့် ကျန်းမာရေးစောင့်ရှောက်မှု" },
      { image: "/images/nearby_central.png", icon: "🛍️", title: "Central မဟာချိုင်", distance: "၈ မိနစ် (၃.၂ ကီလိုမီတာ)", desc: "အဆင့်မြင့် စျေးဝယ်စင်တာ၊ စားသောက်ဆိုင်များနှင့် ရုပ်ရှင်ရုံ" },
      { icon: "🚆", title: "မဟာချိုင် ရထားဘူတာနှင့် ပင်လယ်စာစျေး", distance: "၁၀ မိနစ် (၂.၅ ကီလိုမီတာ)", desc: "လတ်ဆတ်သော ပင်လယ်စာနှင့် ဘန်ကောက်သို့ သွားရောက်နိုင်သည့် ရထားဘူတာ" },
      { image: "/images/nearby_homepro.jpg", icon: "🏠", title: "HomePro မဟာချိုင်", distance: "ကားဖြင့် ၃ မိနစ်ခန့်", desc: "အိမ်အလှဆင်ပစ္စည်းနှင့် အိမ်သုံးပစ္စည်းစင်တာ" },
      { image: "/images/nearby_makro.png", icon: "🛒", title: "Makro မဟာချိုင်", distance: "ကားဖြင့် ၅ မိနစ်ခန့်", desc: "လက်ကားကုန်စုံဆိုင်ကြီး" },
      { image: "/images/nearby_lotus.png", icon: "🛍️", title: "Lotus's မဟာချိုင်", distance: "ကားဖြင့် ၅ မိနစ်ခန့်", desc: "စူပါမားကတ်နှင့် ကုန်တိုက်အပြည့်အစုံ" },
      { image: "/images/nearby_talaythai.jpg", icon: "🦐", title: "Talay Thai ပင်လယ်စာစျေး", distance: "ကားဖြင့် ၁၀ မိနစ်ခန့်", desc: "အကြီးဆုံး လတ်ဆတ်သော ပင်လယ်စာစျေးကြီး" },
      { image: "/images/nearby_bus.png", icon: "🚌", title: "ဘတ်စ်ကားဂိတ်", distance: "အနီးအနား", desc: "အများပြည်သူသုံး ဘတ်စ်ကားများ စီးနင်းရန် လွယ်ကူသည်" },
      { image: "/images/nearby_tops.png", icon: "🛒", title: "Tops စူပါမားကတ်", distance: "၁ မိနစ်", desc: "ကုန်စုံနှင့် စားသောက်ကုန်များ ဝယ်ယူရန်" },
      { image: "/images/nearby_thaiunion.png", icon: "🏪", title: "Thai Union စျေး", distance: "၁ မိနစ်", desc: "လတ်ဆတ်သောစျေးနှင့် ဒေသအစားအစာများ" },
      { image: "/images/nearby_ghbank.png", icon: "🏦", title: "GH ဘဏ်", distance: "၁ မိနစ်", desc: "အစိုးရအိမ်ရာဘဏ် (စမုတ်စာခွန်)" },
      { image: "/images/nearby_kasikorn.png", icon: "🏦", title: "Kasikorn ဘဏ်", distance: "၂ မိနစ်", desc: "Kasikorn ဘဏ်ခွဲ" },
      { image: "/images/nearby_bangchak.png", icon: "⛽", title: "Bangchak ဓာတ်ဆီဆိုင်", distance: "၀.၅ မိနစ်", desc: "Bangchak ဓာတ်ဆီဆိုင်" },
      { image: "/images/nearby_ptt.png", icon: "⛽", title: "PTT ဓာတ်ဆီဆိုင်", distance: "၀.၅ မိနစ်", desc: "PTT ဓာတ်ဆီဆိုင်" },
      { image: "/images/nearby_amazon.png", icon: "☕", title: "Café Amazon", distance: "၀.၅ မိနစ်", desc: "ကော်ဖီဆိုင်" },
      { image: "/images/nearby_7eleven.png", icon: "🏪", title: "7-Eleven", distance: "၀.၅ မိနစ်", desc: "၂၄ နာရီ ဖွင့်သော ကုန်စုံဆိုင်" },
      { image: "/images/nearby_cj.png", icon: "🏪", title: "CJ MORE", distance: "၅ မိနစ်", desc: "စူပါမားကတ်နှင့် ကုန်စုံဆိုင်" },
      { image: "/images/nearby_thasai.png", icon: "🏛️", title: "Tha Sai ရပ်ကွက်အုပ်ချုပ်ရေးရုံး", distance: "၅ မိနစ်", desc: "ဒေသအုပ်ချုပ်ရေးရုံး" }
    ],
    nearbyShowMore: "▼ အနားနာရှိသော နေရအနားကို ဆက်သွား",
    nearbyShowLess: "▲ လေောများ",
    faqTitle: "မေးလေ့ရှိသော မေးခွန်းများ (FAQ)",
    faqSubtitle: "နေ့စဉ်နှင့် လစဉ် တည်းခိုမှုဆိုင်ရာ အချက်အလက်များ",
    faqList: [
      { q: "နေ့စဉ်တည်းခိုမှုအတွက် Check-in နှင့် Check-out အချိန်များမှာ အဘယ်နည်း။", a: "Check-in ကို နေ့လည် ၂:၀၀ နာရီမှ စတင်နိုင်ပြီး Check-out ကို နောက်တစ်နေ့ နေ့လည် ၁၂:၀၀ နာရီ မတိုင်မီ ပြုလုပ်ရပါမည်။" },
      { q: "စပေါ်ငွေ (Deposit) ကို ဘယ်အချိန်မှာ ပြန်လည်ရရှိမည်နည်း။", a: "အခန်းအား စစ်ဆေးပြီး ပျက်စီးဆုံးရှုံးမှု မရှိပါက စပေါ်ငွေကို ထွက်ခွာသည့်နေ့ မွန်းလွဲ ၁၂:၀၀ နာရီ မတိုင်မီ ဘဏ်လွှဲမှတစ်ဆင့် ပြန်လည်လွှဲပြောင်းပေးပါမည်။" },
      { q: "နေ့စဉ်အခန်းကြိုတင်မှာယူမှုအတွက် စပေါ်ငွေ မည်မျှပေးရမည်နည်း။", a: "တစ်ခန်းလျှင် စပေါ်ငွေ ၅၀၀ ဘတ် ဖြစ်ပြီး Check-out ပြီးနောက် အခန်းစစ်ဆေးပြီးပါက မွန်းလွဲ ၁၂:၀၀ နာရီ မတိုင်မီ အပြည့်အဝ ပြန်လည်ရရှိပါမည်။" },
      { q: "လစဉ်အခန်းများအတွက် အနည်းဆုံး ငှားရမ်းခွင့် ကာလမှာ မည်မျှနည်း။", a: "ပုံမှန် ရေရှည်ငှားရမ်းခွင့် စာချုပ်မှာ ၁ နှစ် ဖြစ်ပါသည်။ (၁ နှစ်ထက် နည်းသော ငှားရမ်းခွင့် စာချုပ်များအတွက် လစဉ် အခန်းခကို ၁,၀၀၀ ဘတ် ထပ်မံပေါင်းထည့်ပါမည်။)" },
      { q: "အခန်းအတွင်း အိမ်မွေးတိရစ္ဆာန်များ မွေးမြူခွင့် ရှိပါသလား။", a: "တည်းခိုသူအားလုံး၏ ငြိမ်သက်ရေးအတွက် အိမ်မွေးတိရစ္ဆာန်များ မွေးမြူခွင့် လုံးဝမပြုပါ။" },
      { q: "ကားနှင့် ဆိုင်ကယ် ပါကင်နေရာများ ရှိပါသလား။", a: "ကားပါကင် (၁,၀၀၀ ဘတ်/လ) နှင့် ဆိုင်ကယ်ပါကင် (၁၀၀ ဘတ်/လ) ရှိပြီး ၂၄ နာရီ CCTV ဖြင့် စောင့်ကြည့်ထားပါသည်။" }
    ],
    reviewsTitle: "တည်းခိုသူများ၏ သုံးသပ်ချက်များ",
    reviewsSubtitle: "@samutsakorn mahachai တွင် တည်းခိုခဲ့ဖူးသူများ၏ အမှန်တကယ် မှတ်ချက်များ",
    reviewsList: [
      { name: "Kittisak P.", role: "နေ့စဉ် တည်းခိုသူ", text: "အခန်း အလွန်သန့်ရှင်းပြီး အဲကွန်း အလွန်အေးပါသည်။ Big C မဟာချိုင် မျက်စောင်းထိုးတွင် ရှိ၍ သွားလာရ လွယ်ကူပြီး ဝန်ထမ်းများ ဝန်ဆောင်မှု ကောင်းမွန်ပါသည်။", rating: 5 },
      { name: "Napawan S.", role: "လစဉ် တည်းခိုသူ", text: "ဒီမှာ နေထိုင်တာ ၁ နှစ်ရှိပါပြီ။ ဘေးကင်းပြီး ဆူညံသံ မရှိပါ။ ကီးကဒ်စနစ် စိတ်ချရပြီး အစားအသောက် ဝယ်ယူရ လွယ်ကူပါသည်။", rating: 5 },
      { name: "Anan T.", role: "နေ့စဉ် တည်းခိုသူ", text: "ကြိုတင်မှာယူရလွယ်ကူပြီး Check-in အလွန်အဆင်ပြေပါသည်။ ပါကင်နေရာ ကျယ်ဝန်းပြီး ပေးရသော ဈေးနှုန်းနှင့် တန်ပါသည်။ နောက်တစ်ကြိမ် ထပ်မံလာရောက်ပါမည်။", rating: 5 }
    ],
    contactUs: "ဆက်သွယ်ရန်",
    addressLabel: "လိပ်စာ",
    addressVal: "မြို့လယ်ခေါင်၊ Big C မဟာချိုင် မျက်စောင်းထိုး၊ သေဋ္ဌကิစ္စ 1 လမ်း",
    phoneLabel: "ဖုန်းနံပါတ်",
    phoneVal: "099 095 4541, 065 464 7459",
    mapLabel: "Google Maps လမ်းညွှန်",
    copyright: "မူပိုင်ခွင့် © ၂၀၂၆ @samutsakorn မဟာချိုင်။ မူပိုင်ခွင့်များအားလုံး လက်ဝယ်ရှိသည်။",
    heroBadge: "@Samutsakorn Mahachai • စမုတ်စာခွန် တည်းခိုခန်း",
    heroRating: "ဧည့်သည်များ၏ သုံးသပ်ချက်ရမှတ်",
    heroOpposite: "Big C မဟာချိုင် မျက်စောင်းထိုး",
    heroSecurity: "ကီးကဒ်နှင့် ၂၄ နာရီ CCTV",
    heroWifi: "အခမဲ့ အမြန်နှုန်းမြင့် Wi-Fi",
    heroElevatorParking: "ဓာတ်လှေကားနှင့် အဆောက်အအုံတွင်း ကားပါကင်",
    heroLocationLabel: "တည်နေရာ",
    heroLocationVal: "မဟာချိုင်မြို့လယ်ခေါင် (Big C မျက်စောင်းထိုး)",
    heroCheckInOutLabel: "Check-in / Check-out အချိန်",
    heroCheckInOutVal: "Check-in 14:00 | Check-out 12:00",
    heroDepositLabel: "အခန်းစပေါ်ငွေ (Deposit)",
    heroDepositVal: "အခန်းတစ်ခန်းလျှင် ၅၀၀ ဘတ် (အပြည့်ပြန်အမ်းသည်)",
    heroContractTerm: "ရေရှည်စာချုပ် ၁ နှစ်နှင့်အထက်",
    heroShortTermNote: "၁ နှစ်အောက် စာချုပ်အတွက် တစ်လလျှင် +၁,၀၀၀ ဘတ်",
    heroContactBooking: "အခန်းကြိုတင်မှာယူရန်",
    heroCallQuick: "ချက်ချင်းဖုန်းခေါ်ပါ",
    heroSelectDaily: "🏨 နေ့စဉ်အခန်းများ ကြည့်ရှုရန်",
    heroSelectMonthly: "🏢 လစဉ်အခန်းများ ကြည့်ရှုရန်",
    heroStatusDaily: "ပြောင်းလဲထားသည်: နေ့စဉ်အခန်း (Check-in 14:00 | Check-out 12:00 | စပေါ်ငွေ ၅၀၀ ဘတ်)",
    heroStatusMonthly: "ပြောင်းလဲထားသည်: လစဉ်အခန်း (၁ နှစ်စာချုပ် | ၁ နှစ်အောက်စာချုပ် တစ်လလျှင် +၁,၀၀၀ ဘတ်)",
    rulesSubtitle: "တည်းခိုသူအားလုံး၏ သန့်ရှင်းမှု၊ လုံခြုံရေးနှင့် သီးသန့်ဖြစ်မှုအတွက် စည်းမျဉ်းများ",
    leaseAgreementBtn: "📄 အပြည့်အစုံ ကြည့်ရှုရန်: တိုက်ခန်းငှားရမ်းခြင်းဆိုင်ရာ စည်းမျဉ်းနှင့် စာချုပ်",
    dailyRoomsOverviewTitle: "နေ့စဉ်အခန်းများ အခြေအနေ (စုစုပေါင်း {total} ခန်း)",
    dailyRoomsOverviewSub: "အခန်းစုစုပေါင်းအရေအတွက်၊ ပြည့်သွားသောအခန်းများနှင့် ကျန်ရှိသောအခန်းများကို စစ်ဆေးပါ",
    totalRoomsLabel: "စုစုပေါင်း:",
    occupiedRoomsLabel: "ပြည့်သွားသည်:",
    availableRoomsLabel: "ကျန်ရှိသည်:",
    monthlyOverviewTitle: "အသင့်နေထိုင်နိုင်သော လစဉ်အခန်းများ",
    monthlyOverviewSub: "လစ်လပ်နေသော အခန်းနံပါတ်များကို အချိန်နှင့်တပြေးညီ ကြည့်ရှုပြီး ချက်ချင်း ကြိုတင်မှာယူနိုင်သည်",
    monthlyAvailableBadge: "လက်ရှိတွင် အခန်း {count} ခန်း လစ်လပ်နေပါသည်",
    roomsUnit: "ခန်း",
    keycardFeeLabel: "ကီးကဒ်ဝယ်ယူခ",
    keycardFeeVal: "၁၀၀ ဘတ် / ကဒ်",
    keyUnlockFeeLabel: "အခန်းသော့ဖွင့်ခ (သော့ကျန်ခဲ့ပါက)",
    keyUnlockFeeVal: "၃၀၀ ဘတ် / အကြိမ်",
    officialAgreementTitle: "အဆောင်ငှားရမ်းခြင်းဆိုင်ရာ စာချုပ်နှင့် စည်းမျဉ်းစည်းကမ်းများ",
    mapHeading: "🗺️ တည်နေရာပြမြေပုံ @samutsakorn mahachai",
    mapSubheading: "Big C မဟာချိုင် မျက်စောင်းထိုး၊ Sethakit လမ်း၊ မဟာချိုင်မြို့နယ်၊ စမုတ်စာခွန်",
    openGoogleMapsBtn: "📍 Google Maps ဖြင့် သွားမည်",

    compareRoomsBtn: "📊 လစဉ်အခန်း ၇ မျိုးလုံးကို နှိုင်းယှဉ်ရန်",
    compareModalTitle: "လစဉ်အခန်းအမျိုးအစားများ နှိုင်းယှဉ်ချက်ဇယား",
    compareIntro: "သင့်လူနေမှုပုံစံနှင့် ဘတ်ဂျက်အတွက် အသင့်တော်ဆုံးဖြစ်စေရန် အခန်းအမျိုးအစားတစ်ခုစီ၏ ကွဲပြားချက်များကို ကြည့်ရှုပါ။",
    compareHeaderRoomType: "လစဉ်အခန်းပုံစံ",
    compareHeaderRent: "လစဉ်ငှားရမ်းခ (ဘတ်/လ)",
    compareHeaderDeposit: "ပထမလ စပေါ်ငွေ (ဘတ်)",
    compareHeaderStatus: "အခြေအနေနှင့် လစ်လပ်အခန်းနံပါတ်",
    compareHeaderAir: "အဲကွန်း",
    compareHeaderFurniture: "ပရိဘောဂ",
    compareHeaderHighlights: "ထူးခြားချက်များ",
    compareHeaderAction: "မှာယူရန်",
    compareAvailableBadge: "🟢 အခန်း {count} ခန်း လွတ်သည်",
    compareFullBadge: "🔴 အခန်းပြည့်ပါပြီ",
    compareHasAir: "❄️ အဲကွန်းပါသည်",
    compareNoAir: "❌ အဲကွန်းမပါ",
    compareFurn12: "၁၂ မျိုး (အစုံအလင်)",
    compareFurn8: "၈ မျိုး (ပုံမှန်)",
    compareFurnYes: "ပရိဘောဂပါသည်",
    compareFurnNone: "မပါ (အခန်းအလွတ်)",
    compareBookRoomBtn: "ဤအခန်းကို မှာယူမည်",

    calculatorTitle: "လစဉ်အသုံးစရိတ် တွက်ချက်သည့်ကိရိယာ",
    calculatorSubtitle: "လစဉ်ကုန်ကျစရိတ်များ (အခန်းခ + ရေဖိုး + မီးဖိုး + ဝန်ဆောင်ခ) ကို အချိန်နှင့်တပြေးညီ တွက်ချက်ပါ",
    calcRoomTypeLabel: "လစဉ်အခန်းအမျိုးအစား ရွေးချယ်ပါ",
    calcElecLabel: "ခန့်မှန်း လျှပ်စစ်ယူနစ် (၁ ယူနစ် ၉ ဘတ်)",
    calcWaterLabel: "ခန့်မှန်း ရေယူနစ်",
    calcCarLabel: "🚗 ကားပါကင် (တစ်လလျှင် ၁,၀၀၀ ဘတ်)",
    calcMotoLabel: "🏍️ ဆိုင်ကယ်ပါကင် (တစ်လလျှင် ၁၀၀ ဘတ်)",
    calcTotalMonthly: "ခန့်မှန်း လစဉ်စုစုပေါင်းကုန်ကျစရိတ်",
    calcMoveInDeposit: "စတင်တက်ရောက်ချိန် စပေါ်ငွေ",
    calcCopySummary: "ကုန်ကျစရိတ်အကျဉ်းချုပ်ကို ကူးယူပါ",
    calcCopiedToast: "တွက်ချက်မှုအကျဉ်းချုပ်ကို ကူးယူပြီးပါပြီ။",
    calcUnitsBadge: "ယူနစ်",
    calcParkingTitle: "🅿️ ထပ်ဆောင်း ကား/ဆိုင်ကယ် ပါကင် ဝန်ဆောင်မှု",
    calcSummaryTitle: "ခန့်မှန်း ကုန်ကျစရိတ် အကျဉ်းချုပ်",
    calcRentBreakdown: "အခန်းငှားရမ်းခ",
    calcElecBreakdown: "ခန့်မှန်း မီးဖိုး",
    calcWaterBreakdown: "ခန့်မှန်း ရေဖိုး",
    calcCommonFeeBreakdown: "အများသုံး အဆောက်အဦကြေး",
    calcCarBreakdown: "ကားပါကင်ခ",
    calcMotoBreakdown: "ဆိုင်ကယ်ပါကင်ခ",
    calcTotalMoveIn: "ပထမလ စုစုပေါင်းကုန်ကျငွေ (စပေါ်ငွေ + ပထမလခ)",
    calcEco: "၀ (ချွေတာ)",
    calcAvg: "၁၀၀ (သာမန်)",
    calcAirconOften: "၂၅၀ (အဲကွန်းခဏခဏဖွင့်)",
    calcHighUsage: "၄၀၀ (အသုံးများ)",
    calcWaterRangeMin: "၁-၅ ယူနစ် (အနည်းဆုံး ၂၀၀ ဘတ်)",
    calcWaterRangeMid: "၁၅ ယူနစ်",
    calcWaterRangeMax: "၃၀ ယူနစ်",
    thbUnit: "ဘတ်",

    promptPayBtn: "💳 ငွေပေးချေမှုလမ်းကြောင်းနှင့် စပေါ်ငွေအချက်အလက်",
    promptPayTitle: "ငွေပေးချေမှုလမ်းကြောင်းနှင့် အခန်းစပေါ်ငွေ",
    bankName: "ဘန်ကောက်ဘဏ် (Bangkok Bank)",
    bankNote: "ဘဏ်အကောင့်မှတစ်ဆင့်သာ လွှဲပြောင်းရပါမည် (လက်ငင်းငွေ မလက်ခံပါ)",
    bankAccLabel: "အကောင့်နံပါတ်:",
    bankCopyBtn: "📋 အကောင့်နံပါတ် ကူးယူပါ",
    bankCopiedBtn: "✅ ကူးယူပြီးပါပြီ။",
    bankAccNameLabel: "အကောင့်အမည်:",
    bankAccNameVal: "Onanong Techakasemsook",
    bankDailyNoticeTitle: "နေ့စဉ်အခန်း ငွေပေးချေမှုဆိုင်ရာ:",
    bankDailyNoticeDesc: "အခန်းခ + အခန်းစပေါ်ငွေ တစ်ခန်းလျှင် ၅၀၀ ဘတ် (၁၂:၀၀ တွင် အပြည့်ပြန်လွှဲပေးပါမည်)",
    bankStepsTitle: "ငွေလွှဲပြီးနောက် လုပ်ဆောင်ရန်အဆင့်များ:",
    bankStep1: "ငွေလွှဲစလစ်ကို ဓာတ်ပုံရိုက်ပါ/သိမ်းဆည်းပါ",
    bankStep2: "မှတ်ပုံတင် (သို့) နိုင်ငံကူးလက်မှတ် ဓာတ်ပုံရိုက်ပြီး အခန်းနံပါတ်ကို ပြောပါ",
    bankStep3: "LINE ID: 0990954541 သို့ အတည်ပြုစလစ် ပေးပို့ပါ",
  }
};
