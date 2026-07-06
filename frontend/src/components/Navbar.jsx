import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/themeSlice';
import Logo from './Logo';

const navItems = [
  ['Counsellors', '/counsellors'],
  ['Books', '/books'],
  ['Articles', '/articles'],
  ['Forum', '/forum'],
  ['Videos', '/videos']
];

const dashboardPath = (role) =>
  role === 'admin' ? '/admin' : role === 'counsellor' ? '/counsellor-dashboard' : '/parent';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-ocean/10 text-ocean dark:bg-ocean/20 dark:text-blue-200'
        : 'text-slate-600 hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  const links = (
    <>
      {navItems.map(([label, path]) => (
        <NavLink key={path} to={path} className={linkClass} onClick={() => setOpen(false)}>
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="container-page flex min-h-16 items-center justify-between py-2">
        <Link to="/" aria-label="Parentsphere home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">{links}</div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            className="btn-secondary !px-3"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <Link to={dashboardPath(user.role)} className="btn-primary">
                Dashboard
              </Link>
              <button className="btn-secondary" onClick={() => dispatch(logout())}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="btn-secondary !px-3 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-2">
            {links}
            <button className="btn-secondary" onClick={() => dispatch(toggleTheme())}>
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              Theme
            </button>
            {user ? (
              <>
                <Link to={dashboardPath(user.role)} className="btn-primary" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button className="btn-secondary" onClick={() => dispatch(logout())}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
