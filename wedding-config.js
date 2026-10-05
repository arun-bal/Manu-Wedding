/**
 * ==============================================================================
 * WEDDING INVITATION CONFIGURATION
 * ==============================================================================
 * You can easily edit any detail here: couple names, dates, muhurtham time,
 * venue details, Google Maps link, photos, schedule, audio track, and messages.
 * Everything will update automatically across the entire website!
 */

const WEDDING_CONFIG = {
  // Couple Information
  couple: {
    groom: {
      name: "Manu Maxim",
      role: "Groom",
      parents: "S/o Mr. Maxim & Family",
      bio: "An architect of dreams with a heart of gold, stepping into a lifetime of cherished tomorrows."
    },
    bride: {
      name: "Maneesha",
      role: "Bride",
      parents: "D/o & Family",
      bio: "Graceful and spirited, weaving laughter and love into every step of their journey together."
    },
    combinedTitle: "Manu Maxim & Maneesha",
    hashtag: "#ManuWedsManeesha",
    monogram: "M & M"
  },

  // Wedding Date & Muhurtham Timings
  event: {
    // Standard ISO / JS compatible date for countdown (21 November 2026 at 11:50 AM IST)
    targetDateISO: "2026-11-21T11:50:00+05:30",
    dateFormatted: "Saturday, 21st November 2026",
    day: "Saturday",
    dateNumber: "21",
    monthYear: "November 2026",
    muhurthamTime: "11:50 AM – 12:36 PM",
    timeDisplay: "11:50 AM to 12:36 PM (Auspicious Muhurtham)",
    ceremonyType: "Traditional Hindu Wedding Ceremony"
  },

  // Venue & Location
  venue: {
    name: "Thimiri Bank Convention Centre",
    city: "Cheruvathur",
    fullAddress: "Thimiri Bank Convention Centre, Cheruvathur, Kasaragod District, Kerala, India",
    landmark: "Near Thimiri Service Co-operative Bank, Cheruvathur",
    // User's Google Maps link
    mapUrl: "https://share.google/yBmRznAAygHOGzNtF",
    // Google Maps Embed or Navigation Query
    embedMapUrl: "https://maps.google.com/maps?q=Thimiri+Bank+Convention+Centre+Cheruvathur&t=&z=15&ie=UTF8&iwloc=&output=embed"
  },

  // Invitation Quotes & Emotional Messages
  messages: {
    shloka: "माङ्गल्यं तन्तुनानेन लोकजीवनहेतुना । कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम् ॥",
    shlokaMeaning: "With this sacred thread, the source of life and love, I tie our souls together in devotion. May we live together happily for a hundred years.",
    welcomeHeader: "Together with our families",
    subHeader: "Cordially invite you to celebrate our union in holy matrimony",
    emotionalStory: `From sweet conversations to heartfelt promises, our love story has blossomed into a lifelong bond. With immense joy in our hearts and gratitude for all who have shaped our lives, we invite you to be part of our most precious milestone. Your blessings and presence will make our celebration truly complete.`,
    invitationClosing: "With love, blessings & warmth,",
    familyWarmth: "Warmly invited by Maxim & Family and all near and dear ones."
  },

  // Schedule Timeline
  timeline: [
    {
      time: "11:00 AM",
      title: "Welcoming the Guests",
      description: "Arrival of family and friends accompanied by traditional melodious nadaswaram.",
      icon: "fa-champagne-glasses"
    },
    {
      time: "11:50 AM – 12:36 PM",
      title: "Auspicious Muhurtham & Thali Kettu",
      description: "The sacred nuptial ritual, tying of the mangalsutra, exchanging vows and garlands.",
      icon: "fa-heart",
      highlight: true
    },
    {
      time: "12:45 PM Onwards",
      title: "Grand Wedding Feast (Sadhya)",
      description: "Traditional feast served on plantain leaves with culinary delights and sweet payasam.",
      icon: "fa-utensils"
    },
    {
      time: "02:30 PM",
      title: "Blessings & Photo Keepsakes",
      description: "Capturing moments and showering the newlyweds with heartfelt blessings.",
      icon: "fa-camera"
    }
  ],

  // Couple Photos and Gallery
  photos: {
    heroPortrait: "assets/images/couple-portrait.jpg",
    ringCeremony: "assets/images/ring-ceremony.jpg",
    gallery: [
      {
        src: "assets/images/couple-portrait.jpg",
        caption: "Manu Maxim & Maneesha",
        tag: "Soulmates"
      },
      {
        src: "assets/images/ring-ceremony.jpg",
        caption: "A Sacred Promise — The Ring Exchange",
        tag: "Ceremony"
      },
      {
        src: "assets/images/couple-1.jpg",
        caption: "Smiles of Forever",
        tag: "Love"
      },
      {
        src: "assets/images/couple-2.jpg",
        caption: "Blessed Beginnings with Family",
        tag: "Family Moments"
      }
    ]
  },

  // Audio & Background Music Settings
  audio: {
    // Path to the background music file
    file: "assets/audio/music.mp3",
    // Fallback online wedding instrumental stream if local file isn't loaded
    fallbackOnlineUrl: "https://ia800508.us.archive.org/15/items/100ClassicalMusicMasterpieces/1843%20Mendelssohn%20-%20Wedding%20March%2C%20from%20%27A%20Midsummer%20Night%27s%20Dream%27.mp3",
    title: "Melodious Wedding Theme",
    artist: "Auspicious Instrumental",
    autoPlayOnOpen: true
  },

  // WhatsApp Sharing & RSVP Pre-fills
  sharing: {
    rsvpWhatsAppNumber: "+919876543210", // Edit with bride/groom WhatsApp number
    shareTitle: "💍 Wedding Invitation: Manu Maxim & Maneesha",
    shareMessage: `🌸 You are warmly invited to celebrate the wedding of Manu Maxim & Maneesha! 🌸\n\n📅 Date: Saturday, 21-Nov-2026\n⏰ Muhurtham: 11:50 AM - 12:36 PM\n📍 Venue: Thimiri Bank Convention Centre, Cheruvathur\n\nTap the link below to view our interactive wedding invitation card:\n`
  }
};

// Export for module systems or window global
if (typeof module !== "undefined" && module.exports) {
  module.exports = WEDDING_CONFIG;
}
