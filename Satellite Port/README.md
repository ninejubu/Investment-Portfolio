# Satellite Port Data Inbox

โฟลเดอร์นี้ใช้เป็นจุดประสานงานระหว่าง Nine และ Loki สำหรับบันทึกข้อมูลการเทรดเข้า Satellite Port

รองรับข้อมูลจาก:

- Screenshot จาก Exchange หรือ Broker
- PDF Statement / Order History / Trade Confirmation
- ข้อความที่ Nine พิมพ์ในแชท
- CSV ที่จัดตาม template ใน `templates/`

## วิธีใช้งาน

### ส่งผ่านแชท

แนบ Screenshot หรือ PDF แล้วพิมพ์คำสั่งสั้น ๆ เช่น:

```text
Loki เพิ่มรายการนี้เข้า Satellite Port ให้หน่อย
Owner: Nine
Platform: Binance
ตรวจรายการซ้ำก่อนเพิ่ม และสรุปสิ่งที่อ่านได้ก่อนบันทึก
```

หรือพิมพ์รายการสด:

```text
ซื้อ NVDA วันที่ 2026-06-10 จำนวน 2 หุ้น ราคา 147.50 USD
ค่าธรรมเนียม 0.35 USD ที่ IBKR เหตุผลคือ breakout
TP 165, SL 139, Owner Nine
```

### วางไฟล์ใน Inbox

- Screenshot: `inbox/screenshots/`
- PDF: `inbox/pdfs/`
- ข้อความหรือบันทึก: `inbox/chat/`

จากนั้นบอก Loki:

```text
อ่านไฟล์ใหม่ใน Satellite Port/inbox แล้วเพิ่มข้อมูลที่ยืนยันได้
```

หลังบันทึกสำเร็จ Loki จะทำเครื่องหมายรายการว่า processed โดยไม่เก็บไฟล์หลักฐานส่วนตัวขึ้น public GitHub

## Google Sheets

ข้อมูลปลายทางมี 2 sheets:

- `Satellite_positions`: สถานะล่าสุด แผนการเทรด TP/SL และ Position Journal
- `Satellite_trades`: Execution log และ cash movement ทุกครั้ง

แถวที่ 3 เป็นชื่อ columns ห้ามเปลี่ยนชื่อหรือสลับลำดับโดยไม่แก้ Apps Script ให้ตรงกัน

## หลักสำคัญ

- `Satellite_trades` เป็นประวัติรายการ ห้ามรวมหลาย execution เป็นรายการเดียว เว้นแต่หลักฐานระบุเป็น average fill เดียว
- `Satellite_positions` เป็นสถานะสรุปล่าสุดของแต่ละ position
- ห้ามเดาราคา จำนวน วันที่ ค่าธรรมเนียม FX หรือ ticker ที่อ่านไม่ชัด
- ตรวจ duplicate ก่อนบันทึกทุกครั้ง
- ไฟล์หลักฐานอาจมีข้อมูลการเงินส่วนตัว จึงถูก ignore จาก Git

อ่านรายละเอียด workflow และ field mapping ได้ใน [AGENTS.md](AGENTS.md)
