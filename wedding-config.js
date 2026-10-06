/**
 * ==============================================================================
 * WEDDING INVITATION CONFIGURATION
 * ==============================================================================
 * All wedding details, couple info, dual events (Wedding & Reception),
 * venue links, photos, audio, and messages are centrally configured here.
 */

const WEDDING_CONFIG = {
  // Couple & Family Information from Wedding Letter
  couple: {
    groom: {
      name: "Manu Maxim",
      role: "Groom",
      parents: "Mrs. Bindu T & Mr. Rajan K.P",
      address: "Symphony, Mokeri, Kuttiady",
      bio: "Son of Mrs. Bindu T & Mr. Rajan K.P, embarking on a beautiful new beginning of love and togetherness."
    },
    bride: {
      name: "Maneesha",
      role: "Bride",
      parents: "Mrs. Pushpa K & Mr. Narayanan K.K",
      address: "Sithara, Weavers Street, Nileshwar",
      bio: "Daughter of Mrs. Pushpa K & Mr. Narayanan K.K, radiating grace and joy into every step of their shared journey."
    },
    combinedTitle: "Manu Maxim & Maneesha",
    hashtag: "#ManuWedsManeesha",
    monogram: "M & M"
  },

  // Dual Events: Wedding Ceremony & Reception
  events: {
    // Primary Event for Countdown
    primaryTargetISO: "2026-11-21T11:50:00+05:30",

    wedding: {
      title: "Wedding Ceremony",
      day: "Saturday",
      dateFormatted: "Saturday, 21st November 2026",
      dateNumber: "21",
      monthYear: "November 2026",
      time: "11:50 AM – 12:36 PM",
      timeSubtitle: "Auspicious Muhurtham",
      venueName: "Thimiri Bank Convention Centre",
      venueCity: "Cheruvathur",
      venueAddress: "Thimiri Bank Convention Centre, Cheruvathur, Kasaragod District, Kerala",
      landmark: "Near Thimiri Service Co-operative Bank, Cheruvathur",
      mapUrl: "https://share.google/yBmRznAAygHOGzNtF",
      embedMapUrl: "https://maps.google.com/maps?q=Thimiri+Bank+Convention+Centre+Cheruvathur&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },

    reception: {
      title: "Wedding Reception",
      day: "Sunday",
      dateFormatted: "Sunday, 22nd November 2026",
      dateNumber: "22",
      monthYear: "November 2026",
      time: "4:30 PM – 08:30 PM",
      timeSubtitle: "Evening Reception & Dinner",
      venueName: "Kalleri Auditorium",
      venueCity: "Vadakara",
      venueAddress: "Kalleri Auditorium, Vadakara, Kozhikode District, Kerala",
      landmark: "Kalleri, Near Vadakara",
      mapUrl: "https://maps.google.com/?q=Kalleri+Auditorium+Vadakara",
      embedMapUrl: "https://maps.google.com/maps?q=Kalleri+Auditorium+Vadakara&t=&z=15&ie=UTF8&iwloc=&output=embed"
    }
  },

  // Invitation Quotes & Emotional Messages
  messages: {
    invitationLetterIntro: "With immense joy and happiness, we invite you to join us for the wedding ceremony and reception of our beloved son",
    shloka: "माङ्गल्यं तन्तुनानेन लोकजीवनहेतुना । कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम् ॥",
    shlokaMeaning: "With this sacred thread, the source of life and love, I tie our souls together in devotion. May we live together happily for a hundred years.",
    emotionalStory: `From sweet conversations to heartfelt promises, our love story has blossomed into a lifelong bond. With immense joy in our hearts and gratitude for all who have shaped our lives, we invite you to be part of our most precious milestone. Your blessings and presence will make our celebration truly complete.`,
    complimentsClosing: "We eagerly await celebrating our special day with you.",
    complimentsFrom: "With best compliments: HIMA"
  },

  // Schedule Timeline for both days
  timeline: [
    {
      date: "Saturday, 21 Nov 2026",
      time: "11:00 AM",
      title: "Welcoming the Guests",
      description: "Arrival of family and friends at Thimiri Bank Convention Centre Cheruvathur.",
      icon: "fa-champagne-glasses"
    },
    {
      date: "Saturday, 21 Nov 2026",
      time: "11:50 AM – 12:36 PM",
      title: "Auspicious Muhurtham & Thali Kettu",
      description: "Sacred marriage ritual, exchanging vows, and tying of the mangalsutra.",
      icon: "fa-heart",
      highlight: true
    },
    {
      date: "Saturday, 21 Nov 2026",
      time: "12:45 PM Onwards",
      title: "Traditional Grand Feast (Sadhya)",
      description: "Celebratory feast served on plantain leaves with festive delicacies and sweet payasam.",
      icon: "fa-utensils"
    },
    {
      date: "Sunday, 22 Nov 2026",
      time: "4:30 PM – 08:30 PM",
      title: "Grand Wedding Reception",
      description: "Celebration, blessings, music, and banquet dinner at Kalleri Auditorium, Vadakara.",
      icon: "fa-glass-cheers",
      highlight: true
    }
  ],

  // Couple Photos and Gallery
  photos: {
    heroPortrait: "assets/images/couple-portrait.jpg",
    ringCeremony: "assets/images/ring-ceremony.jpg",
    gallery: [
      {
        src: "assets/images/couple-portrait.jpg",
        caption: "Manu Maxim & Maneesha — Walking Into Forever",
        tag: "Soulmates"
      },
      {
        src: "assets/images/couple-close-portrait.jpg",
        caption: "Smiles of Forever",
        tag: "Portrait"
      },
      {
        src: "assets/images/ring-ceremony.jpg",
        caption: "The Sacred Promise — Ring Exchange",
        tag: "Ceremony"
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
    file: "assets/audio/music.mp3",
    fallbackOnlineUrl: "https://ia800508.us.archive.org/15/items/100ClassicalMusicMasterpieces/1843%20Mendelssohn%20-%20Wedding%20March%2C%20from%20%27A%20Midsummer%20Night%27s%20Dream%27.mp3",
    title: "Melodious Wedding Theme",
    artist: "Auspicious Instrumental",
    autoPlayOnOpen: true
  },

  // Sharing Pre-fills
  sharing: {
    shareTitle: "💍 Wedding Invitation: Manu Maxim & Maneesha",
    shareMessage: `🌸 You are warmly invited to celebrate the wedding ceremony & reception of Manu Maxim & Maneesha! 🌸\n\n💍 Wedding: Sat, 21-Nov-2026 (11:50 AM – 12:36 PM)\n📍 Thimiri Bank Convention Centre, Cheruvathur\n\n🎉 Reception: Sun, 22-Nov-2026 (4:30 PM – 8:30 PM)\n📍 Kalleri Auditorium, Vadakara\n\nTap the link below to view our interactive wedding invitation card:\n`
  }
};

// Export for module systems or window global
if (typeof module !== "undefined" && module.exports) {
  module.exports = WEDDING_CONFIG;
}
