export default function Description({ children, className = '' }) {
  return <p className={`portfolio-description ${className}`.trim()}>{children}</p>;
}
