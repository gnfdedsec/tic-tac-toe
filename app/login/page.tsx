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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <span className="text-5xl text-slate-500 text-center inline-block"> OX </span><span className="text-slate-400 text-center"> game </span>
        <div className="flex justify-center mb-6">
      
          <img
            src="/images/logo/gamelogo.svg"
            alt="Tic tac toe game"
            className="w-48 h-auto"
          />
        </div>
        <h1 className="text-2xl font-krub font-semibold mb-6 text-center">เข้าสู่ระบบเพื่อเล่นเกม</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white border border-gray-300 px-4 py-2 rounded-md hover:bg-slate-600 transition-colors flex items-center justify-center gap-3"
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
  )
}
