import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Sun, Moon, LogOut, User as UserIcon, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = ({ theme, toggleTheme }: { theme: 'dark' | 'light', toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, openLoginModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    if (path.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(path.substring(1))?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(path.substring(1))?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass rounded-3xl border border-border/50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${isScrolled ? 'shadow-2xl shadow-black/20' : ''}`}>
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Building2 className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tighter">listing pilot</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => handleNavClick('#features')}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group ${location.hash === '#features' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Features
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${location.hash === '#features' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </button>
            <Link 
              to="/pricing"
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group ${location.pathname === '/pricing' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Pricing
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${location.pathname === '/pricing' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-xl glass hover:bg-foreground/5 transition-all text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                {profile && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    {profile.plan_type === 'Pro' ? 'Unlimited' : `${profile.credits_remaining} Credits`}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
