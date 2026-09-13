function Card({ className = "", children, ...rest }) {
  return (
      <div
          className={`rounded-3xl bg-surface p-6 shadow-card transition-shadow duration-200 ${className}`}
          {...rest}
      >
        {children}
      </div>
  );
}

export default Card;