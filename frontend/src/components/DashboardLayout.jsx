import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CreditCard,
  Home,
  Library,
  MessageCircle,
  Users
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const sidebars = {
  parent: [
    ['Overview', '/parent', Home],
    ['AI Assistant', '/ai-assistant', BrainCircuit],
    ['Child Tracker', '/child-tracker', BarChart3],
    ['Appointments', '/appointments', CalendarDays],
    ['Books', '/books', Library],
    ['Forum', '/forum', MessageCircle]
  ],
  counsellor: [
    ['Overview', '/counsellor-dashboard', Home],
    ['Appointments', '/appointments', CalendarDays],
    ['Client Forum', '/forum', MessageCircle],
    ['Articles', '/articles', BookOpen]
  ],
  admin: [
    ['Overview', '/admin', Home],
    ['Users', '/admin#users', Users],
    ['Counsellors', '/counsellors', Users],
    ['Payments', '/admin#payments', CreditCard],
    ['Resources', '/admin#resources', Library]
  ]
};

const DashboardLayout = ({ role }) => {
  const items = sidebars[role] || sidebars.parent;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="panel h-max lg:sticky lg:top-24">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
          <nav className="grid gap-1">
            {items.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                end={path === `/${role}` || path === '/parent' || path === '/admin' || path === '/counsellor-dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-ocean text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
