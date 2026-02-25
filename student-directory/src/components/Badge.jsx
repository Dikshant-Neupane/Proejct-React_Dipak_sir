import './components.css';

export default function Badge({ children, type = 'neutral' }) {
  return <span className={`badge badge--${type}`}>{children}</span>;
}
