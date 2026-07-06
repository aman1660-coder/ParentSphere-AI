import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img src="/src/assets/logo.svg" alt="Parentsphere Logo" className="h-8 w-8" />
              <span className="font-bold text-xl text-gradient">Parentsphere</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/counsellors" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Counsellors</Link>
            <Link to="/library" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Library</Link>
            <Link to="/ai-assistant" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">AI Assistant</Link>
            
            {userInfo ? (
              <div className="relative flex items-center gap-4 ml-4 border-l pl-4 border-slate-200">
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium">
                  <User size={18} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={logoutHandler} className="text-slate-500 hover:text-red-500">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4 border-l pl-4 border-slate-200">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md shadow-blue-500/30">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-blue-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1">
          <Link to="/counsellors" className="block px-3 py-2 text-slate-600 font-medium">Counsellors</Link>
          <Link to="/library" className="block px-3 py-2 text-slate-600 font-medium">Library</Link>
          <Link to="/ai-assistant" className="block px-3 py-2 text-slate-600 font-medium">AI Assistant</Link>
          {userInfo ? (
            <>
              <Link to="/dashboard" className="block px-3 py-2 text-slate-600 font-medium">Dashboard</Link>
              <button onClick={logoutHandler} className="block w-full text-left px-3 py-2 text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-slate-600 font-medium">Login</Link>
              <Link to="/register" className="block px-3 py-2 text-blue-600 font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
