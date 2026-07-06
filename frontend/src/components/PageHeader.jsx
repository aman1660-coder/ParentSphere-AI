const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-ocean">{eyebrow}</p>}
      <h1 className="text-3xl font-extrabold tracking-normal text-ink dark:text-white md:text-4xl">{title}</h1>
      {description && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
