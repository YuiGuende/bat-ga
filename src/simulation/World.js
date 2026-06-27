import { createPlayer } from "../entities/createPlayer.js";
import { createChicken } from "../entities/createChicken.js";
import { createCoop } from "../entities/createCoop.js";
import { createObstacle } from "../entities/createObstacle.js";

export function createWorld(settings) {
  const chickens = [
    createChicken(0, "hen", settings),
    createChicken(1, "hen", settings),
    createChicken(2, "hen", settings),
    createChicken(3, "hen", settings),
    createChicken(4, "hen", settings),
    createChicken(5, "rooster", settings)
  ];

  return {
    player: createPlayer(settings),
    chickens,
    grainPiles: [],
    obstacles: [
      createObstacle("rock-01", 340, 190, 20, "hay"),
      createObstacle("rock-02", 650, 210, 18, "hay"),
      createObstacle("rock-03", 665, 505, 22, "hay"),
      createObstacle("hay-01", 480, 325, 34, "hay"),
      createObstacle("hay-02", 310, 420, 30, "hay")
    ],
    coop: createCoop(settings),
    clapWaves: [],
    chickenCalls: [],
    stats: {
      startedAt: 0,
      elapsedTime: 0,
      grainDropsUsed: 0,
      coopToggles: 0,
      clapsUsed: 0,
      panicCount: 0,
      obstacleCollisions: 0,
      stuckRecoveries: 0,
      coopBailed: 0,
      playerDistance: 0,
      averageChickenDistance: 0
    },
    completed: false,
    paused: false,
    grainCharges: settings.grainDropCount,
    grainRechargeTimer: 0,
    grainSequence: 0,
    clapSequence: 0,
    clapCooldownRemaining: 0,
    chickenCallCooldownRemaining: 0,
    grainDropCooldownRemaining: 0
  };
}

export function snapshotWorld(world, settings) {
  const securedCount = world.chickens.filter((chicken) => chicken.secured).length;
  const totalChickenDistance = world.chickens.reduce((sum, chicken) => sum + chicken.distanceTravelled, 0);

  return {
    elapsedTime: world.stats.elapsedTime,
    grainDropsUsed: world.stats.grainDropsUsed,
    grainDropsRemaining: world.grainCharges,
    grainRechargeRemaining:
      world.grainCharges >= settings.grainDropCount ? 0 : Math.max(0, settings.grainRechargeInterval - world.grainRechargeTimer),
    grainRemaining: world.grainPiles.reduce((sum, pile) => sum + pile.amount, 0),
    securedCount,
    chickenCount: world.chickens.length,
    completed: world.completed,
    paused: world.paused,
    coopClosed: world.coop.closed,
    activeClapWaves: world.clapWaves.length,
    playerSprint: {
      active: world.player.sprintActiveTime > 0,
      activeTime: world.player.sprintActiveTime,
      cooldownRemaining: world.player.sprintActiveTime > 0 ? 0 : world.player.sprintCooldownRemaining
    },
    cooldowns: {
      sprint: {
        current: world.player.sprintActiveTime > 0 ? 0 : world.player.sprintCooldownRemaining,
        max: settings.playerSprintCooldown
      },
      clap: {
        current: world.clapCooldownRemaining || 0,
        max: settings.clapCooldown
      },
      call: {
        current: world.chickenCallCooldownRemaining || 0,
        max: settings.chickenCallCooldown
      },
      grain: {
        current: world.grainDropCooldownRemaining || 0,
        max: settings.grainDropCooldown
      }
    },
    stats: {
      ...world.stats,
      averageChickenDistance: world.chickens.length > 0 ? totalChickenDistance / world.chickens.length : 0
    },
    chickens: world.chickens.map((chicken) => ({
      id: chicken.id,
      type: chicken.type,
      state: chicken.state,
      secured: chicken.secured,
      coopStayTime: chicken.coopStayTime,
      panicTriggerCount: chicken.panicTriggerCount
    }))
  };
}
