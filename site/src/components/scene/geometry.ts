import * as THREE from "three";

/**
 * Every shape in the scene is generated in code — no imported models.
 * A 4-step gradient map gives the MeshToonMaterial its flat "printed" ramp.
 */
export function createGradientMap(steps = 4, floor = 0.32): THREE.DataTexture {
  const data = new Uint8Array(steps * 4);
  for (let i = 0; i < steps; i++) {
    const value = Math.round((floor + (1 - floor) * (i / (steps - 1))) * 255);
    data.set([value, value, value, 255], i * 4);
  }

  const texture = new THREE.DataTexture(data, steps, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/** A lumpy sphere reads as a grilled takoyaki ball. */
export function createBallGeometry(segments = 40): THREE.SphereGeometry {
  const geometry = new THREE.SphereGeometry(1, segments, Math.max(16, Math.round(segments * 0.7)));
  const position = geometry.attributes.position;
  const point = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);
    const normal = point.clone().normalize();
    const ripple =
      1 +
      0.06 *
        Math.sin(normal.x * 7.5) *
        Math.sin(normal.y * 6.1 + 1.3) *
        Math.sin(normal.z * 7.9 + 2.1);
    point.copy(normal).multiplyScalar(ripple);
    position.setXYZ(i, point.x, point.y, point.z);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/** Tapered, softly rounded chopstick, centred on the origin. */
export function createChopstickGeometry(): THREE.LatheGeometry {
  const profile: THREE.Vector2[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const radius = 0.018 + 0.062 * Math.pow(t, 1.35);
    profile.push(new THREE.Vector2(radius, t));
  }

  const geometry = new THREE.LatheGeometry(profile, 24);
  geometry.translate(0, -0.5, 0);
  geometry.computeVertexNormals();
  return geometry;
}

/** A shallow folded-paper boat tray, faceted like origami. */
export function createTrayGeometry(): THREE.BufferGeometry {
  const profile = [
    new THREE.Vector2(0.001, 0.0),
    new THREE.Vector2(0.3, 0.02),
    new THREE.Vector2(0.52, 0.08),
    new THREE.Vector2(0.74, 0.18),
    new THREE.Vector2(0.9, 0.32),
    new THREE.Vector2(1.0, 0.48),
  ];
  const geometry = new THREE.LatheGeometry(profile, 9);
  geometry.rotateX(Math.PI);
  // Non-indexed + recomputed normals gives a faceted, folded-paper look.
  const flat = geometry.toNonIndexed();
  flat.computeVertexNormals();
  return flat;
}

function surfacePoints(points: [number, number, number][], radius = 1.02): THREE.Vector3[] {
  return points.map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize().multiplyScalar(radius));
}

function drizzle(points: [number, number, number][], thickness: number): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3(surfacePoints(points));
  return new THREE.TubeGeometry(curve, 48, thickness, 7, false);
}

/** White mayo zig-zag drawn across the front of the ball. */
export function createMayoGeometry(): THREE.TubeGeometry {
  return drizzle(
    [
      [-0.57, 0.42, 0.66],
      [-0.2, 0.62, 0.74],
      [0.04, 0.32, 0.94],
      [0.34, 0.46, 0.8],
      [0.56, 0.16, 0.8],
      [0.16, -0.08, 0.98],
      [-0.24, 0.03, 0.97],
      [-0.52, -0.2, 0.84],
    ],
    0.05,
  );
}

/** A darker sauce drizzle layered beside the mayo. */
export function createSauceGeometry(): THREE.TubeGeometry {
  return drizzle(
    [
      [-0.62, 0.12, 0.76],
      [-0.26, 0.0, 0.95],
      [0.08, -0.14, 0.98],
      [0.4, -0.02, 0.9],
      [0.6, 0.34, 0.72],
      [0.24, 0.5, 0.82],
      [-0.14, 0.44, 0.9],
      [-0.46, 0.3, 0.86],
    ],
    0.038,
  );
}

/** Three thin curved green-onion strands resting on top. */
export function createOnionGeometries(): THREE.TubeGeometry[] {
  const strands: [number, number, number][][] = [
    [
      [-0.16, 0.88, 0.28],
      [0.0, 1.0, 0.06],
      [0.16, 0.9, -0.18],
    ],
    [
      [0.06, 0.94, 0.16],
      [0.26, 0.9, -0.04],
      [0.42, 0.78, -0.24],
    ],
    [
      [-0.34, 0.8, 0.18],
      [-0.5, 0.68, -0.08],
      [-0.56, 0.48, -0.32],
    ],
  ];

  return strands.map((points) => {
    const curve = new THREE.CatmullRomCurve3(surfacePoints(points));
    return new THREE.TubeGeometry(curve, 20, 0.03, 6, false);
  });
}
