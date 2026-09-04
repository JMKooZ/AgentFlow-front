function Card({ className = "", children, ...rest }) {
  return (
    <div
      className={`rounded-3xl bg-surface p-6 shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
