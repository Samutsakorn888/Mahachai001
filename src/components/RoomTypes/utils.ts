export const parseArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' ? (val.startsWith('[') ? JSON.parse(val) : val.split(',')) : []);

export const parseImageUrl = (val: any) => {
  if (typeof val === 'string' && val.startsWith('{')) {
    try {
      const parsed = JSON.parse(val);
      return { image: parsed.main || '', images: parsed.gallery || [] };
    } catch(e) {}
  }
  return { image: val || '', images: [] };
};

export const formatThaiDate = (dateStr: string) => {
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

export const calculateCheckOutDate = (checkInStr: string, duration: number, isMonthly: boolean) => {
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

export const formatThaiDateObj = (date: Date | null) => {
  if (!date) return 'ยังไม่ระบุ';
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
