export function triggerChickenCall(world, settings) {
  if (world.completed) return;

  const player = world.player;
  const dirX = player.directionX;
  const dirY = player.directionY;

  const callId = `call-${world.clapSequence++}`;

  const newCall = {
    id: callId,
    x: player.x,
    y: player.y,
    active: true,
    age: 0,
    duration: settings.chickenCallDuration,
    radius: settings.chickenCallRadius,

    text: "quác",
    textX: player.x,
    textY: player.y - player.radius,
    textVx: dirX * 180,
    textVy: dirY * 180,
    textAge: 0,
    textMaxAge: 1.0
  };

  world.chickenCalls.push(newCall);
}

export function updateChickenCalls(world, settings, deltaTime) {
  for (const call of world.chickenCalls) {
    call.age += deltaTime;

    if (call.textAge < call.textMaxAge) {
      call.textAge += deltaTime;
      call.textX += call.textVx * deltaTime;
      call.textY += call.textVy * deltaTime;
    }

    if (call.age >= call.duration) {
      call.active = false;
    }
  }

  world.chickenCalls = world.chickenCalls.filter((call) => call.active);
}
