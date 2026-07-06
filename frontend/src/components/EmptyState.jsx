import { Sparkles } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', text = 'Create the first item to get started.' }) => (
  <div className="panel grid place-items-center py-12 text-center">
    <div className="grid h-12 w-12 place-items-center rounded-lg bg-ocean/10 text-ocean">
      <Sparkles size={24} />
    </div>
    <h3 className="mt-4 text-lg font-bold">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{text}</p>
  </div>
);

export default EmptyState;
