# คู่มือการตั้งค่า Supabase ใหม่

## ขั้นตอนที่ 1: สร้าง Supabase Project ใหม่

1. ไปที่ [https://supabase.com](https://supabase.com)
2. ลงชื่อเข้าใช้หรือสร้างบัญชีใหม่
3. คลิก **"New Project"**
4. กรอกข้อมูล:
   - **Name**: `tic-tac-toe` (หรือชื่อที่คุณต้องการ)
   - **Database Password**: ตั้งรหัสผ่านที่แข็งแรง (บันทึกไว้!)
   - **Region**: เลือก region ที่ใกล้ที่สุด (เช่น `Southeast Asia (Singapore)`)
5. คลิก **"Create new project"** และรอให้สร้างเสร็จ (ประมาณ 2-3 นาที)

## ขั้นตอนที่ 2: รับ API Keys

1. ไปที่ **Settings** (ไอคอนฟันเฟือง) → **API**
2. คัดลอกค่าต่อไปนี้:
   - **Project URL** → ใช้เป็น `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → ใช้เป็น `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ขั้นตอนที่ 3: สร้างตาราง Database

1. ไปที่ **SQL Editor** (ไอคอน SQL) ในเมนูซ้าย
2. คลิก **"New query"**
3. วาง SQL script จากไฟล์ `database_setup.sql` แล้วคลิก **"Run"**

## ขั้นตอนที่ 4: ตั้งค่า Google OAuth

1. ไปที่ **Authentication** → **Providers** ในเมนูซ้าย
2. คลิกที่ **Google**
3. เปิดใช้งาน Google provider
4. ตั้งค่า Google OAuth:
   - ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
   - สร้างโปรเจคใหม่หรือใช้โปรเจคที่มีอยู่
   - ไปที่ **APIs & Services** → **Credentials**
   - คลิก **Create Credentials** → **OAuth client ID**
   - เลือก **Web application**
   - เพิ่ม **Authorized redirect URIs**:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     (แทน `<your-project-ref>` ด้วย project reference ของคุณ - ดูได้จาก Project URL)
   - คัดลอก **Client ID** และ **Client Secret**
5. กลับมาที่ Supabase → วาง Client ID และ Client Secret
6. คลิก **Save**

## ขั้นตอนที่ 5: ตั้งค่า Environment Variables

1. สร้างไฟล์ `.env.local` ในโฟลเดอร์โปรเจค (ถ้ายังไม่มี)
2. เพิ่มข้อมูลต่อไปนี้:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. แทนที่:
   - `your-project-ref` ด้วย project reference ของคุณ
   - `your-anon-key-here` ด้วย anon key ที่คัดลอกมา

## ขั้นตอนที่ 6: ทดสอบ

1. รีสตาร์ท development server:
   ```bash
   npm run dev
   # หรือ
   pnpm dev
   ```

2. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`
3. ลองเข้าสู่ระบบด้วย Google
4. ตรวจสอบว่าสามารถเล่นเกมและบันทึกสถิติได้

## หมายเหตุ

- ไฟล์ `.env.local` จะไม่ถูก commit เข้า git (ควรอยู่ใน `.gitignore`)
- ถ้ามีปัญหา ให้ตรวจสอบ Console ในเบราว์เซอร์และ Terminal
- สำหรับ production ต้องตั้งค่า environment variables ใน hosting platform ของคุณ (Vercel, Netlify, etc.)

