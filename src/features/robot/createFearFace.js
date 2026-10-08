import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from 'three';

export function createFearFace() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#65eeff';
  ctx.strokeStyle = '#65eeff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = '#20cfff';
  ctx.shadowBlur = 12;

  for (const side of [-1, 1]) {
    const center = side < 0 ? 151 : 361;
    // Raised inner brows and small pupils distinguish fear from surprise.
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(center - side * 52, 45);
    ctx.quadraticCurveTo(center - side * 14, 70, center + side * 50, 82);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(center, 165, 54, 66, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#06274d';
    ctx.beginPath();
    ctx.ellipse(center + 9, 168, 14, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#65eeff';
    ctx.shadowBlur = 12;
  }
  // A tense, uneven mouth instead of the old round "O".
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(214, 265);
  ctx.bezierCurveTo(232, 248, 273, 250, 293, 264);
  ctx.quadraticCurveTo(298, 280, 280, 280);
  ctx.lineTo(229, 278);
  ctx.quadraticCurveTo(211, 281, 214, 265);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(222, 266);
  ctx.lineTo(288, 268);
  ctx.stroke();
  // A small sweat bead reinforces the anxious expression at companion size.
  ctx.beginPath();
  ctx.moveTo(441, 99);
  ctx.bezierCurveTo(427, 116, 427, 129, 441, 129);
  ctx.bezierCurveTo(455, 129, 451, 115, 441, 99);
  ctx.fill();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const face = new Mesh(new PlaneGeometry(1.43, 0.9), new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  face.position.set(0, 0.58, 0.805);
  face.renderOrder = 2;
  return face;
}
