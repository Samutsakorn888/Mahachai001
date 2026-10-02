import React, { useState } from 'react';
import type { Language, Translations } from '../i18n/translations';
import { loadSiteData } from '../services/adminStore';

interface UtilityCalculatorProps {
  t: Translations;
  language?: Language;
}

export const UtilityCalculator: React.FC<UtilityCalculatorProps> = ({ t, language = 'th' }) => {
  const siteData = loadSiteData();
  const monthlyRooms = (siteData.monthlyRooms && siteData.monthlyRooms.length > 0)
    ? siteData.monthlyRooms
    : t.monthlyRooms;

  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);
  const [elecUnits, setElecUnits] = useState<number>(100);
  const [waterUnits, setWaterUnits] = useState<number>(5);
  const [hasCar, setHasCar] = useState<boolean>(false);
  const [hasMoto, setHasMoto] = useState<boolean>(false);
  const [isShortTerm, setIsShortTerm] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedRoom = monthlyRooms[selectedRoomIndex] || monthlyRooms[0];

  const getRoomName = (index: number): string => {
    if (language !== 'th' && t.monthlyRooms && t.monthlyRooms[index]?.name) {
      return t.monthlyRooms[index].name;
    }
    return monthlyRooms[index]?.name || '';
  };

  const currentRoomName = getRoomName(selectedRoomIndex) || selectedRoom.name;

  // Helper to extract base price number from string like "3,100 - 3,400" or "3,900"
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 3500;
    const clean = priceStr.replace(/,/g, '');
    const matches = clean.match(/\d+/g);
    if (!matches || matches.length === 0) return 3500;
    return parseInt(matches[0], 10);
  };

  const parseDeposit = (depositStr: string): number => {
    if (!depositStr) return 8000;
    const clean = depositStr.replace(/,/g, '');
    const matches = clean.match(/\d+/g);
    if (!matches || matches.length === 0) return 8000;
    return parseInt(matches[0], 10);
  };

  const baseRoomPrice = parsePrice(selectedRoom.price);
  const roomDeposit = parseDeposit(selectedRoom.deposit);
  const shortTermFee = isShortTerm ? 1000 : 0;

  // Electricity calculation: 9 THB per unit
  const elecCost = elecUnits * 9;

  // Water calculation: First 1-5 units = 200 THB, each additional unit = 35 THB
  const waterCost = waterUnits <= 5 ? 200 : 200 + (waterUnits - 5) * 35;

  // Fixed maintenance fee
  const maintenanceCost = 200;

  // Parking costs
  const carCost = hasCar ? 1000 : 0;
  const motoCost = hasMoto ? 100 : 0;

  // Total monthly estimated expense
  const totalMonthlyCost = baseRoomPrice + shortTermFee + elecCost + waterCost + maintenanceCost + carCost + motoCost;
  const initialMoveIn = totalMonthlyCost + roomDeposit;

  const unitLabel = t.calcUnitsBadge || 'หน่วย';
  const thb = t.thbUnit || 'บาท';
  const pm = t.perMonth || 'บาท/เดือน';

  const handleCopySummary = async () => {
    const summaryText = `[${t.calculatorTitle || 'สรุปประมาณการค่าใช้จ่ายรายเดือน @สมุทรสาคร มหาชัย'}]
------------------------------------------------
${t.calcRoomTypeLabel || 'ประเภทห้อง'}: ${currentRoomName}
${isShortTerm ? `📝 ระยะเวลาสัญญา: น้อยกว่า 12 เดือน\n` : `📝 ระยะเวลาสัญญา: 12 เดือนขึ้นไป\n`}💰 ${t.calcRentBreakdown || 'ค่าเช่าห้องพัก'}: ${baseRoomPrice.toLocaleString()} ${pm}
${isShortTerm ? `➕ ค่าบริการสัญญาระยะสั้น: 1,000 ${pm}\n` : ''}${t.calcElecBreakdown || 'ค่าไฟฟ้าประมาณ'}: (${elecUnits} ${unitLabel} @ 9 ${thb}) = ${elecCost.toLocaleString()} ${thb}
${t.calcWaterBreakdown || 'ค่าน้ำประปาประมาณ'}: (${waterUnits} ${unitLabel}) = ${waterCost.toLocaleString()} ${thb}
${t.calcCommonFeeBreakdown || 'ค่าส่วนกลาง'}: ${maintenanceCost.toLocaleString()} ${thb}
${t.calcCarBreakdown || 'ค่าจอดรถยนต์'}: ${carCost > 0 ? '1,000' : '0'} ${thb}
${t.calcMotoBreakdown || 'ค่าจอดรถมอเตอร์ไซค์'}: ${motoCost > 0 ? '100' : '0'} ${thb}
------------------------------------------------
${t.calcTotalMonthly || 'ยอดรวมประมาณการรายเดือน'}: ${totalMonthlyCost.toLocaleString()} ${pm}
🔐 ${t.calcMoveInDeposit || 'เงินประกันมัดจำแรกเข้า'}: ${roomDeposit.toLocaleString()} ${thb}
💵 ${t.calcTotalMoveIn || 'รวมงบแรกเข้าพักสุทธิ'}: ${initialMoveIn.toLocaleString()} ${thb}
------------------------------------------------
LINE ID: 0990954541`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setToastMessage(t.calcCopiedToast || 'คัดลอกสรุปรายการคำนวณเรียบร้อยแล้ว!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.error('Failed to copy calculator summary:', e);
    }
  };

  return (
    <section className="section calculator-section">
      <div className="container">
        <div className="calculator-card">
          <div className="calculator-header">
            <h2 className="calculator-title">
              🧮 {t.calculatorTitle || 'เครื่องมือคำนวณค่าใช้จ่ายรายเดือนสุทธิ'}
            </h2>
            <p className="calculator-subtitle">
              {t.calculatorSubtitle || 'ประเมินค่าใช้จ่ายประจำเดือน (ค่าเช่า + ค่าน้ำ + ค่าไฟ + ค่าบริการ) ได้ทันทีแบบเรียลไทม์'}
            </p>
          </div>

          <div className="calculator-body">
            {/* Input Controls */}
            <div className="calculator-inputs">
              <div className="calc-group">
                <label className="calc-label">
                  {t.calcRoomTypeLabel || 'เลือกรูปแบบห้องพักรายเดือน'}
                </label>
                <select
                  className="calc-select"
                  value={selectedRoomIndex}
                  onChange={(e) => setSelectedRoomIndex(Number(e.target.value))}
                >
                  {monthlyRooms.map((room: any, index: number) => (
                    <option key={index} value={index}>
                      {getRoomName(index)} ({room.price} {pm})
                    </option>
                  ))}
                </select>
              </div>

              <div className="calc-group">
                <label className="calc-label">ระยะเวลาสัญญา (Contract Duration)</label>
                <div className="calc-checkbox-grid">
                  <label className={`calc-checkbox-card ${!isShortTerm ? 'active' : ''}`}>
                    <input
                      type="radio"
                      checked={!isShortTerm}
                      onChange={() => setIsShortTerm(false)}
                    />
                    <span>12 เดือนขึ้นไป (ราคาปกติ)</span>
                  </label>
                  <label className={`calc-checkbox-card ${isShortTerm ? 'active' : ''}`}>
                    <input
                      type="radio"
                      checked={isShortTerm}
                      onChange={() => setIsShortTerm(true)}
                    />
                    <span>น้อยกว่า 12 เดือน (+1,000 บาท/เดือน)</span>
                  </label>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-label-row">
                  <label className="calc-label">
                    {t.calcElecLabel || 'ประมาณการหน่วยไฟฟ้าที่ใช้ (หน่วยละ 9 บาท)'}
                  </label>
                  <span className="calc-val-badge">{elecUnits} {unitLabel}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="5"
                  value={elecUnits}
                  onChange={(e) => setElecUnits(Number(e.target.value))}
                  className="calc-slider"
                />
                <div className="calc-range-labels">
                  <span>{t.calcEco || '0 (ประหยัด)'}</span>
                  <span>{t.calcAvg || '100 (เฉลี่ย)'}</span>
                  <span>{t.calcAirconOften || '250 (เปิดแอร์บ่อย)'}</span>
                  <span>{t.calcHighUsage || '400 (ใช้มาก)'}</span>
                </div>
              </div>

              <div className="calc-group">
                <div className="calc-label-row">
                  <label className="calc-label">
                    {t.calcWaterLabel || 'ประมาณการหน่วยน้ำประปาที่ใช้'}
                  </label>
                  <span className="calc-val-badge">{waterUnits} {unitLabel}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={waterUnits}
                  onChange={(e) => setWaterUnits(Number(e.target.value))}
                  className="calc-slider"
                />
                <div className="calc-range-labels">
                  <span>{t.calcWaterRangeMin || '1-5 หน่วย (ขั้นต่ำ 200บ.)'}</span>
                  <span>{t.calcWaterRangeMid || '15 หน่วย'}</span>
                  <span>{t.calcWaterRangeMax || '30 หน่วย'}</span>
                </div>
              </div>

              <div className="calc-group">
                <label className="calc-label">{t.calcParkingTitle || '🅿️ บริการที่จอดรถเพิ่มเติม'}</label>
                <div className="calc-checkbox-grid">
                  <label className={`calc-checkbox-card ${hasCar ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={hasCar}
                      onChange={(e) => setHasCar(e.target.checked)}
                    />
                    <span>{t.calcCarLabel || 'จอดรถยนต์ (1,000 บาท/เดือน)'}</span>
                  </label>
                  <label className={`calc-checkbox-card ${hasMoto ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={hasMoto}
                      onChange={(e) => setHasMoto(e.target.checked)}
                    />
                    <span>{t.calcMotoLabel || 'จอดมอเตอร์ไซค์ (100 บาท/เดือน)'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Output Box */}
            <div className="calculator-results">
              <h3 className="results-title">{t.calcSummaryTitle || 'สรุปรายการคำนวณประเมินผล'}</h3>
              
              <div className="results-breakdown">
                <div className="breakdown-item">
                  <span>{t.calcRentBreakdown || 'ค่าเช่าห้องพัก'} ({currentRoomName})</span>
                  <span>{baseRoomPrice.toLocaleString()} {thb}</span>
                </div>
                {isShortTerm && (
                  <div className="breakdown-item">
                    <span style={{ color: '#dc2626' }}>ค่าบริการสัญญาระยะสั้น (&lt; 12 เดือน)</span>
                    <span style={{ color: '#dc2626' }}>1,000 {thb}</span>
                  </div>
                )}
                <div className="breakdown-item">
                  <span>{t.calcElecBreakdown || 'ค่าไฟฟ้าประมาณการ'} ({elecUnits} {unitLabel})</span>
                  <span>{elecCost.toLocaleString()} {thb}</span>
                </div>
                <div className="breakdown-item">
                  <span>{t.calcWaterBreakdown || 'ค่าน้ำประปาประมาณการ'} ({waterUnits} {unitLabel})</span>
                  <span>{waterCost.toLocaleString()} {thb}</span>
                </div>
                <div className="breakdown-item">
                  <span>{t.calcCommonFeeBreakdown || 'ค่าส่วนกลางอาคาร'}</span>
                  <span>{maintenanceCost.toLocaleString()} {thb}</span>
                </div>
                {hasCar && (
                  <div className="breakdown-item">
                    <span>{t.calcCarBreakdown || 'ค่าจอดรถยนต์'}</span>
                    <span>1,000 {thb}</span>
                  </div>
                )}
                {hasMoto && (
                  <div className="breakdown-item">
                    <span>{t.calcMotoBreakdown || 'ค่าจอดรถมอเตอร์ไซค์'}</span>
                    <span>100 {thb}</span>
                  </div>
                )}
              </div>

              <div className="results-total-box">
                <div className="total-row">
                  <span className="total-label">
                    {t.calcTotalMonthly || 'ยอดรวมค่าใช้จ่ายประเมินรายเดือน'}
                  </span>
                  <span className="total-amount">{totalMonthlyCost.toLocaleString()} <span>{pm}</span></span>
                </div>

                <div className="deposit-row">
                  <span>{t.calcMoveInDeposit || 'เงินมัดจำแรกเข้าพัก'}</span>
                  <strong>{roomDeposit.toLocaleString()} {thb}</strong>
                </div>

                <div className="movein-total-row">
                  <span>{t.calcTotalMoveIn || 'งบรวมแรกเข้าพัก (มัดจำ + เดือนแรก)'}</span>
                  <strong>{initialMoveIn.toLocaleString()} {thb}</strong>
                </div>
              </div>

              <button className="btn btn-copy-calc" onClick={handleCopySummary}>
                {t.calcCopySummary || 'คัดลอกสรุปรายการคำนวณ'}
              </button>

              {toastMessage && <div className="calc-toast">{toastMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
