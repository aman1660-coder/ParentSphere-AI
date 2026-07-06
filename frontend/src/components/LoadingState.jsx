const LoadingState = ({ label = 'Loading Parentsphere data...' }) => (
  <div className="grid min-h-[240px] place-items-center">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-ocean/20 border-t-ocean" />
      <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

export default LoadingState;
