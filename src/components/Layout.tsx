import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Home, 
  LineChart, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-900 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-teal-400" />
              <span className="text-2xl font-bold">SalaryTrack</span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 hover:text-teal-300 transition-colors ${
                  isActive('/dashboard') ? 'text-teal-400' : ''
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/reports"
                className={`flex items-center space-x-1 hover:text-teal-300 transition-colors ${
                  isActive('/reports') ? 'text-teal-400' : ''
                }`}
              >
                <LineChart className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              <div className="relative">
                <button
                  className="flex items-center space-x-1 hover:text-teal-300 transition-colors"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <User className="h-5 w-5" />
                  <span>{user?.name || 'Profile'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-800 text-white">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  isActive('/dashboard') ? 'bg-indigo-700 text-teal-400' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/reports"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  isActive('/reports') ? 'bg-indigo-700 text-teal-400' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LineChart className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  isActive('/profile') ? 'bg-indigo-700 text-teal-400' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-2 p-2 rounded-md text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calculator className="h-6 w-6 text-teal-400" />
              <span className="text-xl font-bold">SalaryTrack</span>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} SalaryTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;