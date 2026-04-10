# 🚀 Task Management System (Front End Angular 20)

โปรเจกต์นี้ถูกออกแบบมาเพื่อรันในสภาพแวดล้อมจำลองแบบ Localhost เท่านั้น เพื่อใช้ในการพัฒนาและทดสอบระบบภายในเครื่อง

## 1. Prerequisites (สิ่งที่ต้องเตรียม)

```text
     _                      _             ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __ / ___| |   |_ _|
   / _ \ | '_ \ / _` | | | | |/ _` | '__| |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |  | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|   \____|_____|___|
                |___/

Angular CLI: 20.3.23
Node: 22.12.0
Package Manager: npm 10.9.0
OS: win32 x64

Angular: 20.3.18
... animations, common, compiler, compiler-cli, core, forms
... platform-browser, platform-server, router

Package                         Version
----------------------------------------------------------
@angular-devkit/architect       0.2003.23
@angular-devkit/core            20.3.23
@angular-devkit/schematics      20.3.23
@angular/build                  20.3.23
@angular/cli                    20.3.23
@angular/ssr                    20.3.23
@schematics/angular             20.3.23
rxjs                            7.8.2
typescript                      5.9.3
```

## 2 Installation & Start (ขั้นตอนการเริ่มทำงาน)

ติดตั้ง dependencies

```
npm install

⚠️ หากพบข้อความ Error เกี่ยวกับ Dependency Conflict (เนื่องจาก Angular 20 เป็นเวอร์ชันใหม่มาก):

npm install --force
```

รันระบบ Front End

```
ng serve
```

เปิดใช้งานผ่าน Browser

```
URL: http://localhost:4200
```

## ✨ Key Features

- **Advanced Sorting:** จัดเรียงข้อมูล (ASC/DESC) ตามลำดับ
- **Priority Filtering:** กรองงานตามระดับความสำคัญ (High/Medium/Low)
- **Expandable Rows:** คลิกที่แถวเพื่อกางดูรายละเอียด (Show Detail)
- **Bulk Actions:** เลือกรายการทั้งหมดเพื่อลบพร้อมกัน (Multi-delete)
- **Auto-Pagination:** ระบบแบ่งหน้าดีดกลับอัตโนมัติเมื่อข้อมูลหมดหน้า
- **Loading Spinner:** แสดงสถานะการโหลดข้อมูลระหว่างดึง API (Spinner)
- **Responsive Design:** รองรับการใช้งานทุกหน้าจอ (Mobile Friendly)
- **Signals State:** จัดการข้อมูลแบบ Real-time ด้วย Angular Signals

## 🛠 Technical Stack (Angular)

```
⚡ Angular CLI 20 + TypeScript + Standalone + Signals + Server-Side Rendering (SSR) + SCSS & Bootstrap 5
```

---

**Developed by Nattawat Thanwiset (Ohm)**
