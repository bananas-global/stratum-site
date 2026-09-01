"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import {
  DEFAULT_PATTERN_LAYOUT,
  ICON_PATH,
  scaleToK,
  tilePositions,
} from "@/components/IconPattern";

export type ThreeSceneSettings = {
  scale: number;
  fov: number;
  activeAmount: number;
  heightMultiplier: number;
  holdMultiplier: number;
  lighting: number;
  backgroundColor: string;
  elementColor: string;
};

export const DEFAULT_PATTERN_SCENE_SETTINGS: ThreeSceneSettings = {
  scale: 0.5,
  fov: 55,
  activeAmount: 2,
  heightMultiplier: 2.3,
  holdMultiplier: 3,
  lighting: 2.5,
  backgroundColor: "#c2c2c2",
  elementColor: "#ffffff",
};

const FIXED_LIGHTING = {
  azimuth: 34,
  height: 7,
  intensity: 3.2,
  ambient: 1.5,
  shadowSoftness: 1.8,
} as const;

const HOVER_MOTION = {
  depth: 0.08,
  stiffness: 90,
  damping: 19,
} as const;

const RANDOM_MOTION = {
  baseActiveCount: 4,
  minHeight: 0.08,
  maxHeight: 0.24,
  minHoldMs: 900,
  maxHoldMs: 2200,
  minIntervalMs: 220,
  maxIntervalMs: 520,
} as const;

const PATTERN_CANVAS = {
  width: 2400,
  height: 1600,
  worldPerPixel: 0.0064,
  overscan: 400,
  maxInstances: 2048,
} as const;

type PatternPlacement = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

type SceneRuntime = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  mesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.MeshStandardMaterial[]>;
  riseMesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.MeshStandardMaterial[]>;
  ground: THREE.Group;
  groundMaterial: THREE.MeshStandardMaterial;
  frontMaterial: THREE.MeshStandardMaterial;
  sideMaterial: THREE.MeshStandardMaterial;
  ambientLight: THREE.HemisphereLight;
  keyLight: THREE.DirectionalLight;
  keyTarget: THREE.Object3D;
  shapes: THREE.Shape[];
  placements: PatternPlacement[];
  patternScaleKey: string;
  heights: Float32Array;
  velocities: Float32Array;
  raisedTargets: Float32Array;
  holdTimers: Array<number | null>;
  hoveredInstance: number | null;
  animationFrame: number | null;
  lastFrameTime: number;
  randomTimer: number | null;
  active: boolean;
  settings: ThreeSceneSettings;
  coverViewport: boolean;
};

function getViewportFov(
  baseFov: number,
  viewportAspect: number,
  coverViewport: boolean,
) {
  if (!coverViewport) return baseFov;

  const baseHalfFov = THREE.MathUtils.degToRad(baseFov / 2);
  const baseVisibleHalfHeight = 11 * Math.tan(baseHalfFov);
  const patternHalfWidth =
    (PATTERN_CANVAS.width / 2 + PATTERN_CANVAS.overscan) *
    PATTERN_CANVAS.worldPerPixel;
  const coverAspect = patternHalfWidth / baseVisibleHalfHeight;
  if (viewportAspect <= coverAspect) return baseFov;

  return THREE.MathUtils.radToDeg(
    2 * Math.atan(Math.tan(baseHalfFov) * (coverAspect / viewportAspect)),
  );
}

function reverseTriangleWinding(geometry: THREE.BufferGeometry) {
  const index = geometry.getIndex();
  if (index) {
    for (let offset = 0; offset < index.count; offset += 3) {
      const second = index.getX(offset + 1);
      index.setX(offset + 1, index.getX(offset + 2));
      index.setX(offset + 2, second);
    }
    index.needsUpdate = true;
    return;
  }

  for (const attribute of Object.values(geometry.attributes)) {
    if (!(attribute instanceof THREE.BufferAttribute)) continue;
    for (let offset = 0; offset < attribute.count; offset += 3) {
      for (let component = 0; component < attribute.itemSize; component++) {
        const second = attribute.getComponent(offset + 1, component);
        attribute.setComponent(
          offset + 1,
          component,
          attribute.getComponent(offset + 2, component),
        );
        attribute.setComponent(offset + 2, component, second);
      }
    }
    attribute.needsUpdate = true;
  }
}

function createExtrusionGeometry(
  shapes: THREE.Shape[],
  direction: "sink" | "rise",
) {
  let geometry: THREE.BufferGeometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 100,
    bevelEnabled: false,
    curveSegments: 12,
    steps: 1,
  });

  geometry.scale(0.01, -0.01, 0.01);
  reverseTriangleWinding(geometry);
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  if (bounds) {
    geometry.translate(
      -(bounds.min.x + bounds.max.x) / 2,
      -(bounds.min.y + bounds.max.y) / 2,
      -bounds.min.z,
    );
  }
  if (direction === "sink") geometry.translate(0, 0, -1);
  geometry.computeVertexNormals();

  if (geometry.index) {
    const indexedGeometry = geometry;
    geometry = geometry.toNonIndexed();
    indexedGeometry.dispose();
  }

  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const capPositions: number[] = [];
  const capUvs: number[] = [];
  const sidePositions: number[] = [];
  const sideUvs: number[] = [];

  const appendVertex = (
    vertex: number,
    targetPositions: number[],
    targetUvs: number[],
  ) => {
    targetPositions.push(position.getX(vertex), position.getY(vertex), position.getZ(vertex));
    if (uv) targetUvs.push(uv.getX(vertex), uv.getY(vertex));
  };

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    const z0 = position.getZ(vertex);
    const z1 = position.getZ(vertex + 1);
    const z2 = position.getZ(vertex + 2);
    const atOpenTop =
      Math.abs(z0) < 0.0001 && Math.abs(z1) < 0.0001 && Math.abs(z2) < 0.0001;
    if (atOpenTop) continue;

    const capZ = direction === "sink" ? -1 : 1;
    const atCap =
      Math.abs(z0 - capZ) < 0.0001 &&
      Math.abs(z1 - capZ) < 0.0001 &&
      Math.abs(z2 - capZ) < 0.0001;
    if (atCap) {
      appendVertex(vertex, capPositions, capUvs);
      appendVertex(vertex + (direction === "sink" ? 2 : 1), capPositions, capUvs);
      appendVertex(vertex + (direction === "sink" ? 1 : 2), capPositions, capUvs);
    } else {
      appendVertex(vertex, sidePositions, sideUvs);
      appendVertex(vertex + 1, sidePositions, sideUvs);
      appendVertex(vertex + 2, sidePositions, sideUvs);
    }
  }

  const openGeometry = new THREE.BufferGeometry();
  openGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([...capPositions, ...sidePositions], 3),
  );
  if (uv) {
    openGeometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute([...capUvs, ...sideUvs], 2),
    );
  }
  openGeometry.addGroup(0, capPositions.length / 3, 0);
  openGeometry.addGroup(capPositions.length / 3, sidePositions.length / 3, 1);
  openGeometry.computeVertexNormals();
  openGeometry.computeBoundingBox();
  openGeometry.computeBoundingSphere();
  geometry.dispose();
  return openGeometry;
}

function createClosedPath(points: THREE.Vector2[]) {
  const path = new THREE.Path();
  const first = points[0];
  if (!first) return path;
  path.moveTo(first.x, first.y);
  for (const point of points.slice(1)) path.lineTo(point.x, point.y);
  path.closePath();
  return path;
}

function getShapeCenter(shapes: THREE.Shape[]) {
  const sourceGeometry = new THREE.ShapeGeometry(shapes, 12);
  sourceGeometry.computeBoundingBox();
  const bounds = sourceGeometry.boundingBox;
  const centerX = bounds ? (bounds.min.x + bounds.max.x) / 2 : 0;
  const centerY = bounds ? (bounds.min.y + bounds.max.y) / 2 : 0;
  sourceGeometry.dispose();
  return { centerX, centerY };
}

function createPatternPlacements(shapes: THREE.Shape[], scale: number) {
  const { centerX, centerY } = getShapeCenter(shapes);
  const k = scaleToK(scale);
  const tiles = tilePositions(
    PATTERN_CANVAS.width,
    PATTERN_CANVAS.height,
    k,
    DEFAULT_PATTERN_LAYOUT,
  );
  const glyphScale =
    (DEFAULT_PATTERN_LAYOUT.iconScale * k * PATTERN_CANVAS.worldPerPixel) / 0.01;
  const placements: PatternPlacement[] = [];

  const addPlacement = (logicalX: number, logicalY: number, rotation: number) => {
    if (
      logicalX < -PATTERN_CANVAS.overscan ||
      logicalX > PATTERN_CANVAS.width + PATTERN_CANVAS.overscan ||
      logicalY < -PATTERN_CANVAS.overscan ||
      logicalY > PATTERN_CANVAS.height + PATTERN_CANVAS.overscan
    ) {
      return;
    }
    placements.push({
      x: (logicalX - PATTERN_CANVAS.width / 2) * PATTERN_CANVAS.worldPerPixel,
      y: -(logicalY - PATTERN_CANVAS.height / 2) * PATTERN_CANVAS.worldPerPixel,
      rotation,
      scale: glyphScale,
    });
  };

  for (const [x, y] of tiles) {
    addPlacement(
      x + k * DEFAULT_PATTERN_LAYOUT.iconScale * centerX,
      y + k * DEFAULT_PATTERN_LAYOUT.iconScale * centerY,
      0,
    );
    addPlacement(
      x + k * (DEFAULT_PATTERN_LAYOUT.rotationX * 2 - DEFAULT_PATTERN_LAYOUT.iconScale * centerX),
      y + k * (DEFAULT_PATTERN_LAYOUT.rotationY * 2 - DEFAULT_PATTERN_LAYOUT.iconScale * centerY),
      Math.PI,
    );
  }

  return placements.slice(0, PATTERN_CANVAS.maxInstances);
}

function transformPatternPoints(
  points: THREE.Vector2[],
  centerX: number,
  centerY: number,
  placement: PatternPlacement,
) {
  const rotated = Math.abs(placement.rotation) > 0.001;
  return points.map((point) => {
    let x = (point.x - centerX) * 0.01 * placement.scale;
    let y = -(point.y - centerY) * 0.01 * placement.scale;
    if (rotated) {
      x = -x;
      y = -y;
    }
    return new THREE.Vector2(x + placement.x, y + placement.y);
  });
}

function createGroundGeometries(
  shapes: THREE.Shape[],
  placements: PatternPlacement[],
) {
  const { centerX, centerY } = getShapeCenter(shapes);

  const groundShape = new THREE.Shape();
  groundShape.moveTo(-20, -20);
  groundShape.lineTo(20, -20);
  groundShape.lineTo(20, 20);
  groundShape.lineTo(-20, 20);
  groundShape.closePath();

  for (const placement of placements) {
    for (const shape of shapes) {
      groundShape.holes.push(
        createClosedPath(
          transformPatternPoints(shape.getPoints(12), centerX, centerY, placement),
        ),
      );
    }
  }

  const geometries = [new THREE.ShapeGeometry(groundShape, 12)];
  const islands: THREE.Shape[] = [];
  for (const placement of placements) {
    for (const shape of shapes) {
      for (const hole of shape.holes) {
        const island = new THREE.Shape();
        const points = transformPatternPoints(
          hole.getPoints(12),
          centerX,
          centerY,
          placement,
        );
        const first = points[0];
        if (!first) continue;
        island.moveTo(first.x, first.y);
        for (const point of points.slice(1)) island.lineTo(point.x, point.y);
        island.closePath();
        islands.push(island);
      }
    }
  }
  if (islands.length > 0) geometries.push(new THREE.ShapeGeometry(islands, 12));
  return geometries;
}

function rebuildGround(
  ground: THREE.Group,
  material: THREE.MeshStandardMaterial,
  shapes: THREE.Shape[],
  placements: PatternPlacement[],
) {
  for (const child of [...ground.children]) {
    ground.remove(child);
    if (child instanceof THREE.Mesh) child.geometry.dispose();
  }
  for (const geometry of createGroundGeometries(shapes, placements)) {
    const surface = new THREE.Mesh(geometry, material);
    surface.castShadow = true;
    surface.receiveShadow = true;
    ground.add(surface);
  }
}

function updatePatternInstances(
  sinkMesh: THREE.InstancedMesh,
  riseMesh: THREE.InstancedMesh,
  placements: PatternPlacement[],
  heights: Float32Array,
  recomputeBounds = false,
) {
  const transform = new THREE.Object3D();
  const rotationAxis = new THREE.Vector3(0, 0, 1);
  const epsilon = 0.00001;

  for (const [index, placement] of placements.entries()) {
    const height = heights[index] ?? 0;
    transform.position.set(placement.x, placement.y, 0);
    transform.quaternion.setFromAxisAngle(rotationAxis, placement.rotation);
    transform.scale.set(
      height <= 0 ? placement.scale : epsilon,
      height <= 0 ? placement.scale : epsilon,
      Math.max(-height, epsilon),
    );
    transform.updateMatrix();
    sinkMesh.setMatrixAt(index, transform.matrix);

    transform.scale.set(
      height >= 0 ? placement.scale : epsilon,
      height >= 0 ? placement.scale : epsilon,
      Math.max(height, epsilon),
    );
    transform.updateMatrix();
    riseMesh.setMatrixAt(index, transform.matrix);
  }

  sinkMesh.count = placements.length;
  riseMesh.count = placements.length;
  sinkMesh.instanceMatrix.needsUpdate = true;
  riseMesh.instanceMatrix.needsUpdate = true;
  if (recomputeBounds) {
    sinkMesh.computeBoundingSphere();
    riseMesh.computeBoundingSphere();
  }
}

function requestHoverFrame(runtime: SceneRuntime) {
  if (!runtime.active || document.hidden) return;
  if (runtime.animationFrame !== null) return;
  runtime.lastFrameTime = performance.now();
  runtime.animationFrame = requestAnimationFrame((timestamp) => {
    animateHover(runtime, timestamp);
  });
}

function animateHover(runtime: SceneRuntime, timestamp: number) {
  runtime.animationFrame = null;
  if (!runtime.active || document.hidden) return;
  if (timestamp - runtime.lastFrameTime < 1000 / 30) {
    runtime.animationFrame = requestAnimationFrame((nextTimestamp) => {
      animateHover(runtime, nextTimestamp);
    });
    return;
  }
  const delta = Math.min((timestamp - runtime.lastFrameTime) / 1000, 0.032);
  runtime.lastFrameTime = timestamp;
  let moving = false;

  for (let index = 0; index < runtime.placements.length; index++) {
    const target =
      (runtime.raisedTargets[index] ?? 0) -
      (index === runtime.hoveredInstance ? HOVER_MOTION.depth : 0);
    let height = runtime.heights[index] ?? 0;
    const previousHeight = height;
    let velocity = runtime.velocities[index] ?? 0;

    velocity += (target - height) * HOVER_MOTION.stiffness * delta;
    velocity *= Math.exp(-HOVER_MOTION.damping * delta);
    height += velocity * delta;

    if (
      target === 0 &&
      runtime.hoveredInstance !== index &&
      previousHeight >= 0 &&
      height < 0
    ) {
      height = 0;
      velocity = 0;
    }

    runtime.heights[index] = height;
    runtime.velocities[index] = velocity;
    if (Math.abs(target - height) > 0.0003 || Math.abs(velocity) > 0.001) moving = true;
  }

  updatePatternInstances(
    runtime.mesh,
    runtime.riseMesh,
    runtime.placements,
    runtime.heights,
  );
  runtime.keyLight.shadow.needsUpdate = true;
  runtime.renderer.render(runtime.scene, runtime.camera);

  if (moving) {
    runtime.animationFrame = requestAnimationFrame((nextTimestamp) => {
      animateHover(runtime, nextTimestamp);
    });
  }
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clearHoldTimers(runtime: SceneRuntime) {
  for (const timer of runtime.holdTimers) {
    if (timer !== null) window.clearTimeout(timer);
  }
  runtime.holdTimers.fill(null);
}

function activateRandomInstance(runtime: SceneRuntime) {
  const candidates: number[] = [];
  const visibleHalfHeight =
    runtime.camera.position.z *
    Math.tan(THREE.MathUtils.degToRad(runtime.camera.fov / 2));
  const visibleHalfWidth = visibleHalfHeight * runtime.camera.aspect;
  const visibilityInset = 0.35;
  for (let index = 0; index < runtime.placements.length; index++) {
    const placement = runtime.placements[index];
    if (
      placement !== undefined &&
      Math.abs(placement.x) <= Math.max(0, visibleHalfWidth - visibilityInset) &&
      Math.abs(placement.y) <= Math.max(0, visibleHalfHeight - visibilityInset) &&
      (runtime.raisedTargets[index] ?? 0) === 0 &&
      Math.abs(runtime.heights[index] ?? 0) < 0.002
    ) {
      candidates.push(index);
    }
  }
  if (candidates.length === 0) return;

  const index = candidates[Math.floor(Math.random() * candidates.length)];
  if (index === undefined) return;
  const height =
    randomBetween(RANDOM_MOTION.minHeight, RANDOM_MOTION.maxHeight) *
    runtime.settings.heightMultiplier;
  runtime.raisedTargets[index] = height;
  requestHoverFrame(runtime);

  const holdMs =
    randomBetween(RANDOM_MOTION.minHoldMs, RANDOM_MOTION.maxHoldMs) *
    runtime.settings.holdMultiplier;
  runtime.holdTimers[index] = window.setTimeout(() => {
    runtime.holdTimers[index] = null;
    runtime.raisedTargets[index] = 0;
    requestHoverFrame(runtime);
  }, holdMs);
}

function scheduleRandomMotion(runtime: SceneRuntime, initial = false) {
  if (runtime.randomTimer !== null) window.clearTimeout(runtime.randomTimer);
  runtime.randomTimer = null;
  if (!runtime.active || document.hidden) return;
  const delay = initial
    ? 650
    : randomBetween(RANDOM_MOTION.minIntervalMs, RANDOM_MOTION.maxIntervalMs) /
      Math.max(runtime.settings.activeAmount, 0.5);

  runtime.randomTimer = window.setTimeout(() => {
    runtime.randomTimer = null;
    const desiredActive = Math.round(
      RANDOM_MOTION.baseActiveCount * runtime.settings.activeAmount,
    );
    let active = 0;
    for (let index = 0; index < runtime.placements.length; index++) {
      if ((runtime.raisedTargets[index] ?? 0) > 0) active++;
    }
    if (active < desiredActive) activateRandomInstance(runtime);
    scheduleRandomMotion(runtime);
  }, delay);
}

function applySettings(runtime: SceneRuntime, settings: ThreeSceneSettings) {
  const {
    renderer,
    scene,
    camera,
    mesh,
    riseMesh,
    ground,
    groundMaterial,
    frontMaterial,
    sideMaterial,
    ambientLight,
    keyLight,
    keyTarget,
    shapes,
  } = runtime;

  runtime.settings = settings;

  const nextPatternScaleKey = settings.scale.toFixed(3);
  let patternChanged = false;
  if (runtime.patternScaleKey !== nextPatternScaleKey) {
    runtime.placements = createPatternPlacements(shapes, settings.scale);
    clearHoldTimers(runtime);
    runtime.heights.fill(0);
    runtime.velocities.fill(0);
    runtime.raisedTargets.fill(0);
    runtime.hoveredInstance = null;
    rebuildGround(ground, groundMaterial, shapes, runtime.placements);
    runtime.patternScaleKey = nextPatternScaleKey;
    patternChanged = true;
  }
  updatePatternInstances(
    mesh,
    riseMesh,
    runtime.placements,
    runtime.heights,
    patternChanged,
  );

  const elementColor = new THREE.Color(settings.elementColor);
  frontMaterial.color.copy(elementColor);
  sideMaterial.color.copy(elementColor).multiplyScalar(0.76);
  groundMaterial.color.set(settings.backgroundColor);
  scene.background = new THREE.Color(settings.backgroundColor);

  camera.position.set(0, 0, 11);
  camera.fov = getViewportFov(
    settings.fov,
    camera.aspect,
    runtime.coverViewport,
  );
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  const lightAzimuth = THREE.MathUtils.degToRad(FIXED_LIGHTING.azimuth);
  keyLight.position.set(
    Math.cos(lightAzimuth) * 6,
    Math.sin(lightAzimuth) * 6,
    FIXED_LIGHTING.height,
  );
  keyTarget.position.set(0, 0, -HOVER_MOTION.depth * 0.15);
  keyTarget.updateMatrixWorld();
  keyLight.intensity = FIXED_LIGHTING.intensity;
  keyLight.shadow.radius = FIXED_LIGHTING.shadowSoftness;
  const visibleHalfHeight = 11 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const visibleHalfWidth = visibleHalfHeight * camera.aspect;
  const maxAnimatedHeight =
    RANDOM_MOTION.maxHeight * Math.max(settings.heightMultiplier, 0) +
    HOVER_MOTION.depth;
  const shadowExtent =
    Math.max(visibleHalfHeight, visibleHalfWidth) + 1.25 + maxAnimatedHeight * 0.35;
  keyLight.shadow.camera.left = -shadowExtent;
  keyLight.shadow.camera.right = shadowExtent;
  keyLight.shadow.camera.top = shadowExtent;
  keyLight.shadow.camera.bottom = -shadowExtent;
  keyLight.shadow.camera.updateProjectionMatrix();
  keyLight.shadow.needsUpdate = true;
  ambientLight.intensity = FIXED_LIGHTING.ambient * settings.lighting;

  renderer.render(scene, camera);
}

export default function ThreeExtrusionScene({
  settings,
  interactive = true,
  coverViewport = false,
}: {
  settings: ThreeSceneSettings;
  interactive?: boolean;
  coverViewport?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<SceneRuntime | null>(null);
  const settingsRef = useRef(settings);
  const [error, setError] = useState<string | null>(null);

  settingsRef.current = settings;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let removePointerListeners: (() => void) | null = null;
    let removeVisibilityListener: (() => void) | null = null;

    try {
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.domElement.dataset.threeCanvas = "true";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.setAttribute("aria-hidden", "true");
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);

      const loader = new SVGLoader();
      const svgData = loader.parse(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 543 472"><path d="${ICON_PATH}" fill="#fff"/></svg>`,
      );
      const shapes = svgData.paths.flatMap((path) => path.toShapes());
      const sinkGeometry = createExtrusionGeometry(shapes, "sink");
      const riseGeometry = createExtrusionGeometry(shapes, "rise");
      const placements = createPatternPlacements(shapes, settingsRef.current.scale);
      const heights = new Float32Array(PATTERN_CANVAS.maxInstances);
      const velocities = new Float32Array(PATTERN_CANVAS.maxInstances);
      const raisedTargets = new Float32Array(PATTERN_CANVAS.maxInstances);
      const holdTimers = Array<number | null>(PATTERN_CANVAS.maxInstances).fill(null);

      const frontMaterial = new THREE.MeshStandardMaterial({
        color: settingsRef.current.elementColor,
        roughness: 0.76,
        metalness: 0,
      });
      const sideMaterial = new THREE.MeshStandardMaterial({
        color: settingsRef.current.elementColor,
        roughness: 0.86,
        metalness: 0,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.InstancedMesh(
        sinkGeometry,
        [frontMaterial, sideMaterial],
        PATTERN_CANVAS.maxInstances,
      );
      const riseMesh = new THREE.InstancedMesh(
        riseGeometry,
        [frontMaterial, sideMaterial],
        PATTERN_CANVAS.maxInstances,
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.renderOrder = 1;
      riseMesh.castShadow = true;
      riseMesh.receiveShadow = true;
      riseMesh.renderOrder = 2;
      updatePatternInstances(
        mesh,
        riseMesh,
        placements,
        heights,
        true,
      );
      scene.add(mesh, riseMesh);

      const groundMaterial = new THREE.MeshStandardMaterial({
        color: settingsRef.current.backgroundColor,
        roughness: 1,
        metalness: 0,
      });
      const ground = new THREE.Group();
      rebuildGround(ground, groundMaterial, shapes, placements);
      scene.add(ground);

      const ambientLight = new THREE.HemisphereLight(0xffffff, 0xb9bcc2, 1);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.bias = 0;
      keyLight.shadow.normalBias = 0;
      const keyTarget = new THREE.Object3D();
      scene.add(keyLight, keyTarget);
      keyLight.target = keyTarget;

      const runtime: SceneRuntime = {
        renderer,
        scene,
        camera,
        mesh,
        riseMesh,
        ground,
        groundMaterial,
        frontMaterial,
        sideMaterial,
        ambientLight,
        keyLight,
        keyTarget,
        shapes,
        placements,
        patternScaleKey: settingsRef.current.scale.toFixed(3),
        heights,
        velocities,
        raisedTargets,
        holdTimers,
        hoveredInstance: null,
        animationFrame: null,
        lastFrameTime: performance.now(),
        randomTimer: null,
        active: false,
        settings: settingsRef.current,
        coverViewport,
      };
      runtimeRef.current = runtime;

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const setHoveredInstance = (instanceId: number | null) => {
        if (runtime.hoveredInstance === instanceId) return;

        const previousInstance = runtime.hoveredInstance;
        if (previousInstance !== null) {
          runtime.velocities[previousInstance] = Math.abs(
            runtime.velocities[previousInstance] ?? 0,
          );
        }
        if (instanceId !== null) {
          runtime.velocities[instanceId] = -Math.abs(
            runtime.velocities[instanceId] ?? 0,
          );
        }

        runtime.hoveredInstance = instanceId;
        renderer.domElement.style.cursor = instanceId === null ? "default" : "pointer";
        requestHoverFrame(runtime);
      };
      const onPointerMove = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects([riseMesh, mesh], false)[0];
        setHoveredInstance(hit?.instanceId ?? null);
      };
      const onPointerLeave = () => setHoveredInstance(null);
      if (interactive) {
        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("pointerleave", onPointerLeave);
        removePointerListeners = () => {
          renderer.domElement.removeEventListener("pointermove", onPointerMove);
          renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
        };
      }

      const resize = () => {
        const rect = mount.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        applySettings(runtime, settingsRef.current);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const pause = () => {
        runtime.active = false;
        if (runtime.animationFrame !== null) cancelAnimationFrame(runtime.animationFrame);
        runtime.animationFrame = null;
        if (runtime.randomTimer !== null) window.clearTimeout(runtime.randomTimer);
        runtime.randomTimer = null;
        clearHoldTimers(runtime);
      };
      const resume = () => {
        if (document.hidden || runtime.active) return;
        runtime.active = true;
        scheduleRandomMotion(runtime, true);
      };
      const syncActivity = (visible: boolean) => {
        if (visible && !document.hidden) resume();
        else pause();
      };
      let inViewport = false;
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          inViewport = Boolean(entry?.isIntersecting);
          syncActivity(inViewport);
        },
        { rootMargin: "120px 0px" },
      );
      visibilityObserver.observe(mount);
      const onVisibilityChange = () => syncActivity(inViewport);
      document.addEventListener("visibilitychange", onVisibilityChange);
      removeVisibilityListener = () =>
        document.removeEventListener("visibilitychange", onVisibilityChange);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "WebGL não pôde ser iniciado.");
    }

    return () => {
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      removeVisibilityListener?.();
      removePointerListeners?.();
      const runtime = runtimeRef.current;
      runtimeRef.current = null;
      if (!runtime) return;

      if (runtime.animationFrame !== null) cancelAnimationFrame(runtime.animationFrame);
      if (runtime.randomTimer !== null) window.clearTimeout(runtime.randomTimer);
      clearHoldTimers(runtime);

      runtime.mesh.geometry.dispose();
      runtime.riseMesh.geometry.dispose();
      runtime.frontMaterial.dispose();
      runtime.sideMaterial.dispose();
      for (const child of runtime.ground.children) {
        if (child instanceof THREE.Mesh) child.geometry.dispose();
      }
      runtime.groundMaterial.dispose();
      runtime.renderer.dispose();
      runtime.renderer.domElement.remove();
    };
  }, [coverViewport, interactive]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (runtime) applySettings(runtime, settings);
  }, [settings]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 overflow-hidden"
      role="img"
      aria-label="Pattern Stratum tridimensional interativo; peças sobem aleatoriamente e afundam ao passar o cursor"
    >
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-[#efefed] p-8 text-center text-sm text-black/55">
          <p>Não foi possível iniciar a cena 3D: {error}</p>
        </div>
      )}
    </div>
  );
}
