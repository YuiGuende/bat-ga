import { clamp, distance, normalize } from "../math/vector.js";
import { resolveCircleObstacle } from "../math/collision.js";

const PLAY_AREA_POLYGON = [
  { x: 197, y: 157 },
  { x: 798, y: 157 },
  { x: 798, y: 242 },
  { x: 1000, y: 242 },
  { x: 1000, y: 378 },
  { x: 798, y: 378 },
  { x: 798, y: 563 },
  { x: 503, y: 563 },
  { x: 503, y: 650 },
  { x: 437, y: 650 },
  { x: 437, y: 563 },
  { x: 197, y: 563 }
];

function isPointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function keepInsideWorld(entity, settings) {
  if (entity.lastValidX === undefined) {
    entity.lastValidX = entity.x;
    entity.lastValidY = entity.y;
  }

  const previousX = entity.x;
  const previousY = entity.y;

  entity.x = clamp(entity.x, entity.radius, settings.worldWidth - entity.radius);
  entity.y = clamp(entity.y, entity.radius, settings.worldHeight - entity.radius);

  let hit = false;
  if (entity.x !== previousX || entity.y !== previousY) {
    hit = true;
  }

  if (!isPointInPolygon(entity.x, entity.y, PLAY_AREA_POLYGON)) {
    entity.x = entity.lastValidX;
    entity.y = entity.lastValidY;

    if (!isPointInPolygon(entity.x, entity.y, PLAY_AREA_POLYGON)) {
      entity.x = 480;
      entity.y = 350;
    }
    hit = true;
  }

  if (hit) {
    entity.directionX *= -1;
    entity.directionY *= -1;
  } else {
    entity.lastValidX = entity.x;
    entity.lastValidY = entity.y;
  }

  return hit;
}

export function resolveObstacleCollisions(entity, world, statsKey) {
  let collided = false;

  for (const obstacle of world.obstacles) {
    if (resolveCircleObstacle(entity, obstacle)) {
      collided = true;
      if (statsKey) {
        world.stats[statsKey] += 1;
      }
    }
  }

  return collided;
}

export function resolveChickenSeparation(world) {
  const chickens = world.chickens.filter((chicken) => !chicken.secured);

  for (let i = 0; i < chickens.length; i += 1) {
    for (let j = i + 1; j < chickens.length; j += 1) {
      const a = chickens[i];
      const b = chickens[j];
      const minimumDistance = a.radius + b.radius + 2;
      const currentDistance = distance(a, b);

      if (currentDistance > 0 && currentDistance < minimumDistance) {
        const normal = normalize(a.x - b.x, a.y - b.y);
        const push = (minimumDistance - currentDistance) / 2;
        a.x += normal.x * push;
        a.y += normal.y * push;
        b.x -= normal.x * push;
        b.y -= normal.y * push;
      }
    }
  }
}
