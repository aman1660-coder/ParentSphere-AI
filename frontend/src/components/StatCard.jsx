const StatCard = ({ label, value, icon: Icon, tone = 'ocean' }) => {
  const tones = {
    ocean: 'bg-ocean/10 text-ocean',
    violet: 'bg-violet/10 text-violet',
    coral: 'bg-coral/10 text-coral',
    mint: 'bg-mint/10 text-mint'
  };
  return (
    <div className="metric">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-extrabold text-ink dark:text-white">{value}</p>
        </div>
        {Icon && (
          <div className={`grid h-11 w-11 place-items-center rounded-lg ${tones[tone] || tones.ocean}`}>
            <Icon size={21} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
