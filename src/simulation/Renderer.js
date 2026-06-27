import backgroundImage from "../asset/background.png";
import cageImage from "../asset/cage.png";
import conGaImage from "../asset/con_ga.png";
import conGaDangChayImage from "../asset/con_ga_dang_chay.png";
import dongRomImage from "../asset/dong_rom.png";
import gateImage from "../asset/gate.png";
import lanAnhIdle from "../asset/lan_anh_move/lan_anh_idle.png";
import lanAnhRunDown from "../asset/lan_anh_move/lan_anh_run_down.png";
import lanAnhRunLeft from "../asset/lan_anh_move/lan_anh_run_left.png";
import lanAnhRunRight from "../asset/lan_anh_move/lan_anh_run_right.png";
import lanAnhRunUp from "../asset/lan_anh_move/lan_anh_run_up.png";
import lanAnhWalkDown from "../asset/lan_anh_move/lan_anh_walk_down.png";
import lanAnhWalkLeft from "../asset/lan_anh_move/lan_anh_walk_left.png";
import lanAnhWalkRight from "../asset/lan_anh_move/lan_anh_walk_right.png";
import lanAnhWalkUp from "../asset/lan_anh_move/lan_anh_walk_up.png";
import lanAnhLayDown from "../asset/lan_anh_move/lan_anh_lay_down.png";

export class Renderer {
  constructor(canvas, settings) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.settings = settings;

    this.images = {
      background: new Image(),
      cage: new Image(),
      con_ga: new Image(),
      con_ga_dang_chay: new Image(),
      dong_rom: new Image(),
      gate: new Image(),
      lan_anh_idle: new Image(),
      lan_anh_run_down: new Image(),
      lan_anh_run_left: new Image(),
      lan_anh_run_right: new Image(),
      lan_anh_run_up: new Image(),
      lan_anh_walk_down: new Image(),
      lan_anh_walk_left: new Image(),
      lan_anh_walk_right: new Image(),
      lan_anh_walk_up: new Image(),
      lan_anh_lay_down: new Image()
    };

    this.images.background.src = backgroundImage;
    this.images.cage.src = cageImage;
    this.images.con_ga.src = conGaImage;
    this.images.con_ga_dang_chay.src = conGaDangChayImage;
    this.images.dong_rom.src = dongRomImage;
    this.images.gate.src = gateImage;
    this.images.lan_anh_idle.src = lanAnhIdle;
    this.images.lan_anh_run_down.src = lanAnhRunDown;
    this.images.lan_anh_run_left.src = lanAnhRunLeft;
    this.images.lan_anh_run_right.src = lanAnhRunRight;
    this.images.lan_anh_run_up.src = lanAnhRunUp;
    this.images.lan_anh_walk_down.src = lanAnhWalkDown;
    this.images.lan_anh_walk_left.src = lanAnhWalkLeft;
    this.images.lan_anh_walk_right.src = lanAnhWalkRight;
    this.images.lan_anh_walk_up.src = lanAnhWalkUp;
    this.images.lan_anh_lay_down.src = lanAnhLayDown;
  }

  setSettings(settings) {
    this.settings = settings;
  }

  render(world) {
    const ctx = this.context;
    const settings = this.settings;

    ctx.clearRect(0, 0, settings.worldWidth, settings.worldHeight);
    this.drawField(ctx, settings);
    this.drawCoop(ctx, world.coop);
    this.drawGrain(ctx, world.grainPiles);
    this.drawClapWaves(ctx, world.clapWaves);
    this.drawChickenCalls(ctx, world.chickenCalls);
    this.drawObstacles(ctx, world.obstacles);

    for (const chicken of world.chickens) {
      this.drawChicken(ctx, chicken, world.player);
    }

    this.drawPlayer(ctx, world.player, world.stats.elapsedTime || 0);
  }

  drawField(ctx, settings) {
    if (this.images.background.complete && this.images.background.naturalWidth !== 0) {
      ctx.drawImage(this.images.background, 0, 0, settings.worldWidth, settings.worldHeight);
    } else {
      ctx.fillStyle = "#879f5a";
      ctx.fillRect(0, 0, settings.worldWidth, settings.worldHeight);
    }

    const isDebugging = settings.debugShowRadii || settings.debugShowCone || settings.debugShowDirection || settings.debugShowCollision || settings.debugShowState;
    if (isDebugging || !(this.images.background.complete && this.images.background.naturalWidth !== 0)) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= settings.worldWidth; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, settings.worldHeight);
        ctx.stroke();
      }
      for (let y = 0; y <= settings.worldHeight; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(settings.worldWidth, y);
        ctx.stroke();
      }
    }
  }

  drawCoop(ctx, coop) {
    const thickness = coop.wallThickness;
    const gateOffset = 18;
    const gateCenterY = coop.y + coop.height / 2 + gateOffset;
    const gateTop = gateCenterY - coop.gateWidth / 2;
    const gateBottom = gateCenterY + coop.gateWidth / 2;

    ctx.save();
    if (this.images.cage.complete && this.images.cage.naturalWidth !== 0) {
      // Draw cage image shifted left and up to account for transparent margins,
      // and stretch it vertically.
      ctx.drawImage(
        this.images.cage,
        coop.x - 30,
        coop.y - 15,
        coop.width + 55,
        coop.height + 35
      );
    } else {
      ctx.fillStyle = "rgba(220, 245, 205, 0.2)";
      ctx.fillRect(coop.x, coop.y, coop.width, coop.height);

      ctx.strokeStyle = "rgba(82, 53, 30, 0.55)";
      ctx.lineWidth = 2;
      for (let x = coop.x + 18; x < coop.x + coop.width; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, coop.y);
        ctx.lineTo(x, coop.y + coop.height);
        ctx.stroke();
      }

      ctx.fillStyle = "#52351e";
      ctx.fillRect(coop.x, coop.y - thickness / 2, coop.width, thickness);
      ctx.fillRect(coop.x, coop.y + coop.height - thickness / 2, coop.width, thickness);
      ctx.fillRect(coop.x + coop.width - thickness / 2, coop.y, thickness, coop.height);
      ctx.fillRect(coop.x - thickness / 2, coop.y, thickness, gateTop - coop.y);
      ctx.fillRect(coop.x - thickness / 2, gateBottom, thickness, coop.y + coop.height - gateBottom);
    }

    const gateSlide = coop.gateSlide !== undefined ? coop.gateSlide : (coop.closed ? 1 : 0);
    const drawY = gateTop - (1 - gateSlide) * coop.gateWidth;

    if (this.images.gate.complete && this.images.gate.naturalWidth !== 0) {
      const gateWidth = thickness * 2.2;
      ctx.drawImage(this.images.gate, coop.x - gateWidth / 2, drawY, gateWidth, coop.gateWidth);
    } else {
      ctx.fillStyle = "#2f1c13";
      ctx.fillRect(coop.x - thickness / 2, drawY, thickness, coop.gateWidth);
    }

    ctx.font = "12px Inter, sans-serif";
    ctx.fillStyle = "#102018";
    ctx.fillText(coop.closed ? "LOCKED" : "OPEN", coop.x + 44, coop.y + coop.height + 22);
    ctx.restore();
  }

  drawChickenCalls(ctx, calls) {
    for (const call of calls) {
      if (call.textAge < call.textMaxAge) {
        ctx.save();
        const progress = call.textAge / call.textMaxAge;
        const fontSize = 14 + progress * 24;
        const alpha = Math.max(0, 1 - progress);

        ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // White outline stroke
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.strokeText(call.text, call.textX, call.textY);

        // Black fill
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillText(call.text, call.textX, call.textY);
        ctx.restore();
      }
    }
  }

  drawClapWaves(ctx, waves) {
    for (const wave of waves) {
      const alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);
      ctx.save();
      ctx.strokeStyle = `rgba(255, 245, 180, ${0.65 * alpha})`;
      ctx.lineWidth = wave.width;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(70, 45, 20, ${0.45 * alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawGrain(ctx, piles) {
    for (const pile of piles) {
      ctx.save();
      ctx.fillStyle = pile.tooCloseToCoopGate ? "rgba(150, 75, 55, 0.12)" : "rgba(169, 116, 51, 0.16)";
      ctx.beginPath();
      ctx.arc(pile.x, pile.y, pile.attractionRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = pile.tooCloseToCoopGate ? "#8d6c56" : "#d6ad62";
      const grainCount = Math.max(3, Math.ceil(pile.amount));
      for (let i = 0; i < grainCount; i += 1) {
        const angle = (i / grainCount) * Math.PI * 2;
        const radius = 3 + (i % 4) * 2.2;
        ctx.beginPath();
        ctx.arc(pile.x + Math.cos(angle) * radius, pile.y + Math.sin(angle) * radius, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (pile.tooCloseToCoopGate) {
        ctx.strokeStyle = "rgba(80, 35, 20, 0.75)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pile.x, pile.y, pile.radius + 7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pile.x - 8, pile.y - 8);
        ctx.lineTo(pile.x + 8, pile.y + 8);
        ctx.moveTo(pile.x + 8, pile.y - 8);
        ctx.lineTo(pile.x - 8, pile.y + 8);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  drawObstacles(ctx, obstacles) {
    for (const obstacle of obstacles) {
      ctx.save();
      if (obstacle.kind === "hay" && this.images.dong_rom.complete && this.images.dong_rom.naturalWidth !== 0) {
        const size = obstacle.radius * 2.4;
        ctx.drawImage(this.images.dong_rom, obstacle.x - size / 2, obstacle.y - size / 2, size, size);
      } else {
        ctx.fillStyle = obstacle.kind === "hay" ? "#3b3525" : "#202322";
        ctx.strokeStyle = obstacle.kind === "hay" ? "#b89d52" : "#111";
        ctx.lineWidth = obstacle.kind === "hay" ? 4 : 2;
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  drawChicken(ctx, chicken, player) {
    const settings = this.settings;

    if (settings.debugShowRadii && !chicken.secured) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      for (const radius of [chicken.alertRadius, chicken.pressureRadius, chicken.panicRadius]) {
        ctx.beginPath();
        ctx.arc(chicken.x, chicken.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (settings.debugShowCone && ["ESCAPE", "PANIC"].includes(chicken.state)) {
      const half = ((chicken.state === "PANIC" ? Math.min(150, settings.escapeConeAngle + 35) : settings.escapeConeAngle) * Math.PI) / 360;
      const base = Math.atan2(chicken.lastEscapeBase.y, chicken.lastEscapeBase.x);
      ctx.save();
      ctx.fillStyle = chicken.state === "PANIC" ? "rgba(226, 85, 55, 0.18)" : "rgba(242, 205, 92, 0.18)";
      ctx.beginPath();
      ctx.moveTo(chicken.x, chicken.y);
      ctx.arc(chicken.x, chicken.y, 82, base - half, base + half);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    if (settings.debugShowDirection) {
      ctx.save();
      ctx.strokeStyle = "#1d2630";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(chicken.x, chicken.y);
      ctx.lineTo(chicken.x + chicken.directionX * 30, chicken.y + chicken.directionY * 30);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    const isRunning = ["ESCAPE", "PANIC"].includes(chicken.state);
    const img = isRunning ? this.images.con_ga_dang_chay : this.images.con_ga;

    if (img.complete && img.naturalWidth !== 0) {
      ctx.translate(chicken.x, chicken.y);
      // Flip horizontally if moving right (directionX > 0)
      // Assuming sprite faces left by default.
      if (chicken.directionX > 0) {
        ctx.scale(-1, 1);
      }
      const size = chicken.radius * 2 * 2.2;
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
    } else {
      ctx.fillStyle = chicken.secured ? "#9bd67b" : chicken.type === "rooster" ? "#c83232" : "#44b65a";
      ctx.strokeStyle = "#142117";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(chicken.x, chicken.y, chicken.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(chicken.x + chicken.directionX * chicken.radius * 0.55, chicken.y + chicken.directionY * chicken.radius * 0.55, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (settings.debugShowState) {
      ctx.font = "11px Inter, sans-serif";
      ctx.fillStyle = "#102018";
      ctx.fillText(chicken.state, chicken.x + 12, chicken.y - 10);
    }

    if (settings.debugShowCollision) {
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.arc(chicken.x, chicken.y, chicken.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    if (settings.debugShowCone && ["ESCAPE", "PANIC"].includes(chicken.state)) {
      ctx.save();
      ctx.strokeStyle = "rgba(60, 20, 20, 0.45)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(chicken.x, chicken.y);
      ctx.stroke();
      ctx.restore();
    }

    // Angry Red Flashing Aura Overlay for chickens panicked 3 or more times
    if (chicken.panicTriggerCount >= 3 && !chicken.secured) {
      const flashFreq = chicken.panicTriggerCount === 3 ? 2 : chicken.panicTriggerCount === 4 ? 4.5 : 7.5;
      const elapsed = performance.now() / 1000;
      const flashVal = (Math.sin(elapsed * Math.PI * 2 * flashFreq) + 1) / 2; // oscillates 0 to 1

      ctx.save();
      // Glowing red stroke aura
      ctx.strokeStyle = `rgba(255, 0, 0, ${0.4 + flashVal * 0.5})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "red";
      ctx.shadowBlur = 6 + flashVal * 8;
      ctx.beginPath();
      ctx.arc(chicken.x, chicken.y, chicken.radius * 1.35, 0, Math.PI * 2);
      ctx.stroke();

      // Semi-transparent red overlay
      ctx.fillStyle = `rgba(255, 0, 0, ${flashVal * 0.28})`;
      ctx.beginPath();
      ctx.arc(chicken.x, chicken.y, chicken.radius * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawPlayer(ctx, player, elapsedTime = 0) {
    ctx.save();
    const isStunned = (player.layDownTimeRemaining || 0) > 0;
    const sprinting = player.sprintActiveTime > 0 && !isStunned;
    if (sprinting) {
      ctx.strokeStyle = "rgba(255, 245, 180, 0.75)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Determine movement direction and state
    const isMoving = !isStunned && (Math.abs(player.velocityX) > 0.01 || Math.abs(player.velocityY) > 0.01);
    let direction = "down";
    if (isMoving) {
      if (Math.abs(player.directionX) > Math.abs(player.directionY)) {
        direction = player.directionX > 0 ? "right" : "left";
      } else {
        direction = player.directionY > 0 ? "down" : "up";
      }
    }

    // Select correct image
    let img = this.images.lan_anh_idle;
    let animSpeed = 6; // frames per second

    if (isStunned) {
      img = this.images.lan_anh_lay_down;
    } else if (isMoving) {
      if (sprinting) {
        animSpeed = 12;
        if (direction === "up") img = this.images.lan_anh_run_up;
        else if (direction === "down") img = this.images.lan_anh_run_down;
        else if (direction === "left") img = this.images.lan_anh_run_left;
        else if (direction === "right") img = this.images.lan_anh_run_right;
      } else {
        animSpeed = 8;
        if (direction === "up") img = this.images.lan_anh_walk_up;
        else if (direction === "down") img = this.images.lan_anh_walk_down;
        else if (direction === "left") img = this.images.lan_anh_walk_left;
        else if (direction === "right") img = this.images.lan_anh_walk_right;
      }
    }

    if (img.complete && img.naturalWidth !== 0) {
      const frameWidth = img.naturalWidth;
      const frameHeight = img.naturalHeight;

      // Draw preserving correct aspect ratio.
      // Make the character's height proportional to the collision radius.
      const targetHeight = player.radius * 2 * 3.8 * 0.6;
      const targetWidth = targetHeight * (frameWidth / frameHeight);

      ctx.translate(player.x, player.y);
      ctx.drawImage(
        img,
        -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight
      );
    } else {
      ctx.fillStyle = sprinting ? "#fff07a" : "#ffd34d";
      ctx.strokeStyle = "#3c2a00";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
}
