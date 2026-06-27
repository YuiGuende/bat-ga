import { isCircleInsideRect } from "../math/geometry.js";
import { clamp, normalize } from "../math/vector.js";

function getGateBounds(coop) {
  const gateOffset = 22;
  const centerY = coop.y + coop.height / 2 + gateOffset;
  const halfGate = coop.gateWidth / 2;

  return {
    x: coop.x,
    y: centerY - halfGate,
    width: coop.wallThickness,
    height: coop.gateWidth,
    top: centerY - halfGate,
    bottom: centerY + halfGate
  };
}

function getCoopWallRects(coop, isPlayer = false) {
  const thickness = coop.wallThickness;
  const gate = getGateBounds(coop);
  const walls = [
    { x: coop.x, y: coop.y - thickness / 2, width: coop.width, height: thickness },
    { x: coop.x, y: coop.y + coop.height - thickness / 2, width: coop.width, height: thickness },
    { x: coop.x + coop.width - thickness / 2, y: coop.y, width: thickness, height: coop.height },
    { x: coop.x - thickness / 2, y: coop.y, width: thickness, height: gate.top - coop.y },
    {
      x: coop.x - thickness / 2,
      y: gate.bottom,
      width: thickness,
      height: coop.y + coop.height - gate.bottom
    }
  ];

  if (coop.closed || isPlayer) {
    walls.push({
      x: coop.x - thickness / 2,
      y: gate.top,
      width: thickness,
      height: coop.gateWidth
    });
  }

  return walls;
}

function resolveCircleRectCollision(entity, rect) {
  const closestX = clamp(entity.x, rect.x, rect.x + rect.width);
  const closestY = clamp(entity.y, rect.y, rect.y + rect.height);
  let offsetX = entity.x - closestX;
  let offsetY = entity.y - closestY;
  let distanceSquared = offsetX * offsetX + offsetY * offsetY;

  if (distanceSquared > entity.radius * entity.radius) {
    return false;
  }

  if (distanceSquared <= 0.0001) {
    const distances = [
      { value: Math.abs(entity.x - rect.x), x: -1, y: 0, targetX: rect.x - entity.radius, targetY: entity.y },
      {
        value: Math.abs(rect.x + rect.width - entity.x),
        x: 1,
        y: 0,
        targetX: rect.x + rect.width + entity.radius,
        targetY: entity.y
      },
      { value: Math.abs(entity.y - rect.y), x: 0, y: -1, targetX: entity.x, targetY: rect.y - entity.radius },
      {
        value: Math.abs(rect.y + rect.height - entity.y),
        x: 0,
        y: 1,
        targetX: entity.x,
        targetY: rect.y + rect.height + entity.radius
      }
    ].sort((a, b) => a.value - b.value);

    const push = distances[0];
    entity.x = push.targetX;
    entity.y = push.targetY;
    offsetX = push.x;
    offsetY = push.y;
  } else {
    const dist = Math.sqrt(distanceSquared);
    const push = entity.radius - dist;
    offsetX /= dist;
    offsetY /= dist;
    entity.x += offsetX * push;
    entity.y += offsetY * push;
  }

  const dotProduct = entity.directionX * offsetX + entity.directionY * offsetY;
  entity.directionX -= 2 * dotProduct * offsetX;
  entity.directionY -= 2 * dotProduct * offsetY;
  const next = normalize(entity.directionX, entity.directionY);
  entity.directionX = next.x;
  entity.directionY = next.y;

  return true;
}

export function resolveCoopWallCollisions(entity, coop, isPlayer = false) {
  let collided = false;

  for (const wall of getCoopWallRects(coop, isPlayer)) {
    if (resolveCircleRectCollision(entity, wall)) {
      collided = true;
    }
  }

  return collided;
}

export function updateCoop(world, settings, deltaTime) {
  const coop = world.coop;
  coop.requiredStayTime = settings.coopRequiredStayTime;
  coop.gateWidth = settings.coopGateWidth;
  coop.wallThickness = settings.coopWallThickness;

  const targetSlide = coop.closed ? 1 : 0;
  const slideSpeed = 4.0;
  if (coop.gateSlide === undefined) coop.gateSlide = targetSlide;
  if (coop.gateSlide < targetSlide) {
    coop.gateSlide = Math.min(targetSlide, coop.gateSlide + slideSpeed * deltaTime);
  } else if (coop.gateSlide > targetSlide) {
    coop.gateSlide = Math.max(targetSlide, coop.gateSlide - slideSpeed * deltaTime);
  }

  for (const chicken of world.chickens) {
    if (chicken.secured) {
      if (coop.closed) {
        chicken.state = "SECURED";
        chicken.speed = 0;
        continue;
      }

      if (!isCircleInsideRect(chicken, coop)) {
        chicken.secured = false;
        chicken.state = "COOP_RELEASED";
        chicken.coopStayTime = 0;
        world.stats.coopBailed += 1;
      } else if (!["ESCAPE", "PANIC", "CLAP_PANIC"].includes(chicken.state)) {
        chicken.state = "COOP_OPEN";
      }

      continue;
    }

    const gate = getGateBounds(coop);
    const touchesGate = !coop.closed &&
      chicken.x + chicken.radius >= coop.x &&
      chicken.y >= gate.top - chicken.radius &&
      chicken.y <= gate.bottom + chicken.radius;

    const inside = isCircleInsideRect(chicken, coop) || touchesGate;

    if (inside) {
      chicken.secured = true;
      chicken.state = "SECURED";
      chicken.speed = 0;
      chicken.x = coop.x + coop.width / 2;
      chicken.y = coop.y + coop.height / 2 + (Math.random() - 0.5) * 40;
      chicken.coopStayTime = coop.requiredStayTime;
      chicken.panicTriggerCount = 0;
    }
  }

  const allSecured = world.chickens.every((chicken) => chicken.secured);
  if (allSecured && !world.completed) {
    world.completed = true;
    world.paused = true;
    coop.closed = true;
  }
}
