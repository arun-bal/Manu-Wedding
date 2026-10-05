/**
 * ==============================================================================
 * WEDDING INVITATION APPLICATION SCRIPT
 * ==============================================================================
 * Handles:
 * - Dynamic data binding from wedding-config.js (dual events, parents, Hima compliment)
 * - Botanical envelope opening animation & audio initiation
 * - Scratch-to-reveal canvas for dual events (Wedding & Reception)
 * - Countdown timer
 * - Google Calendar & iCal generator for both events
 * - Photo Lightbox preview
 * - Enhanced Well Wishes Wall with:
 *    • Quick emoji insertion
 *    • Client-side auto-compressed photo uploads (< 80KB)
 *    • Celebratory animated GIF stickers
 *    • Heart/Like counters stored in localStorage
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

  // 4. SCRATCH-TO-REVEAL DUAL EVENTS CANVAS
  initScratchCard(petalEngine);

  // 5. COUNTDOWN TIMER
  initCountdownTimer(WEDDING_CONFIG.events.primaryTargetISO);

  // 6. DUAL CALENDAR BUTTONS (WEDDING & RECEPTION)
  initCalendarButtons();

  // 7. PHOTO GALLERY & WISH LIGHTBOX
  initPhotoLightbox();

  // 8. INTERACTIVE WELL WISHES WALL (EMOJIS, PHOTOS, GIFS)
  initWishesWall(petalEngine);

  // 9. WHATSAPP SHARE BUTTONS
  initShareButtons();

  // 10. SCROLL REVEAL ANIMATIONS
  initScrollAnimations();

  // 11. LIVE EDIT MODAL
  initLiveEditor(petalEngine);
});

/**
 * Populates DOM elements with values from wedding-config.js
 */
function bindWeddingData(config) {
  const bindings = {
    "groom-name": config.couple.groom.name,
    "bride-name": config.couple.bride.name,
    "couple-combined": config.couple.combinedTitle,
    "couple-hashtag": config.couple.hashtag,
    "couple-monogram": config.couple.monogram,
    
    // Parents & Addresses from Wedding Letter
    "groom-parents": config.couple.groom.parents,
    "groom-address": config.couple.groom.address,
    "bride-parents": config.couple.bride.parents,
    "bride-address": config.couple.bride.address,
    "letter-intro": config.messages.invitationLetterIntro,
    "compliments-await": config.messages.complimentsClosing,
    "compliments-from": config.messages.complimentsFrom,

    // Wedding Event Details
    "wedding-date-formatted": config.events.wedding.dateFormatted,
    "wedding-day": config.events.wedding.day,
    "wedding-date-number": config.events.wedding.dateNumber,
    "wedding-month-year": config.events.wedding.monthYear,
    "wedding-time": config.events.wedding.time,
    "wedding-venue-name": config.events.wedding.venueName,
    "wedding-venue-city": config.events.wedding.venueCity,
    "wedding-venue-address": config.events.wedding.venueAddress,
    "wedding-landmark": config.events.wedding.landmark,

    // Reception Event Details
    "reception-date-formatted": config.events.reception.dateFormatted,
    "reception-day": config.events.reception.day,
    "reception-date-number": config.events.reception.dateNumber,
    "reception-month-year": config.events.reception.monthYear,
    "reception-time": config.events.reception.time,
    "reception-venue-name": config.events.reception.venueName,
    "reception-venue-city": config.events.reception.venueCity,
    "reception-venue-address": config.events.reception.venueAddress,
    "reception-landmark": config.events.reception.landmark,

    // Shloka & Story
    "shloka-text": config.messages.shloka,
    "shloka-meaning": config.messages.shlokaMeaning,
    "emotional-story": config.messages.emotionalStory
  };

  for (const [key, val] of Object.entries(bindings)) {
    document.querySelectorAll(`[data-bind="${key}"]`).forEach(el => {
      el.textContent = val;
    });
  }

  // Map Links
  const weddingMapBtn = document.getElementById("wedding-map-btn");
  if (weddingMapBtn) weddingMapBtn.href = config.events.wedding.mapUrl;

  const receptionMapBtn = document.getElementById("reception-map-btn");
  if (receptionMapBtn) receptionMapBtn.href = config.events.reception.mapUrl;

  // Photo bindings
  const heroImg = document.getElementById("hero-couple-img");
  if (heroImg) heroImg.src = config.photos.heroPortrait;

  const storyImg = document.getElementById("story-couple-img");
  if (storyImg) storyImg.src = config.photos.ringCeremony;

  // Build Dynamic Timeline
  const timelineContainer = document.getElementById("timeline-list");
  if (timelineContainer && config.timeline) {
    timelineContainer.innerHTML = "";
    config.timeline.forEach((item) => {
      const el = document.createElement("div");
      el.className = `timeline-item ${item.highlight ? "highlighted" : ""}`;
      el.innerHTML = `
        <div class="timeline-dot">
          <i class="fas ${item.icon || "fa-ring"}"></i>
        </div>
        <div class="timeline-content">
          <span class="timeline-date-tag">${item.date}</span>
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
    config.photos.gallery.forEach((photo) => {
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
    envelopeOverlay.classList.add("opening");

    // Burst hydrangea blue petals and gold sparkles
    petalEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 110);

    // Play background music
    if (window.weddingMusicPlayer) {
      window.weddingMusicPlayer.play();
    }

    setTimeout(() => {
      envelopeOverlay.classList.add("hidden");
      if (mainContent) {
        mainContent.classList.add("visible");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 950);
  };

  sealBtn.addEventListener("click", handleOpen);
  sealBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleOpen();
  }, { passive: false });
}

/**
 * Background Music Controller
 */
function initMusicPlayer() {
  const audioEl = document.getElementById("bg-audio");
  const toggleBtn = document.getElementById("music-toggle-btn");
  const discIcon = document.getElementById("music-disc-icon");

  if (!audioEl || !toggleBtn) return null;

  audioEl.src = WEDDING_CONFIG.audio.file;
  audioEl.volume = 0.55;

  audioEl.addEventListener("error", () => {
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
        console.log("Audio autoplay waiting for user interaction:", err);
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
  window.weddingMusicPlayer = player;
  return player;
}

/**
 * Scratch to Reveal Canvas Card for DUAL EVENTS (Wedding & Reception)
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

    // Champagne gold foil with blue shimmer gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#c59b27");
    grad.addColorStop(0.25, "#f7d774");
    grad.addColorStop(0.5, "#d4af37");
    grad.addColorStop(0.75, "#fdf6c7");
    grad.addColorStop(1, "#a8811e");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative glitter specks
    for (let i = 0; i < 350; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 255, 255, 0.45)" : "rgba(74, 123, 176, 0.25)";
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner gold border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Scratch instructions text
    ctx.fillStyle = "#1b365d";
    ctx.font = "bold 15px 'Montserrat', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH TO REVEAL ✨", width / 2, height / 2 - 16);

    ctx.fillStyle = "#284b7e";
    ctx.font = "italic 13px 'Playfair Display', serif";
    ctx.fillText("Wedding & Reception Ceremonies", width / 2, height / 2 + 14);
  }

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
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    checkRevealedPercentage();
  }

  function checkRevealedPercentage() {
    if (isRevealed) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentCount = 0;
    const step = 32;

    for (let i = 3; i < pixels.length; i += 4 * step) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / (4 * step);
    const ratio = transparentCount / totalSampled;

    if (ratio > 0.36) {
      triggerFullReveal();
    }
  }

  function triggerFullReveal() {
    if (isRevealed) return;
    isRevealed = true;

    canvas.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    canvas.style.opacity = "0";
    canvas.style.transform = "scale(1.05)";
    canvas.style.pointerEvents = "none";

    setTimeout(() => {
      canvas.remove();
      if (revealedContent) revealedContent.classList.add("revealed");
    }, 700);

    const rect = container.getBoundingClientRect();
    petalEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 120);

    if (revealBtn) revealBtn.style.display = "none";
  }

  // Scratch events
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

  if (revealBtn) {
    revealBtn.addEventListener("click", () => triggerFullReveal());
  }
}

/**
 * Live Countdown to Primary Wedding Date
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
 * Calendar Link & iCal Download Generation for Both Events
 */
function initCalendarButtons() {
  const weddingGcalBtn = document.getElementById("save-wedding-gcal-btn");
  const weddingIcalBtn = document.getElementById("save-wedding-ical-btn");
  const receptionGcalBtn = document.getElementById("save-reception-gcal-btn");
  const receptionIcalBtn = document.getElementById("save-reception-ical-btn");

  const couple = WEDDING_CONFIG.couple.combinedTitle;

  // 1. Wedding Event Calendar
  if (weddingGcalBtn) {
    const title = encodeURIComponent(`Wedding: ${couple}`);
    const details = encodeURIComponent(`Auspicious Muhurtham: 11:50 AM – 12:36 PM\nVenue: Thimiri Bank Convention Centre, Cheruvathur\nMaps: ${WEDDING_CONFIG.events.wedding.mapUrl}`);
    const location = encodeURIComponent("Thimiri Bank Convention Centre, Cheruvathur");
    weddingGcalBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261121T062000Z/20261121T100000Z&details=${details}&location=${location}`;
  }

  if (weddingIcalBtn) {
    weddingIcalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadIcal(`Wedding of ${couple}`, "Auspicious Muhurtham: 11:50 AM – 12:36 PM", "Thimiri Bank Convention Centre, Cheruvathur", "20261121T062000Z", "20261121T100000Z", "Wedding_Manu_and_Maneesha.ics");
    });
  }

  // 2. Reception Event Calendar
  if (receptionGcalBtn) {
    const title = encodeURIComponent(`Reception: ${couple}`);
    const details = encodeURIComponent(`Grand Reception & Dinner: 4:30 PM – 8:30 PM\nVenue: Kalleri Auditorium, Vadakara\nMaps: ${WEDDING_CONFIG.events.reception.mapUrl}`);
    const location = encodeURIComponent("Kalleri Auditorium, Vadakara");
    receptionGcalBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261122T110000Z/20261122T150000Z&details=${details}&location=${location}`;
  }

  if (receptionIcalBtn) {
    receptionIcalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadIcal(`Reception of ${couple}`, "Grand Reception & Dinner: 4:30 PM – 8:30 PM", "Kalleri Auditorium, Vadakara", "20261122T110000Z", "20261122T150000Z", "Reception_Manu_and_Maneesha.ics");
    });
  }
}

function downloadIcal(summary, desc, loc, start, end, filename) {
  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Manu Maxim & Maneesha Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "SUMMARY:" + summary,
    "DESCRIPTION:" + desc,
    "LOCATION:" + loc,
    "DTSTART:" + start,
    "DTEND:" + end,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
    const item = e.target.closest(".gallery-item, .clickable-photo, .blessing-photo-thumb");
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
 * INTERACTIVE WELL WISHES WALL
 * Supports:
 * - Emoji insertion
 * - Auto-downscaled photo uploads (< 80KB)
 * - Celebratory animated GIF stickers
 * - Instant on-screen display with like counters
 */
function initWishesWall(petalEngine) {
  const form = document.getElementById("post-wish-form");
  const nameInput = document.getElementById("wish-name");
  const messageInput = document.getElementById("wish-message");
  const photoInput = document.getElementById("wish-photo-input");
  const previewBox = document.getElementById("attachment-preview");
  const previewImg = document.getElementById("preview-thumb-img");
  const removePhotoBtn = document.getElementById("remove-photo-btn");
  const gifToggleBtn = document.getElementById("gif-toggle-btn");
  const gifDrawer = document.getElementById("gif-sticker-drawer");

  let attachedPhotoData = null;
  let selectedGifUrl = null;

  // 1. Emoji Toolbar Handler
  document.querySelectorAll(".emoji-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const emoji = pill.getAttribute("data-emoji");
      if (messageInput) {
        const start = messageInput.selectionStart || messageInput.value.length;
        const end = messageInput.selectionEnd || messageInput.value.length;
        messageInput.value = messageInput.value.substring(0, start) + emoji + messageInput.value.substring(end);
        messageInput.focus();
        messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
      }
    });
  });

  // 2. Photo Compression & Upload Handler
  if (photoInput) {
    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Client-side canvas compression down to max 650px and 70% quality (~50KB)
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 650;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compressed base64 Data URL
          attachedPhotoData = canvas.toDataURL("image/jpeg", 0.72);

          // Clear any active GIF selection
          selectedGifUrl = null;
          document.querySelectorAll(".gif-sticker-option").forEach(o => o.classList.remove("selected"));

          // Show preview thumbnail
          previewImg.src = attachedPhotoData;
          previewBox.classList.add("active");
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Remove Attachment Handler
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener("click", () => {
      attachedPhotoData = null;
      selectedGifUrl = null;
      photoInput.value = "";
      previewBox.classList.remove("active");
      previewImg.src = "";
    });
  }

  // 3. GIF Sticker Drawer Toggle
  if (gifToggleBtn && gifDrawer) {
    gifToggleBtn.addEventListener("click", () => {
      gifDrawer.classList.toggle("active");
    });

    // GIF Option Click Handler
    document.querySelectorAll(".gif-sticker-option").forEach(opt => {
      opt.addEventListener("click", () => {
        const gifSrc = opt.getAttribute("data-gif");
        if (selectedGifUrl === gifSrc) {
          selectedGifUrl = null;
          opt.classList.remove("selected");
          previewBox.classList.remove("active");
        } else {
          selectedGifUrl = gifSrc;
          document.querySelectorAll(".gif-sticker-option").forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");

          // Clear photo if GIF is selected
          attachedPhotoData = null;
          photoInput.value = "";
          previewImg.src = gifSrc;
          previewBox.classList.add("active");
        }
      });
    });
  }

  // 4. Form Submit & Post Wish
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value.trim() || "Well-Wisher";
      const message = messageInput.value.trim();

      if (!message && !attachedPhotoData && !selectedGifUrl) {
        alert("Please write a message or attach a celebration photo/GIF!");
        return;
      }

      const newWish = {
        id: "wish_" + Date.now(),
        name: name,
        message: message,
        photo: attachedPhotoData,
        gif: selectedGifUrl,
        timestamp: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        likes: 0
      };

      // Save to localStorage
      saveWishLocally(newWish);

      // Reset form
      nameInput.value = "";
      messageInput.value = "";
      attachedPhotoData = null;
      selectedGifUrl = null;
      if (photoInput) photoInput.value = "";
      previewBox.classList.remove("active");
      if (gifDrawer) gifDrawer.classList.remove("active");
      document.querySelectorAll(".gif-sticker-option").forEach(o => o.classList.remove("selected"));

      // Confetti celebration
      petalEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 70);

      // Re-render
      renderWishesList();
    });
  }

  // Initial render
  renderWishesList();
}

function saveWishLocally(wish) {
  const wishes = getStoredWishes();
  wishes.unshift(wish);
  // Keep up to 30 recent wishes to preserve fast storage
  localStorage.setItem("wedding_guest_wishes_v2", JSON.stringify(wishes.slice(0, 30)));
}

function getStoredWishes() {
  try {
    return JSON.parse(localStorage.getItem("wedding_guest_wishes_v2") || "[]");
  } catch (e) {
    return [];
  }
}

function renderWishesList() {
  const container = document.getElementById("blessings-wall-list");
  if (!container) return;

  const defaultWishes = [
    {
      id: "default_1",
      name: "Family & Elders",
      message: "Sending our warmest love and blessings to Manu & Maneesha! May your married life be filled with prosperity, good health, and eternal joy. 🌸🕊️",
      timestamp: "Today",
      likes: 12
    },
    {
      id: "default_2",
      name: "Friends & Dear Ones",
      message: "Congratulations to the most wonderful couple! Looking forward to celebrating both the wedding at Cheruvathur and the grand reception at Vadakara! 🥂🎉💙",
      timestamp: "Today",
      likes: 8
    }
  ];

  const stored = getStoredWishes();
  const all = stored.concat(defaultWishes);

  container.innerHTML = "";
  all.forEach((wish) => {
    const card = document.createElement("div");
    card.className = "blessing-card";
    card.id = wish.id;

    let mediaHtml = "";
    if (wish.photo) {
      mediaHtml = `
        <div class="blessing-photo-thumb" data-src="${wish.photo}" data-caption="Blessing from ${wish.name}">
          <img src="${wish.photo}" alt="Wish Attachment" />
        </div>
      `;
    } else if (wish.gif) {
      mediaHtml = `
        <div class="blessing-gif-sticker">
          <img src="${wish.gif}" alt="Celebration GIF" />
        </div>
      `;
    }

    card.innerHTML = `
      <div class="blessing-card-header">
        <span class="blessing-author-name"><i class="fas fa-feather-pointed" style="color:var(--blue-hydrangea); margin-right:6px;"></i>${wish.name}</span>
        <span class="blessing-timestamp">${wish.timestamp}</span>
      </div>
      ${wish.message ? `<p class="blessing-message-text">${wish.message}</p>` : ""}
      ${mediaHtml}
      <div class="blessing-card-footer">
        <button class="like-wish-btn" data-id="${wish.id}" aria-label="Heart wish">
          <i class="far fa-heart"></i> <span>${wish.likes || 0}</span>
        </button>
      </div>
    `;

    // Heart button listener
    const likeBtn = card.querySelector(".like-wish-btn");
    likeBtn.addEventListener("click", () => {
      const isLiked = likeBtn.classList.contains("liked");
      const span = likeBtn.querySelector("span");
      const icon = likeBtn.querySelector("i");
      let current = parseInt(span.textContent, 10) || 0;

      if (!isLiked) {
        likeBtn.classList.add("liked");
        icon.className = "fas fa-heart";
        span.textContent = current + 1;
        updateWishLikes(wish.id, current + 1);
      } else {
        likeBtn.classList.remove("liked");
        icon.className = "far fa-heart";
        span.textContent = Math.max(0, current - 1);
        updateWishLikes(wish.id, Math.max(0, current - 1));
      }
    });

    container.appendChild(card);
  });
}

function updateWishLikes(id, newCount) {
  const wishes = getStoredWishes();
  const target = wishes.find(w => w.id === id);
  if (target) {
    target.likes = newCount;
    localStorage.setItem("wedding_guest_wishes_v2", JSON.stringify(wishes));
  }
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
 * Scroll Reveal Animations
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
 */
function initLiveEditor(petalEngine) {
  const openEditBtn = document.getElementById("open-editor-btn");
  const editModal = document.getElementById("editor-modal");
  const closeEditBtn = document.getElementById("editor-close-btn");
  const form = document.getElementById("live-editor-form");
  const exportBtn = document.getElementById("export-config-btn");

  if (!openEditBtn || !editModal || !form) return;

  openEditBtn.addEventListener("click", () => {
    document.getElementById("edit-groom").value = WEDDING_CONFIG.couple.groom.name;
    document.getElementById("edit-bride").value = WEDDING_CONFIG.couple.bride.name;
    document.getElementById("edit-groom-parents").value = WEDDING_CONFIG.couple.groom.parents;
    document.getElementById("edit-bride-parents").value = WEDDING_CONFIG.couple.bride.parents;
    document.getElementById("edit-wedding-venue").value = WEDDING_CONFIG.events.wedding.venueName;
    document.getElementById("edit-reception-venue").value = WEDDING_CONFIG.events.reception.venueName;
    document.getElementById("edit-wedding-map").value = WEDDING_CONFIG.events.wedding.mapUrl;

    editModal.classList.add("active");
  });

  const closeModal = () => editModal.classList.remove("active");
  if (closeEditBtn) closeEditBtn.addEventListener("click", closeModal);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    WEDDING_CONFIG.couple.groom.name = document.getElementById("edit-groom").value.trim();
    WEDDING_CONFIG.couple.bride.name = document.getElementById("edit-bride").value.trim();
    WEDDING_CONFIG.couple.groom.parents = document.getElementById("edit-groom-parents").value.trim();
    WEDDING_CONFIG.couple.bride.parents = document.getElementById("edit-bride-parents").value.trim();
    WEDDING_CONFIG.couple.combinedTitle = `${WEDDING_CONFIG.couple.groom.name} & ${WEDDING_CONFIG.couple.bride.name}`;
    WEDDING_CONFIG.events.wedding.venueName = document.getElementById("edit-wedding-venue").value.trim();
    WEDDING_CONFIG.events.reception.venueName = document.getElementById("edit-reception-venue").value.trim();
    WEDDING_CONFIG.events.wedding.mapUrl = document.getElementById("edit-wedding-map").value.trim();

    bindWeddingData(WEDDING_CONFIG);
    closeModal();
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
