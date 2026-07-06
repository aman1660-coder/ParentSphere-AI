import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Logo from './Logo';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const subscribe = async (event) => {
    event.preventDefault();
    if (!email) return;
    await api.post('/newsletter', { email });
    setMessage('Subscribed to Parentsphere updates.');
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1.2fr_.8fr_.8fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
            A premium parenting platform for expert counselling, growth tracking, AI guidance, learning resources,
            and community support.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Platform</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Link to="/ai-assistant">AI Assistant</Link>
            <Link to="/child-tracker">Growth Tracker</Link>
            <Link to="/counsellors">Counselling</Link>
            <Link to="/books">E-book Library</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Contact</h3>
          <div className="mt-3 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
            <p className="flex items-center gap-2"><Mail size={16} /> support@parentsphere.com</p>
            <p className="flex items-center gap-2"><Phone size={16} /> +91 90000 00000</p>
            <p className="flex items-center gap-2"><MapPin size={16} /> Bengaluru, India</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Newsletter</h3>
          <form className="mt-3 flex gap-2" onSubmit={subscribe}>
            <input className="input" type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button className="btn-primary" type="submit">Join</button>
          </form>
          {message && <p className="mt-2 text-sm font-semibold text-mint">{message}</p>}
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} Parentsphere. Built for intelligent parenting and child development.
      </div>
    </footer>
  );
};

export default Footer;
