'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
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
    <div className="min-h-[100vh] flex  justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      
      <div className="bg-white p-4 rounded-lg shadow-md text-center max-w-md w-11/12 animate-jump-in ">
      <span className="text-5xl text-slate-500 text-center inline-block">  </span> 
        <div className="flex justify-center mb-6">
          <img
            src="/images/logo/logomaster.svg"
            alt="Tic tac toe game"
            className="pt-10 w-12/12 h-auto animate-jump-in"
          />
        </div>
        <h1 className="text-2xl font-krub font-semibold mb-6 text-center">เข้าสู่ระบบเพื่อเล่นเกม</h1>
        <div className="flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="w-64 bg-blue-600 text-white border border-gray-300 px-4 py-2 rounded-md hover:bg-slate-600 transition-colors flex items-center justify-center gap-3 animate-fade-up "
          >
            <img 
              src="https://authjs.dev/img/providers/google.svg" 
              alt="Google logo" 
              className="w-5 h-5"
            />
            เข้าสู่ระบบด้วย Google
          </button>
        </div>
      </div>
    </div>
  )
}
