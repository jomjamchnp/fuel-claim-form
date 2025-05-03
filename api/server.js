require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));  // เอาไว้ serve index.html ในโฟลเดอร์ public

// สร้าง Google Sheets client
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
console.log(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT));
const sheets = google.sheets({ version: 'v4', auth });
app.post('/api/submit', async (req, res) => {
  try {
    const data = req.body;

    // Append row to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'ฟอร์ม!A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString(),
          data.date,
          data.name,
          data.car_no,
          `'${data.phone}`,
          data.barcode,
          data.route,
          data.standby_round,
          data.standby_time,
          data.departure_time,
          data.note,
          data.trip_fee,
          data.oil_claim,
          data.bank,
          data.bank_name,
          data.bank_no
        ]]
      }
    });

    // ส่งข้อความเข้า LINE
    const message = `
🚛 แจ้งเบิกน้ำมัน 🚛
วันที่: ${data.date}
ชื่อ🙋: ${data.name}
ทะเบียนรถ🚛: ${data.car_no}
เบอร์โทร: ${data.phone}
เลขบาร์: ${data.barcode}
เส้นทาง: ${data.route}
รอบเวลาสแตนบาย: ${data.standby_round}
เวลาสแตนบาย: ${data.standby_time}
ออกเดินทาง: ${data.departure_time}
หมายเหตุ: ${data.note}
💸 ค่าเที่ยว: ${data.trip_fee} บาท
💸 เบิกน้ำมัน: ${data.oil_claim} บาท
🏦 บัญชี: ${data.bank}
👤 ชื่อบัญชี: ${data.bank_name}
🔢 เลขบัญชี: ${data.bank_no}
`;

    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: process.env.LINE_GROUP_ID,
      messages: [{
        type: 'text',
        text: message
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_TOKEN}`
      }
    });

    res.json({ message: 'ส่งข้อมูลเรียบร้อยแล้ว!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการส่งข้อมูล' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));