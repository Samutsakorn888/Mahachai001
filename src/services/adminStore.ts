import { translations } from '../i18n/translations';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'atsamutsakorn_admin_data_v1';

export interface DailyIncomeLog {
  id: string;
  date: string; // YYYY-MM-DD
  roomName: string;
  pricePerNight: number;
  occupiedCount: number;
  totalIncome: number;
  note?: string;
}

export interface MonthlyTenantLog {
  id: string;
  date: string; // YYYY-MM-DD
  monthYear: string; // e.g. "2026-08" or "สิงหาคม 2569"
  type: 'in' | 'out'; // 'in' = ย้ายเข้า, 'out' = ย้ายออก
  roomNumber: string;
  roomType: string;
  tenantName: string;
  depositAmount: number;
  note?: string;
}

export interface CustomSiteData {
  phoneVal: string;
  lineId: string;
  facebookUrl: string;
  bankAccountVal: string;
  bankNameVal: string;
  bankAccountName: string;
  wifiPass: string;
  heroTitle?: string;
  heroSubtitle?: string;
  dailyRooms?: any[];
  monthlyRooms?: any[];
  rulesList?: string[];
  rulesNotice?: string;
  checkInSteps?: string[];
  checkOutSteps?: string[];
  dailyIncomeLogs?: DailyIncomeLog[];
  monthlyTenantLogs?: MonthlyTenantLog[];
}

export const getDefaultRoomTotal = (key?: string, name?: string): number => {
  const k = (key || '').toLowerCase();
  const n = (name || '').toLowerCase();
  if (k === 'fanfuton' || n.includes('พัดลม') || n.includes('futon')) return 1;
  if (k === 'single' || n.includes('เดี่ยว') || n.includes('single')) return 6;
  if (k === 'twin' || n.includes('คู่') || n.includes('twin')) return 3;
  if (k === 'extra' || n.includes('เสริม') || n.includes('extra')) return 3;
  if (k === 'suite' || n.includes('สูท') || n.includes('suite')) return 1;
  return 1;
};

// Get initial default state
export const getDefaultSiteData = (): CustomSiteData => {
  const th = translations.th;
  return {
    phoneVal: th.phoneVal,
    lineId: '0990954541',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61553464657033',
    bankAccountVal: th.bankAccountVal,
    bankNameVal: th.bankNameVal,
    bankAccountName: th.bankAccountName,
    wifiPass: th.wifiPass,
    heroTitle: th.welcome,
    heroSubtitle: th.subheading,
    dailyRooms: [
      {
        key: 'fanFuton',
        name: 'ห้องฟูกพัดลม (Fan Futon Room)',
        desc: 'ห้องพักราคาประหยัด บรรยากาศสบาย พร้อมพัดลมและชุดฟูกที่นอน',
        price: '450',
        deposit: '500',
        totalRooms: 1,
        occupiedRooms: 0,
        features: ['🌀 พัดลม', '🛏️ ฟูกที่นอน', '📶 ฟรี Wi-Fi', '🚿 ห้องน้ำในตัว'],
        image: '/images/fan_futon.png'
      },
      {
        key: 'single',
        name: th.singleRoom.name,
        desc: th.singleRoom.desc,
        price: th.singleRoom.price,
        deposit: '500',
        totalRooms: 6,
        occupiedRooms: 4,
        features: [...th.singleRoom.features],
        image: '/images/single.jpg?v=2'
      },
      {
        key: 'twin',
        name: th.twinRoom.name,
        desc: th.twinRoom.desc,
        price: th.twinRoom.price,
        deposit: '500',
        totalRooms: 3,
        occupiedRooms: 2,
        features: [...th.twinRoom.features],
        image: '/images/twin.png'
      },
      {
        key: 'extra',
        name: th.extraRoom.name,
        desc: th.extraRoom.desc,
        price: th.extraRoom.price,
        deposit: '500',
        totalRooms: 3,
        occupiedRooms: 1,
        features: [...th.extraRoom.features],
        image: '/images/extra.png'
      },
      {
        key: 'suite',
        name: 'ห้องสูทเฟอร์นิเจอร์ + ฟูก (Connecting Suite Room)',
        desc: 'ห้องพัก 2 ห้องเชื่อมกัน (Connecting Rooms) พร้อมเฟอร์นิเจอร์ครบชุดและฟูกที่นอน',
        price: '1,299',
        deposit: '1,000',
        totalRooms: 1,
        occupiedRooms: 0,
        features: ['🚪 2 ห้องเชื่อมกัน', '❄️ เครื่องปรับอากาศ', '🛋️ เฟอร์นิเจอร์ครบชุด', '🛏️ ชุดฟูกที่นอน', '📶 ฟรี Wi-Fi'],
        image: '/images/extra.png'
      }
    ],
    monthlyRooms: th.monthlyRooms.map((r, idx) => ({
      id: idx,
      name: r.name,
      desc: r.desc,
      price: r.price,
      deposit: r.deposit,
      availableRoomsList: r.availableRoomsList ? [...r.availableRoomsList] : [],
      features: [...r.features],
      image: r.name.toLowerCase().includes('ไม่มีแอร์') ? '' : (r.name.toLowerCase().includes('คู่') || r.name.toLowerCase().includes('twin') ? '/images/twin.png' : idx > 5 ? '/images/extra.png' : '/images/single.png')
    })),
    rulesList: [...th.rulesList],
    rulesNotice: th.rulesNotice,
    checkInSteps: [...th.checkInSteps],
    checkOutSteps: [...th.checkOutSteps],
    dailyIncomeLogs: [
      {
        id: 'inc-1',
        date: '2026-08-05',
        roomName: 'ห้องพักเตียงเดี่ยว (Single Bed)',
        pricePerNight: 799,
        occupiedCount: 4,
        totalIncome: 3196,
        note: 'เข้าพักทั่วไป 4 ห้อง'
      },
      {
        id: 'inc-2',
        date: '2026-08-05',
        roomName: 'ห้องพักเตียงคู่ (Twin Bed)',
        pricePerNight: 799,
        occupiedCount: 2,
        totalIncome: 1598,
        note: 'เข้าพัก 2 ห้อง'
      },
      {
        id: 'inc-3',
        date: '2026-08-05',
        roomName: 'ห้องพักที่นอนเสริม (Extra Bed)',
        pricePerNight: 899,
        occupiedCount: 1,
        totalIncome: 899,
        note: 'เข้าพักครอบครัว 1 ห้อง'
      },
      {
        id: 'inc-4',
        date: '2026-08-04',
        roomName: 'ห้องสูทเฟอร์นิเจอร์ + ฟูก (Connecting Suite Room)',
        pricePerNight: 1299,
        occupiedCount: 1,
        totalIncome: 1299,
        note: 'ลูกค้ารายวัน 1 คืน'
      },
      {
        id: 'inc-5',
        date: '2026-08-04',
        roomName: 'ห้องพักเตียงเดี่ยว (Single Bed)',
        pricePerNight: 799,
        occupiedCount: 5,
        totalIncome: 3995,
        note: 'เต็ม 5 จาก 6 ห้อง'
      }
    ],
    monthlyTenantLogs: [
      {
        id: 'log-1',
        date: '2026-08-01',
        monthYear: '2026-08',
        type: 'in',
        roomNumber: '307',
        roomType: 'ห้องเปล่า ไม่มีแอร์',
        tenantName: 'คุณสมชาย ใจดี',
        depositAmount: 8000,
        note: 'เข้าอยู่วันแรก สัญญา 1 ปี'
      },
      {
        id: 'log-2',
        date: '2026-08-02',
        monthYear: '2026-08',
        type: 'in',
        roomNumber: '809',
        roomType: 'ห้องเฟอร์นิเจอร์ 8 ชิ้น (มีแอร์)',
        tenantName: 'คุณวิภา รักษ์ไทย',
        depositAmount: 10000,
        note: 'เข้าอยู่ใหม่ สัญญา 6 เดือน'
      },
      {
        id: 'log-3',
        date: '2026-08-03',
        monthYear: '2026-08',
        type: 'in',
        roomNumber: '208',
        roomType: 'ห้องเฟอร์นิเจอร์ 12 ชิ้น (มีแอร์)',
        tenantName: 'คุณณัฐพงษ์ สุขสันต์',
        depositAmount: 10000,
        note: 'โอนมัดจำเรียบร้อย'
      },
      {
        id: 'log-4',
        date: '2026-08-04',
        monthYear: '2026-08',
        type: 'in',
        roomNumber: '709',
        roomType: 'ห้องเฟอร์นิเจอร์ เตียงคู่ + มุม (มีแอร์)',
        tenantName: 'คุณอนันต์ เลิศไพศาล',
        depositAmount: 15000,
        note: 'ย้ายมาจากสาขาอื่น'
      },
      {
        id: 'log-5',
        date: '2026-07-31',
        monthYear: '2026-07',
        type: 'out',
        roomNumber: '402',
        roomType: 'ห้องเปล่า มีแอร์',
        tenantName: 'คุณกิตติศักดิ์',
        depositAmount: 8500,
        note: 'หมดสัญญา ย้ายออกเรียบร้อย คืนมัดจำครบ'
      },
      {
        id: 'log-6',
        date: '2026-08-03',
        monthYear: '2026-08',
        type: 'out',
        roomNumber: '505',
        roomType: 'ห้องเฟอร์นิเจอร์ 8 ชิ้น (มีแอร์)',
        tenantName: 'คุณปรียา',
        depositAmount: 10000,
        note: 'ย้ายออกไปต่างจังหวัด หักค่าทำความสะอาด 1,000'
      }
    ]
  };
};

export const loadSiteData = (): CustomSiteData => {
  const defaultData = getDefaultSiteData();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return mergeDataWithDefault(parsed, defaultData);
    }
  } catch (e) {
    console.error('Error loading admin site data from localStorage:', e);
  }
  return defaultData;
};

// Helper function to merge parsed data with default data structures
const mergeDataWithDefault = (parsed: any, defaultData: CustomSiteData): CustomSiteData => {
  const dailyRooms = (parsed.dailyRooms || defaultData.dailyRooms).map((r: any) => ({
    ...r,
    totalRooms: r.totalRooms !== undefined ? Number(r.totalRooms) : getDefaultRoomTotal(r.key, r.name),
    occupiedRooms: r.occupiedRooms !== undefined ? Number(r.occupiedRooms) : 0,
    image: (r.key === 'single' || (r.image && r.image.includes('single'))) ? '/images/single.jpg?v=2' : r.image
  }));
  const defaultMonthly = defaultData.monthlyRooms || [];
  const monthlyRooms = (parsed.monthlyRooms || defaultMonthly).map((r: any) => {
    const matchDef = defaultMonthly.find((m: any) => m.name === r.name);
    return {
      ...r,
      price: (matchDef && matchDef.price) ? matchDef.price : r.price,
      deposit: (matchDef && matchDef.deposit) ? matchDef.deposit : r.deposit,
      availableRoomsList: r.availableRoomsList !== undefined
        ? r.availableRoomsList
        : (matchDef ? matchDef.availableRoomsList : [])
    };
  });
  const dailyIncomeLogs = parsed.dailyIncomeLogs && parsed.dailyIncomeLogs.length > 0
    ? parsed.dailyIncomeLogs
    : defaultData.dailyIncomeLogs;
  const monthlyTenantLogs = parsed.monthlyTenantLogs && parsed.monthlyTenantLogs.length > 0
    ? parsed.monthlyTenantLogs
    : defaultData.monthlyTenantLogs;

  return { ...defaultData, ...parsed, dailyRooms, monthlyRooms, dailyIncomeLogs, monthlyTenantLogs };
};

// Async function to load site data from Supabase Storage
export const loadSiteDataFromCloud = async (): Promise<CustomSiteData> => {
  const defaultData = getDefaultSiteData();
  try {
    const { data: { publicUrl } } = supabase.storage
      .from('room-images')
      .getPublicUrl('siteData.json');
      
    // Fetch with cache-busting timestamp
    const res = await fetch(`${publicUrl}?t=${Date.now()}`);
    if (res.ok) {
      const parsed = await res.json();
      const merged = mergeDataWithDefault(parsed, defaultData);
      // Also update local storage for fallback
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {
    console.error('Error loading admin site data from Supabase:', e);
  }
  
  // Fallback to local storage if cloud fetch fails
  return loadSiteData();
};

export const saveSiteData = (data: CustomSiteData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Also upload to Supabase asynchronously without blocking the UI
    const file = new Blob([JSON.stringify(data)], { type: 'application/json' });
    supabase.storage
      .from('room-images')
      .upload('siteData.json', file, { upsert: true, contentType: 'application/json' })
      .catch(e => console.error('Error syncing to Supabase:', e));
      
  } catch (e) {
    console.error('Error saving admin site data:', e);
  }
};

export const resetSiteData = (): CustomSiteData => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error resetting admin site data:', e);
  }
  return getDefaultSiteData();
};
