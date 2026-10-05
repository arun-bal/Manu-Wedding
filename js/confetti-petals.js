/**
 * Botanical Flower Petal & Golden Sparkle Particle Engine
 * Realistic French Blue Hydrangeas, White Jasmine, Sage Foliage & Champagne Gold Foil Confetti
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

    // Pre-create gentle ambient petals
    this.initAmbient();
    this.startLoop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  // Botanical Color Palettes matching the wedding invitation letter
  static get PALETTES() {
    return {
      hydrangeaBlue: ["#608fb8", "#7da6ca", "#9ec1de", "#4a7499", "#bed7ed", "#416788"],
      whiteJasmine: ["#ffffff", "#f9fbfd", "#f3f7fa", "#e9f1f7"],
      sageGreen: ["#5c8067", "#769a81", "#8eb399", "#44634d"],
      champagneGold: ["#d4af37", "#f5e49e", "#c59b27", "#f8d878", "#b38728"]
    };
  }

  createPetal(x, y, isBurst = false) {
    const types = ["hydrangeaBlue", "hydrangeaBlue", "whiteJasmine", "sageGreen", "champagneGold"];
    const type = types[Math.floor(Math.random() * types.length)];
    const colorList = PetalCelebration.PALETTES[type];
    const color = colorList[Math.floor(Math.random() * colorList.length)];

    let vx, vy;
    if (isBurst) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8.5 + 3.5;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed - 4.5; // gentle upward pop
    } else {
      vx = (Math.random() - 0.5) * 1.8;
      vy = Math.random() * 1.8 + 1.2;
    }

    return {
      x: x !== undefined ? x : Math.random() * this.width,
      y: y !== undefined ? y : -20,
      size: Math.random() * 9 + 7,
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
    const count = window.innerWidth < 768 ? 10 : 22;
    for (let i = 0; i < count; i++) {
      const p = this.createPetal(Math.random() * this.width, Math.random() * this.height, false);
      this.ambientParticles.push(p);
    }
  }

  /**
   * Explode a grand celebratory shower of blue hydrangeas, white jasmine & gold foil
   */
  burst(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 95) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createPetal(originX, originY, true));
    }
    // Shower gently from the top
    for (let i = 0; i < Math.floor(count * 0.65); i++) {
      const p = this.createPetal(Math.random() * this.width, -30, false);
      p.vy = Math.random() * 3.8 + 2.2;
      this.particles.push(p);
    }
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.globalAlpha = Math.max(0, p.opacity);

    if (p.type === "champagneGold") {
      // Shimmering Golden Foil Flake
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = "#f5e49e";
      this.ctx.shadowBlur = 5;
      this.ctx.fillRect(-p.size / 3, -p.size / 3, (p.size * 2) / 3, (p.size * 2) / 3);
    } else if (p.type === "sageGreen") {
      // Slender Botanical Leaf
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
      this.ctx.shadowBlur = 3;

      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.quadraticCurveTo(p.size * 0.6, 0, 0, p.size);
      this.ctx.quadraticCurveTo(-p.size * 0.6, 0, 0, -p.size);
      this.ctx.closePath();
      this.ctx.fill();

      // Leaf vein
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      this.ctx.lineWidth = 0.8;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size * 0.8);
      this.ctx.lineTo(0, p.size * 0.8);
      this.ctx.stroke();
    } else {
      // Soft Hydrangea Blossom Petal
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = "rgba(74, 116, 153, 0.18)";
      this.ctx.shadowBlur = 4;

      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.5, p.size * 0.9, p.size * 0.5, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.5, -p.size * 0.9, -p.size * 0.5, 0, -p.size);
      this.ctx.closePath();
      this.ctx.fill();

      // Soft white sheen
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      this.ctx.beginPath();
      this.ctx.arc(0, -p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
      this.ctx.fill();
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
        p.vy += 0.11; // gentle gravity
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
        p.x += Math.sin(p.sway) * p.swayAmplitude + 0.25;
        p.y += p.vy;
        p.rotation += p.vRotation;

        this.drawPetal(p);

        // Loop seamlessly
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

// Global export
window.PetalCelebration = PetalCelebration;
