/**
 * ==============================================================================
 * WEDDING INVITATION APPLICATION SCRIPT
 * ==============================================================================
 * Handles:
 * - Dynamic data binding from wedding-config.js
 * - Envelope opening animation & sound initiation
 * - Audio player with volume fade and floating controls
 * - Scratch-to-reveal canvas with touch & mouse support
 * - Petal burst triggers
 * - Live wedding countdown timer
 * - Google Calendar & iCal generator
 * - Photo Lightbox preview
 * - WhatsApp RSVP and sharing
 * - In-browser live editor with config export
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Petal Engine
  const petalEngine = new window.PetalCelebration();

  // 1. DYNAMIC DATA BINDING FROM CONFIG
  bindWeddingData(WEDDING_CONFIG);

  // 2. ENVELOPE OPENING HANDLER
  initEnvelopeOpener(petalEngine);

  // 3. BACKGROUND MUSIC CONTROLLER
  const musicPlayer = initMusicPlayer();

  // 4. SCRATCH-TO-REVEAL DATE CANVAS
  initScratchCard(petalEngine);

  // 5. COUNTDOWN TIMER
  initCountdownTimer(WEDDING_CONFIG.event.targetDateISO);

  // 6. CALENDAR INTEGRATION
  initCalendarButtons();

  // 7. PHOTO GALLERY LIGHTBOX
  initPhotoLightbox();

  // 8. RSVP & WHATSAPP GENERATOR
  initRsvpHandler();

  // 9. WHATSAPP SHARE BUTTONS
  initShareButtons();

  // 10. SCROLL REVEAL ANIMATIONS
  initScrollAnimations();

  // 11. LIVE EDIT MODAL (FOR EASY CUSTOMIZATION)
  initLiveEditor(petalEngine);
});

/**
 * Populates DOM elements with values from wedding-config.js
 */
function bindWeddingData(config) {
  // Text content binding via data-bind attributes
  const bindings = {
    "groom-name": config.couple.groom.name,
    "bride-name": config.couple.bride.name,
    "couple-combined": config.couple.combinedTitle,
    "couple-hashtag": config.couple.hashtag,
    "couple-monogram": config.couple.monogram,
    "event-date-formatted": config.event.dateFormatted,
    "event-day": config.event.day,
    "event-date-number": config.event.dateNumber,
    "event-month-year": config.event.monthYear,
    "muhurtham-time": config.event.muhurthamTime,
    "venue-name": config.venue.name,
    "venue-city": config.venue.city,
    "venue-address": config.venue.fullAddress,
    "venue-landmark": config.venue.landmark,
    "shloka-text": config.messages.shloka,
    "shloka-meaning": config.messages.shlokaMeaning,
    "welcome-header": config.messages.welcomeHeader,
    "sub-header": config.messages.subHeader,
    "emotional-story": config.messages.emotionalStory,
    "family-warmth": config.messages.familyWarmth
  };

  for (const [key, val] of Object.entries(bindings)) {
    document.querySelectorAll(`[data-bind="${key}"]`).forEach(el => {
      el.textContent = val;
    });
  }

  // Links and URLs
  document.querySelectorAll("[data-bind-map-url]").forEach(el => {
    el.setAttribute("href", config.venue.mapUrl);
  });

  const mapIframe = document.getElementById("venue-map-iframe");
  if (mapIframe && config.venue.embedMapUrl) {
    mapIframe.src = config.venue.embedMapUrl;
  }

  // Photo bindings
  const heroImg = document.getElementById("hero-couple-img");
  if (heroImg) heroImg.src = config.photos.heroPortrait;

  const storyImg = document.getElementById("story-couple-img");
  if (storyImg) storyImg.src = config.photos.ringCeremony;

  // Build Dynamic Timeline if container exists
  const timelineContainer = document.getElementById("timeline-list");
  if (timelineContainer && config.timeline) {
    timelineContainer.innerHTML = "";
    config.timeline.forEach((item, idx) => {
      const el = document.createElement("div");
      el.className = `timeline-item ${item.highlight ? "highlighted" : ""}`;
      el.innerHTML = `
        <div class="timeline-dot">
          <i class="fas ${item.icon || "fa-ring"}"></i>
        </div>
        <div class="timeline-content">
          <span class="timeline-time">${item.time}</span>
          <h4 class="timeline-title">${item.title}</h4>
          <p class="timeline-desc">${item.description}</p>
        </div>
      `;
      timelineContainer.appendChild(el);
    });
  }

  // Build Dynamic Gallery
  const galleryGrid = document.getElementById("gallery-grid");
  if (galleryGrid && config.photos.gallery) {
    galleryGrid.innerHTML = "";
    config.photos.gallery.forEach((photo, idx) => {
      const card = document.createElement("div");
      card.className = "gallery-item";
      card.setAttribute("data-src", photo.src);
      card.setAttribute("data-caption", photo.caption);
      card.innerHTML = `
        <div class="gallery-image-wrapper">
          <img src="${photo.src}" alt="${photo.caption}" loading="lazy" />
          <div class="gallery-overlay">
            <span class="gallery-tag">${photo.tag || "Wedding"}</span>
            <p class="gallery-caption-text">${photo.caption}</p>
            <span class="gallery-zoom-icon"><i class="fas fa-magnifying-glass-plus"></i></span>
          </div>
        </div>
      `;
      galleryGrid.appendChild(card);
    });
  }
}

/**
 * Handles the opening envelope / royal wax seal animation
 */
function initEnvelopeOpener(petalEngine) {
  const envelopeOverlay = document.getElementById("invitation-cover");
  const sealBtn = document.getElementById("open-invitation-btn");
  const mainContent = document.getElementById("main-invitation-content");

  if (!envelopeOverlay || !sealBtn) return;

  const handleOpen = () => {
    // Add opened animation classes
    envelopeOverlay.classList.add("opening");

    // Burst petals and golden glitters
    petalEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 110);

    // Play music smoothly
    if (window.weddingMusicPlayer) {
      window.weddingMusicPlayer.play();
    }

    // Scroll to top of main content smoothly
    setTimeout(() => {
      envelopeOverlay.classList.add("hidden");
      if (mainContent) {
        mainContent.classList.add("visible");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1100);
  };

  sealBtn.addEventListener("click", handleOpen);
  sealBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleOpen();
  }, { passive: false });
}

/**
 * High-fidelity Background Music Controller
 */
function initMusicPlayer() {
  const audioEl = document.getElementById("bg-audio");
  const toggleBtn = document.getElementById("music-toggle-btn");
  const discIcon = document.getElementById("music-disc-icon");
  const musicTitleEl = document.getElementById("music-title-display");

  if (!audioEl || !toggleBtn) return null;

  audioEl.src = WEDDING_CONFIG.audio.file;
  audioEl.volume = 0.55;

  // Handle fallback if local file fails to load
  audioEl.addEventListener("error", () => {
    console.warn("Local audio not available, falling back to online instrumental...");
    if (WEDDING_CONFIG.audio.fallbackOnlineUrl && audioEl.src !== WEDDING_CONFIG.audio.fallbackOnlineUrl) {
      audioEl.src = WEDDING_CONFIG.audio.fallbackOnlineUrl;
      audioEl.load();
    }
  });

  const player = {
    isPlaying: false,
    play: function() {
      audioEl.play().then(() => {
        this.isPlaying = true;
        toggleBtn.classList.add("playing");
        if (discIcon) discIcon.classList.add("spinning");
      }).catch(err => {
        console.log("Audio autoplay prevented or waiting for interaction:", err);
      });
    },
    pause: function() {
      audioEl.pause();
      this.isPlaying = false;
      toggleBtn.classList.remove("playing");
      if (discIcon) discIcon.classList.remove("spinning");
    },
    toggle: function() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
  };

  toggleBtn.addEventListener("click", () => player.toggle());

  // Store globally
  window.weddingMusicPlayer = player;
  return player;
}

/**
 * Scratch to Reveal Canvas Card for Date & Muhurtham
 */
function initScratchCard(petalEngine) {
  const canvas = document.getElementById("scratch-canvas");
  const container = document.getElementById("scratch-card-container");
  const revealedContent = document.getElementById("scratch-revealed-content");
  const revealBtn = document.getElementById("manual-reveal-btn");

  if (!canvas || !container) return;

  const ctx = canvas.getContext("2d");
  let isScratching = false;
  let isRevealed = false;
  let width, height;

  function setupCanvas() {
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;

    // Draw luxury golden foil pattern with shimmer
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#c59b27");
    grad.addColorStop(0.2, "#f7d774");
    grad.addColorStop(0.4, "#d4af37");
    grad.addColorStop(0.6, "#fdf6c7");
    grad.addColorStop(0.8, "#b38728");
    grad.addColorStop(1, "#855a15");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative golden glitter specks
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 255, 255, 0.4)" : "rgba(180, 130, 30, 0.35)";
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Elegant gold border inside canvas
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Scratch instructions text
    ctx.fillStyle = "#2c0e1e";
    ctx.font = "bold 15px 'Montserrat', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH TO REVEAL ✨", width / 2, height / 2 - 14);

    ctx.fillStyle = "#4a1932";
    ctx.font = "italic 13px 'Playfair Display', serif";
    ctx.fillText("The Auspicious Date & Muhurtham", width / 2, height / 2 + 14);
  }

  // Initial setup after fonts load / layout stabilizes
  setTimeout(setupCanvas, 300);
  window.addEventListener("resize", () => {
    if (!isRevealed) setupCanvas();
  });

  function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    checkRevealedPercentage();
  }

  function checkRevealedPercentage() {
    if (isRevealed) return;

    // Sample pixels across grid to check how much is uncovered
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentCount = 0;
    const step = 32; // sampling step for high performance

    for (let i = 3; i < pixels.length; i += 4 * step) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / (4 * step);
    const ratio = transparentCount / totalSampled;

    // Unveil automatically once 38% has been scratched
    if (ratio > 0.38) {
      triggerFullReveal();
    }
  }

  function triggerFullReveal() {
    if (isRevealed) return;
    isRevealed = true;

    // Fade out canvas smoothly
    canvas.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    canvas.style.opacity = "0";
    canvas.style.transform = "scale(1.05)";
    canvas.style.pointerEvents = "none";

    setTimeout(() => {
      canvas.remove();
      if (revealedContent) revealedContent.classList.add("revealed");
    }, 700);

    // Grand flower petal & confetti pop celebration
    const rect = container.getBoundingClientRect();
    petalEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 120);

    // Hide manual reveal button if present
    if (revealBtn) revealBtn.style.display = "none";
  }

  // Scratch Event Listeners (Touch for mobile, Mouse for desktop)
  canvas.addEventListener("mousedown", (e) => {
    isScratching = true;
    const pos = getTouchPos(e);
    scratch(pos.x, pos.y);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isScratching || isRevealed) return;
    const pos = getTouchPos(e);
    scratch(pos.x, pos.y);
  });

  window.addEventListener("mouseup", () => {
    isScratching = false;
  });

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isScratching = true;
    const pos = getTouchPos(e);
    scratch(pos.x, pos.y);
  }, { passive: false });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!isScratching || isRevealed) return;
    const pos = getTouchPos(e);
    scratch(pos.x, pos.y);
  }, { passive: false });

  canvas.addEventListener("touchend", () => {
    isScratching = false;
  });

  // Manual fallback button
  if (revealBtn) {
    revealBtn.addEventListener("click", () => triggerFullReveal());
  }
}

/**
 * Live Countdown to Wedding Date
 */
function initCountdownTimer(targetDateISO) {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetTime = new Date(targetDateISO).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      const statusTitle = document.getElementById("countdown-status-text");
      if (statusTitle) statusTitle.textContent = "💍 Today is the Auspicious Day! 💍";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/**
 * Calendar Link & iCal Download Generation
 */
function initCalendarButtons() {
  const gcalBtn = document.getElementById("save-gcal-btn");
  const icalBtn = document.getElementById("save-ical-btn");

  const title = encodeURIComponent(`Wedding of ${WEDDING_CONFIG.couple.combinedTitle}`);
  const details = encodeURIComponent(`Auspicious Muhurtham: ${WEDDING_CONFIG.event.muhurthamTime}\nVenue: ${WEDDING_CONFIG.venue.name}, ${WEDDING_CONFIG.venue.city}\nMaps: ${WEDDING_CONFIG.venue.mapUrl}`);
  const location = encodeURIComponent(`${WEDDING_CONFIG.venue.name}, ${WEDDING_CONFIG.venue.fullAddress}`);

  // 21 Nov 2026: 11:50 AM to 03:00 PM IST (UTC: 06:20 to 09:30)
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261121T062000Z/20261121T100000Z&details=${details}&location=${location}`;

  if (gcalBtn) {
    gcalBtn.href = gcalUrl;
  }

  if (icalBtn) {
    icalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Manu Maxim & Maneesha Wedding//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "SUMMARY:" + `Wedding of ${WEDDING_CONFIG.couple.combinedTitle}`,
        "DESCRIPTION:" + `Auspicious Muhurtham: ${WEDDING_CONFIG.event.muhurthamTime} at ${WEDDING_CONFIG.venue.name}`,
        "LOCATION:" + `${WEDDING_CONFIG.venue.name}, ${WEDDING_CONFIG.venue.city}`,
        "DTSTART:20261121T062000Z",
        "DTEND:20261121T100000Z",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Manu_and_Maneesha_Wedding.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

/**
 * Photo Lightbox Modal
 */
function initPhotoLightbox() {
  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("lightbox-img");
  const modalCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close-btn");

  if (!modal || !modalImg) return;

  document.body.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item, .clickable-photo");
    if (!item) return;

    const img = item.querySelector("img") || item;
    const src = item.getAttribute("data-src") || img.src;
    const caption = item.getAttribute("data-caption") || img.alt || "Manu Maxim & Maneesha";

    modalImg.src = src;
    if (modalCaption) modalCaption.textContent = caption;
    modal.classList.add("active");
  });

  const closeModal = () => modal.classList.remove("active");

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("lightbox-backdrop")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

/**
 * RSVP Form to WhatsApp
 */
function initRsvpHandler() {
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("rsvp-name")?.value || "Guest";
    const attending = document.querySelector('input[name="attending"]:checked')?.value || "Yes";
    const count = document.getElementById("rsvp-guests")?.value || "1";
    const wishes = document.getElementById("rsvp-wishes")?.value || "";

    const cleanNumber = (WEDDING_CONFIG.sharing.rsvpWhatsAppNumber || "").replace(/[^0-9]/g, "");

    const msg = `Namaste! 🌸\n` +
      `RSVP for the wedding of ${WEDDING_CONFIG.couple.combinedTitle}:\n\n` +
      `👤 Guest Name: ${name}\n` +
      `✨ Attending: ${attending === "Yes" ? "Joyfully Attending! 🎉" : "Regretfully Cannot Attend"}\n` +
      `👥 Total Guests: ${count}\n` +
      (wishes ? `💌 Blessings & Message: "${wishes}"\n\n` : "\n") +
      `Looking forward to celebrating together!`;

    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    // Also store locally in blessings wall
    if (wishes) {
      saveBlessingLocally(name, wishes);
    }
  });

  loadBlessings();
}

function saveBlessingLocally(name, message) {
  const blessings = JSON.parse(localStorage.getItem("wedding_blessings") || "[]");
  blessings.unshift({ name, message, time: new Date().toLocaleDateString() });
  localStorage.setItem("wedding_blessings", JSON.stringify(blessings.slice(0, 20)));
  renderBlessings();
}

function loadBlessings() {
  renderBlessings();
}

function renderBlessings() {
  const list = document.getElementById("blessings-list");
  if (!list) return;

  const defaultBlessings = [
    { name: "Family & Well-Wishers", message: "Wishing Manu & Maneesha a lifetime filled with boundless love, joy, and prosperous tomorrows!", time: "Today" },
    { name: "Friends & Dear Ones", message: "May your sacred bond be as timeless and radiant as gold. Heartiest congratulations!", time: "Today" }
  ];

  const stored = JSON.parse(localStorage.getItem("wedding_blessings") || "[]");
  const all = stored.concat(defaultBlessings);

  list.innerHTML = "";
  all.slice(0, 6).forEach(b => {
    const card = document.createElement("div");
    card.className = "blessing-card";
    card.innerHTML = `
      <div class="blessing-quote"><i class="fas fa-quote-left"></i></div>
      <p class="blessing-text">"${b.message}"</p>
      <div class="blessing-author">
        <strong>${b.name}</strong> • <span>${b.time}</span>
      </div>
    `;
    list.appendChild(card);
  });
}

/**
 * WhatsApp Sharing Button
 */
function initShareButtons() {
  const shareBtn = document.getElementById("whatsapp-share-btn");
  if (!shareBtn) return;

  shareBtn.addEventListener("click", () => {
    const currentUrl = window.location.href;
    const text = `${WEDDING_CONFIG.sharing.shareMessage}${currentUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  });
}

/**
 * Scroll Reveal Animations (IntersectionObserver for buttery 60fps on mobile)
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".scroll-reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * In-browser Live Editor Modal
 * Enables instantaneous editing of names, dates, times, venue, and map URL right on screen!
 */
function initLiveEditor(petalEngine) {
  const openEditBtn = document.getElementById("open-editor-btn");
  const editModal = document.getElementById("editor-modal");
  const closeEditBtn = document.getElementById("editor-close-btn");
  const form = document.getElementById("live-editor-form");
  const exportBtn = document.getElementById("export-config-btn");

  if (!openEditBtn || !editModal || !form) return;

  openEditBtn.addEventListener("click", () => {
    // Populate form with current config
    document.getElementById("edit-groom").value = WEDDING_CONFIG.couple.groom.name;
    document.getElementById("edit-bride").value = WEDDING_CONFIG.couple.bride.name;
    document.getElementById("edit-date").value = WEDDING_CONFIG.event.dateFormatted;
    document.getElementById("edit-muhurtham").value = WEDDING_CONFIG.event.muhurthamTime;
    document.getElementById("edit-venue").value = WEDDING_CONFIG.venue.name;
    document.getElementById("edit-address").value = WEDDING_CONFIG.venue.fullAddress;
    document.getElementById("edit-map-link").value = WEDDING_CONFIG.venue.mapUrl;

    editModal.classList.add("active");
  });

  const closeModal = () => editModal.classList.remove("active");
  if (closeEditBtn) closeEditBtn.addEventListener("click", closeModal);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Update WEDDING_CONFIG object
    WEDDING_CONFIG.couple.groom.name = document.getElementById("edit-groom").value.trim();
    WEDDING_CONFIG.couple.bride.name = document.getElementById("edit-bride").value.trim();
    WEDDING_CONFIG.couple.combinedTitle = `${WEDDING_CONFIG.couple.groom.name} & ${WEDDING_CONFIG.couple.bride.name}`;
    WEDDING_CONFIG.event.dateFormatted = document.getElementById("edit-date").value.trim();
    WEDDING_CONFIG.event.muhurthamTime = document.getElementById("edit-muhurtham").value.trim();
    WEDDING_CONFIG.venue.name = document.getElementById("edit-venue").value.trim();
    WEDDING_CONFIG.venue.fullAddress = document.getElementById("edit-address").value.trim();
    WEDDING_CONFIG.venue.mapUrl = document.getElementById("edit-map-link").value.trim();

    // Rebind into DOM
    bindWeddingData(WEDDING_CONFIG);
    closeModal();

    // Celebration burst
    petalEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 70);

    alert("✨ Wedding invitation details updated successfully!");
  });

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const configStr = "const WEDDING_CONFIG = " + JSON.stringify(WEDDING_CONFIG, null, 2) + ";\n\nif (typeof module !== 'undefined' && module.exports) { module.exports = WEDDING_CONFIG; }";
      const blob = new Blob([configStr], { type: "application/javascript" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "wedding-config.js";
      a.click();
    });
  }
}
