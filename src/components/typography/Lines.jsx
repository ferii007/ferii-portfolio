import { Fragment } from 'react';

// Renders "\n"-separated locale text with <br /> between lines (hand-drawn notes keep their line breaks).
export default function Lines({ text }) {
  return String(text).split('\n').map((line, index) => <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>);
}
