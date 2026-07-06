import logo from '../assets/logo.svg';

const Logo = ({ compact = false }) => (
  <div className="flex items-center gap-2">
    <img src={logo} alt="Parentsphere logo" className={compact ? 'h-9 w-9' : 'h-11 w-11'} />
    {!compact && (
      <div className="leading-tight">
        <p className="text-lg font-extrabold tracking-normal text-ink dark:text-white">Parentsphere</p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Empowering Parents</p>
      </div>
    )}
  </div>
);

export default Logo;
