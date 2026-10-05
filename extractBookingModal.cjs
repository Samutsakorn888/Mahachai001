const fs = require('fs');

const lines = fs.readFileSync('src/components/RoomTypes.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('selectedBookingRoom && createPortal('));
const end = lines.findIndex((l, i) => i > start && l.trim() === ')}' && lines[i-1].includes('document.body'));

const modalJsxLines = lines.slice(start + 1, end - 1); // Exclude the createPortal and document.body lines

const code = `import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { calculateCheckOutDate, formatThaiDate } from './utils';
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
  room, dailyRooms, monthlyRoomsData, onClose, language, t, setExpandedImage
}) => {
  const isMonthly = room.isMonthly || false;
  const initialDuration = isMonthly ? 12 : 1;
  const roomData = room.data || room;

  const [selectedBookingItems, setSelectedBookingItems] = useState<BookingItem[]>([{ roomData, count: 1, duration: initialDuration }]);
  const [bookingNights, setBookingNights] = useState<number | ''>(1);
  const [bookingMonths, setBookingMonths] = useState<number | ''>(12);
  const [checkInDate, setCheckInDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [payDepositNow, setPayDepositNow] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAddRoomType = (roomDataToAdd: any) => {
    const currentDur = isMonthly ? ((bookingMonths as number) || 1) : ((bookingNights as number) || 1);
    setSelectedBookingItems(prev => {
      const existingIndex = prev.findIndex(item => item.roomData?.name === roomDataToAdd?.name);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].count += 1;
        return updated;
      }
      return [...prev, { roomData: roomDataToAdd, count: 1, duration: currentDur }];
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
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isLineOrMessenger = /Line|FBAV|FBAN|Messenger/i.test(ua);
    
    if (isLineOrMessenger) {
      if (!summaryRef.current) return;
      const printHeader = summaryRef.current.querySelector('.print-only') as HTMLElement;
      if (printHeader) printHeader.style.display = 'block';
      const originalStyle = summaryRef.current.getAttribute('style') || '';
      summaryRef.current.style.width = '800px';
      summaryRef.current.style.maxWidth = '800px';
      summaryRef.current.style.padding = '20px';
      
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
        setExpandedImage(image);
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
    } else {
      window.print();
    }
  };

  const generatePDF = async () => {
    if (!summaryRef.current) return;
    
    const printHeader = summaryRef.current.querySelector('.print-only') as HTMLElement;
    if (printHeader) printHeader.style.display = 'block';

    const originalStyle = summaryRef.current.getAttribute('style') || '';
    summaryRef.current.style.width = '800px';
    summaryRef.current.style.maxWidth = '800px';
    summaryRef.current.style.padding = '20px';

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
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(\`AtSamutsakorn_Booking_\${Date.now()}.pdf\`);
      
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    } finally {
      summaryRef.current.setAttribute('style', originalStyle);
      if (printHeader) printHeader.style.display = 'none';
      noPrintElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
    }
  };

  const selectedBookingRoom = room;
  const totalBookingRooms = selectedBookingItems.reduce((acc, item) => acc + item.count, 0);

  return createPortal(
    <>
${modalJsxLines.join('\n').replace(/onClick=\{\(\) => setSelectedBookingRoom\(null\)\}/g, 'onClick={onClose}')}
    {copiedToast && (
      <div className="alert-toast">
        คัดลอก{copiedToast}สำเร็จแล้ว!
      </div>
    )}
    </>,
    document.body
  );
};
`;

fs.writeFileSync('src/components/RoomTypes/BookingModal.tsx', code);
