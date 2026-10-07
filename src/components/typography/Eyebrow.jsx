export default function Eyebrow({ children, className = '' }) {
  return <p className={`portfolio-eyebrow ${className}`.trim()}>{children}</p>;
}
