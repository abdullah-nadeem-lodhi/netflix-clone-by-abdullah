import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isTransparent = router.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent ? 'bg-gradient-to-b from-black/70 to-transparent' : 'bg-netflix-black'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-netflix-red text-3xl font-bold">
              NETFLIX
            </Link>
          </div>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`text-white hover:text-netflix-light-gray transition-colors ${
                  router.pathname === '/' ? 'font-semibold' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/browse"
                className={`text-white hover:text-netflix-light-gray transition-colors ${
                  router.pathname === '/browse' ? 'font-semibold' : ''
                }`}
              >
                Browse
              </Link>
              <Link
                href="/my-list"
                className="text-white hover:text-netflix-light-gray transition-colors"
              >
                My List
              </Link>
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="text-white hover:text-netflix-light-gray transition-colors">
                  <MagnifyingGlassIcon className="w-6 h-6" />
                </button>

                <button className="text-white hover:text-netflix-light-gray transition-colors">
                  <BellIcon className="w-6 h-6" />
                </button>

                <div className="relative">
                  <button
                    className="flex items-center space-x-2 text-white hover:text-netflix-light-gray transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <UserCircleIcon className="w-8 h-8" />
                    <span className="hidden md:inline">
                      {user.firstName}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {isMobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-netflix-gray rounded-md shadow-lg py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-white hover:bg-netflix-black transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/plans"
                        className="block px-4 py-2 text-white hover:bg-netflix-black transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Plans
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-white hover:bg-netflix-black transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-netflix-black transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-white hover:text-netflix-light-gray transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/plans"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {user && (
        <div className={`md:hidden bg-netflix-black transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-48' : 'max-h-0'
        }`}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/"
              className="block py-2 text-white hover:text-netflix-light-gray transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="block py-2 text-white hover:text-netflix-light-gray transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/my-list"
              className="block py-2 text-white hover:text-netflix-light-gray transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My List
            </Link>
            <Link
              href="/profile"
              className="block py-2 text-white hover:text-netflix-light-gray transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 text-white hover:text-netflix-light-gray transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}