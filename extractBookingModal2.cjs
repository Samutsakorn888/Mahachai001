const fs = require('fs');
const lines = fs.readFileSync('tempRoom.tsx', 'utf16le').split('\n');

const startIndex = lines.findIndex(l => l.includes('selectedBookingRoom && createPortal('));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.trim() === ')}' && lines[i-1].includes('document.body'));

let modalJsx = lines.slice(startIndex, endIndex + 1).join('\n');
modalJsx = modalJsx.replace('selectedBookingRoom && createPortal(', 'return createPortal(');
modalJsx = modalJsx.replace('          document.body\r\n        )}', '    document.body\r\n  );');
modalJsx = modalJsx.replace('          </div>,\r\n    {copiedToast', '          </div>\r\n    {copiedToast');

const statesStr = `
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
`;

const handlersStr = lines.slice(157, 265).join('\n') + '\n';

const fileContent = `// @ts-nocheck
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
}) => {${statesStr}${handlersStr}${modalJsx}\n};\n`;

fs.writeFileSync('src/components/RoomTypes/BookingModal.tsx', fileContent);
