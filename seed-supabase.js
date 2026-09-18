import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jwcanvzcnjudthruulul.supabase.co';
const SUPABASE_KEY = 'sb_publishable_c2PNad_RRkZut9m_K9HETg_brXqQKMn';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const dailyRooms = [
  {
    room_type: 'daily',
    name: 'ห้องฟูกพัดลม (Fan Futon Room)',
    description: 'ห้องพักราคาประหยัด บรรยากาศสบาย พร้อมพัดลมและชุดฟูกที่นอน',
    price: 450,
    deposit: 500,
    total_rooms: 1,
    occupied_rooms: 0,
    features: ['🌀 พัดลม', '🛏️ ฟูกที่นอน', '📶 ฟรี Wi-Fi', '🚿 ห้องน้ำในตัว'],
    image_url: '/images/fan_futon.png',
    available_room_numbers: []
  },
  {
    room_type: 'daily',
    name: 'ห้องพักเตียงเดี่ยว (Single Bed)',
    description: 'พักผ่อนสบาย เป็นส่วนตัว แอร์เย็นฉ่ำ',
    price: 799,
    deposit: 500,
    total_rooms: 6,
    occupied_rooms: 4,
    features: ['📶 Wi-Fi ฟรี', '❄️ แอร์', '📺 ทีวี', 'ตู้เสื้อผ้าบิ้วอิน', 'เครื่องทำน้ำอุ่น', 'เครื่องเป่าผม', 'ตู้เย็น'],
    image_url: '/images/single.jpg?v=2',
    available_room_numbers: []
  },
  {
    room_type: 'daily',
    name: 'ห้องพักเตียงคู่ (Twin Bed)',
    description: 'กว้างขวาง เหมาะสำหรับมาเป็นคู่หรือเพื่อนซี้',
    price: 799,
    deposit: 500,
    total_rooms: 3,
    occupied_rooms: 2,
    features: ['📶 Wi-Fi ฟรี', '❄️ แอร์', '📺 ทีวี', 'ตู้เสื้อผ้าบิ้วอิน', 'เครื่องทำน้ำอุ่น', 'เครื่องเป่าผม', 'ตู้เย็น'],
    image_url: '/images/twin.png',
    available_room_numbers: []
  },
  {
    room_type: 'daily',
    name: 'ห้องพักที่นอนเสริม (Extra Bed)',
    description: 'รองรับครอบครัวหรือกลุ่มเพื่อน เพิ่มพื้นที่พักผ่อน',
    price: 899,
    deposit: 500,
    total_rooms: 3,
    occupied_rooms: 1,
    features: ['📶 Wi-Fi ฟรี', '❄️ แอร์', '📺 ทีวี', 'ตู้เสื้อผ้าบิ้วอิน', 'เครื่องทำน้ำอุ่น', 'เครื่องเป่าผม', 'ตู้เย็น'],
    image_url: '/images/extra.png',
    available_room_numbers: []
  },
  {
    room_type: 'daily',
    name: 'ห้องสูทเฟอร์นิเจอร์ + ฟูก (Connecting Suite Room)',
    description: 'ห้องพัก 2 ห้องเชื่อมกัน (Connecting Rooms) พร้อมเฟอร์นิเจอร์ครบชุดและฟูกที่นอน',
    price: 1299,
    deposit: 1000,
    total_rooms: 1,
    occupied_rooms: 0,
    features: ['🚪 2 ห้องเชื่อมกัน', '❄️ เครื่องปรับอากาศ', '🛋️ เฟอร์นิเจอร์ครบชุด', '🛏️ ชุดฟูกที่นอน', '📶 ฟรี Wi-Fi'],
    image_url: '/images/extra.png',
    available_room_numbers: []
  }
];

const monthlyRooms = [
  {
    room_type: 'monthly',
    name: "ห้องเปล่า ไม่มีแอร์",
    description: "ห้องพักราคาประหยัด สำหรับผู้ที่ต้องการความเป็นส่วนตัว",
    price: 3100,
    deposit: 8000,
    available_room_numbers: ["307", "504"],
    features: ["❌ แอร์", "❌ เฟอร์นิเจอร์", "🚿 ห้องน้ำในตัว"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: ""
  },
  {
    room_type: 'monthly',
    name: "ห้องเปล่า ไม่มีแอร์ + มุม",
    description: "ห้องพักมุมส่วนตัว อากาศถ่ายเทสะดวก (รวมค่าห้องมุม +500 บาทแล้ว)",
    price: 3400,
    deposit: 8000,
    available_room_numbers: [],
    features: ["❌ แอร์", "❌ เฟอร์นิเจอร์", "📐 ห้องมุม"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: ""
  },
  {
    room_type: 'monthly',
    name: "ห้องเปล่า มีแอร์",
    description: "ห้องพักห้องเปล่า ติดตั้งแอร์เย็นฉ่ำพร้อมใช้งาน",
    price: 3600,
    deposit: 8500,
    available_room_numbers: [],
    features: ["❄️ เครื่องปรับอากาศ", "❌ เฟอร์นิเจอร์"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: "/images/single.jpg?v=2"
  },
  {
    room_type: 'monthly',
    name: "ห้องเปล่า มีแอร์ + มุม",
    description: "ห้องพักมุมส่วนตัว พร้อมแอร์เย็นสบาย (รวมค่าห้องมุม)",
    price: 3600,
    deposit: 8500,
    available_room_numbers: [],
    features: ["❄️ เครื่องปรับอากาศ", "❌ เฟอร์นิเจอร์", "📐 ห้องมุม"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: "/images/single.jpg?v=2"
  },
  {
    room_type: 'monthly',
    name: "ห้องเฟอร์นิเจอร์ 8 ชิ้น (มีแอร์)",
    description: "พร้อมเข้าอยู่ ด้วยเฟอร์นิเจอร์พื้นฐาน 8 ชิ้น และเครื่องปรับอากาศ",
    price: 5000,
    deposit: 10000,
    available_room_numbers: ["809", "603", "804", "807"],
    features: ["❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์ 8 ชิ้น"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: "/images/single.jpg?v=2"
  },
  {
    room_type: 'monthly',
    name: "ห้องเฟอร์นิเจอร์ 12 ชิ้น (มีแอร์)",
    description: "ครบครันและสะดวกสบายขึ้นด้วยเฟอร์นิเจอร์จัดเต็ม 12 ชิ้น (ครบชุดใหญ่)",
    price: 5500,
    deposit: 10000,
    available_room_numbers: ["208", "203", "605", "802", "809", "609"],
    features: ["❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์ 12 ชิ้น (ครบชุด)"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: "/images/single.jpg?v=2"
  },
  {
    room_type: 'monthly',
    name: "ห้องเฟอร์นิเจอร์ เตียงคู่ + มุม (มีแอร์)",
    description: "ห้องมุมส่วนตัวกว้างขวาง พิเศษด้วยเตียงคู่นอนสบาย พร้อมแอร์",
    price: 6000,
    deposit: 15000,
    available_room_numbers: ["709", "209", "509"],
    features: ["❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์", "📐 ห้องมุม", "🛏️ เตียงคู่"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: "/images/twin.png"
  },
  {
    room_type: 'monthly',
    name: "ห้องเฟอร์นิเจอร์ เตียงคู่ ระเบียงใหญ่ + มุม",
    description: "ห้องมุม วิวสวย พร้อมระเบียงขนาดใหญ่สำหรับพักผ่อนภายนอก",
    price: 6500,
    deposit: 15000,
    available_room_numbers: ["501", "801", "601"],
    features: ["❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์", "📐 ห้องมุม", "🛏️ เตียงคู่", "🌅 ระเบียงใหญ่"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: "/images/extra.png"
  },
  {
    room_type: 'monthly',
    name: "ห้องสูทเฟอร์นิเจอร์ + เตียง + แอร์",
    description: "ห้องสูทขนาดใหญ่ 2 ห้องเชื่อมกัน (Connecting Suite) พร้อมเฟอร์นิเจอร์และแอร์ครบชุด",
    price: 8400,
    deposit: 18500,
    available_room_numbers: ["206 เชื่อมกับ 207"],
    features: ["🚪 2 ห้องเชื่อมกัน (Connecting Suite)", "❄️ เครื่องปรับอากาศ", "🛋️ เฟอร์นิเจอร์ครบชุด", "🛏️ เตียงนอน"],
    total_rooms: null,
    occupied_rooms: null,
    image_url: "/images/extra.png"
  }
];

async function seedData() {
  console.log('Clearing old data (if any)...');
  await supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  console.log('Inserting daily rooms...');
  const { error: dailyErr } = await supabase.from('rooms').insert(dailyRooms);
  if (dailyErr) {
    console.error('Error inserting daily rooms:', dailyErr);
    process.exit(1);
  }

  console.log('Inserting monthly rooms...');
  const { error: monthlyErr } = await supabase.from('rooms').insert(monthlyRooms);
  if (monthlyErr) {
    console.error('Error inserting monthly rooms:', monthlyErr);
    process.exit(1);
  }

  console.log('Seed completed successfully!');
  
  const { data } = await supabase.from('rooms').select('*');
  console.log(`Total rows in 'rooms' table now: ${data.length}`);
}

seedData();
