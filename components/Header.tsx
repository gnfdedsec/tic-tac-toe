import { User } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getGameStats } from '@/app/actions/getStats';

interface HeaderProps {
  user: User;
}

export const Header = ({ user }: HeaderProps) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userRank, setUserRank] = useState('Bronze');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchRank = async () => {
      const result = await getGameStats();
      if (result.success && result.data) {
        setUserRank(result.data.current_rank);
      }
    };
    
    fetchRank();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsMenuOpen(false);
      await router.refresh();
      await router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Immortal God':
        return 'text-red-600';
      case 'Diamond':
        return 'text-blue-500';
      case 'Platinum':
        return 'text-cyan-500';
      case 'Gold':
        return 'text-yellow-500';
      case 'Silver':
        return 'text-gray-400';
      default:
        return 'text-amber-700'; // Bronze
    }
  };

  return (
    <header className="w-full px-4 md:px-12 py-4 flex justify-between items-center bg-white shadow-md fixed top-0 left-0 z-50">
      {/* Logo Section - ปรับขนาดตามหน้าจอ */}
      <div className="flex items-center h-12 md:h-16 pl-2 md:pl-20">
        <Image 
          src="/images/logo/gamelogo.svg"
          alt="Tic tac toe game"
          width={150}
          height={75}
          className="object-contain h-full w-auto"
        />
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-3 pr-20">
        <span className="text-gray-600 text-base font-medium">
          {user.email}
        </span>
        {/* Avatar */}
        {user.user_metadata?.avatar_url && (
          <Image 
            src={user.user_metadata.avatar_url}
            alt={user.email || 'User avatar'}
            width={40}
            height={40}
            className="rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email || 'U');
            }}
          />
        )}
        
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white text-base rounded-md hover:bg-red-600 transition-colors flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          ออกจากระบบ
        </button>
      </div>

      {/* Hamburger Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 w-64 bg-white shadow-lg rounded-bl-md py-0 lg:hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            {user.user_metadata?.avatar_url && (
              <div className="flex items-center gap-3 mb-2">
                <Image 
                  src={user.user_metadata.avatar_url}
                  alt={user.email || 'User avatar'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email || 'U');
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm truncate">{user.email}</span>
                  <span className="text-gray-600 text-sm"> Rank: <span className={`font-medium ${getRankColor(userRank)}`}>{userRank}</span></span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-6 text-left text-gray-600 hover:bg-slate-100 transition-colors flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout : ออกจากระบบ  
          </button>
        </div>
      )}
    </header>
  )
}
