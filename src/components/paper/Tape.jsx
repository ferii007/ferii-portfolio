// A strip of masking tape holding paper to the page (styled by .fp-tape in appearance.css).
export default function Tape({ className = '' }) {
  return <span className={`fp-tape ${className}`.trim()} aria-hidden="true" />;
}
