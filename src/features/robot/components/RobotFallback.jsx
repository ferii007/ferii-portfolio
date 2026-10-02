import Image from 'next/image';

export default function RobotFallback({ expression }) {
  return <div className="robot-fallback" data-testid="robot-fallback" data-expression={expression}>
    <Image src={`/images/robot/robot-${expression}.png`} alt={`Robot Feri dengan ekspresi ${expression}`} width={680} height={680} priority={expression === 'happy'} />
  </div>;
}
