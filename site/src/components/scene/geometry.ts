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
export function createBallGeometry(segments = 48): THREE.SphereGeometry {
  const geometry = new THREE.SphereGeometry(1, segments, Math.max(20, Math.round(segments * 0.72)));
  const position = geometry.attributes.position;
  const point = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);
    const normal = point.clone().normalize();
    const ripple =
      1 +
      0.055 * Math.sin(normal.x * 7.5) * Math.sin(normal.y * 6.1 + 1.3) * Math.sin(normal.z * 7.9 + 2.1) +
      0.02 * Math.sin(normal.x * 16.0 + 0.5) * Math.sin(normal.z * 15.0);
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

/**
 * A folded-paper boat tray: a rim polygon at the top tapering into a narrower
 * flat bottom. Kept non-indexed so the facets read as crisp origami creases.
 */
export function createTrayGeometry(): THREE.BufferGeometry {
  const rim: [number, number][] = [
    [1.0, 0.0],
    [0.58, 0.6],
    [-0.58, 0.6],
    [-1.0, 0.0],
    [-0.58, -0.6],
    [0.58, -0.6],
  ];
  const bottom = rim.map(([x, z]) => [x * 0.6, z * 0.46] as [number, number]);
  const rimY = 0.4;
  const bottomY = -1.0;
  const vertices: number[] = [];
  const push = (x: number, y: number, z: number) => vertices.push(x, y, z);
  const count = rim.length;

  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    const [rx, rz] = rim[i];
    const [rx2, rz2] = rim[j];
    const [bx, bz] = bottom[i];
    const [bx2, bz2] = bottom[j];

    push(rx, rimY, rz);
    push(bx, bottomY, bz);
    push(bx2, bottomY, bz2);

    push(rx, rimY, rz);
    push(bx2, bottomY, bz2);
    push(rx2, rimY, rz2);
  }

  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    push(0, bottomY, 0);
    push(bottom[i][0], bottomY, bottom[i][1]);
    push(bottom[j][0], bottomY, bottom[j][1]);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
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

/** Curved green-onion ribbons resting on top of a ball. */
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
    [
      [-0.05, 0.52, 0.85],
      [0.18, 0.4, 0.9],
      [0.38, 0.24, 0.86],
    ],
    [
      [-0.44, 0.62, 0.62],
      [-0.2, 0.5, 0.84],
      [0.02, 0.6, 0.8],
    ],
  ];

  return strands.map((points) => {
    const curve = new THREE.CatmullRomCurve3(surfacePoints(points));
    return new THREE.TubeGeometry(curve, 20, 0.03, 6, false);
  });
}

/** A green-onion ring used on the balls and as drifting garnish in the air. */
export function createOnionRingGeometry(): THREE.TorusGeometry {
  const geometry = new THREE.TorusGeometry(0.16, 0.055, 6, 16);
  return geometry;
}
