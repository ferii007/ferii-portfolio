import Image from 'next/image';

export default function RobotFallback({ expression }) {
  return <div className="robot-fallback" data-testid="robot-fallback" data-expression={expression}>
    <Image src={`/images/robot/robot-${expression}.png`} alt={`Robot Feri dengan ekspresi ${expression}`} width={1164} height={1351} priority={expression === 'happy'} />
  </div>;
}
