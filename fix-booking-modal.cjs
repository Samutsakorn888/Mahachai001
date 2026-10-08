const fs = require('fs');
let code = fs.readFileSync('src/components/RoomTypes/BookingModal.tsx', 'utf8');

// Replace specific string patterns
code = code.replace(/฿(\{effectivePriceNum.toLocaleString\(\)\})/g, '$1 บาท');
code = code.replace(/฿(\{roomObj.price\})/g, '$1 บาท');
code = code.replace(/\(฿100\)/g, '(100 บาท)');
code = code.replace(/\(฿200\)/g, '(200 บาท)');
code = code.replace(/\(฿300\)/g, '(300 บาท)');
code = code.replace(/฿(\{grandTotalCalc.toLocaleString\(\)\}) บาท/g, '$1 บาท');
code = code.replace(/฿(\{grandTotalCalc.toLocaleString\(\)\})/g, '$1 บาท');
code = code.replace(/รวม ฿(\{totalDeposit.toLocaleString\(\)\}) บาท/g, 'รวม $1 บาท');
code = code.replace(/฿(\{basePriceNum.toLocaleString\(\)\})/g, '$1 บาท');
code = code.replace(/฿\$\{itemRoomTotal.toLocaleString\(\)\}/g, '${itemRoomTotal.toLocaleString()} บาท');
code = code.replace(/฿(\{totalRoomsCount > 0 \? \(totalDeposit \/ totalRoomsCount\).toLocaleString\(\) : '0'\})/g, '$1 บาท');
code = code.replace(/฿(\{effectiveDepositToPay.toLocaleString\(\)\})/g, '$1 บาท');
code = code.replace(/>฿100</g, '>100 บาท<');
code = code.replace(/฿(\{totalKeycardFee.toLocaleString\(\)\})/g, '$1 บาท');
code = code.replace(/ชำระ ฿(\{totalDeposit.toLocaleString\(\)\})/g, 'ชำระ $1 บาท');
code = code.replace(/฿\$\{totalDeposit.toLocaleString\(\)\}/g, '${totalDeposit.toLocaleString()} บาท');
code = code.replace(/฿\$\{totalKeycardFee.toLocaleString\(\)\}/g, '${totalKeycardFee.toLocaleString()} บาท');
code = code.replace(/฿(\{\(totalDeposit - customDeposit\).toLocaleString\(\)\})/g, '$1 บาท');

fs.writeFileSync('src/components/RoomTypes/BookingModal.tsx', code);
