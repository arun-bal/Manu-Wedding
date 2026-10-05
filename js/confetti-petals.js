/**
 * Flower Petal & Golden Sparkle Particle Engine
 * Creates realistic, celebratory rose, jasmine, marigold petals and golden foil confetti
 */

class PetalCelebration {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "petal-canvas";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "9998";
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.ambientParticles = [];
    this.isRunning = false;
    this.ambientActive = true;

    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Pre-create some ambient petals
    this.initAmbient();
    this.startLoop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  // Pre-generate petal color palettes
  static get PALETTES() {
    return {
      rose: ["#c5283d", "#d7385e", "#9e192c", "#e74c3c", "#f368e0"],
      marigold: ["#f39c12", "#e67e22", "#f1c40f", "#ff9f1a", "#e58e26"],
      jasmine: ["#ffffff", "#fff9e6", "#fef6e4", "#f8f9fa", "#fff0c2"],
      gold: ["#d4af37", "#f3e5ab", "#c59b27", "#f7d774", "#aa771c"]
    };
  }

  createPetal(x, y, isBurst = false) {
    const types = ["rose", "marigold", "jasmine", "gold"];
    const type = types[Math.floor(Math.random() * types.length)];
    const colorList = PetalCelebration.PALETTES[type];
    const color = colorList[Math.floor(Math.random() * colorList.length)];

    let vx, vy;
    if (isBurst) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed - 4; // slight upward bias
    } else {
      vx = (Math.random() - 0.5) * 2;
      vy = Math.random() * 2 + 1.5;
    }

    return {
      x: x !== undefined ? x : Math.random() * this.width,
      y: y !== undefined ? y : -20,
      size: Math.random() * 10 + 8,
      type: type,
      color: color,
      vx: vx,
      vy: vy,
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() - 0.5) * 0.08,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.04 + 0.02,
      swayAmplitude: Math.random() * 2 + 1,
      opacity: 1,
      fadeRate: isBurst ? Math.random() * 0.005 + 0.003 : 0,
      isBurst: isBurst
    };
  }

  initAmbient() {
    const count = window.innerWidth < 768 ? 12 : 25;
    for (let i = 0; i < count; i++) {
      const p = this.createPetal(Math.random() * this.width, Math.random() * this.height, false);
      this.ambientParticles.push(p);
    }
  }

  /**
   * Explode a grand shower of flower petals and gold sparkles
   * @param {number} originX Screen X coordinate
   * @param {number} originY Screen Y coordinate
   * @param {number} count Number of petals
   */
  burst(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 90) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createPetal(originX, originY, true));
    }
    // Also shower from the top
    for (let i = 0; i < Math.floor(count * 0.6); i++) {
      const p = this.createPetal(Math.random() * this.width, -30, false);
      p.vy = Math.random() * 4 + 2.5;
      this.particles.push(p);
    }
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.globalAlpha = Math.max(0, p.opacity);

    if (p.type === "gold") {
      // Golden shimmering confetti square / diamond
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = "#f3e5ab";
      this.ctx.shadowBlur = 6;
      this.ctx.fillRect(-p.size / 3, -p.size / 3, (p.size * 2) / 3, (p.size * 2) / 3);
    } else {
      // Organic Curved Petal Shape
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      this.ctx.shadowBlur = 3;

      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      this.ctx.closePath();
      this.ctx.fill();

      // Subtle center vein
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size * 0.8);
      this.ctx.lineTo(0, p.size * 0.8);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update burst particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.sway += p.swaySpeed;
      p.x += p.vx + Math.sin(p.sway) * p.swayAmplitude;
      p.y += p.vy;
      p.rotation += p.vRotation;

      if (p.isBurst) {
        p.vx *= 0.98;
        p.vy += 0.12; // gravity
        p.opacity -= p.fadeRate;
      }

      this.drawPetal(p);

      if (p.y > this.height + 40 || p.opacity <= 0 || p.x < -40 || p.x > this.width + 40) {
        this.particles.splice(i, 1);
      }
    }

    // Update ambient drifting petals
    if (this.ambientActive) {
      for (let i = 0; i < this.ambientParticles.length; i++) {
        const p = this.ambientParticles[i];
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * p.swayAmplitude + 0.3; // gentle wind
        p.y += p.vy;
        p.rotation += p.vRotation;

        this.drawPetal(p);

        // Reset if fell off screen
        if (p.y > this.height + 30) {
          p.y = -20;
          p.x = Math.random() * this.width;
        }
        if (p.x > this.width + 30) p.x = -20;
      }
    }
  }

  startLoop() {
    const loop = () => {
      this.update();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Global instance
window.PetalCelebration = PetalCelebration;
