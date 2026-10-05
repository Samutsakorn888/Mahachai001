const fs = require('fs');
let text = fs.readFileSync('src/components/RoomTypes.tsx', 'utf8');

text = text.replace(
  "import { DailyRoomCard, MonthlyRoomCard } from './RoomTypes/RoomCard';",
  "import { DailyRoomCard, MonthlyRoomCard } from './RoomTypes/RoomCard';\nimport { BookingModal } from './RoomTypes/BookingModal';"
);

const stateToRemove = [
  '  const [selectedBookingItems, setSelectedBookingItems] = useState<Array<{ roomData: any; count: number; duration?: number }>>([]);\n',
  '  const [bookingNights, setBookingNights] = useState<number | \'\'>\\(1\\);\n',
  '  const [bookingMonths, setBookingMonths] = useState<number | \'\'>\\(1\\);\n',
  '  const [payDepositNow, setPayDepositNow] = useState<boolean>\\(false\\);\n',
  '  const [checkInDate, setCheckInDate] = useState<string>\\(\\(\\) => new Date\\(\\)\\.toISOString\\(\\)\\.split\\(\'T\'\\)\\[0\\]\\);\n',
  '  const [guestName, setGuestName] = useState<string>\\(\'\'\\);\n',
  '  const [guestPhone, setGuestPhone] = useState<string>\\(\\'\\'\\);\n',
  '  const [copiedToast, setCopiedToast] = useState<string \\| null>\\(null\\);\n',
  '  const summaryRef = useRef<HTMLDivElement>\\(null\\);\n'
];

for(const s of stateToRemove) {
  text = text.replace(new RegExp(s), '');
}

const handleOpenBookingReplace = `  const handleOpenBooking = (room: any) => {
    const roomData = room.data || room;
    const isMonthly = room.isMonthly || (roomData?.name && (roomData.name.includes('เดือน') || roomData.name.includes('Monthly'))) || activeTab === 'monthly';
    setSelectedBookingRoom({ ...room, isMonthly });
  };`;

text = text.replace(/  const handleOpenBooking = \(room: any\) => \{[\s\S]*?^  \};/m, handleOpenBookingReplace);

const handlersRegex = [
  /  const handleAddRoomType = [\s\S]*?^  };\n/m,
  /  const handleUpdateRoomCount = [\s\S]*?^  };\n/m,
  /  const handleUpdateItemDuration = [\s\S]*?^  };\n/m,
  /  const handleSetGlobalNights = [\s\S]*?^  };\n/m,
  /  const handleSetGlobalMonths = [\s\S]*?^  };\n/m,
  /  const handleRemoveRoomItem = [\s\S]*?^  };\n/m,
  /  const handleCopyText = [\s\S]*?^  };\n/m,
  /  const handlePrintOrDownload = [\s\S]*?^      }\n    } else {\n      window\.print\(\);\n    }\n  };\n/m,
  /  const generatePDF = [\s\S]*?^  };\n/m,
  /  const handleDownloadPDF = [\s\S]*?^  };\n/m
];

for(const regex of handlersRegex) {
  text = text.replace(regex, '');
}

const copiedToastStr = `        {copiedToast && (
          <div className="alert-toast">
            คัดลอก{copiedToast}สำเร็จแล้ว!
          </div>
        )}`;

text = text.replace(copiedToastStr, '');

fs.writeFileSync('src/components/RoomTypes.tsx', text);
