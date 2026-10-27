// Compresses the refined robot for the web: quantized attributes + EXT_meshopt_compression, which drei's
// useGLTF decodes out of the box. Geometry, rig, morph targets, animations and empty sockets are kept as-is.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';

const file = new URL('../public/models/feri-robot-rigged.glb', import.meta.url);
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const document = await io.read(file.pathname);
const names = () => document.getRoot().listNodes().map((node) => node.getName()).sort();
const before = names();
// cleanup: false keeps empty helper nodes such as ProjectorSocketR, which the hologram beam reads at runtime.
// 'high' adds meshopt's octahedral normal / quaternion filters; checked pixel-for-pixel against the uncompressed model.
await document.transform(meshopt({ encoder: MeshoptEncoder, level: 'high', cleanup: false }));
if (names().join() !== before.join()) throw new Error('Compression changed the node list');
const bytes = await io.writeBinary(document);
await io.write(file.pathname, document);
console.log(`Compressed robot: ${before.length} nodes, ${bytes.byteLength} bytes`);
