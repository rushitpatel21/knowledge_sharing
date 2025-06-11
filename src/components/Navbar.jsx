import { useState } from 'react';
import { Menu, X, Plus, List, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/apis/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const {
    auth
  } = useSelector((state) => state.auth)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);

    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate('/login');
      });
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      setIsProfileDropdownOpen(false);
    }
  };

  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">ArticleHub</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/articles" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition duration-200 font-medium">
                <List className="w-5 h-5 mr-2" />
                List
              </Link>
              <Link to="/articles/new" className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition duration-200 font-medium">
                <Plus className="w-5 h-5 mr-2" />
                Create
              </Link>
            </div>
          </div>

          {/* User Profile with Dropdown */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative profile-dropdown">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium">{auth?.name || 'John Doe'}</span>
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{auth?.name || 'John Doe'}</p>
                      <p className="text-sm text-gray-500">{auth?.email || 'john@example.com'}</p>
                    </div>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
            <Link to="/articles" className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition duration-200">
              <List className="w-5 h-5 mr-3" />
              List
            </Link>
            <Link to="/articles/new" className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition duration-200">
              <Plus className="w-5 h-5 mr-3" />
              Create
            </Link>


            {/* Mobile User Section */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900">{auth?.name || 'John Doe'}</p>
                <p className="text-sm text-gray-500">{auth?.email || 'john@example.com'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}