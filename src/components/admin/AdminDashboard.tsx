import React, { useState } from 'react';
import { loadSiteData, saveSiteData, resetSiteData, type CustomSiteData, type DailyIncomeLog, type MonthlyTenantLog } from '../../services/adminStore';
import { supabase } from '../../services/supabaseClient';

interface AdminDashboardProps {
  onLogout: () => void;
  onGoToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onGoToSite }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'daily-revenue' | 'monthly-logs' | 'rooms' | 'hero' | 'rules' | 'settings'>('overview');
  const [siteData, setSiteData] = useState<CustomSiteData>(loadSiteData());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Room management active sub-tab
  const [roomTab, setRoomTab] = useState<'daily' | 'monthly'>('daily');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);

  // Form edit state for selected room
  const [editRoom, setEditRoom] = useState<any>(null);

  // Daily Revenue Log Form State
  const [newDailyLog, setNewDailyLog] = useState<{
    date: string;
    roomName: string;
    pricePerNight: number;
    occupiedCount: number;
    note: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    roomName: 'ห้องพักเตียงเดี่ยว (Single Bed)',
    pricePerNight: 799,
    occupiedCount: 1,
    note: ''
  });

  // Daily Income Filter Date
  const [dailyFilterDate, setDailyFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Monthly Tenant Movement Form State
  const [newMonthlyLog, setNewMonthlyLog] = useState<{
    date: string;
    monthYear: string;
    type: 'in' | 'out';
    roomNumber: string;
    roomType: string;
    tenantName: string;
    depositAmount: number;
    note: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    monthYear: new Date().toISOString().slice(0, 7),
    type: 'in',
    roomNumber: '',
    roomType: 'ห้องเปล่า ไม่มีแอร์',
    tenantName: '',
    depositAmount: 8000,
    note: ''
  });

  // Monthly Logs Filter Month
  const [monthlyFilterMonth, setMonthlyFilterMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  // When room selection changes or roomTab changes, sync editRoom
  const currentRoomsList = roomTab === 'daily' ? siteData.dailyRooms || [] : siteData.monthlyRooms || [];
  
  React.useEffect(() => {
    if (currentRoomsList.length > 0) {
      const idx = Math.min(selectedRoomIndex, currentRoomsList.length - 1);
      setEditRoom(JSON.parse(JSON.stringify(currentRoomsList[idx])));
    }
  }, [roomTab, selectedRoomIndex, siteData]);

  const notifySave = (msg: string = 'บันทึกข้อมูลสำเร็จแล้ว!') => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Image File Uploader with Live Preview
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editRoom) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('room-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('room-images')
          .getPublicUrl(filePath);

        setEditRoom({ ...editRoom, image: publicUrl });
      } catch (error) {
        console.error('Error uploading image: ', error);
        alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพไปยัง Supabase');
      }
    }
  };

  // Handle Feature Checkbox Toggle
  const handleToggleFeature = (feature: string) => {
    if (!editRoom) return;
    const currentFeatures: string[] = editRoom.features || [];
    if (currentFeatures.includes(feature)) {
      setEditRoom({ ...editRoom, features: currentFeatures.filter(f => f !== feature) });
    } else {
      setEditRoom({ ...editRoom, features: [...currentFeatures, feature] });
    }
  };

  const handleSaveRoom = () => {
    if (!editRoom) return;
    if (roomTab === 'daily') {
      const updated = [...(siteData.dailyRooms || [])];
      updated[selectedRoomIndex] = editRoom;
      const newData = { ...siteData, dailyRooms: updated };
      setSiteData(newData);
      saveSiteData(newData);
    } else {
      const updated = [...(siteData.monthlyRooms || [])];
      updated[selectedRoomIndex] = editRoom;
      const newData = { ...siteData, monthlyRooms: updated };
      setSiteData(newData);
      saveSiteData(newData);
    }
    notifySave(`บันทึกข้อมูลห้อง "${editRoom.name}" เรียบร้อยแล้ว!`);
  };

  const handleSaveSettings = () => {
    saveSiteData(siteData);
    notifySave('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลเป็นค่าเริ่มต้นของระบบหรือไม่?')) {
      const reset = resetSiteData();
      setSiteData(reset);
      notifySave('คืนค่าเริ่มต้นเรียบร้อยแล้ว!');
    }
  };

  // Daily Income Log Handlers
  const handleAddDailyIncomeLog = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(newDailyLog.pricePerNight) * Number(newDailyLog.occupiedCount);
    const entry: DailyIncomeLog = {
      id: 'inc-' + Date.now(),
      date: newDailyLog.date,
      roomName: newDailyLog.roomName,
      pricePerNight: Number(newDailyLog.pricePerNight),
      occupiedCount: Number(newDailyLog.occupiedCount),
      totalIncome: total,
      note: newDailyLog.note
    };
    const updated = [entry, ...(siteData.dailyIncomeLogs || [])];
    const newData = { ...siteData, dailyIncomeLogs: updated };
    setSiteData(newData);
    saveSiteData(newData);
    notifySave('บันทึกยอดรายได้รายวันเรียบร้อยแล้ว!');
    setNewDailyLog({ ...newDailyLog, note: '' });
  };

  const handleDeleteDailyIncomeLog = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการบันทึกรายได้นี้ใช่หรือไม่?')) {
      const updated = (siteData.dailyIncomeLogs || []).filter(l => l.id !== id);
      const newData = { ...siteData, dailyIncomeLogs: updated };
      setSiteData(newData);
      saveSiteData(newData);
      notifySave('ลบรายการบันทึกรายได้เรียบร้อยแล้ว');
    }
  };

  // Monthly Tenant Log Handlers
  const handleAddMonthlyTenantLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonthlyLog.roomNumber || !newMonthlyLog.tenantName) {
      alert('กรุณากรอกเลขห้องและชื่อผู้เช่า');
      return;
    }
    const entry: MonthlyTenantLog = {
      id: 'log-' + Date.now(),
      date: newMonthlyLog.date,
      monthYear: newMonthlyLog.date.slice(0, 7),
      type: newMonthlyLog.type,
      roomNumber: newMonthlyLog.roomNumber,
      roomType: newMonthlyLog.roomType,
      tenantName: newMonthlyLog.tenantName,
      depositAmount: Number(newMonthlyLog.depositAmount),
      note: newMonthlyLog.note
    };
    const updated = [entry, ...(siteData.monthlyTenantLogs || [])];
    const newData = { ...siteData, monthlyTenantLogs: updated };
    setSiteData(newData);
    saveSiteData(newData);
    notifySave(`บันทึกข้อมูล ${newMonthlyLog.type === 'in' ? 'ย้ายเข้า' : 'ย้ายออก'} ห้อง ${newMonthlyLog.roomNumber} เรียบร้อยแล้ว!`);
    setNewMonthlyLog({ ...newMonthlyLog, roomNumber: '', tenantName: '', note: '' });
  };

  const handleDeleteMonthlyTenantLog = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการย้ายเข้า-ออกนี้ใช่หรือไม่?')) {
      const updated = (siteData.monthlyTenantLogs || []).filter(l => l.id !== id);
      const newData = { ...siteData, monthlyTenantLogs: updated };
      setSiteData(newData);
      saveSiteData(newData);
      notifySave('ลบรายการย้ายเข้า-ออกเรียบร้อยแล้ว');
    }
  };

  const availableFeatures = [
    "❄️ แอร์", "📺 TV", "📶 Free Wi-Fi", "🛋️ เฟอร์นิเจอร์", "Built-in Wardrobe",
    "Water Heater", "Hair Dryer", "Refrigerator", "📐 ห้องมุม", "🛏️ เตียงคู่", "🌅 ระเบียงใหญ่"
  ];

  // Daily statistics calculation
  const dailyList = siteData.dailyRooms || [];
  const totalDailyRoomsCount = dailyList.reduce((sum, r) => sum + (r.totalRooms !== undefined ? Number(r.totalRooms) : 1), 0);
  const totalDailyOccupiedCount = dailyList.reduce((sum, r) => sum + (r.occupiedRooms !== undefined ? Number(r.occupiedRooms) : 0), 0);
  const totalDailyAvailableCount = Math.max(0, totalDailyRoomsCount - totalDailyOccupiedCount);
  const currentDailyEstRevenue = dailyList.reduce((sum, r) => {
    const price = parseInt(String(r.price).replace(/,/g, '')) || 0;
    const occ = r.occupiedRooms !== undefined ? Number(r.occupiedRooms) : 0;
    return sum + (price * occ);
  }, 0);

  // Monthly statistics calculation
  const monthlyList = siteData.monthlyRooms || [];
  const filteredMonthlyTenantLogs = (siteData.monthlyTenantLogs || []).filter(l => l.monthYear === monthlyFilterMonth || l.date.startsWith(monthlyFilterMonth));
  const moveInCount = filteredMonthlyTenantLogs.filter(l => l.type === 'in').length;
  const moveOutCount = filteredMonthlyTenantLogs.filter(l => l.type === 'out').length;
  const moveInDepositTotal = filteredMonthlyTenantLogs.filter(l => l.type === 'in').reduce((sum, l) => sum + (l.depositAmount || 0), 0);
  const moveOutDepositTotal = filteredMonthlyTenantLogs.filter(l => l.type === 'out').reduce((sum, l) => sum + (l.depositAmount || 0), 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header Bar */}
      <header style={{
        background: 'linear-gradient(135deg, #002d62 0%, #004088 100%)',
        color: '#ffffff',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0, 45, 98, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/images/logo.png" alt="Logo" style={{ height: '42px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '3px' }} />
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff', letterSpacing: '-0.3px' }}>
              ระบบจัดการและสรุปการเงิน (Admin Dashboard)
            </h1>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '500' }}>
              แอทสมุทรสาคร (สาขามหาชัย) • @Samutsakorn Mahachai
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            👤 แอดมิน: <span style={{ color: '#60a5fa' }}>samutsakorn_mahachai</span>
          </div>

          <button
            onClick={onGoToSite}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            🌐 ดูหน้าเว็บจริง
          </button>

          <button
            onClick={onLogout}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
            }}
          >
            🚪 ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Main Content Layout with Sidebar */}
      <div style={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar Menu */}
        <aside style={{
          width: '270px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          padding: '24px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ padding: '0 12px 10px 12px', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em' }}>
              📊 เมนูรายงาน & การเงิน
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'overview' ? '#e0f2fe' : 'transparent',
                color: activeTab === 'overview' ? '#0369a1' : '#475569',
                fontWeight: activeTab === 'overview' ? '800' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🏠</span> ภาพรวม & สรุปการเงิน
            </button>

            <button
              onClick={() => setActiveTab('daily-revenue')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'daily-revenue' ? '#e0f2fe' : 'transparent',
                color: activeTab === 'daily-revenue' ? '#0369a1' : '#475569',
                fontWeight: activeTab === 'daily-revenue' ? '800' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>💵</span> สรุปรายได้ห้องรายวัน
            </button>

            <button
              onClick={() => setActiveTab('monthly-logs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'monthly-logs' ? '#e0f2fe' : 'transparent',
                color: activeTab === 'monthly-logs' ? '#0369a1' : '#475569',
                fontWeight: activeTab === 'monthly-logs' ? '800' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>📋</span> สรุปคนเข้า-ออกรายเดือน
            </button>

            <div style={{ margin: '12px 0 6px 0', padding: '12px 12px 6px 12px', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', borderTop: '1px solid #f1f5f9' }}>
              ⚙️ เมนูจัดการเนื้อหาเว็บไซต์
            </div>

            <button
              onClick={() => setActiveTab('rooms')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'rooms' ? '#e0f2fe' : 'transparent',
                color: activeTab === 'rooms' ? '#0369a1' : '#475569',
                fontWeight: activeTab === 'rooms' ? '800' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🛏️</span> แก้ไขข้อมูลห้องพัก
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'hero' ? '#e0f2fe' : 'transparent',
                color: activeTab === 'hero' ? '#0369a1' : '#475569',
                fontWeight: activeTab === 'hero' ? '800' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🖼️</span> แก้ไขหน้าแรก (Hero)
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'rules' ? '#e0f2fe' : 'transparent',
                color: activeTab === 'rules' ? '#0369a1' : '#475569',
                fontWeight: activeTab === 'rules' ? '800' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>📜</span> กฎระเบียบ & เช็คอิน
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'settings' ? '#e0f2fe' : 'transparent',
                color: activeTab === 'settings' ? '#0369a1' : '#475569',
                fontWeight: activeTab === 'settings' ? '800' : '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>⚙️</span> ตั้งค่าระบบ & บัญชี
            </button>
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={handleResetDefaults}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              🔄 คืนค่าเริ่มต้นของระบบ
            </button>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main style={{ flex: 1, padding: '28px 36px', minWidth: '320px', overflowY: 'auto' }}>
          {saveMessage && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              border: '1.5px solid #86efac',
              padding: '14px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(22, 101, 52, 0.1)'
            }}>
              <span style={{ fontSize: '1.4rem' }}>✅</span>
              <span>{saveMessage}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW & FINANCIAL DASHBOARD */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  🏠 ภาพรวมระบบและสรุปยอดการเงิน (Overview Dashboard)
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                  สรุปรายได้ประจำวัน อัตราการเข้าพักห้องรายวัน และสถิติผู้เช่าย้ายเข้า-ย้ายออกรายเดือน
                </p>
              </div>

              {/* 4 Summary Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>💵 รายได้ห้องรายวัน (วันนี้)</span>
                    <span style={{ backgroundColor: '#eff6ff', padding: '6px 10px', borderRadius: '8px', fontSize: '1.2rem' }}>💰</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0284c7', marginTop: '8px' }}>
                    ฿{currentDailyEstRevenue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '4px', fontWeight: '600' }}>
                    คำนวณจากห้องรายวันที่เข้าพักปัจจุบัน ({totalDailyOccupiedCount} ห้อง)
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>📊 อัตราการเข้าพักรายวัน</span>
                    <span style={{ backgroundColor: '#f0fdf4', padding: '6px 10px', borderRadius: '8px', fontSize: '1.2rem' }}>📈</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16a34a', marginTop: '8px' }}>
                    {totalDailyOccupiedCount} / {totalDailyRoomsCount} ห้อง
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '4px', fontWeight: '600' }}>
                    🟢 ว่างพร้อมบริการ {totalDailyAvailableCount} ห้อง ({((totalDailyOccupiedCount / totalDailyRoomsCount) * 100).toFixed(0)}% Occupied)
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>📥 ผู้เช่าย้ายเข้า (เดือนนี้)</span>
                    <span style={{ backgroundColor: '#f0fdf4', padding: '6px 10px', borderRadius: '8px', fontSize: '1.2rem' }}>🔑</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16a34a', marginTop: '8px' }}>
                    {moveInCount} ราย
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '4px', fontWeight: '600' }}>
                    มัดจำรับเข้าสุทธิ: ฿{moveInDepositTotal.toLocaleString()} บาท
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>📤 ผู้เช่าย้ายออก (เดือนนี้)</span>
                    <span style={{ backgroundColor: '#fef2f2', padding: '6px 10px', borderRadius: '8px', fontSize: '1.2rem' }}>🚪</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#dc2626', marginTop: '8px' }}>
                    {moveOutCount} ราย
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#991b1b', marginTop: '4px', fontWeight: '600' }}>
                    คืนมัดจำออกสุทธิ: ฿{moveOutDepositTotal.toLocaleString()} บาท
                  </div>
                </div>
              </div>

              {/* Daily Rooms Revenue Table Breakdown */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#004088', margin: 0 }}>
                      💵 สรุปรายได้ห้องพักรายวันตามประเภทห้อง (Daily Rooms Revenue Breakdown)
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      ตารางคำนวณจำนวนห้องเข้าพักและรายได้รายวันแบบ Real-time
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('daily-revenue')}
                    style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    ➕ บันทึกยอดรายวัน
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '12px 14px' }}>ประเภทห้องพักรายวัน</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>ราคา / คืน</th>
                        <th style={{ padding: '12px 14px', textAlign: 'center' }}>จำนวนทั้งหมด</th>
                        <th style={{ padding: '12px 14px', textAlign: 'center' }}>เต็มแล้ว (เข้าพัก)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'center' }}>เหลือว่าง</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>รายได้ประจำวัน (บาท)</th>
                        <th style={{ padding: '12px 14px', textAlign: 'center' }}>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyList.map((rm, idx) => {
                        const price = parseInt(String(rm.price).replace(/,/g, '')) || 0;
                        const tot = rm.totalRooms !== undefined ? Number(rm.totalRooms) : 1;
                        const occ = rm.occupiedRooms !== undefined ? Number(rm.occupiedRooms) : 0;
                        const avail = Math.max(0, tot - occ);
                        const income = price * occ;
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '14px', fontWeight: 'bold', color: '#0f172a' }}>{rm.name}</td>
                            <td style={{ padding: '14px', textAlign: 'right', color: '#0284c7', fontWeight: 'bold' }}>฿{price.toLocaleString()}</td>
                            <td style={{ padding: '14px', textAlign: 'center', fontWeight: 'bold' }}>{tot} ห้อง</td>
                            <td style={{ padding: '14px', textAlign: 'center', color: '#dc2626', fontWeight: 'bold' }}>{occ} ห้อง</td>
                            <td style={{ padding: '14px', textAlign: 'center', color: '#16a34a', fontWeight: 'bold' }}>{avail} ห้อง</td>
                            <td style={{ padding: '14px', textAlign: 'right', color: '#0284c7', fontWeight: '800', fontSize: '1rem' }}>
                              ฿{income.toLocaleString()}
                            </td>
                            <td style={{ padding: '14px', textAlign: 'center' }}>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                backgroundColor: avail > 0 ? '#dcfce7' : '#fee2e2',
                                color: avail > 0 ? '#15803d' : '#dc2626'
                              }}>
                                {avail > 0 ? '🟢 เหลือว่าง' : '🔴 เต็มแล้ว'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ backgroundColor: '#f0f9ff', fontWeight: 'bold', borderTop: '2px solid #bae6fd' }}>
                        <td colSpan={3} style={{ padding: '14px', color: '#0369a1', fontSize: '1rem' }}>
                          ยอดรวมรายได้ห้องพักรายวันประมาณการต่อวัน:
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center', color: '#dc2626', fontSize: '1rem' }}>
                          {totalDailyOccupiedCount} ห้อง
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center', color: '#16a34a', fontSize: '1rem' }}>
                          {totalDailyAvailableCount} ห้อง
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right', color: '#0284c7', fontSize: '1.2rem', fontWeight: '800' }}>
                          ฿{currentDailyEstRevenue.toLocaleString()} บาท
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Monthly Tenant Move-In/Out Recent History Preview */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#004088', margin: 0 }}>
                      📋 ประวัติคนย้ายเข้า - ย้ายออก รายเดือน (Monthly Tenant Movement Preview)
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      บันทึกรายการย้ายเข้าและย้ายออกของผู้เช่าห้องพักรายเดือน
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('monthly-logs')}
                    style={{ backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    📋 ดูรายการทั้งหมด
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '10px 12px' }}>วันที่</th>
                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>ประเภท</th>
                        <th style={{ padding: '10px 12px' }}>เลขห้อง</th>
                        <th style={{ padding: '10px 12px' }}>ประเภทห้องพัก</th>
                        <th style={{ padding: '10px 12px' }}>ชื่อผู้เช่า</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>เงินมัดจำ (บาท)</th>
                        <th style={{ padding: '10px 12px' }}>หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(siteData.monthlyTenantLogs || []).slice(0, 5).map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{log.date}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.78rem',
                              fontWeight: 'bold',
                              backgroundColor: log.type === 'in' ? '#dcfce7' : '#fee2e2',
                              color: log.type === 'in' ? '#15803d' : '#dc2626'
                            }}>
                              {log.type === 'in' ? '📥 ย้ายเข้า' : '📤 ย้ายออก'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontWeight: '800', color: '#0f172a' }}>ห้อง {log.roomNumber}</td>
                          <td style={{ padding: '12px', color: '#475569' }}>{log.roomType}</td>
                          <td style={{ padding: '12px', fontWeight: 'bold' }}>{log.tenantName}</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: log.type === 'in' ? '#16a34a' : '#dc2626' }}>
                            ฿{log.depositAmount.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px', color: '#64748b', fontSize: '0.85rem' }}>{log.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAILY REVENUE TRACKER */}
          {activeTab === 'daily-revenue' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  💵 สรุปรายได้ห้องพักรายวัน (Daily Revenue Tracker)
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                  บันทึกและตรวจสอบยอดรายได้รายวันของแต่ละประเภทห้องพัก
                </p>
              </div>

              {/* Add New Daily Income Entry Form */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0284c7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>➕</span> บันทึกยอดรายได้รายวันประจำวัน (Add Daily Revenue Entry)
                </h3>
                <form onSubmit={handleAddDailyIncomeLog} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      📅 วันที่เข้าพัก
                    </label>
                    <input
                      type="date"
                      value={newDailyLog.date}
                      onChange={e => setNewDailyLog({ ...newDailyLog, date: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      🛏️ ประเภทห้องพัก
                    </label>
                    <select
                      value={newDailyLog.roomName}
                      onChange={e => {
                        const name = e.target.value;
                        const match = dailyList.find(r => r.name === name);
                        const price = match ? parseInt(String(match.price).replace(/,/g, '')) || 799 : 799;
                        setNewDailyLog({ ...newDailyLog, roomName: name, pricePerNight: price });
                      }}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    >
                      {dailyList.map((r, i) => (
                        <option key={i} value={r.name}>{r.name} (฿{r.price}/คืน)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      💰 ราคา/คืน (บาท)
                    </label>
                    <input
                      type="number"
                      value={newDailyLog.pricePerNight}
                      onChange={e => setNewDailyLog({ ...newDailyLog, pricePerNight: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      🏢 จำนวนห้องที่เข้าพัก
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newDailyLog.occupiedCount}
                      onChange={e => setNewDailyLog({ ...newDailyLog, occupiedCount: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      📝 หมายเหตุ
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น โอนเงิน / จองผ่าน LINE"
                      value={newDailyLog.note}
                      onChange={e => setNewDailyLog({ ...newDailyLog, note: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.3)'
                      }}
                    >
                      💾 บันทึกยอดรายได้
                    </button>
                  </div>
                </form>
              </div>

              {/* History Daily Income Table */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    📜 ประวัติบันทึกรายได้ห้องพักรายวันทั้งหมด
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#475569' }}>กรองตามวันที่:</span>
                    <input
                      type="date"
                      value={dailyFilterDate}
                      onChange={e => setDailyFilterDate(e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                    {dailyFilterDate && (
                      <button
                        onClick={() => setDailyFilterDate('')}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', backgroundColor: '#e2e8f0', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        แสดงทั้งหมด
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '12px' }}>วันที่</th>
                        <th style={{ padding: '12px' }}>ประเภทห้องพัก</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>ราคา/คืน</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>จำนวนห้อง</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>ยอดรวมรายได้ (บาท)</th>
                        <th style={{ padding: '12px' }}>หมายเหตุ</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(siteData.dailyIncomeLogs || [])
                        .filter(l => !dailyFilterDate || l.date === dailyFilterDate)
                        .map((log) => (
                          <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{log.date}</td>
                            <td style={{ padding: '12px', color: '#0f172a', fontWeight: '600' }}>{log.roomName}</td>
                            <td style={{ padding: '12px', textAlign: 'right', color: '#0284c7' }}>฿{log.pricePerNight.toLocaleString()}</td>
                            <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>{log.occupiedCount} ห้อง</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '800', color: '#0284c7', fontSize: '1rem' }}>
                              ฿{log.totalIncome.toLocaleString()}
                            </td>
                            <td style={{ padding: '12px', color: '#64748b', fontSize: '0.85rem' }}>{log.note || '-'}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteDailyIncomeLog(log.id)}
                                style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                🗑️ ลบ
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONTHLY TENANT MOVE-IN/OUT LOGS */}
          {activeTab === 'monthly-logs' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  📋 สรุปคนย้ายเข้า - ย้ายออก ห้องพักรายเดือน (Monthly Tenant Tracker)
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                  ติดตามและสรุปยอดจำนวนคนย้ายเข้า ย้ายออก และมัดจำรับ-คืนรายเดือน
                </p>
              </div>

              {/* Monthly Filter & Summary Metric Cards */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>📅 ประจำเดือน:</span>
                  <input
                    type="month"
                    value={monthlyFilterMonth}
                    onChange={e => setMonthlyFilterMonth(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 'bold' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ backgroundColor: '#f0fdf4', padding: '10px 18px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 'bold' }}>📥 ย้ายเข้าเดือนนี้</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#16a34a' }}>
                      {moveInCount} คน (มัดจำ ฿{moveInDepositTotal.toLocaleString()})
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fef2f2', padding: '10px 18px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                    <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 'bold' }}>📤 ย้ายออกเดือนนี้</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#dc2626' }}>
                      {moveOutCount} คน (คืนมัดจำ ฿{moveOutDepositTotal.toLocaleString()})
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#eff6ff', padding: '10px 18px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 'bold' }}>📈 สรุปผู้เช่าสุทธิ</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#2563eb' }}>
                      {moveInCount - moveOutCount >= 0 ? `+${moveInCount - moveOutCount}` : moveInCount - moveOutCount} คน
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Move-in / Move-out Log Form */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#16a34a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✍️</span> บันทึกรายการย้ายเข้า / ย้ายออก (Add Tenant Movement Log)
                </h3>
                <form onSubmit={handleAddMonthlyTenantLog} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      📅 วันที่ทำรายการ
                    </label>
                    <input
                      type="date"
                      value={newMonthlyLog.date}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, date: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      🔄 ประเภทรายการ
                    </label>
                    <select
                      value={newMonthlyLog.type}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, type: e.target.value as 'in' | 'out' })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 'bold' }}
                    >
                      <option value="in">📥 ย้ายเข้า (Move-in)</option>
                      <option value="out">📤 ย้ายออก (Move-out)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      🔑 หมายเลขห้อง (เช่น 307, 809)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น 307"
                      value={newMonthlyLog.roomNumber}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, roomNumber: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 'bold' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      🛏️ ประเภทห้องพัก
                    </label>
                    <select
                      value={newMonthlyLog.roomType}
                      onChange={e => {
                        const name = e.target.value;
                        const match = monthlyList.find(m => m.name === name);
                        const dep = match ? parseInt(String(match.deposit).replace(/,/g, '')) || 8000 : 8000;
                        setNewMonthlyLog({ ...newMonthlyLog, roomType: name, depositAmount: dep });
                      }}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    >
                      {monthlyList.map((m, i) => (
                        <option key={i} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      👤 ชื่อผู้เช่า / เบอร์โทร
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น คุณสมชาย ใจดี"
                      value={newMonthlyLog.tenantName}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, tenantName: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      💵 เงินมัดจำ (บาท)
                    </label>
                    <input
                      type="number"
                      value={newMonthlyLog.depositAmount}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, depositAmount: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      required
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.88rem', marginBottom: '6px', color: '#475569' }}>
                      📝 หมายเหตุรายละเอียด
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น สัญญา 1 ปี / หักค่าทำความสะอาด 500"
                      value={newMonthlyLog.note}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, note: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)'
                      }}
                    >
                      💾 บันทึกรายการย้ายเข้า/ออก
                    </button>
                  </div>
                </form>
              </div>

              {/* Monthly Tenant Movement Logs Table */}
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                  📜 ประวัติรายการคนย้ายเข้า - ย้ายออก ทั้งหมด
                </h3>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '12px' }}>วันที่</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>รายการ</th>
                        <th style={{ padding: '12px' }}>เลขห้อง</th>
                        <th style={{ padding: '12px' }}>ประเภทห้องพัก</th>
                        <th style={{ padding: '12px' }}>ชื่อผู้เช่า</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>เงินมัดจำ (บาท)</th>
                        <th style={{ padding: '12px' }}>หมายเหตุ</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(siteData.monthlyTenantLogs || [])
                        .filter(l => !monthlyFilterMonth || l.monthYear === monthlyFilterMonth || l.date.startsWith(monthlyFilterMonth))
                        .map((log) => (
                          <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{log.date}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                backgroundColor: log.type === 'in' ? '#dcfce7' : '#fee2e2',
                                color: log.type === 'in' ? '#15803d' : '#dc2626'
                              }}>
                                {log.type === 'in' ? '📥 ย้ายเข้า' : '📤 ย้ายออก'}
                              </span>
                            </td>
                            <td style={{ padding: '12px', fontWeight: '800', color: '#0f172a' }}>ห้อง {log.roomNumber}</td>
                            <td style={{ padding: '12px', color: '#475569' }}>{log.roomType}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{log.tenantName}</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: log.type === 'in' ? '#16a34a' : '#dc2626' }}>
                              ฿{log.depositAmount.toLocaleString()}
                            </td>
                            <td style={{ padding: '12px', color: '#64748b', fontSize: '0.85rem' }}>{log.note || '-'}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteMonthlyTenantLog(log.id)}
                                style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                🗑️ ลบ
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROOM MANAGEMENT */}
          {activeTab === 'rooms' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  🛏️ จัดการข้อมูลห้องพัก (Room Management)
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                  แก้ไขรูปภาพ รายละเอียด ราคา มัดจำ และสถานะห้องว่างของแต่ละประเภท
                </p>
              </div>

              {/* Sub-tab toggle: Daily vs Monthly */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                  onClick={() => { setRoomTab('daily'); setSelectedRoomIndex(0); }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: roomTab === 'daily' ? '#004088' : '#e2e8f0',
                    color: roomTab === 'daily' ? '#ffffff' : '#475569',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: roomTab === 'daily' ? '0 4px 6px -1px rgba(0,64,136,0.3)' : 'none'
                  }}
                >
                  ☀️ ห้องพักรายวัน ({siteData.dailyRooms?.length || 0})
                </button>
                <button
                  onClick={() => { setRoomTab('monthly'); setSelectedRoomIndex(0); }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: roomTab === 'monthly' ? '#2b6cb0' : '#e2e8f0',
                    color: roomTab === 'monthly' ? '#ffffff' : '#475569',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: roomTab === 'monthly' ? '0 4px 6px -1px rgba(43,108,176,0.3)' : 'none'
                  }}
                >
                  🏢 ห้องพักรายเดือน ({siteData.monthlyRooms?.length || 0})
                </button>
              </div>

              {/* Select Room Selector Dropdown */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>
                  เลือกประเภทห้องพักที่ต้องการแก้ไข:
                </label>
                <select
                  value={selectedRoomIndex}
                  onChange={(e) => setSelectedRoomIndex(Number(e.target.value))}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}
                >
                  {currentRoomsList.map((room: any, idx: number) => (
                    <option key={idx} value={idx}>
                      {idx + 1}. {room.name} — ราคา {room.price} บาท
                    </option>
                  ))}
                </select>
              </div>

              {/* Edit Room Form */}
              {editRoom && (
                <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#004088', marginBottom: '20px' }}>
                    ✏️ แก้ไขข้อมูล: {editRoom.name}
                  </h3>

                  {/* 1. Room Name */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>ชื่อประเภทห้องพัก</label>
                    <input
                      type="text"
                      value={editRoom.name || ''}
                      onChange={e => setEditRoom({ ...editRoom, name: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                    />
                  </div>

                  {/* 2. Room Image */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>🖼️ รูปภาพประจำห้องพัก</label>
                    {editRoom.image && (
                      <img
                        src={editRoom.image}
                        alt="Preview"
                        style={{ height: '140px', borderRadius: '8px', objectFit: 'cover', marginBottom: '10px', border: '1px solid #e2e8f0' }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'block', width: '100%', padding: '8px', border: '1px dashed #cbd5e0', borderRadius: '8px' }}
                    />
                  </div>

                  {/* 3. Description */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>คำอธิบายย่อ</label>
                    <textarea
                      value={editRoom.desc || ''}
                      onChange={e => setEditRoom({ ...editRoom, desc: e.target.value })}
                      rows={3}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                    />
                  </div>

                  {/* 4. Price & Deposit */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
                        ราคา ({roomTab === 'daily' ? 'บาท / คืน' : 'บาท / เดือน'})
                      </label>
                      <input
                        type="text"
                        value={editRoom.price || ''}
                        onChange={e => setEditRoom({ ...editRoom, price: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem', fontWeight: 'bold' }}
                      />
                    </div>
                    {roomTab === 'monthly' && (
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
                          ค่ามัดจำ (บาท)
                        </label>
                        <input
                          type="text"
                          value={editRoom.deposit || ''}
                          onChange={e => setEditRoom({ ...editRoom, deposit: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem', fontWeight: 'bold' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* 4.5. Room Availability Counters (for Daily Rooms) */}
                  {roomTab === 'daily' && (
                    <div style={{
                      backgroundColor: '#f0f9ff',
                      border: '1.5px solid #bae6fd',
                      borderRadius: '12px',
                      padding: '18px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ fontWeight: '800', color: '#0369a1', fontSize: '0.95rem', marginBottom: '12px' }}>
                        📊 จัดการสถานะและจำนวนห้องพักรายวัน (Room Availability)
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '0.9rem' }}>
                            🏢 จำนวนห้องทั้งหมด (Total)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editRoom.totalRooms !== undefined ? editRoom.totalRooms : 1}
                            onChange={e => setEditRoom({ ...editRoom, totalRooms: Math.max(1, parseInt(e.target.value) || 1) })}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem', fontWeight: 'bold' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '0.9rem', color: '#c53030' }}>
                            🔴 จำนวนห้องที่เต็มแล้ว (Occupied)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={editRoom.totalRooms || 99}
                            value={editRoom.occupiedRooms !== undefined ? editRoom.occupiedRooms : 0}
                            onChange={e => setEditRoom({ ...editRoom, occupiedRooms: Math.max(0, parseInt(e.target.value) || 0) })}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #feb2b2', backgroundColor: '#fff5f5', fontSize: '1rem', fontWeight: 'bold', color: '#c53030' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '0.9rem', color: '#276749' }}>
                            🟢 จำนวนห้องที่เหลือว่าง (Available)
                          </label>
                          <div style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#f0fff4',
                            border: '1px solid #9ae6b4',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: '#276749'
                          }}>
                            {Math.max(0, (editRoom.totalRooms !== undefined ? Number(editRoom.totalRooms) : 1) - (editRoom.occupiedRooms !== undefined ? Number(editRoom.occupiedRooms) : 0))} ห้อง
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4.6. Available Room Numbers List (for Monthly Rooms) */}
                  {roomTab === 'monthly' && (
                    <div style={{
                      backgroundColor: '#f0f9ff',
                      border: '1.5px solid #bae6fd',
                      borderRadius: '12px',
                      padding: '18px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ fontWeight: '800', color: '#0369a1', fontSize: '0.95rem', marginBottom: '8px' }}>
                        🔑 รายการเลขห้องพักที่ว่างปัจจุบัน (Monthly Available Room Numbers)
                      </div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '6px' }}>
                        ระบุหมายเลขห้องที่ว่าง (คั่นด้วยเครื่องหมายจุลภาค , เช่น: 208, 203, 605) หรือเว้นว่างหากห้องเต็มทุกห้อง
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น 307, 504 หรือปล่อยว่างหากเต็ม"
                        value={(editRoom.availableRoomsList || []).join(', ')}
                        onChange={e => {
                          const val = e.target.value;
                          const list = val.split(',').map(s => s.trim()).filter(Boolean);
                          setEditRoom({ ...editRoom, availableRoomsList: list });
                        }}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem', fontWeight: 'bold' }}
                      />
                      <div style={{ fontSize: '0.82rem', color: '#166534', marginTop: '8px', fontWeight: 'bold' }}>
                        {(editRoom.availableRoomsList && editRoom.availableRoomsList.length > 0)
                          ? `🟢 มีห้องว่างรวม ${editRoom.availableRoomsList.length} ห้อง: ${editRoom.availableRoomsList.join(', ')}`
                          : '🔴 ปัจจุบันแสดงเป็น: เต็มแล้ว (0 ห้องว่าง)'}
                      </div>
                    </div>
                  )}

                  {/* 5. Amenities / Features Checkboxes */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px' }}>
                      ✨ สิ่งอำนวยความสะดวก (Amenities)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
                      {availableFeatures.map((feat, idx) => {
                        const isChecked = (editRoom.features || []).includes(feat);
                        return (
                          <label
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              backgroundColor: isChecked ? '#e0f2fe' : '#f8fafc',
                              border: isChecked ? '1px solid #7dd3fc' : '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              cursor: 'pointer'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleFeature(feat)}
                            />
                            <span>{feat}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveRoom}
                    style={{
                      backgroundColor: '#004088',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      padding: '12px 28px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0, 64, 136, 0.3)'
                    }}
                  >
                    💾 บันทึกการเปลี่ยนแปลงห้องพัก
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HERO SECTION */}
          {activeTab === 'hero' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                🖼️ จัดการเนื้อหาหน้าแรก (Hero Section)
              </h2>
              <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>หัวข้อใหญ่ (Main Heading Title)</label>
                  <input
                    type="text"
                    value={siteData.heroTitle || ''}
                    onChange={e => setSiteData({ ...siteData, heroTitle: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>ข้อความบรรยายสั้น (Subheading)</label>
                  <input
                    type="text"
                    value={siteData.heroSubtitle || ''}
                    onChange={e => setSiteData({ ...siteData, heroSubtitle: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                  />
                </div>

                <button
                  onClick={handleSaveSettings}
                  style={{ backgroundColor: '#004088', color: '#ffffff', fontWeight: 'bold', padding: '12px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                  💾 บันทึกเนื้อหาหน้าแรก
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: RULES */}
          {activeTab === 'rules' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                📜 กฎระเบียบ & ขั้นตอนเช็คอิน-เช็คเอ้าท์
              </h2>
              <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '12px' }}>กฎระเบียบการพักอาศัย</h3>
                {(siteData.rulesList || []).map((rule, idx) => (
                  <div key={idx} style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={rule}
                      onChange={e => {
                        const updated = [...(siteData.rulesList || [])];
                        updated[idx] = e.target.value;
                        setSiteData({ ...siteData, rulesList: updated });
                      }}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                    />
                  </div>
                ))}

                <button
                  onClick={handleSaveSettings}
                  style={{ backgroundColor: '#004088', color: '#ffffff', fontWeight: 'bold', padding: '12px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '16px' }}
                >
                  💾 บันทึกกฎระเบียบ
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                ⚙️ ตั้งค่าข้อมูลการติดต่อและบัญชีธนาคาร (Settings)
              </h2>

              <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>📞 เบอร์โทรศัพท์ติดต่อ</label>
                    <input
                      type="text"
                      value={siteData.phoneVal || ''}
                      onChange={e => setSiteData({ ...siteData, phoneVal: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>💬 LINE Official ID</label>
                    <input
                      type="text"
                      value={siteData.lineId || ''}
                      onChange={e => setSiteData({ ...siteData, lineId: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>🏦 เลขที่บัญชีธนาคาร</label>
                    <input
                      type="text"
                      value={siteData.bankAccountVal || ''}
                      onChange={e => setSiteData({ ...siteData, bankAccountVal: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>🏛️ ธนาคาร</label>
                    <input
                      type="text"
                      value={siteData.bankNameVal || ''}
                      onChange={e => setSiteData({ ...siteData, bankNameVal: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>👤 ชื่อบัญชีธนาคาร</label>
                    <input
                      type="text"
                      value={siteData.bankAccountName || ''}
                      onChange={e => setSiteData({ ...siteData, bankAccountName: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                    />
                  </div>
                </div>


                <button
                  onClick={handleSaveSettings}
                  style={{ backgroundColor: '#004088', color: '#ffffff', fontWeight: 'bold', padding: '12px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                  💾 บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
