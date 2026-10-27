# Robot source

`feri-robot-original.glb` is the original CC0 rig from the supplied portfolio asset ZIP.

Run `npm run model:build` to reproduce `public/models/feri-robot-rigged.glb`. The build refines the rig (`scripts/refine-robot.mjs`), then compresses it for the web (`scripts/compress-robot.mjs`): quantized attributes plus EXT_meshopt_compression at the `high` level, about 1.7 MB down to 567 KB (229 KB gzipped). drei's `useGLTF` decodes it automatically; loaders outside drei (such as the rig unit tests) need `setMeshoptDecoder`. Nodes are never pruned, because the hologram beam reads the empty `ProjectorSocketR` node. The committed model was checked pixel-for-pixel against the uncompressed one in every hero expression, the floating companion and the footer pose.
The local Three.js builder reshapes the palm, moves the finger rows into the palm plane,
adds finger spacing and different lengths, narrows the lower chest and pelvis,
and adds waist/shoulder joints. Thumbs sit beside the index fingers, and forearm roll
is separate from the elbow hinge. The original animation clips and face morphs remain in the export.
Each hand has three articulated fingers and one thumb. The extra finger's mesh,
vertices, bones, and animation tracks are removed from the export. A curved knuckle
row and rounded digits follow the reference. Upper arms extend by 0.125 model units
so the guard pose can keep the elbows out and palms below the shoulders.

Hero arm posing is in `src/features/robot/guardArm.js`. It resolves local rotations
from a shared elbow hinge plane, distributes palm rotation through the forearm,
and poses each finger independently. The guard timing
is in `searchMotion.js`; companion clips still come from the GLB.
