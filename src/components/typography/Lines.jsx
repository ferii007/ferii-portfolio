import { Fragment } from 'react';
import { splitLines } from '@/lib/text';

// Renders "\n"-separated locale text with <br /> between lines (hand-drawn notes keep their line breaks).
export default function Lines({ text }) {
  return splitLines(text).map((line, index) => <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>);
}
