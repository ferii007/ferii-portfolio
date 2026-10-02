import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from 'three';

export function createAlertFace() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#65eeff';
  ctx.strokeStyle = '#65eeff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = '#20cfff';
  ctx.shadowBlur = 13;

  for (const side of [-1, 1]) {
    const center = side < 0 ? 151 : 361;
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(center - 65, side < 0 ? 82 : 118);
    ctx.quadraticCurveTo(center, 94, center + 65, side < 0 ? 118 : 82);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(center, 185, 60, 52, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#06274d';
    ctx.beginPath();
    ctx.ellipse(center + 22, 190, 18, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#65eeff';
    ctx.shadowBlur = 13;
  }
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(238, 270);
  ctx.quadraticCurveTo(256, 265, 274, 270);
  ctx.stroke();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const mesh = new Mesh(new PlaneGeometry(1.43, 0.9), new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  mesh.position.set(0, 0.58, 0.805);
  mesh.renderOrder = 2;
  return mesh;
}
