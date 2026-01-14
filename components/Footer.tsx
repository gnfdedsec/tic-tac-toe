import { Icon } from "@iconify/react/dist/iconify.js"

export const Footer = () => {
  return (
    <footer className="w-full py-4 text-center text-gray-600 border-t">
      <div className="flex items-center justify-center gap-2">
        <p className="font-krub">© 2025 Mr.surawut Supon</p>
        <Icon icon="solar:document-linear" className="w-5 h-5" />
        <a href="https://drive.google.com/file/d/16JPlv1mztr5jtOlnKxO1S5KNOuYvBWIN/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">เอกสารคู่มือระบบ</a>
      </div>
    </footer>
  )
}
