import './components.css';

export default function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false, ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant}`}
      {...props}
    >
      {children}
    </button>
  );
}
