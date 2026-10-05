# 💍 Manu Maxim & Maneesha — Digital Wedding Invitation Website

A cinematic, mobile-first, luxury digital wedding invitation crafted with a royal burgundy & antique gold aesthetic, interactive wax seal opening, scratch-to-reveal muhurtham date, flower petal pop effects, live countdown timer, couple photo gallery, Google Maps directions, and background wedding music.

---

## 🌟 Key Highlights & Features

1. **Royal Opening Envelope & Wax Seal**:
   - Tap the embossed golden wax seal (`M & M`) to open the invitation.
   - Smooth 3D opening animation with celebratory golden sparkles and flower petals.
   - BGM begins smoothly upon opening (optimally compliant with mobile browser audio policies).

2. **Mobile-First Luxury Aesthetics**:
   - Deep Royal Burgundy (`#2C0E1E`) and Kasavu Cream paired with Gleaming Antique Gold accents.
   - Matches the couple's traditional attire seen in the photos.
   - Smooth 60fps scrolling and typography with Google Fonts (`Playfair Display`, `Cinzel Decorative`, `Montserrat`).

3. **Interactive Scratch-to-Reveal Date**:
   - Guests use their finger on mobile (or mouse cursor on desktop) to scratch the gold foil card.
   - Automatically unveils the auspicious date (**21-Nov-2026**) and muhurtham (**11:50 AM – 12:36 PM**).
   - Triggers an instant festive flower petal & gold confetti shower!
   - Includes one-tap "Add to Google Calendar" and Apple/iCal calendar download.

4. **Live Wedding Countdown**:
   - Real-time countdown tracking days, hours, minutes, and seconds until the auspicious Muhurtham.

5. **Couple Story & Photo Gallery**:
   - Includes the uploaded high-resolution portrait and ring exchange ceremony photos.
   - Lightbox image viewer allows guests to tap and zoom photos in high definition.

6. **Venue & Google Maps Integration**:
   - **Venue**: Thimiri Bank Convention Centre, Cheruvathur
   - One-tap button opening the exact Google Maps location: `https://share.google/yBmRznAAygHOGzNtF`
   - Embedded interactive map with address and landmark directions.

7. **RSVP & WhatsApp Sharing**:
   - Guests can fill in their attendance and warm blessings to send directly to WhatsApp.
   - Community blessings wall where guests can view heartfelt wishes.
   - One-tap "Share on WhatsApp" floating button with pre-formatted invite card text.
   - Full Open Graph meta tags for rich link previews in WhatsApp and social media.

8. **Fully Editable & Customizable**:
   - Every single text, name, time, venue, map link, and photo is defined in **`wedding-config.js`**.
   - An on-screen **"Edit Details Live"** button is also built into the footer so anyone can test changes in real time.

---

## 📁 Project Directory Structure

```text
d:\Wedding site\
  ├── index.html                 # Main digital invitation web app
  ├── wedding-config.js          # Centralized configuration (all text, dates, links, photos)
  ├── README.md                  # Instructions and deployment guide
  ├── css/
  │   └── style.css              # Royal styling, animations, golden shimmer effects
  ├── js/
  │   ├── app.js                 # App controller (wax seal, audio, scratch card, countdown, lightbox, RSVP)
  │   └── confetti-petals.js     # Bespoke flower petal & golden sparkle particle physics engine
  └── assets/
      ├── images/
      │   ├── couple-portrait.jpg # Hero portrait photo
      │   ├── ring-ceremony.jpg   # Ring exchange ceremony photo
      │   ├── couple-1.jpg
      │   └── couple-2.jpg
      └── audio/
          └── music.mp3          # Wedding background music
```

---

## ✏️ How to Edit Details

All details are stored in **`wedding-config.js`**. Simply open this file in any text editor to modify:

```javascript
const WEDDING_CONFIG = {
  couple: {
    groom: { name: "Manu Maxim" },
    bride: { name: "Maneesha" },
    combinedTitle: "Manu Maxim & Maneesha",
    hashtag: "#ManuWedsManeesha"
  },
  event: {
    targetDateISO: "2026-11-21T11:50:00+05:30",
    dateFormatted: "Saturday, 21st November 2026",
    muhurthamTime: "11:50 AM – 12:36 PM"
  },
  venue: {
    name: "Thimiri Bank Convention Centre",
    city: "Cheruvathur",
    mapUrl: "https://share.google/yBmRznAAygHOGzNtF"
  },
  audio: {
    file: "assets/audio/music.mp3"
  }
};
```

---

## 🎵 How to Change Background Music

1. Replace the file at `assets/audio/music.mp3` with your preferred wedding track (MP3 format).
2. Or update the `file` path in `wedding-config.js` to point to any local or web URL.

---

## 🚀 How to Preview and Host Free

### Local Preview:
- Simply double click `index.html` in your browser!
- Or run a local lightweight server using PowerShell:
  ```powershell
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` on your phone or computer.

### Free Hosting Options (for sharing via WhatsApp):
1. **GitHub Pages** (100% Free):
   - Push this folder to a GitHub repository.
   - Go to **Settings > Pages > Deploy from branch (main)**.
   - Your invitation is live on `https://yourusername.github.io/wedding-invitation`!
2. **Netlify Drop** (Instant Drag & Drop):
   - Go to [drop.netlify.com](https://app.netlify.com/drop).
   - Drag and drop the `Wedding site` folder.
   - You get a live HTTPS URL within 10 seconds!
3. **Vercel**:
   - Run `npx vercel` or import the GitHub repository on [vercel.com](https://vercel.com).
