import React from 'react';
import { createPortal } from 'react-dom';

interface LeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaseModal: React.FC<LeaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="booking-modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '820px', maxHeight: '92vh' }}
      >
        {/* Header Bar */}
        <div className="booking-modal-header no-print">
          <div className="modal-header-brand">
            <span className="hotel-badge-pill">📄 @SAMUTSAKORN MAHACHAI BRANCH</span>
            <h3>สัญญาและกฎข้อระเบียบข้อบังคับในการเช่าหอพัก</h3>
          </div>
          <button className="modal-close-circle" onClick={onClose} title="ปิดหน้าต่าง">
            ✕
          </button>
        </div>

        {/* Modal Scrollable Document Body */}
        <div className="booking-modal-body" style={{ padding: '24px 28px', backgroundColor: '#ffffff' }}>
          
          {/* Printable Header Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #004088', paddingBottom: '16px' }}>
            <img src="/images/logo.png" alt="At Samutsakorn Logo" style={{ height: '70px', marginBottom: '8px' }} />
            <h2 style={{ color: '#004088', fontSize: '1.4rem', margin: '4px 0', fontWeight: 'bold' }}>
              สัญญาและกฎข้อระเบียบข้อบังคับในการเช่าหอพัก
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '600' }}>
              แอทสมุทรสาคร (สาขามหาชัย) • @SAMUTSAKORN MAHACHAI BRANCH
            </div>
          </div>

          {/* Section 1: Utility & Basic Rates */}
          <div className="contract-section" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#004088', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📌</span> <span>1. อัตราค่าเช่าและค่าบริการสาธารณูปโภค</span>
            </h4>
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.92rem', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>💧 ค่าน้ำประปา:</strong> หน่วยละ 35 บาท (ขั้นต่ำ 200 บาท/เดือน ไม่เกิน 5 หน่วย)</div>
                <div><strong>⚡ ค่าไฟฟ้า:</strong> หน่วยละ 9 บาท</div>
                <div><strong>🏢 ค่าส่วนกลาง:</strong> 200 บาท / เดือน</div>
                <div><strong>💳 ค่าซื้อคีย์การ์ดเข้าอาคาร:</strong> 100 บาท / ใบ</div>
                <div><strong>🔑 ค่าเปิดห้อง (กรณีลืมกุญแจ):</strong> 300 บาท / ครั้ง</div>
                <div><strong>🕒 กำหนดชำระเงิน:</strong> วันที่ 25 - 30 ของทุกเดือน</div>
              </div>
            </div>
          </div>

          {/* Section 2: Parking Rates & Rules */}
          <div className="contract-section" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#004088', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🛵</span> <span>2. อัตราค่าจอดรถยนต์ และรถมอเตอร์ไซค์</span>
            </h4>
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.92rem', lineHeight: '1.7' }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li><strong>รถมอเตอร์ไซค์คันเล็ก (จอดภายนอก):</strong> 100 บาท / เดือน</li>
                <li><strong>รถมอเตอร์ไซค์คันใหญ่ (จอดภายนอก):</strong> 200 บาท / เดือน</li>
                <li><strong>รถมอเตอร์ไซค์ (จอดภายในอาคาร):</strong> 300 บาท / เดือน (เช็คสิทธิ์ว่างก่อนจอด)</li>
                <li><strong>รถยนต์รายเดือน:</strong> ตามเรทลงทะเบียนระบุในสัญญา</li>
                <li><strong>ผู้มาติดต่อ/รถชั่วคราวไม่ได้ลงทะเบียน:</strong> รถยนต์ 100 บาท/ครั้ง | มอเตอร์ไซค์ 50 บาท/ครั้ง (โอนเงินชำระล่วงหน้า)</li>
                <li style={{ color: '#c53030', fontWeight: 'bold', marginTop: '4px' }}>
                  ⚠️ กรณีจอดโดยไม่แจ้งหรือมิได้ลงทะเบียน: ปรับ 2 เท่าของค่าจอด (ผู้เช่าที่ไม่ลงทะเบียนจอดปรับคันละ 1,000 บาท/ครั้ง)
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Payment Penalties & Late Rules */}
          <div className="contract-section" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#004088', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏱️</span> <span>3. เงื่อนไขการชำระเงิน และค่าปรับชำระล่าช้า</span>
            </h4>
            <div style={{ backgroundColor: '#fff5f5', padding: '16px', borderRadius: '10px', border: '1px solid #fed7d7', fontSize: '0.92rem', lineHeight: '1.7', color: '#9b2c2c' }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>ผู้เช่าต้องชำระค่าเช่า พร้อมค่าน้ำ-ค่าไฟ ภายในวันที่ 25 - 30 ของทุกเดือน</li>
                <li>กรณีชำระเกินวันที่ 3 ของเดือนถัดไป มีค่าปรับวันละ <strong>50 บาท</strong> โดยเริ่มนับตั้งแต่วันที่ 1 จนกว่าจะชำระเสร็จสิ้น</li>
                <li>หากไม่ชำระภายในวันที่ 3 หรือไม่ติดต่อภายใน 3 วัน ผู้เช่ายินยอมให้ตัดไฟฟ้า น้ำประปา และปิดล็อคห้องเช่าทันที และสัญญานี้ถือเป็นอันยกเลิก ยึดเงินประกัน</li>
              </ul>
            </div>
          </div>

          {/* Section 4: 10 Tenant Regulations */}
          <div className="contract-section" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#004088', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚫</span> <span>4. กฎระเบียบข้อบังคับ 10 ประการของการพักอาศัย</span>
            </h4>
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                <div>1. 🚭 <strong>ห้ามสูบบุหรี่</strong> ในอาคารหรือห้องพัก</div>
                <div>2. 🍺 <strong>ห้ามดื่มสุรา</strong> ในพื้นที่ส่วนกลาง</div>
                <div>3. 👊 <strong>ห้ามทะเลาะวิวาท</strong> หรือมั่วสุม</div>
                <div>4. 🤫 <strong>ห้ามส่งเสียงดัง</strong> รบกวนผู้อื่น</div>
                <div>5. 🥾 <strong>ห้ามถอดวางรองเท้า</strong> ไว้หน้าห้อง</div>
                <div>6. 🔥 <strong>ห้ามใช้เตาแก๊ส / ถังแก๊ส</strong> (ใช้ได้เฉพาะเตาไฟฟ้า)</div>
                <div>7. 🐕 <strong>ห้ามเลี้ยงสัตว์</strong> ทุกชนิด</div>
                <div>8. 🚽 <strong>ห้ามทิ้งสิ่งของ</strong> ลงชักโครก/ท่อระบายน้ำ</div>
                <div>9. 🔨 <strong>ห้ามเจาะผนัง ตอกตะปู ติดเทปกาว</strong> (ปรับจุดละ 500 บ.)</div>
                <div>10. 🚪 <strong>ห้ามเปิด-ปิดประตูเสียงดัง</strong></div>
              </div>
              <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#feebc8', color: '#744210', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'center' }}>
                ⚠️ การฝ่าฝืนกฎ: ครั้งที่ 1 เตือนด้วยวาจา | ครั้งที่ 2 ปรับครั้งละ 2,000 บาท / ครั้ง
              </div>
            </div>
          </div>

          {/* Section 5: Move-Out Rules */}
          <div className="contract-section" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#004088', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📦</span> <span>5. เงื่อนไขการครบสัญญาและการย้ายออก</span>
            </h4>
            <div style={{ backgroundColor: '#ebf8ff', padding: '16px', borderRadius: '10px', border: '1px solid #bee3f8', fontSize: '0.9rem', lineHeight: '1.7', color: '#2b6cb0' }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>สัญญาเช่าเริ่มต้นขั้นต่ำ <strong>1 ปี</strong> หากไม่ครบกำหนด จะไม่ได้รับคืนเงินประกัน</li>
                <li>เมื่อต้องการย้ายออก ต้องแจ้งล่วงหน้าไม่น้อยกว่า <strong>30 วัน</strong></li>
                <li>ต้องคืนลูกกุญแจ, รีโมทแอร์, คีย์การ์ด และส่งมอบห้องพักในสภาพเรียบร้อย</li>
                <li>ค่าล้างแอร์เมื่อย้ายออก: <strong>500 บาท</strong> / ครั้ง</li>
                <li>ค่าทำความสะอาดห้องพักเมื่อย้ายออก: <strong>500 บาท</strong> (หากสกปรกมาก 1,000 บาท)</li>
                <li>คืนเงินประกันห้องพักโดยการโอนเงินคืนไม่เกินเวลา <strong>12:00 น. (เที่ยงตรง) ของวันที่ย้ายออก</strong> หลังพนักงานตรวจสอบสภาพห้องเรียบร้อยไม่พบสิ่งของเสียหาย</li>
              </ul>
            </div>
          </div>

          {/* Section 6: Damage Fee Schedule Table */}
          <div className="contract-section" style={{ marginBottom: '10px' }}>
            <h4 style={{ color: '#004088', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span> <span>6. ตารางอัตราค่าชดเชยอุปกรณ์และทรัพย์สินชำรุดเสียหาย</span>
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#004088', color: '#ffffff' }}>
                    <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>รายการอุปกรณ์/ทรัพย์สิน</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1', width: '120px', textAlign: 'right' }}>ราคาชดเชย (บาท)</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>รายการอุปกรณ์/ทรัพย์สิน</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1', width: '120px', textAlign: 'right' }}>ราคาชดเชย (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>ค่าทำความสะอาด/ครั้ง</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>500 / 1,000</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>ลูกบิดประตูหน้าห้อง</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>1,500</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>ค่าทาสีใหม่/จุด</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>500</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>ลูกบิดประตูห้องน้ำ</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>1,000</td>
                  </tr>
                  <tr style={{ backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>ค่าล้างแอร์ (ย้ายออก)</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>500</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>คีย์การ์ดตัดไฟในห้อง</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>2,000</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>ดวงไฟ / โคมกลม LED</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>450</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>คีย์การ์ดประตูเข้าอาคาร</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>1,000</td>
                  </tr>
                  <tr style={{ backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>ฝารองชักโครก</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>500</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>รีโมทแอร์ / รีโมททีวี</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>800</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>เจาะผนัง / ติดเทป / สติกเกอร์</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>500 / จุด</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>เครื่องทำน้ำอุ่น</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>3,900</td>
                  </tr>
                  <tr style={{ backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>สายชำระ / ฝักบัว</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>400</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>เครื่องปรับอากาศ 13,000 BTU</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>13,500</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>อ่างล้างหน้า / กระจกเงา</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>1,000</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>สมาร์ททีวี 32 นิ้ว</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>4,500</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>เตียงนอน 5-6 ฟุต</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>5,000</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>ตู้เย็น LG 6.9Q</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>6,900</td>
                  </tr>
                  <tr style={{ backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>🔑 ค่าบริการเปิดห้อง (กรณีลืมกุญแจ)</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>300 / ครั้ง</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0' }}>-</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #e2e8f0', textAlign: 'right' }}>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#718096', fontStyle: 'italic', marginTop: '6px' }}>
              ** ค่าใช้จ่ายข้างต้นอาจมีการเปลี่ยนแปลง ขึ้นอยู่กับดุลยพินิจของผู้ดูแลหรือความเสียหายของทรัพย์สินนั้นๆ **
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="booking-modal-footer no-print">
          <button className="btn-modal-close" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
          <button className="btn-modal-outline" onClick={() => window.print()}>
            🖨️ พิมพ์สัญญา / บันทึก PDF
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
