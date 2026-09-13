function Input({ label, error, className = "", ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-ink-sub">
          {label}
        </span>
      )}

      <input
        className={`h-14 w-full rounded-2xl bg-surface-alt px-4 text-[15px] text-ink
          placeholder:text-ink-tertiary outline-none transition-shadow duration-150
          focus:bg-surface focus:ring-2 focus:ring-primary
          ${error ? "ring-2 ring-danger focus:ring-danger" : ""}
          ${className}`}
        {...rest}
      />

      {error && <span className="mt-1.5 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export default Input;
