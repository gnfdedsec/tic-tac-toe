import { User } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  user: User;
}

export const Header = ({ user }: HeaderProps) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="w-full px-12 py-4 flex justify-between items-center bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center gap-3 h-16 pl-20">
        <Image 
          src="/images/logo/gamelogo.svg"
          alt="Tic tac toe game"
          width={200}
          height={100}
          className="object-contain h-full w-auto"
        />
      </div>

      {/* User Section */}
      <div className="flex items-center gap-6 pr-4">
        <span className="text-gray-600 text-base font-medium">
          {user.email}
        </span>
        <img 
          src={user.user_metadata.avatar_url || user.email} 
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white text-base rounded-md hover:bg-red-600 transition-colors flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          ออกจากระบบ
        </button>
      </div>
    </header>
  )
}
