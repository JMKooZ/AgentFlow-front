const VARIANT_CLASS = {
  primary:
      "bg-primary text-white hover:bg-primary-strong disabled:bg-ink-disabled",
  secondary:
      "bg-surface-alt text-ink hover:bg-line disabled:text-ink-disabled",
  ghost: "bg-transparent text-ink-sub hover:bg-surface-alt",
  danger: "bg-danger text-white hover:opacity-90 disabled:bg-ink-disabled",
};

const SIZE_CLASS = {
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-6 text-[16px]",
  sm: "h-10 px-4 text-sm",
};

function Button({
                  variant = "primary",
                  size = "lg",
                  fullWidth = false,
                  className = "",
                  children,
                  ...rest
                }) {
  return (
      <button
          className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold
        transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]}
        ${fullWidth ? "w-full" : ""} ${className}`}
          {...rest}
      >
        {children}
      </button>
  );
}

export default Button;