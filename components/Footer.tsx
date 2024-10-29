import { Icon } from "@iconify/react/dist/iconify.js"

export const Footer = () => {
  return (
    <footer className="w-full py-4 text-center text-gray-600 border-t">
      <div className="flex items-center justify-center gap-2">
        <p className="font-krub">© 2024 Mr.surawut Supon</p>
        <Icon icon="solar:document-linear" className="w-5 h-5" />
        <span>เอกสารคู่มือระบบ</span>
        <Icon icon="ph:coffee" className="w-5 h-5" />
        <span>เลี้ยงกาแฟฉัน</span>
      </div>
    </footer>
  )
}
