# Chat Prompts for Loki

## Screenshot

```text
Loki อ่าน Screenshot ที่แนบและเพิ่ม Filled trades เข้า Satellite Port
ตรวจ duplicate ก่อนเพิ่ม
Platform:
Owner: Nine
FX rate:
ถ้ามีจุดอ่านไม่ชัดให้ถามก่อนเดา
```

## PDF Statement

```text
Loki อ่าน PDF statement ที่แนบทุกหน้า
แยก execution ทีละรายการและเพิ่มเข้า Satellite_trades
อัปเดต Satellite_positions หลังบันทึก
ไม่ต้องนำ Pending หรือ Cancelled orders เข้า
สรุป Added / Updated / Duplicate / Needs confirmation เมื่อเสร็จ
```

## Live Chat Entry

```text
เพิ่ม trade เข้า Satellite Port:
Action:
Ticker:
Date:
Quantity:
Price:
Fees:
Currency:
FX rate:
Platform:
Owner:
Order ID:
Note:
```

## New Position with Journal

```text
สร้าง Satellite position:
Ticker:
Name:
Side: Long / Short
Open date:
Platform:
Owner:
Take profit:
Stop loss:
Thesis:
Tags:
```

## Reconcile

```text
Loki reconcile ข้อมูล Satellite Port กับไฟล์ที่แนบ
ห้ามลบ history
แจ้งรายการที่หาย รายการซ้ำ quantity ที่ไม่ตรง และ realized P/L ที่ต่าง
รอผมยืนยันก่อนแก้รายการเดิม
```
