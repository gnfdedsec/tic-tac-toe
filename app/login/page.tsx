'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import VantaBackground from '@/components/VantaBackground'
import { RainbowButton } from "@/components/ui/rainbow-button";
export default function Login() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <VantaBackground>
      <div className="min-h-screen flex relative">
        <div className="w-full flex items-center justify-center p-4 md:p-8">
          <div className="max-w-5xl w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* คอลัมน์ซ้าย - รูปภาพ (ซ่อนบนมือถือ) */}
              <div className="hidden md:block relative w-full h-[500px] transform transition-all duration-700 
                            hover:scale-105 animate-fade-in-up overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-black/2 z-10"></div>
                <Image
                  src="/images/logo/bglogin.png"
                  alt="Background"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* คอลัมน์ขวา - หัวข้อและปุ่ม login */}
              <div className="flex flex-col justify-center py-8 md:py-0">
                {/* แสดงรูปขนาดเล็กบนมือถือ */}
                <div className="md:hidden relative w-full h-[200px] mb-8 overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-black/2 z-10"></div>
                  <Image
                    src="/images/logo/bglogin.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
                  เข้าสู่ระบบเพื่อเล่นเกม
                </h1>
                <div className="space-y-4">
                  <RainbowButton
                    onClick={handleGoogleLogin}
                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg 
                             hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 
                             shadow-md hover:shadow-lg border border-gray-800 animate-jump-in"
                  >
                    <img 
                      src="https://authjs.dev/img/providers/google.svg" 
                      alt="Google logo" 
                      className="w-6 h-6 bg-white rounded-full p-1"
                    />
                    <span>เข้าสู่ระบบด้วย Google</span>
                  </RainbowButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VantaBackground>
  )
}
