import React, { useState, useEffect } from 'react';
import type { CustomSiteData, DailyIncomeLog, MonthlyTenantLog } from '../../services/adminStore';
import { supabase } from '../../services/supabaseClient';

interface AdminEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: 'hero' | 'rooms' | 'rules' | 'settings' | 'logs';
  siteData: CustomSiteData;
  onSaveSiteData: (newData: CustomSiteData, message?: string) => void;
  targetRoomIndex?: number | null;
  targetRoomType?: 'daily' | 'monthly';
}

export const AdminEditModal: React.FC<AdminEditModalProps> = ({
  isOpen,
  onClose,
  activeSection,
  siteData,
  onSaveSiteData,
  targetRoomIndex = null,
  targetRoomType = 'daily'
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'rooms' | 'rules' | 'settings' | 'logs'>(activeSection);
  const [localData, setLocalData] = useState<CustomSiteData>(siteData);

  // Rooms state
  const [selectedRoomTab, setSelectedRoomTab] = useState<'daily' | 'monthly'>(targetRoomType);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number>(targetRoomIndex !== null ? targetRoomIndex : 0);
  const [editRoom, setEditRoom] = useState<any>(null);

  // Daily Log state
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

  // Monthly Log state
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

  useEffect(() => {
    setActiveTab(activeSection);
  }, [activeSection]);

  useEffect(() => {
    setLocalData(siteData);
  }, [siteData]);

  useEffect(() => {
    if (targetRoomIndex !== null) {
      setSelectedRoomIdx(targetRoomIndex);
      setSelectedRoomTab(targetRoomType);
    }
  }, [targetRoomIndex, targetRoomType]);

  const currentRoomsList = selectedRoomTab === 'daily' ? (localData.dailyRooms || []) : (localData.monthlyRooms || []);

  useEffect(() => {
    if (currentRoomsList.length > 0) {
      const idx = Math.min(selectedRoomIdx, currentRoomsList.length - 1);
      setEditRoom(JSON.parse(JSON.stringify(currentRoomsList[idx])));
    } else {
      setEditRoom(null);
    }
  }, [selectedRoomTab, selectedRoomIdx, localData]);

  if (!isOpen) return null;

  const handleSaveGeneral = () => {
    onSaveSiteData(localData, 'บันทึกข้อมูลเรียบร้อยแล้ว!');
    onClose();
  };

  // Image Upload handler for Room
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editRoom) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditRoom({ ...editRoom, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && editRoom) {
      const newImages = Array.from(files);
      let currentImages = [...(editRoom.images || [])];
      
      let loadedCount = 0;
      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          currentImages.push(reader.result as string);
          loadedCount++;
          if (loadedCount === newImages.length) {
            setEditRoom({ ...editRoom, images: currentImages });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleToggleFeature = (feature: string) => {
    if (!editRoom) return;
    const currentFeatures: string[] = editRoom.features || [];
    if (currentFeatures.includes(feature)) {
      setEditRoom({ ...editRoom, features: currentFeatures.filter(f => f !== feature) });
    } else {
      setEditRoom({ ...editRoom, features: [...currentFeatures, feature] });
    }
  };

  const handleSaveRoom = async () => {
    if (!editRoom) return;
    const isDaily = selectedRoomTab === 'daily';
    const targetList = isDaily ? [...(localData.dailyRooms || [])] : [...(localData.monthlyRooms || [])];

    try {
      const roomPayload = {
        name: editRoom.name,
        description: editRoom.desc,
        price: editRoom.price,
        deposit: editRoom.deposit,
        image_url: editRoom.image,
        room_type: isDaily ? 'daily' : 'monthly',
        features: editRoom.features || [],
        gallery_images: editRoom.images || [],
        ...(isDaily ? {
          total_rooms: editRoom.totalRooms || 0,
          occupied_rooms: editRoom.occupiedRooms || 0
        } : {
          available_room_numbers: editRoom.availableRoomsList || []
        })
      };

      const roomId = isDaily ? editRoom.key : editRoom.id;
      const isNewRoom = String(roomId).startsWith('custom_') || typeof roomId === 'number';

      if (isNewRoom) {
        // Insert new room
        const { data, error } = await supabase.from('rooms').insert([roomPayload]).select();
        if (error) throw error;
        // update local id to real uuid
        if (data && data.length > 0) {
          if (isDaily) editRoom.key = data[0].id;
          else editRoom.id = data[0].id;
        }
      } else {
        // Update existing room
        const { error } = await supabase.from('rooms').update(roomPayload).eq('id', roomId);
        if (error) throw error;
      }

      if (selectedRoomIdx >= 0 && selectedRoomIdx < targetList.length) {
        targetList[selectedRoomIdx] = editRoom;
      } else {
        targetList.push(editRoom);
      }

      const updated = isDaily
        ? { ...localData, dailyRooms: targetList }
        : { ...localData, monthlyRooms: targetList };

      setLocalData(updated);
      onSaveSiteData(updated, `บันทึกข้อมูล ${editRoom.name || 'ห้องพัก'} สำเร็จแล้ว!`);
    } catch (err) {
      console.error('Error saving room:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลไปยังฐานข้อมูล');
    }
  };

  const handleAddNewRoom = () => {
    const isDaily = selectedRoomTab === 'daily';
    const newRoom = isDaily
      ? {
          key: `custom_${Date.now()}`,
          name: 'ห้องพักใหม่ (New Daily Room)',
          desc: 'รายละเอียดห้องพักใหม่...',
          price: '899',
          deposit: '500',
          totalRooms: 2,
          occupiedRooms: 0,
          features: ['❄️ เครื่องปรับอากาศ', '📶 ฟรี Wi-Fi', '🚿 ห้องน้ำในตัว'],
          image: '/images/single.png'
        }
      : {
          id: Date.now(),
          name: 'ประเภทห้องรายเดือนใหม่',
          desc: 'รายละเอียดห้องรายเดือน...',
          price: '4,500',
          deposit: '9,000',
          availableRoomsList: ['101', '102'],
          features: ['❄️ เครื่องปรับอากาศ', '🛋️ เฟอร์นิเจอร์', '📶 ฟรี Wi-Fi'],
          image: '/images/single.png'
        };

    const targetList = isDaily ? [...(localData.dailyRooms || []), newRoom] : [...(localData.monthlyRooms || []), newRoom];
    const updated = isDaily
      ? { ...localData, dailyRooms: targetList }
      : { ...localData, monthlyRooms: targetList };

    setLocalData(updated);
    setSelectedRoomIdx(targetList.length - 1);
    onSaveSiteData(updated, 'เพิ่มประเภทห้องใหม่เรียบร้อยแล้ว');
  };

  const handleDeleteRoom = async () => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประเภทห้องนี้?')) return;
    const isDaily = selectedRoomTab === 'daily';
    const targetList = isDaily ? [...(localData.dailyRooms || [])] : [...(localData.monthlyRooms || [])];
    const roomToDelete = targetList[selectedRoomIdx];

    try {
      const roomId = isDaily ? roomToDelete.key : roomToDelete.id;
      const isNewRoom = String(roomId).startsWith('custom_') || typeof roomId === 'number';

      if (!isNewRoom) {
        const { error } = await supabase.from('rooms').delete().eq('id', roomId);
        if (error) throw error;
      }

      targetList.splice(selectedRoomIdx, 1);
      const updated = isDaily
        ? { ...localData, dailyRooms: targetList }
        : { ...localData, monthlyRooms: targetList };

      setLocalData(updated);
      setSelectedRoomIdx(Math.max(0, selectedRoomIdx - 1));
      onSaveSiteData(updated, 'ลบห้องพักเรียบร้อยแล้ว');
    } catch (err) {
      console.error('Error deleting room:', err);
      alert('เกิดข้อผิดพลาดในการลบห้องพัก');
    }
  };

  // Add Daily Revenue Log
  const handleAddDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const totalIncome = newDailyLog.pricePerNight * newDailyLog.occupiedCount;
    const newLogItem: DailyIncomeLog = {
      id: `inc-${Date.now()}`,
      date: newDailyLog.date,
      roomName: newDailyLog.roomName,
      pricePerNight: newDailyLog.pricePerNight,
      occupiedCount: newDailyLog.occupiedCount,
      totalIncome,
      note: newDailyLog.note
    };

    const updatedLogs = [newLogItem, ...(localData.dailyIncomeLogs || [])];
    const updated = { ...localData, dailyIncomeLogs: updatedLogs };
    setLocalData(updated);
    onSaveSiteData(updated, `เพิ่มบันทึกรายได้ ฿${totalIncome.toLocaleString()} สำเร็จ!`);
    setNewDailyLog({ ...newDailyLog, note: '' });
  };

  const handleDeleteDailyLog = (id: string) => {
    if (!window.confirm('ต้องการลบบันทึกรายได้รายการนี้?')) return;
    const updatedLogs = (localData.dailyIncomeLogs || []).filter(l => l.id !== id);
    const updated = { ...localData, dailyIncomeLogs: updatedLogs };
    setLocalData(updated);
    onSaveSiteData(updated, 'ลบบันทึกรายได้สำเร็จแล้ว');
  };

  // Add Monthly Tenant Log
  const handleAddMonthlyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLogItem: MonthlyTenantLog = {
      id: `log-${Date.now()}`,
      date: newMonthlyLog.date,
      monthYear: newMonthlyLog.monthYear,
      type: newMonthlyLog.type,
      roomNumber: newMonthlyLog.roomNumber,
      roomType: newMonthlyLog.roomType,
      tenantName: newMonthlyLog.tenantName,
      depositAmount: newMonthlyLog.depositAmount,
      note: newMonthlyLog.note
    };

    const updatedLogs = [newLogItem, ...(localData.monthlyTenantLogs || [])];
    const updated = { ...localData, monthlyTenantLogs: updatedLogs };
    setLocalData(updated);
    onSaveSiteData(updated, `เพิ่มบันทึกผู้เช่า ${newMonthlyLog.tenantName} สำเร็จ!`);
    setNewMonthlyLog({ ...newMonthlyLog, roomNumber: '', tenantName: '', note: '' });
  };

  const handleDeleteMonthlyLog = (id: string) => {
    if (!window.confirm('ต้องการลบบันทึกรายการนี้?')) return;
    const updatedLogs = (localData.monthlyTenantLogs || []).filter(l => l.id !== id);
    const updated = { ...localData, monthlyTenantLogs: updatedLogs };
    setLocalData(updated);
    onSaveSiteData(updated, 'ลบบันทึกผู้เช่าสำเร็จแล้ว');
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-container" onClick={e => e.stopPropagation()}>
        {/* Header Tabs */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="modal-back-btn" onClick={onClose} title="ย้อนกลับ">
              ← ย้อนกลับ
            </button>
            <div className="admin-modal-title">
              <h3 style={{ margin: 0 }}>⚙️ แก้ไขข้อมูลเว็บไซต์ (Admin Quick Edit)</h3>
            </div>
          </div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="admin-modal-nav-tabs">
          <button
            className={`admin-modal-nav-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            ✏️ Hero & สโลแกน
          </button>
          <button
            className={`admin-modal-nav-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            🛏️ จัดการห้องพัก
          </button>
          <button
            className={`admin-modal-nav-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            📜 กฎระเบียบ
          </button>
          <button
            className={`admin-modal-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            📞 ติดต่อ / การเงิน
          </button>
          <button
            className={`admin-modal-nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📊 บันทึกรายได้ & ผู้เช่า
          </button>
        </div>

        <div className="admin-modal-body">
          {/* 1. HERO TAB */}
          {activeTab === 'hero' && (
            <div className="admin-edit-form">
              <h4>✏️ แก้ไขข้อความต้อนรับ (Hero Section)</h4>
              <div className="form-group">
                <label>หัวข้อต้อนรับหลัก (Welcome Title):</label>
                <input
                  type="text"
                  className="admin-input"
                  value={localData.heroTitle || ''}
                  onChange={e => setLocalData({ ...localData, heroTitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>คำอธิบายย่อย (Subheading / Slogan):</label>

                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={localData.heroSubtitle || ''}
                  onChange={e => setLocalData({ ...localData, heroSubtitle: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button className="btn btn-primary" onClick={handleSaveGeneral}>
                  💾 บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          )}

          {/* 2. ROOMS TAB */}
          {activeTab === 'rooms' && (
            <div className="admin-edit-rooms-panel">
              <div className="admin-subtabs">
                <button
                  className={`admin-subtab ${selectedRoomTab === 'daily' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedRoomTab('daily');
                    setSelectedRoomIdx(0);
                  }}
                >
                  🏨 ห้องพักรายวัน
                </button>
                <button
                  className={`admin-subtab ${selectedRoomTab === 'monthly' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedRoomTab('monthly');
                    setSelectedRoomIdx(0);
                  }}
                >
                  🏢 ห้องพักรายเดือน
                </button>
              </div>

              <div className="admin-rooms-editor-layout">
                {/* Room Selector List */}
                <div className="admin-room-list-sidebar">
                  <h5>เลือกห้องพักเพื่อแก้ไข:</h5>
                  {currentRoomsList.map((room: any, index: number) => (
                    <button
                      key={index}
                      className={`admin-room-list-item ${selectedRoomIdx === index ? 'active' : ''}`}
                      onClick={() => setSelectedRoomIdx(index)}
                    >
                      <span className="room-item-name">{room.name}</span>
                      <span className="room-item-price">฿{room.price}</span>
                    </button>
                  ))}
                  <button className="btn btn-outline admin-add-room-btn" onClick={handleAddNewRoom}>
                    ➕ เพิ่มประเภทห้องใหม่
                  </button>
                </div>

                {/* Edit Form for Selected Room */}
                {editRoom ? (
                  <div className="admin-room-form">
                    <div className="form-group">
                      <label>ชื่อห้องพัก:</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={editRoom.name || ''}
                        onChange={e => setEditRoom({ ...editRoom, name: e.target.value })}
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>ราคา (บาท/คืน หรือ บาท/เดือน):</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editRoom.price || ''}
                          onChange={e => setEditRoom({ ...editRoom, price: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>เงินมัดจำ (บาท):</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={editRoom.deposit || ''}
                          onChange={e => setEditRoom({ ...editRoom, deposit: e.target.value })}
                        />
                      </div>
                    </div>

                    {selectedRoomTab === 'daily' && (
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>จำนวนห้องทั้งหมด:</label>
                          <input
                            type="number"
                            className="admin-input"
                            min={1}
                            value={editRoom.totalRooms || 1}
                            onChange={e => setEditRoom({ ...editRoom, totalRooms: Number(e.target.value) })}
                          />
                        </div>
                        <div className="form-group">
                          <label>จำนวนห้องที่มีแขกพักอยู่ (Occupied):</label>
                          <input
                            type="number"
                            className="admin-input"
                            min={0}
                            max={editRoom.totalRooms || 10}
                            value={editRoom.occupiedRooms || 0}
                            onChange={e => setEditRoom({ ...editRoom, occupiedRooms: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                    )}

                    {selectedRoomTab === 'monthly' && (
                      <div className="form-group">
                        <label>เลขห้องว่าง (คั่นด้วยจุลภาค เช่น 201, 305, 410):</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={Array.isArray(editRoom.availableRoomsList) ? editRoom.availableRoomsList.join(', ') : ''}
                          onChange={e => setEditRoom({
                            ...editRoom,
                            availableRoomsList: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })}
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label>คำอธิบายห้องพัก:</label>
                      <textarea
                        className="admin-textarea"
                        rows={2}
                        value={editRoom.desc || ''}
                        onChange={e => setEditRoom({ ...editRoom, desc: e.target.value })}
                      />
                    </div>

                    {/* Image URL / Uploader */}
                    <div className="form-group">
                      <label>รูปภาพห้องพัก:</label>
                      <div className="image-edit-container">
                        {editRoom.image && (
                          <img src={editRoom.image} alt="Preview" className="admin-room-img-preview" />
                        )}
                        <div className="image-input-group">
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="URL รูปภาพ (เช่น /images/single.png)"
                            value={editRoom.image || ''}
                            onChange={e => setEditRoom({ ...editRoom, image: e.target.value })}
                          />
                          <label className="btn btn-outline file-upload-label">
                            📁 อัปโหลดรูปภาพ
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Gallery Images (Multiple) */}
                    <div className="form-group">
                      <label>รูปภาพแกลเลอรี่ในหน้าต่างรายละเอียด:</label>
                      <div className="image-edit-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                        {(editRoom.images || []).map((imgUrl: string, idx: number) => (
                          <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                            <img src={imgUrl} alt={`gallery-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                            <button
                              type="button"
                              onClick={() => {
                                const newArr = [...editRoom.images];
                                newArr.splice(idx, 1);
                                setEditRoom({ ...editRoom, images: newArr });
                              }}
                              style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                            >×</button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="image-input-group" style={{ marginTop: '12px' }}>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="วาง URL รูปภาพที่นี่ แล้วกดเพิ่ม"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                setEditRoom({ ...editRoom, images: [...(editRoom.images || []), val] });
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                        <label className="btn btn-outline file-upload-label" style={{ whiteSpace: 'nowrap' }}>
                          📁 อัปโหลดรูปภาพ
                          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
                        </label>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>* ใส่ลิงก์รูปภาพแล้วกด Enter หรือกดอัปโหลดรูปภาพจากเครื่อง</span>
                    </div>

                    {/* Features Toggle */}
                    <div className="form-group">
                      <label>สิ่งอำนวยความสะดวก (คลิกเพื่อเปิด/ปิด):</label>
                      <div className="feature-badges-selector">
                        {[
                          '❄️ เครื่องปรับอากาศ',
                          '🌀 พัดลม',
                          '📺 ทีวีดิจิตอล',
                          '🛏️ เตียงนอน 5 ฟุต',
                          '🛏️ เตียงคู่',
                          '🛋️ เฟอร์นิเจอร์ครบชุด',
                          '📶 ฟรี Wi-Fi',
                          '🚿 เครื่องทำน้ำอุ่น',
                          '🌅 มีระเบียง',
                          '🚪 2 ห้องเชื่อมกัน'
                        ].map((feat, fIdx) => {
                          const isSelected = (editRoom.features || []).includes(feat);
                          return (
                            <button
                              key={fIdx}
                              type="button"
                              className={`feature-chip ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleToggleFeature(feat)}
                            >
                              {feat} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="admin-modal-actions-between">
                      <button className="btn btn-danger" onClick={handleDeleteRoom}>
                        🗑️ ลบประเภทห้องนี้
                      </button>
                      <button className="btn btn-primary" onClick={handleSaveRoom}>
                        💾 บันทึกข้อมูลห้องพักนี้
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>ไม่มีข้อมูลห้องพักที่เลือก</div>
                )}
              </div>
            </div>
          )}

          {/* 3. RULES TAB */}
          {activeTab === 'rules' && (
            <div className="admin-edit-form">
              <h4>📜 แก้ไขกฎระเบียบ & ประกาศของหอพัก</h4>
              
              <div className="form-group">
                <label>ข้อระเบียบปฏิบัติ (บรรทัดละ 1 ข้อ):</label>
                <textarea
                  className="admin-textarea"
                  rows={8}
                  value={Array.isArray(localData.rulesList) ? localData.rulesList.join('\n') : ''}
                  onChange={e => setLocalData({
                    ...localData,
                    rulesList: e.target.value.split('\n').filter(line => line.trim() !== '')
                  })}
                />
              </div>

              <div className="form-group">
                <label>ข้อความเตือน / หมายเหตุสั้น (Rules Notice):</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={localData.rulesNotice || ''}
                  onChange={e => setLocalData({ ...localData, rulesNotice: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button className="btn btn-primary" onClick={handleSaveGeneral}>
                  💾 บันทึกกฎระเบียบ
                </button>
              </div>
            </div>
          )}

          {/* 4. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="admin-edit-form">
              <h4>📞 แก้ไขข้อมูลติดต่อ & บัญชีชำระเงิน</h4>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>เบอร์โทรศัพท์ติดต่อ:</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localData.phoneVal || ''}
                    onChange={e => setLocalData({ ...localData, phoneVal: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Line ID / เบอร์ Line Official:</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localData.lineId || ''}
                    onChange={e => setLocalData({ ...localData, lineId: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>ลิงก์ Facebook Page:</label>
                <input
                  type="text"
                  className="admin-input"
                  value={localData.facebookUrl || ''}
                  onChange={e => setLocalData({ ...localData, facebookUrl: e.target.value })}
                />
              </div>

              <hr className="admin-divider" />

              <h4>💳 ข้อมูลบัญชีธนาคาร (PromptPay)</h4>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>ธนาคาร:</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localData.bankNameVal || ''}
                    onChange={e => setLocalData({ ...localData, bankNameVal: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>เลขที่บัญชี / เบอร์พร้อมเพย์:</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localData.bankAccountVal || ''}
                    onChange={e => setLocalData({ ...localData, bankAccountVal: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>ชื่อบัญชี:</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localData.bankAccountName || ''}
                    onChange={e => setLocalData({ ...localData, bankAccountName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>รหัสผ่าน Wi-Fi:</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localData.wifiPass || ''}
                    onChange={e => setLocalData({ ...localData, wifiPass: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button className="btn btn-primary" onClick={handleSaveGeneral}>
                  💾 บันทึกข้อมูลการติดต่อ & การเงิน
                </button>
              </div>
            </div>
          )}

          {/* 5. LOGS TAB (Revenue & Tenants) */}
          {activeTab === 'logs' && (
            <div className="admin-logs-management">
              <h4>📊 บันทึกรายได้รายวัน & ประวัติผู้เช่ารายเดือน</h4>

              {/* Daily Income Section */}
              <div className="admin-logs-card">
                <h5>💰 บันทึกรายได้รายวัน (Daily Revenue Log)</h5>
                <form onSubmit={handleAddDailyLog} className="form-grid-3">
                  <div className="form-group">
                    <label>วันที่:</label>
                    <input
                      type="date"
                      className="admin-input"
                      value={newDailyLog.date}
                      onChange={e => setNewDailyLog({ ...newDailyLog, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ประเภทห้อง:</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newDailyLog.roomName}
                      onChange={e => setNewDailyLog({ ...newDailyLog, roomName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ราคา/คืน (บาท):</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={newDailyLog.pricePerNight}
                      onChange={e => setNewDailyLog({ ...newDailyLog, pricePerNight: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>จำนวนห้องที่เข้าพัก:</label>
                    <input
                      type="number"
                      className="admin-input"
                      min={1}
                      value={newDailyLog.occupiedCount}
                      onChange={e => setNewDailyLog({ ...newDailyLog, occupiedCount: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>หมายเหตุ:</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="เช่น เข้าพัก 1 คืน"
                      value={newDailyLog.note}
                      onChange={e => setNewDailyLog({ ...newDailyLog, note: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      ➕ บันทึกรายได้
                    </button>
                  </div>
                </form>

                {/* Table of Daily Income */}
                <div className="table-responsive" style={{ marginTop: '16px' }}>
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>วันที่</th>
                        <th>ห้องพัก</th>
                        <th>ราคา/คืน</th>
                        <th>จำนวน</th>
                        <th>รวม (บาท)</th>
                        <th>หมายเหตุ</th>
                        <th>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(localData.dailyIncomeLogs || []).length > 0 ? (
                        (localData.dailyIncomeLogs || []).map(log => (
                          <tr key={log.id}>
                            <td>{log.date}</td>
                            <td>{log.roomName}</td>
                            <td>฿{log.pricePerNight.toLocaleString()}</td>
                            <td>{log.occupiedCount}</td>
                            <td><strong>฿{log.totalIncome.toLocaleString()}</strong></td>
                            <td>{log.note || '-'}</td>
                            <td>
                              <button className="btn-sm btn-danger" onClick={() => handleDeleteDailyLog(log.id)}>
                                ลบ
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center' }}>ไม่มีข้อมูลรายได้</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Tenant Movement Section */}
              <div className="admin-logs-card" style={{ marginTop: '24px' }}>
                <h5>🏢 บันทึกการย้ายเข้า-ออก ผู้เช่ารายเดือน (Monthly Tenant Movement)</h5>
                <form onSubmit={handleAddMonthlyLog} className="form-grid-3">
                  <div className="form-group">
                    <label>วันที่:</label>
                    <input
                      type="date"
                      className="admin-input"
                      value={newMonthlyLog.date}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>รายการ:</label>
                    <select
                      className="admin-input"
                      value={newMonthlyLog.type}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, type: e.target.value as 'in' | 'out' })}
                    >
                      <option value="in">📥 ย้ายเข้า (Move In)</option>
                      <option value="out">📤 ย้ายออก (Move Out)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>เลขห้อง:</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="เช่น 307"
                      value={newMonthlyLog.roomNumber}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, roomNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ชื่อผู้เช่า:</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="เช่น คุณสมชาย"
                      value={newMonthlyLog.tenantName}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, tenantName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>เงินมัดจำ (บาท):</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={newMonthlyLog.depositAmount}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, depositAmount: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>หมายเหตุ:</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="เช่น สัญญา 1 ปี"
                      value={newMonthlyLog.note}
                      onChange={e => setNewMonthlyLog({ ...newMonthlyLog, note: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary">
                      ➕ บันทึกข้อมูลผู้เช่า
                    </button>
                  </div>
                </form>

                {/* Table of Monthly Tenant Logs */}
                <div className="table-responsive" style={{ marginTop: '16px' }}>
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>วันที่</th>
                        <th>ประเภท</th>
                        <th>เลขห้อง</th>
                        <th>ชื่อผู้เช่า</th>
                        <th>มัดจำ (บาท)</th>
                        <th>หมายเหตุ</th>
                        <th>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(localData.monthlyTenantLogs || []).length > 0 ? (
                        (localData.monthlyTenantLogs || []).map(log => (
                          <tr key={log.id}>
                            <td>{log.date}</td>
                            <td>
                              <span className={`badge-type ${log.type}`}>
                                {log.type === 'in' ? '📥 ย้ายเข้า' : '📤 ย้ายออก'}
                              </span>
                            </td>
                            <td><strong>{log.roomNumber}</strong></td>
                            <td>{log.tenantName}</td>
                            <td>฿{log.depositAmount.toLocaleString()}</td>
                            <td>{log.note || '-'}</td>
                            <td>
                              <button className="btn-sm btn-danger" onClick={() => handleDeleteMonthlyLog(log.id)}>
                                ลบ
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center' }}>ไม่มีข้อมูลผู้เช่า</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
