# Robot source

`feri-robot-original.glb` is the original CC0 rig from the supplied portfolio asset ZIP.

Run `npm run model:build` to reproduce `public/models/feri-robot-rigged.glb`.
The local Three.js builder reshapes the palm, moves the finger rows into the palm plane,
adds finger spacing and different lengths, narrows the lower chest and pelvis,
and adds waist/shoulder joints. Thumbs sit beside the index fingers, and forearm roll
is separate from the elbow hinge. The original animation clips and face morphs remain in the export.

Hero arm posing is in `src/features/robot/guardArm.js`. It resolves local rotations
from a shared elbow hinge plane, distributes palm rotation through the forearm,
and poses each finger independently. The guard timing
is in `searchMotion.js`; companion clips still come from the GLB.
