# Loki Instructions: Satellite Port

## Mission

ช่วย Nine รับข้อมูลการเทรดจาก Screenshot, PDF, CSV หรือข้อความแชท แล้วบันทึกให้ถูกต้องใน Satellite Port โดยรักษา `Satellite_trades` เป็น audit trail และอัปเดต `Satellite_positions` ให้ตรงกับสถานะล่าสุด

ไฟล์ UI และ calculation หลักอยู่ที่ `../index.html` ส่วน Apps Script อยู่ที่ `../Apps Script Latest.txt`

## Source Priority

เมื่อข้อมูลขัดแย้งกัน ให้เรียงความน่าเชื่อถือตามนี้:

1. Trade confirmation หรือ execution history จาก Exchange/Broker
2. PDF statement
3. Screenshot
4. ข้อความที่ Nine พิมพ์
5. ค่าที่มีอยู่ใน dashboard

อย่า overwrite ข้อมูลที่น่าเชื่อถือกว่าด้วยข้อมูลที่คลุมเครือกว่าโดยไม่แจ้ง Nine

## Required Workflow

1. ระบุ source, platform, owner และช่วงวันที่
2. Extract รายการแบบ execution-by-execution
3. Normalize วันที่เป็น `YYYY-MM-DD`, ticker เป็นตัวพิมพ์ใหญ่ และ action ตามรายการที่รองรับ
4. ตรวจ duplicate ก่อนบันทึก
5. ถ้าข้อมูลสำคัญไม่ชัด ให้ถามเฉพาะจุดที่ขาด ห้ามเดา
6. แสดง preview สั้น ๆ ก่อนเขียน เมื่อ source มีหลายรายการหรือ OCR ไม่มั่นใจ
7. บันทึก `Satellite_trades`
8. Recalculate และอัปเดต `Satellite_positions`
9. ตรวจยอด quantity, average cost, realized P/L, fees และ status หลังบันทึก
10. รายงานจำนวนรายการที่เพิ่ม แก้ไข ข้ามเพราะซ้ำ และรายการที่ยังต้องยืนยัน

## Supported Actions

- `BUY`: เพิ่ม Long position
- `SELL`: ลดหรือปิด Long position
- `SHORT`: เพิ่ม Short position
- `COVER`: ลดหรือปิด Short position
- `DIVIDEND`: เงินปันผลของ position
- `FEE`: ค่าธรรมเนียมที่บันทึกแยก
- `DEPOSIT`: เงินเข้า Satellite Port
- `WITHDRAW`: เงินออก Satellite Port
- `CASH_BALANCE`: Snapshot ของ cash ปัจจุบัน ใช้กำหนดยอด cash โดยตรง ไม่ใช่เงินฝากใหม่

ห้ามใช้ `SELL` เพื่อเปิด Short และห้ามใช้ `BUY` เพื่อปิด Short

## Satellite_trades Schema

| Field | Rule |
|---|---|
| `id` | Stable unique ID เช่น `trade-20260610-binance-001` |
| `positionId` | ID ของ position ที่เกี่ยวข้อง; cash movement เว้นว่างได้ |
| `date` | `YYYY-MM-DD` ตาม execution date |
| `ticker` | Uppercase; cash movement เว้นว่างได้ |
| `action` | หนึ่งใน Supported Actions |
| `quantity` | จำนวนหน่วยที่ execute; cash movement ใช้ `0` |
| `price` | ราคาต่อหน่วย; cash movement ใช้ยอดรวม |
| `fees` | ค่าธรรมเนียมใน currency ของรายการ |
| `currency` | `USD` หรือ `THB` |
| `fxRate` | Dashboard เติม USD/THB ตาม execution date อัตโนมัติ; THB ใช้ `1` |
| `fxDate` | วันที่อัตรา FX ที่ API ส่งกลับ (อาจเป็นวันทำการก่อนหน้า) |
| `fxSource` | แหล่งอัตรา FX หรือชื่อ fallback ที่ระบบใช้ |
| `platform` | ชื่อ Exchange/Broker |
| `note` | execution note หรือเหตุผลที่เกี่ยวข้อง |
| `owner` | `Nine`, `Loki` หรือ `Nine + Loki` |
| `tags` | setup หรือกลยุทธ์ เช่น `swing, breakout, earnings` |
| `pairNote` | review ของคู่ entry/exit; สำหรับรายการที่ยังถือให้เก็บที่ entry trade |
| `reference` | Order ID / Trade ID จาก source เมื่อมี |
| `realizedPL` | P/L ต่อรายการใน currency เดิม; คำนวณเฉพาะ SELL/COVER |
| `createdAt` | ISO timestamp |

## Satellite_positions Schema

| Field | Rule |
|---|---|
| `id` | Stable unique ID เช่น `pos-nvda-20260610-long` |
| `ticker`, `name` | Symbol และชื่อสินทรัพย์ |
| `side` | `long` หรือ `short` |
| `status` | `open` หรือ `closed` |
| `openDate`, `closeDate` | `YYYY-MM-DD`; closeDate ว่างเมื่อยัง open |
| `quantity` | Remaining open quantity |
| `avgCost` | Weighted average entry price ของ quantity ที่เหลือ |
| `currentPrice` | ราคาล่าสุดที่ยืนยันได้ ห้ามเดา |
| `exitPrice` | ราคาปิดล่าสุด/เฉลี่ยเมื่อปิด |
| `realizedPL` | Realized P/L สะสมก่อน FX conversion |
| `dividends`, `fees` | ยอดสะสมใน currency ของ position |
| `currency`, `fxRate` | Native currency และ weighted historical entry FX; ห้ามแปลงค่าต้นฉบับเพื่อเปลี่ยน display |
| `fxDate`, `fxSource` | วันที่และแหล่งอัตรา entry FX ล่าสุดที่บันทึก |
| `platform`, `owner` | แหล่งถือ position และผู้รับผิดชอบ |
| `takeProfit`, `stopLoss` | TP/SL จาก Nine; ถ้าไม่ให้มาใช้ค่าว่าง |
| `tags` | กลยุทธ์หรือหมวด เช่น `swing, momentum` |
| `thesis` | เหตุผลเข้า position และ invalidation |
| `review` | Post-trade review หรือแผนปรับ position |
| `updatedAt` | ISO timestamp ล่าสุด |

## Position Calculation Rules

### Long

- BUY: `newAvg = ((oldQty * oldAvg) + (buyQty * price)) / newQty`
- SELL realized P/L: `(sellPrice - avgCost) * sellQty`

### Short

- SHORT: ใช้ weighted average แบบเดียวกับ BUY
- COVER realized P/L: `(avgCost - coverPrice) * coverQty`

เมื่อ remaining quantity เป็น `0`:

- เปลี่ยน `status` เป็น `closed`
- ตั้ง `closeDate`
- อัปเดต `exitPrice`

## Duplicate Detection

ใช้ `reference` เป็นหลัก หากไม่มี ให้เทียบ composite key:

```text
date + platform + ticker + action + quantity + price + fees
```

ถ้าตรงกันทั้งหมดให้ถือว่าเป็น duplicate และไม่เพิ่มซ้ำ หากเป็น partial fill คนละ Trade ID ให้เก็บแยกบรรทัด

## Screenshot / PDF Extraction

- อ่านเฉพาะสิ่งที่มองเห็นหรือ parse ได้ชัดเจน
- ระวัง timezone, order date เทียบกับ settlement date และ comma/decimal separator
- แยก Order status: Filled เท่านั้นจึงเป็น execution; Pending/Cancelled ไม่บันทึกเป็น trade
- ถ้า PDF มีหลายหน้า ให้ตรวจ page count และสรุปจำนวน execution ที่พบ
- ถ้าข้อมูลถูก mask หรือ crop ให้ระบุ field ที่ขาด
- ไม่เก็บ account number, email, address หรือข้อมูลส่วนตัวลง note

### Confirmed Platform UI

- Screenshot หน้า position detail แบบ Webull ที่มี `Open P&L(USD)`, `Market Value`,
  `Total Cost`, `Average Price`, `Filled Records` และปุ่ม `Sell to Close / Buy /
  Quotes` ให้ระบุ `platform` เป็น `Webull`
- ใช้ mapping นี้เฉพาะเมื่อองค์ประกอบ UI ตรงกับรูปแบบที่ Nine ยืนยันแล้ว หาก UI
  แตกต่างหรือมีข้อขัดแย้ง ให้ถามก่อนระบุ platform

## Chat Parsing

ข้อมูลขั้นต่ำสำหรับ execution:

- Action
- Ticker
- Date
- Quantity
- Price
- Currency

ข้อมูลที่ควรถามเพิ่มเมื่อจำเป็น:

- Platform
- Fees
- FX rate
- Owner
- Position side เมื่อ action คลุมเครือ

TP, SL และ thesis เป็น Position Journal ส่วน `tags` และ `pairNote` สามารถใส่ที่ execution เพื่อใช้ใน Trade Log LIST/PAIR ได้

## Safety

- อย่าลบ trade history เพื่อแก้ยอด ให้แก้ record ที่ผิดหรือเพิ่ม correcting entry
- อย่าแก้ `id` ของ record ที่มีอยู่ เว้นแต่ยืนยันว่า duplicate/collision
- อย่าแก้ `index.html` หรือ Apps Script ระหว่างงาน data entry
- อย่า commit Screenshot, PDF หรือ statement จริงขึ้น public repository
- หลังเขียน Google Sheets ให้ pull/refresh dashboard และตรวจผลเสมอ

## Completion Report

ใช้รูปแบบนี้:

```text
Satellite update complete
- Added: 4 trades
- Updated: 2 positions
- Skipped duplicates: 1
- Needs confirmation: 1 (fee unreadable)
- Source: Binance screenshot, 2026-06-10
```
