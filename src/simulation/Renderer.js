import backgroundImage from "../asset/background.png";
import cageImage from "../asset/cage.png";
import conGaImage from "../asset/con_ga.png";
import conGaDangChayImage from "../asset/con_ga_dang_chay.png";
import dongRomImage from "../asset/dong_rom.png";
import nhanVatImage from "../asset/nhan_vat.png";
import gateImage from "../asset/gate.png";

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
      nhan_vat: new Image(),
      gate: new Image()
    };

    this.images.background.src = backgroundImage;
    this.images.cage.src = cageImage;
    this.images.con_ga.src = conGaImage;
    this.images.con_ga_dang_chay.src = conGaDangChayImage;
    this.images.dong_rom.src = dongRomImage;
    this.images.nhan_vat.src = nhanVatImage;
    this.images.gate.src = gateImage;
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

    this.drawPlayer(ctx, world.player);
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

        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
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
  }

  drawPlayer(ctx, player) {
    ctx.save();
    const sprinting = player.sprintActiveTime > 0;
    if (sprinting) {
      ctx.strokeStyle = "rgba(255, 245, 180, 0.75)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.images.nhan_vat.complete && this.images.nhan_vat.naturalWidth !== 0) {
      ctx.translate(player.x, player.y);
      // Flip horizontally if moving left (directionX < 0)
      // Assuming sprite faces right by default.
      if (player.directionX < 0) {
        ctx.scale(-1, 1);
      }
      const size = player.radius * 2 * 3.8;
      ctx.drawImage(this.images.nhan_vat, -size / 2, -size / 2, size, size);
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
