/* DCR update: Approach now resumes the homepage reel instead of restarting it. */
/* DCR update: 77 Diamonds SS24 mobile MP4 and HLS refreshed v6. */
/* DCR update: 77 Diamonds SS24 refreshed MP4, HLS, and still assets v5. */
/* DCR update: 77 Diamonds SS24 refreshed MP4 and HLS sources v4. */
/* DCR update: 77 Diamonds SS24 refreshed MP4 and HLS sources v3. */
/* DCR update: 77 Diamonds SS24 refreshed HLS streams. */
/* DCR update: 77 Diamonds SS24 — Commercial Direction, desktop/mobile MP4 + HLS + stills. */
/* DCR update: contact stable v7 no restart, tab-freeze, robust email, contact-toggle hit zone. */
/* DCR update: contact stable v6 mobile pause/resume, nav toggle, native email. */
/* DCR update: contact modal v4 slower reveal, contact nav stays active, native mailto. */
/* DCR update: contact modal v3 slower luxury reveal, staged links, close last. */
/* DCR update: contact modal v2 centred crisp links, mailto fix, subtle glass reveal. */
/* DCR update: refined contact modal links using original glass animation. */
/* DCR update: mobile client videos now MP4-first with 3s HLS fallback. */
/* DCR update: homepage desktop v3 + mobile v2 videos; desktop remains MP4-only. */
/* DCR update: homepage main reel desktop MP4-only; mobile keeps HLS fallback. */
/* DCR update: restart homepage main reel when returning from client videos / overlays. */
/* DCR update: homepage mobile main reel + desktop/mobile poster images. */
/* DCR update: homepage main reel v2 on desktop + mobile — shared MP4 + HLS stream. */
/* DCR update: homepage desktop main reel v2 source swap — MP4 + HLS stream. */
/* DCR update: LOVEBITE excerpt credit + mobile-only swipe-to-clear. */
/* DCR update: Christie’s Luxury AW23 desktop/mobile v2 source swap — 16x9.2 + 9x16.2. */
/* DCR update: LOVEBITE desktop/mobile v4 source swap — 16x9.4 + 9x16.4. */
/* DCR update: Half Sick of Shadows job description credit + stills. */
/* Based on overlay timer separation fix; no overlay-behaviour rewrite in this update. */
/* mobile overlay quick-freeze test from 4ee64d5 */
/* DCR update: mobile homepage autoplay + client-video nav preservation + faster mobile Approach exit */
/* Based on 7a86260 overlay behaviour. Mobile HLS fallback deliberately disabled while pause/resume is stabilised. */
const videos = {
    main: document.getElementById("main-reel"),
    commercial: document.getElementById("commercial-reel"),
    narrative: document.getElementById("narrative-reel"),
    "tom-ford": document.getElementById("tom-ford-reel"),
    "mr-porter": document.getElementById("mr-porter-reel"),
    "christies-spring-season-25": document.getElementById("christies-spring-season-25-reel"),
    "vogue-bicester-village": document.getElementById("vogue-bicester-village-reel"),
    "christies-the-winter-egg": document.getElementById("christies-the-winter-egg-reel"),
    "christies-classic-week": document.getElementById("christies-classic-week-reel"),
    "vogue-suntory": document.getElementById("vogue-suntory-reel"),
    "christies-luxury-aw23": document.getElementById("christies-luxury-aw23-reel"),
    "christies-luxury-ss24": document.getElementById("christies-luxury-ss24-reel"),
    "77-diamonds-ss24": document.getElementById("77-diamonds-ss24-reel"),
    "lovebite": document.getElementById("lovebite-reel"),
    "half-sick-of-shadows": document.getElementById("half-sick-of-shadows-reel")
  };

  let current = "main";
  let mainReelMobileMotionReady = false;
  let mainReelMobileMotionTimer = null;
  let mainReelMobileMotionAttempts = 0;
  let mainReelHolderSavedStyle = null;
  let mainReelMobileFallbackStillTimer = null;
  let mainReelMobileFallbackStillAllowed = false;
  const MAIN_REEL_DESKTOP_URL = "https://portfolio-pullzone.b-cdn.net/HOMEPAGE_FILMS/main-reel-bg-no-audio.3.mp4";
  const MAIN_REEL_DESKTOP_HLS_URL = "https://vz-636468bf-dd1.b-cdn.net/d8e1fd05-a14e-40f9-8393-342b50d83145/playlist.m3u8";
  const MAIN_REEL_MOBILE_URL = "https://portfolio-pullzone.b-cdn.net/HOMEPAGE_FILMS/main-reel-bg-no-audio-mobile.2.mp4";
  const MAIN_REEL_MOBILE_HLS_URL = "https://vz-636468bf-dd1.b-cdn.net/29731024-f551-4c6d-a6a6-5d4b05a8b1ce/playlist.m3u8";
  const MAIN_REEL_DESKTOP_POSTER_URL = "https://portfolio-pullzone.b-cdn.net/HOMEPAGE_FILMS/main-reel-poster-desktop.jpg";
  const MAIN_REEL_MOBILE_POSTER_URL = "https://portfolio-pullzone.b-cdn.net/HOMEPAGE_FILMS/main-reel-poster-mobile.jpg";
  const MAIN_REEL_HLS_FALLBACK_MS = 3000;
  let mainReelInitialSourceUrl = "";
  let mainReelSourceMode = "";
  let mainReelHlsInstance = null;
  let mainReelHlsFallbackTimeout = null;
  const clientVideoSourceConfig = {
    "tom-ford": {
      creditTitle: "FINISHING EDITOR / ONLINE EDITOR",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/7ed50dd2-9a11-43c5-be79-ece38675d744/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/1426fc88-3b39-444f-9e05-d46d147af762/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/00_TOM_FORD/FASHION/TF_Fucking_Fabulous_2025_Lip_Model_Video_Uncensored_15s_1920x1080_WEBSITE_RES.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/00_TOM_FORD/FASHION/TF_Fucking_Fabulous_2025_Lip_Model_Video_Uncensored_15s_1080x1920_WEBSITE_RES.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/00_TOM_FORD/FASHION/STILL_TF_Fucking_Fabulous_2025_Lip_Model_Video_Uncensored_15s_1920x1080_1.1.1_1.1.2.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/00_TOM_FORD/FASHION/STILL_TF_Fucking_Fabulous_2025_Lip_Model_Video_Uncensored_15s_1080x1920_1.1.1_1.1.1.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/00_TOM_FORD/FASHION/STILL_2_TF_Fucking_Fabulous_2025_Lip_Model_Video_Uncensored_15s_1920x1080_1.1.1_1.1.2_1.1.3.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/00_TOM_FORD/FASHION/STILL_2_TF_Fucking_Fabulous_2025_Lip_Model_Video_Uncensored_15s_1080x1920_1.1.1_1.1.1_1.1.2.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "mr-porter": {
      creditTitle: "EDITOR + COLOURIST",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/94276a0d-8455-489e-bffa-f8248c6760c9/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/41f618ce-7a7b-40a4-9d2c-2478c1a4dbaf/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/MR_PORTER/01_HARINGTON_MASTER_BRANDING_CLOSE_16x9_WEBSITE_RES.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/MR_PORTER/01_HARINGTON_MASTER_BRANDING_CLOSE_9x16_WEBSITE_RES.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/MR_PORTER/STILL_01_HARINGTON_MASTER_BRANDING_CLOSE_16x9_1.3.1_1.3.1.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/MR_PORTER/STILL_01_HARINGTON_MASTER_BRANDING_CLOSE_9x16_1.3.1_1.3.1.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/MR_PORTER/STILL_01_HARINGTON_MASTER_BRANDING_CLOSE_16x9_1.3.1.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/MR_PORTER/STILL_01_HARINGTON_MASTER_BRANDING_CLOSE_9x16_1.3.1.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "christies-spring-season-25": {
      creditTitle: "COLOURIST",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/164a52ad-3dbb-47f3-9b5a-8ca6f8bffe55/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/3c8fdc21-e14a-4466-9cb0-fe17253c64f1/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/LUXURY_SS25/GNV-LUX-SS25-Watches-Final_WEBSITE_RES.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/LUXURY_SS25/GNV-LUX-SS25-Watches-Social-Final_WEBSITE_RES.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/LUXURY_SS25/STILL_GNV-LUX-SS25-Watches-Final_1.2.1_1.2.1.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/LUXURY_SS25/STILL_GNV-LUX-SS25-JAR-Social-Final_1.2.1_1.2.1.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/LUXURY_SS25/STILL_GNV-LUX-SS25-Watches-Final_1.2.1.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/LUXURY_SS25/STILL_GNV-LUX-SS25-JAR-Social-Final_1.2.1.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "vogue-bicester-village": {
      creditTitle: "COLOURIST",
      creditDelayMs: 5000,
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/41929183-a0d0-4bcf-b3f1-298cc06f6ac5/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/5ed7099b-4942-4890-8417-8131e2641279/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/BICESTER/VOGUE_BICESTER_COLLECTION_16X9.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/BICESTER/VOGUE_BICESTER_COLLECTION_9X16.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/BICESTER/VOGUE_BICESTER_COLLECTION_16X9_HOLDING_STILL.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/BICESTER/VOGUE_BICESTER_COLLECTION_9x16_HOLDING_STILL.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/BICESTER/VOGUE_BICESTER_COLLECTION_16X9_END_STILL.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/BICESTER/VOGUE_BICESTER_COLLECTION_9X16_END_STILL.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "christies-the-winter-egg": {
      creditTitle: "EDITOR + COMPOSER",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/ff4ce16e-332a-428e-90e7-fa2e7c43f3e5/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/d3d2fc38-a7ea-47d3-a18f-20c56ba9422c/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/01_CHRISTIE'S_WINTER_EGG__WITH_TITLES_WEBSITE_RES.2.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/01_CHRISTIE'S_WINTER_EGG_SOCIAL_EDIT_V2_WITH_TITLES_WEBSITE_RES.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/STILL_01_CHRISTIE'S_WINTER_EGG__WITH_TITLES_1.4.1_1.4.1.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/STILL_01_CHRISTIE'S_WINTER_EGG_SOCIAL_EDIT_V2_WITH_TITLES_1.4.1_1.4.1.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/STILL_01_CHRISTIE'S_WINTER_EGG__WITH_TITLES_1.4.1.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/STILL_01_CHRISTIE'S_WINTER_EGG_SOCIAL_EDIT_V2_WITH_TITLES_1.4.1.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "christies-classic-week": {
      creditTitle: "EDITOR, COLOURIST, COMPOSER",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/eca1105c-23ff-485a-a1b0-4101cf5b66c7/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/fb144186-aa4c-4c8c-a135-27b9ba3be022/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/CLASSIC_WEEK/Christie's_Classic_Week_16x9.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/CLASSIC_WEEK/Christie's_Classic_Week_9x16.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/CLASSIC_WEEK/Christie's_Classic_Week_16x9_HOLDING_STILL.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/CLASSIC_WEEK/Christie's_Classic_Week_9x16_HOLDING_STILL.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/CLASSIC_WEEK/Christie's_Classic_Week_16x9_ENDING_STILL.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/CLASSIC_WEEK/Christie's_Classic_Week_9x16_ENDING_STILL.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "vogue-suntory": {
      creditTitle: "COLOURIST",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/3a6ae6dc-a97c-4226-8bc4-ef57ce593409/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/18aea18f-f824-401b-8e53-bdd6524ee23f/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/SUNTORY/Vogue_Suntory_16x9_WEBSITE_RES.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/SUNTORY/Vogue_Suntory_9x16_WEBSITE_RES.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/SUNTORY/Vogue_Suntory_16_9.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/SUNTORY/Vogue_Suntory_9x16.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/SUNTORY/Vogue_Suntory_16_9_1.5.2.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/VOGUE/SUNTORY/Vogue_Suntory_9x16_1.9.1.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "christies-luxury-aw23": {
      creditTitle: "COMMERCIAL DIRECTION",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/a5a6ec45-3a66-4391-8635-53569b50b5ca/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/43e0a9ea-d31d-4de9-9138-b733510287ae/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_01/CHRISTIE'S_DIRECTION_01_16x9.2.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_01/CHRISTIE'S_DIRECTION_01_9x16.2.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_01/CHRISTIE'S_DIRECTION_01_16x9_HOLDING_STILL.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_01/CHRISTIE'S_DIRECTION_01_9x16_HOLDING_STILL.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_01/CHRISTIE'S_DIRECTION_01_16x9_ENDING_STILL.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_01/CHRISTIE'S_DIRECTION_01_9x16_ENDING_STILL.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "christies-luxury-ss24": {
      creditTitle: "COMMERCIAL DIRECTION",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/77a34ed1-959b-4dd3-aa4e-772b510d12c8/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/5becaa24-9fe7-4f48-858e-a86686b8974c/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_02/CHRISTIE'S_LUX_SS24_16x9.4.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_02/CHRISTIE'S_LUX_SS24_9x16.3.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_02/CHRISTIE'S_LUX_SS24_16x9_HOLDING_STILL_3.10.1.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_02/CHRISTIE'S_LUX_SS24_9X16_HOLDING_STILL_3.10.1_3.10.1.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_02/CHRISTIE'S_LUX_SS24_16x9_ENDING_STILL_3.10.1_1.48.1.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/CHRISTIE'S/LUX_02/CHRISTIE'S_LUX_SS24_9x16_ENDING_STILL_3.10.1_1.48.1_1.54.1.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "77-diamonds-ss24": {
      creditTitle: "COMMERCIAL DIRECTION",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/4e2f3fa2-a6a7-4efa-b37c-c0dd90147899/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/5b505b17-66b4-4a72-bdc9-ff49f176eb9f/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/77_DIAMONDS/77_DIAMONDS_SS24_DESKTOP_16x9.4.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/77_DIAMONDS/77_DIAMONDS_SS24_MOBILE_9x16.5.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/77_DIAMONDS/77_DIAMONDS_STILL_OPENING_DESKTOP_16x9.3.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/77_DIAMONDS/77_DIAMONDS_STILL_OPENING_MOBILE_9x16.3.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/77_DIAMONDS/77_DIAMONDS_STILL_ENDING_DESKTOP_16x9.3.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/77_DIAMONDS/77_DIAMONDS_STILL_ENDING_MOBILE_9x16.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "lovebite": {
      creditTitle: "NARRATIVE DIRECTION",
      creditHtml: 'NARRATIVE DIRECTION<br><span class="dcr-client-video-credit-subline">(excerpt)</span>',
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/258f01ec-459d-4156-b751-bb6e54b38706/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/6dc7e73c-d048-41c9-a389-b31c513068f1/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/LOVEBITE/LOVEBITE_DESKTOP_16x9.4.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/LOVEBITE/LOVEBITE_MOBILE_9x16.4.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/LOVEBITE/LOVEBITE_DESKTOP_HOLDING_STILL_16x9.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/LOVEBITE/LOVEBITE_MOBILE_HOLDING_STILL_9x16.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/LOVEBITE/LOVEBITE_DESKTOP_ENDING_STILL_16x9.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/LOVEBITE/LOVEBITE_ENDING_STILL_9x16.jpg",
      activeSourceMode: "",
      playbackReady: false
    },
    "half-sick-of-shadows": {
      creditTitle: "NARRATIVE DIRECTION",
      creditHtml: 'NARRATIVE DIRECTION<br><span class="dcr-client-video-credit-subline">(excerpt)</span>',
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/8d7f8047-e810-48e6-875f-a9fbc5ca9c93/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/96aeeac0-ae37-44cb-9a6e-fc4c2213608e/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/00_HSOS/HSOS.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/00_HSOS/HSOS-9x16.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/00_HSOS/open_16x9_1.1.2.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/00_HSOS/open_9x16_1.1.1.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/00_HSOS/close_16x9_1.13.1.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/DIRECTION/00_HSOS/close_9x16_1.13.1.jpg",
      activeSourceMode: "",
      playbackReady: false
    }
  };
  let hasHoveredNarrative = false;
  let audioFadeAnimation = null;
  let activeProjectButton = null;
  let activeMainNavButton = null;
  let activeSection = null;
  let isApproachOpen = false;
  let isContactOpen = false;
  let revealTimeouts = [];
  let approachTimeouts = [];
  let contactTimeouts = [];
  let overlayVideoTimeouts = [];
  let approachPlaybackAnimation = null;
  let approachPausedVideo = null;
  let approachVideoWasPaused = false;
  let approachResumeState = null;
  let contactVideoState = null;
  let centerNameReturnTimeout = null;
  let centerNameSettleTimeout = null;
  let projectsGradientPeakTimeout = null;
  let clientVideoLoadingHideTimeout = null;
  let clientVideoLoadingWatchTimer = null;
  let clientVideoLoadingTextDelayTimer = null;
  let clientVideoCreditShowTimeout = null;
  let clientVideoCreditHideTimeout = null;
  let clientVideoEndReturnTimeout = null;
  let mobileClientFullscreenNavActive = false;
  let mobileClientFullscreenNavEntries = [];
  let mobileClientFullscreenNavCleanupTimeout = null;
  let mobileClientFullscreenTouchStart = null;
  let desktopClientFullscreenPointerStart = null;
  let desktopClientFullscreenWheelLock = false;
  let clientVideoSwipeHintShowTimeout = null;
  let clientVideoSwipeHintHideTimeout = null;
  let clientVideoSwipeHintShownThisSession = false;

  const CLIENT_VIDEO_PLAYBACK_VOLUME = 0.68;
  const CLIENT_DESKTOP_MP4_FALLBACK_TO_HLS_MS = 3000;
  const CLIENT_HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js";
  const CONTACT_EMAIL_ADDRESS = "contact@davidcrose.com";
  const CONTACT_MAILTO_URL = "mailto:" + CONTACT_EMAIL_ADDRESS;
  const CONTACT_INSTAGRAM_URL = "https://www.instagram.com/davidr0se/";
  const clientVideoHlsInstances = {};
  let hlsJsLoadPromise = null;

  Object.keys(videos).forEach((key) => {
    if (!videos[key]) {
      delete videos[key];
    }
  });

  function isClientVideoKey(key) {
    return Boolean(clientVideoSourceConfig[key]);
  }

  function isHlsSourceUrl(sourceUrl) {
    return /\.m3u8(?:$|[?#])/i.test(sourceUrl || "");
  }

  function supportsNativeHls(video) {
    if (!video || !video.canPlayType) return false;

    return Boolean(
      video.canPlayType("application/vnd.apple.mpegurl") ||
      video.canPlayType("application/x-mpegURL")
    );
  }

  function getClientSourceUrlForViewport(key) {
    const config = clientVideoSourceConfig[key];

    if (!config) return "";

    if (isMobileClientVideoViewport()) {
      // Mobile now tries the optimised MP4 first as well. The direct MP4 avoids
      // the small early HLS quality-switch audio blip; if it takes too long,
      // the fallback timer below moves to Bunny Stream HLS.
      return config.mobileUrl || config.mobileHlsUrl || config.desktopUrl || config.desktopHlsUrl || "";
    }

    // Desktop gets the full-quality MP4 first so the opening frame does not
    // briefly appear as a low-quality adaptive HLS rendition. If it takes too
    // long to start, we fall back to HLS below.
    return config.desktopUrl || config.desktopHlsUrl || config.mobileUrl || config.mobileHlsUrl || "";
  }

  function getClientFallbackSourceUrlForViewport(key) {
    const config = clientVideoSourceConfig[key];

    if (!config) return "";

    if (isMobileClientVideoViewport()) {
      return config.mobileUrl || config.desktopUrl || "";
    }

    return config.desktopUrl || config.mobileUrl || "";
  }

  function getClientHlsSourceUrlForViewport(key) {
    const config = clientVideoSourceConfig[key];

    if (!config) return "";

    if (isMobileClientVideoViewport()) {
      return config.mobileHlsUrl || config.desktopHlsUrl || "";
    }

    return config.desktopHlsUrl || config.mobileHlsUrl || "";
  }

  function clearClientDesktopHlsFallbackTimer(key) {
    const config = clientVideoSourceConfig[key];

    if (!config || !config.desktopHlsFallbackTimeout) return;

    clearTimeout(config.desktopHlsFallbackTimeout);
    config.desktopHlsFallbackTimeout = null;
  }

  function switchDesktopClientVideoToHlsFallback(key) {
    const video = videos[key];
    const config = clientVideoSourceConfig[key];
    const hlsUrl = getClientHlsSourceUrlForViewport(key);
    const sourceMode = isMobileClientVideoViewport() ? "mobile" : "desktop";

    if (!video || !config || !hlsUrl) return;
    if (current !== key || config.playbackReady) return;
    if (isHlsSourceUrl(config.activeSourceUrl)) return;

    config.activeSourceMode = sourceMode + "-hls-fallback|" + hlsUrl;
    config.activeSourceUrl = hlsUrl;
    config.autoplayAfterSourceReady = true;
    config.playbackReady = false;

    try {
      video.pause();
      video.currentTime = 0;
      video.preload = "auto";
      video.setAttribute("preload", "auto");
    } catch (error) {}

    setVideoSourceUrl(video, hlsUrl, key);
    showClientVideoLoadingState(key, true);
    watchClientVideoMotion(key, 0);
  }

  function scheduleDesktopClientVideoHlsFallback(key) {
    const config = clientVideoSourceConfig[key];

    // Client videos are MP4-first on both desktop and mobile.
    // If the MP4 has not started after the timer, switch to the matching Bunny Stream HLS.
    const hlsUrl = getClientHlsSourceUrlForViewport(key);

    if (!config || !hlsUrl) return;
    if (isHlsSourceUrl(config.activeSourceUrl)) return;

    clearClientDesktopHlsFallbackTimer(key);

    config.desktopHlsFallbackTimeout = setTimeout(() => {
      config.desktopHlsFallbackTimeout = null;
      switchDesktopClientVideoToHlsFallback(key);
    }, CLIENT_DESKTOP_MP4_FALLBACK_TO_HLS_MS);
  }

  function loadHlsJsLibrary() {
    if (window.Hls && typeof window.Hls.isSupported === "function") {
      return Promise.resolve(window.Hls);
    }

    if (hlsJsLoadPromise) {
      return hlsJsLoadPromise;
    }

    hlsJsLoadPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector("script[data-dcr-hls-js]");

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.Hls), { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = CLIENT_HLS_JS_URL;
      script.async = true;
      script.defer = true;
      script.setAttribute("data-dcr-hls-js", "true");

      script.addEventListener("load", () => {
        if (window.Hls && typeof window.Hls.isSupported === "function") {
          resolve(window.Hls);
        } else {
          reject(new Error("hls.js loaded but Hls was unavailable"));
        }
      }, { once: true });

      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });

    return hlsJsLoadPromise;
  }

  function destroyClientHlsInstance(key) {
    const hls = clientVideoHlsInstances[key];

    if (!hls) return;

    try {
      hls.destroy();
    } catch (error) {}

    delete clientVideoHlsInstances[key];
  }

  function destroyMainReelHlsInstance() {
    if (!mainReelHlsInstance) return;

    try {
      mainReelHlsInstance.destroy();
    } catch (error) {}

    mainReelHlsInstance = null;
  }

  function clearMainReelHlsFallbackTimer() {
    if (!mainReelHlsFallbackTimeout) return;

    clearTimeout(mainReelHlsFallbackTimeout);
    mainReelHlsFallbackTimeout = null;
  }

  function getMainReelSourceModeForViewport() {
    return isMobileViewportForMainReel() ? "mobile" : "desktop";
  }

  function getMainReelMp4UrlForViewport() {
    return isMobileViewportForMainReel() ? MAIN_REEL_MOBILE_URL : MAIN_REEL_DESKTOP_URL;
  }

  function getMainReelHlsUrlForViewport() {
    // Desktop homepage must stay MP4-only and hold on the poster/still until the MP4 is ready.
    // Mobile keeps the timed HLS fallback.
    return isMobileViewportForMainReel() ? MAIN_REEL_MOBILE_HLS_URL : "";
  }

  function getMainReelPosterUrlForViewport() {
    return isMobileViewportForMainReel()
      ? MAIN_REEL_MOBILE_POSTER_URL
      : MAIN_REEL_DESKTOP_POSTER_URL;
  }

  function applyMainReelPosterForViewport() {
    const video = videos.main;
    const posterUrl = getMainReelPosterUrlForViewport();

    if (!video || !posterUrl) return;

    try {
      video.poster = posterUrl;
      video.setAttribute("poster", posterUrl);
    } catch (error) {}

    const holder = getMainReelHolder();

    if (holder) {
      try {
        holder.style.backgroundImage = 'url("' + posterUrl + '")';
        holder.style.backgroundSize = "cover";
        holder.style.backgroundPosition = "center center";
        holder.style.backgroundRepeat = "no-repeat";
      } catch (error) {}
    }
  }

  function isMainReelSourceViewport() {
    return Boolean(videos.main);
  }

  function captureMainReelInitialSource() {
    if (!videos.main || mainReelInitialSourceUrl) return;

    mainReelInitialSourceUrl = getVideoSourceUrl(videos.main);
  }

  function fallbackMainReelToMp4() {
    const nextMp4Url = getMainReelMp4UrlForViewport();

    if (!videos.main || !nextMp4Url) return;

    destroyMainReelHlsInstance();
    mainReelSourceMode = getMainReelSourceModeForViewport() + "-mp4|" + nextMp4Url;
    setDirectVideoSourceUrl(videos.main, nextMp4Url);

    if (current === "main" && isMainReelSourceViewport()) {
      playVideo(videos.main);
    }
  }

  function setMainReelHlsSource(sourceUrl) {
    const video = videos.main;

    if (!video || !sourceUrl) return;

    destroyMainReelHlsInstance();
    mainReelSourceMode = getMainReelSourceModeForViewport() + "-hls|" + sourceUrl;

    const source = video.querySelector("source");

    if (source) {
      source.removeAttribute("src");
    }

    video.removeAttribute("src");

    if (supportsNativeHls(video)) {
      setDirectVideoSourceUrl(video, sourceUrl);

      if (current === "main") {
        playVideo(video);
      }

      return;
    }

    loadHlsJsLibrary()
      .then((Hls) => {
        if (!Hls || typeof Hls.isSupported !== "function" || !Hls.isSupported()) {
          fallbackMainReelToMp4();
          return;
        }

        if (mainReelSourceMode !== getMainReelSourceModeForViewport() + "-hls|" + sourceUrl) return;

        const hls = new Hls({
          enableWorker: true,
          capLevelToPlayerSize: true,
          maxBufferLength: 18,
          maxMaxBufferLength: 36
        });

        mainReelHlsInstance = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (current === "main" && isMainReelSourceViewport()) {
            playVideo(video);
          }
        });

        hls.on(Hls.Events.ERROR, (eventName, data) => {
          if (!data || !data.fatal) return;

          fallbackMainReelToMp4();
        });

        hls.attachMedia(video);
        hls.loadSource(sourceUrl);
      })
      .catch(() => {
        fallbackMainReelToMp4();
      });
  }

  function switchMainReelToHlsFallback() {
    const video = videos.main;
    const nextHlsUrl = getMainReelHlsUrlForViewport();

    if (!video || !nextHlsUrl) return;
    if (!isMobileViewportForMainReel()) return;
    if (!isMainReelSourceViewport() || current !== "main") return;
    if (mainReelSourceMode === getMainReelSourceModeForViewport() + "-hls|" + nextHlsUrl) return;

    const hasMotion =
      !video.paused &&
      !video.ended &&
      video.readyState >= 2 &&
      (video.currentTime || 0) > 0.08;

    if (hasMotion) return;

    setMainReelHlsSource(nextHlsUrl);
  }

  function scheduleMainReelHlsFallback() {
    clearMainReelHlsFallbackTimer();

    if (!isMobileViewportForMainReel()) return;
    if (!isMainReelSourceViewport() || !getMainReelHlsUrlForViewport()) return;

    mainReelHlsFallbackTimeout = setTimeout(() => {
      mainReelHlsFallbackTimeout = null;
      switchMainReelToHlsFallback();
    }, MAIN_REEL_HLS_FALLBACK_MS);
  }

  function prepareMainReelDesktopSource() {
    const video = videos.main;
    const nextMp4Url = getMainReelMp4UrlForViewport();

    if (!video || !nextMp4Url) return;

    captureMainReelInitialSource();
    applyMainReelPosterForViewport();

    const sourceSignature = getMainReelSourceModeForViewport() + "-mp4|" + nextMp4Url;

    if (mainReelSourceMode === sourceSignature) return;

    clearMainReelHlsFallbackTimer();
    destroyMainReelHlsInstance();

    mainReelSourceMode = sourceSignature;

    try {
      video.preload = "auto";
      video.setAttribute("preload", "auto");
    } catch (error) {}

    setDirectVideoSourceUrl(video, nextMp4Url);
    scheduleMainReelHlsFallback();
  }

  function restartMainReelFromBeginning() {
    const mainVideo = videos.main;

    if (!mainVideo) return;

    prepareMainReelDesktopSource();

    try {
      mainVideo.pause();
    } catch (error) {}

    try {
      mainVideo.currentTime = 0;
    } catch (error) {}

    safelySetMuted(mainVideo, true);
    safelySetPlaybackRate(mainVideo, 1);

    mainVideo.style.opacity = "1";
    mainVideo.style.filter = "blur(0) brightness(1)";
    mainVideo.style.transform = "scale(1)";

    if (isMobileViewportForMainReel()) {
      mainReelMobileMotionReady = false;
      mainReelMobileFallbackStillAllowed = false;
      clearMobileMainReelStillFallbackTimer();

      if (mainReelMobileMotionTimer) {
        clearTimeout(mainReelMobileMotionTimer);
        mainReelMobileMotionTimer = null;
      }

      requestMobileMainReelMotion();
    } else {
      hideMainReelMobileStillOnDesktop();
      playVideo(mainVideo);
    }
  }

  Object.keys(clientVideoSourceConfig).forEach((key) => {
    const video = videos[key];

    if (!video) return;

    const initialSource = video.querySelector("source");
    const initialSourceUrl =
      (initialSource && initialSource.getAttribute("src")) ||
      video.getAttribute("src") ||
      "";

    if (initialSourceUrl && !clientVideoSourceConfig[key].desktopUrl) {
      clientVideoSourceConfig[key].desktopUrl = initialSourceUrl;
    }
  });

  function unloadClientVideoSource(key) {
    const video = videos[key];
    const config = clientVideoSourceConfig[key];

    if (!video || !config) return;

    clearClientDesktopHlsFallbackTimer(key);
    destroyClientHlsInstance(key);

    try {
      video.pause();
    } catch (error) {}

    try {
      video.preload = "none";
      video.setAttribute("preload", "none");
      video.removeAttribute("autoplay");
    } catch (error) {}

    const source = video.querySelector("source");

    if (source) {
      source.removeAttribute("src");
    }

    video.removeAttribute("src");
    config.activeSourceMode = "";
    config.activeSourceUrl = "";
    config.autoplayAfterSourceReady = false;
    config.playbackReady = false;

    try {
      video.load();
    } catch (error) {}
  }

  function unloadInactiveClientVideoSources() {
    Object.keys(clientVideoSourceConfig).forEach((key) => {
      if (current === key) return;
      unloadClientVideoSource(key);
    });
  }

  unloadInactiveClientVideoSources();

  Object.entries(videos).forEach(([key, video]) => {
    video.style.transition =
      "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
      "filter 1.4s cubic-bezier(0.8, 0, 0.2, 1), " +
      "transform 1.4s ease";

    video.style.opacity = key === "main" ? "1" : "0";
    video.style.filter = "blur(0) brightness(1)";
    video.style.transform = "scale(1)";
  });

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function approachSlowdownEase(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function playVideo(video) {
    if (!video) return;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }

  function isDesktopLikePointer() {
    return Boolean(
      window.matchMedia &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }

  function isMobileViewportForMainReel() {
    return Boolean(
      window.matchMedia &&
        window.matchMedia("(max-width: 1024px)").matches &&
        !isDesktopLikePointer()
    );
  }

  function getMainReelMobileStill() {
    // Native poster mode: the homepage still is now handled by the video
    // element's poster attribute, not by a separate overlay div. If an old
    // overlay is still present from a previous embed, force it out of the way.
    const still = document.querySelector(".dcr-main-reel-mobile-still");

    if (still) {
      still.style.display = "none";
      still.style.visibility = "hidden";
      still.style.opacity = "0";
      still.style.pointerEvents = "none";
    }

    return null;
  }

  function getMainReelHolder() {
    return (
      document.querySelector(".dcr-main-reel-holder") ||
      (videos.main && videos.main.closest && videos.main.closest(".dcr-main-reel-holder")) ||
      null
    );
  }

  function saveMainReelHolderStyle(holder) {
    if (!holder || mainReelHolderSavedStyle) return;

    mainReelHolderSavedStyle = {
      display: holder.style.display,
      visibility: holder.style.visibility,
      opacity: holder.style.opacity,
      transition: holder.style.transition,
      pointerEvents: holder.style.pointerEvents
    };
  }

  function hideMainReelHolderForClientVideo() {
    const holder = getMainReelHolder();

    if (!holder) return;

    saveMainReelHolderStyle(holder);

    holder.style.transition = "none";
    holder.style.opacity = "0";
    holder.style.visibility = "hidden";
    holder.style.pointerEvents = "none";
  }

  function showMainReelHolderForWebsiteVideo() {
    const holder = getMainReelHolder();

    if (!holder) return;

    saveMainReelHolderStyle(holder);

    holder.style.display = mainReelHolderSavedStyle.display || "";
    holder.style.transition = mainReelHolderSavedStyle.transition || "";
    holder.style.visibility = mainReelHolderSavedStyle.visibility || "";
    holder.style.opacity = mainReelHolderSavedStyle.opacity || "";
    holder.style.pointerEvents = "none";
  }


  function hideMainReelMobileStillOnDesktop() {
    if (isClientVideoKey(current)) {
      hideMainReelHolderForClientVideo();
    } else {
      showMainReelHolderForWebsiteVideo();
    }

    const still = getMainReelMobileStill();

    if (!still || isMobileViewportForMainReel()) return;

    still.style.display = "none";
    still.style.visibility = "hidden";
    still.style.opacity = "0";
    still.style.pointerEvents = "none";

    if (videos.main) {
      videos.main.style.visibility = "visible";
      videos.main.style.pointerEvents = "none";

      if (current === "main") {
        videos.main.style.opacity = "1";
      }
    }
  }

  function configureMainReelAsDecorative() {
    if (isClientVideoKey(current)) {
      hideMainReelHolderForClientVideo();
    }

    const mainVideo = videos.main;

    if (!mainVideo) return;

    try {
      mainVideo.muted = true;
      mainVideo.defaultMuted = true;
      mainVideo.loop = true;
      mainVideo.autoplay = true;
      mainVideo.playsInline = true;
      mainVideo.controls = false;
      mainVideo.removeAttribute("controls");
      mainVideo.setAttribute("muted", "");
      mainVideo.setAttribute("loop", "");
      mainVideo.setAttribute("autoplay", "");
      mainVideo.setAttribute("playsinline", "");
      mainVideo.setAttribute("webkit-playsinline", "");
      mainVideo.setAttribute("preload", "auto");
      mainVideo.setAttribute("disablepictureinpicture", "");
      mainVideo.setAttribute("disableremoteplayback", "");
      mainVideo.disablePictureInPicture = true;
      mainVideo.style.pointerEvents = "none";
    } catch (error) {}

    prepareMainReelDesktopSource();
  }

  function clearMobileMainReelStillFallbackTimer() {
    if (mainReelMobileFallbackStillTimer) {
      clearTimeout(mainReelMobileFallbackStillTimer);
      mainReelMobileFallbackStillTimer = null;
    }
  }

  function hideMobileMainReelStillForPrimaryAttempt() {
    const still = getMainReelMobileStill();

    if (!still || !isMobileViewportForMainReel()) return;

    still.style.display = "block";
    still.style.visibility = "hidden";
    still.style.opacity = "0";
    still.style.pointerEvents = "none";

    if (videos.main) {
      videos.main.style.opacity = "1";
      videos.main.style.visibility = "visible";
      videos.main.style.pointerEvents = "none";
    }
  }

  function scheduleMobileMainReelStillFallback(delay) {
    if (!videos.main || !isMobileViewportForMainReel() || mainReelMobileMotionReady) return;
    if (mainReelMobileFallbackStillTimer) return;

    hideMobileMainReelStillForPrimaryAttempt();

    mainReelMobileFallbackStillTimer = setTimeout(() => {
      mainReelMobileFallbackStillTimer = null;

      if (!videos.main || !isMobileViewportForMainReel() || mainReelMobileMotionReady) return;

      mainReelMobileFallbackStillAllowed = true;
      keepMobileStillVisible(true);
    }, typeof delay === "number" ? delay : 3000);
  }

  function keepMobileStillVisible(force) {
    const still = getMainReelMobileStill();

    if (!still || !isMobileViewportForMainReel()) return;

    if (!force && !mainReelMobileFallbackStillAllowed) {
      scheduleMobileMainReelStillFallback(3000);
      return;
    }

    still.style.display = "block";
    still.style.visibility = "visible";
    still.style.opacity = "1";
    still.style.pointerEvents = "none";

    if (videos.main && !mainReelMobileMotionReady) {
      videos.main.style.opacity = "0";
      videos.main.style.visibility = "visible";
      videos.main.style.pointerEvents = "none";
    }
  }

  function confirmMobileMainReelMotion() {
    if (!videos.main || mainReelMobileMotionReady) return;

    mainReelMobileMotionReady = true;
    mainReelMobileFallbackStillAllowed = false;
    clearMobileMainReelStillFallbackTimer();

    if (mainReelMobileMotionTimer) {
      clearTimeout(mainReelMobileMotionTimer);
      mainReelMobileMotionTimer = null;
    }

    const still = getMainReelMobileStill();

    videos.main.style.visibility = "visible";
    videos.main.style.pointerEvents = "none";
    videos.main.style.transition =
      "opacity 1800ms cubic-bezier(0.16, 1, 0.3, 1), " +
      "filter 2600ms cubic-bezier(0.16, 1, 0.3, 1), " +
      "transform 3600ms cubic-bezier(0.13, 1, 0.22, 1)";
    videos.main.style.opacity = "1";

    if (still) {
      still.style.transition =
        "opacity 2200ms cubic-bezier(0.16, 1, 0.3, 1)";
      still.style.opacity = "0";

      setTimeout(() => {
        if (mainReelMobileMotionReady) {
          still.style.visibility = "hidden";
        }
      }, 2300);
    }
  }

  function watchMobileMainReelMotion(startTime) {
    if (!videos.main || !isMobileViewportForMainReel() || mainReelMobileMotionReady) {
      return;
    }

    const initialTime = typeof startTime === "number" ? startTime : videos.main.currentTime || 0;
    let checks = 0;

    if (mainReelMobileMotionTimer) {
      clearTimeout(mainReelMobileMotionTimer);
    }

    function check() {
      if (!videos.main || mainReelMobileMotionReady) return;

      checks += 1;

      const hasAdvanced = (videos.main.currentTime || 0) > initialTime + 0.08;
      const isActuallyPlaying =
        !videos.main.paused &&
        !videos.main.ended &&
        videos.main.readyState >= 2;

      if (hasAdvanced || (isActuallyPlaying && checks >= 3)) {
        confirmMobileMainReelMotion();
        return;
      }

      if (checks < 12) {
        mainReelMobileMotionTimer = setTimeout(check, 180);
      } else {
        keepMobileStillVisible();
      }
    }

    mainReelMobileMotionTimer = setTimeout(check, 180);
  }

  function requestMobileMainReelMotion() {
    if (!videos.main || !isMobileViewportForMainReel() || mainReelMobileMotionReady) {
      return;
    }

    // Do not wake the hidden home reel while a client film is playing.
    // iOS is especially sensitive to multiple media elements competing.
    if (current !== "main") {
      return;
    }

    configureMainReelAsDecorative();
    keepMobileStillVisible();

    mainReelMobileMotionAttempts += 1;

    const startTime = videos.main.currentTime || 0;

    try {
      videos.main.muted = true;
      videos.main.defaultMuted = true;
      videos.main.autoplay = true;
      videos.main.playsInline = true;
      videos.main.preload = "auto";
      videos.main.setAttribute("muted", "");
      videos.main.setAttribute("autoplay", "");
      videos.main.setAttribute("playsinline", "");
      videos.main.setAttribute("webkit-playsinline", "");
      videos.main.setAttribute("preload", "auto");

      if (videos.main.readyState === 0) {
        videos.main.load();
      }
    } catch (error) {}

    function handlePlaybackAttempt(playPromise) {
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            watchMobileMainReelMotion(startTime);
          })
          .catch(() => {
            keepMobileStillVisible();
          });
      } else {
        watchMobileMainReelMotion(startTime);
      }
    }

    try {
      handlePlaybackAttempt(videos.main.play());
    } catch (error) {
      keepMobileStillVisible();
    }
  }

  function configureVideoAutoplayFallbacks() {
    Object.entries(videos).forEach(([key, video]) => {
      if (!video) return;

      try {
        video.controls = false;
        video.removeAttribute("controls");

        if (!isClientVideoKey(key)) {
          video.muted = true;
          video.defaultMuted = true;
          video.setAttribute("muted", "");
        }

        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        if (isClientVideoKey(key)) {
          video.preload = "none";
          video.setAttribute("preload", "none");
          video.removeAttribute("autoplay");
        } else {
          video.preload = "auto";
          video.setAttribute("preload", "auto");
        }

        video.disablePictureInPicture = true;
        video.setAttribute("disablepictureinpicture", "");
        video.setAttribute("controlslist", "nodownload noplaybackrate nofullscreen");
        video.style.pointerEvents = "none";
      } catch (error) {}
    });

    hideMainReelMobileStillOnDesktop();

    if (videos.main) {
      configureMainReelAsDecorative();

      if (isMobileViewportForMainReel()) {
        keepMobileStillVisible();

        videos.main.addEventListener("playing", () => {
          watchMobileMainReelMotion(videos.main.currentTime || 0);
        });

        videos.main.addEventListener("timeupdate", () => {
          if (!mainReelMobileMotionReady && videos.main.currentTime > 0.08) {
            confirmMobileMainReelMotion();
          }
        });

        setTimeout(requestMobileMainReelMotion, 120);
        setTimeout(requestMobileMainReelMotion, 480);
        setTimeout(requestMobileMainReelMotion, 1100);
        setTimeout(requestMobileMainReelMotion, 2400);
        setTimeout(requestMobileMainReelMotion, 4600);

        ["touchstart", "touchend", "pointerdown", "click", "keydown"].forEach((eventName) => {
          document.addEventListener(eventName, requestMobileMainReelMotion, {
            passive: true
          });
        });

        window.addEventListener("load", requestMobileMainReelMotion, { once: true });
      } else {
        if (isClientVideoKey(current)) {
          hideMainReelHolderForClientVideo();
        } else {
          hideMainReelMobileStillOnDesktop();
        }
        playVideo(videos.main);
      }
    }

    window.addEventListener("pageshow", () => {
      if (isMobileViewportForMainReel()) {
        requestMobileMainReelMotion();
      } else if (videos.main) {
        if (isClientVideoKey(current)) {
          hideMainReelHolderForClientVideo();
        } else {
          hideMainReelMobileStillOnDesktop();
        }
        playVideo(videos.main);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;

      if (isMobileViewportForMainReel()) {
        requestMobileMainReelMotion();
      } else if (videos.main) {
        if (isClientVideoKey(current)) {
          hideMainReelHolderForClientVideo();
        } else {
          hideMainReelMobileStillOnDesktop();
        }
        playVideo(videos.main);
      }

      if (!isClientVideoKey(current)) {
        prepareAllClientSourcesForViewport();
      }
    });

    window.addEventListener("resize", () => {
      prepareMainReelDesktopSource();

      if (isClientVideoKey(current)) {
        hideMainReelHolderForClientVideo();
      } else {
        hideMainReelMobileStillOnDesktop();
        prepareAllClientSourcesForViewport();
      }
    });
  }

  function safelySetPlaybackRate(video, rate) {
    try {
      video.playbackRate = rate;
    } catch (error) {}
  }

  function safelySetMuted(video, muted) {
    try {
      video.muted = muted;
    } catch (error) {}
  }

  function safelySetVolume(video, volume) {
    try {
      video.volume = Math.max(0, Math.min(1, volume));
    } catch (error) {}
  }

  function showProjectsGradient(options) {
    const root = document.documentElement;
    const shouldPeak = !options || options.peak !== false;

    root.classList.add("projects-gradient-on");

    if (projectsGradientPeakTimeout) {
      clearTimeout(projectsGradientPeakTimeout);
      projectsGradientPeakTimeout = null;
    }

    root.classList.remove("projects-gradient-peak");

    if (!shouldPeak) return;

    requestAnimationFrame(() => {
      if (!root.classList.contains("projects-gradient-on")) return;

      root.classList.add("projects-gradient-peak");

      projectsGradientPeakTimeout = setTimeout(() => {
        root.classList.remove("projects-gradient-peak");
        projectsGradientPeakTimeout = null;
      }, 1750);
    });
  }

  function hideProjectsGradient() {
    const root = document.documentElement;

    if (projectsGradientPeakTimeout) {
      clearTimeout(projectsGradientPeakTimeout);
      projectsGradientPeakTimeout = null;
    }

    root.classList.remove("projects-gradient-peak");
    root.classList.remove("projects-gradient-on");
  }

  function getCenterNameElements() {
    const innerElements = document.querySelectorAll(
      ".center-name-wrapper .name-stack, " +
      ".center-name-wrapper .subheadline"
    );

    if (innerElements.length) {
      return innerElements;
    }

    return document.querySelectorAll(".center-name-wrapper");
  }

  function cancelCenterNameReturn() {
    if (centerNameReturnTimeout) {
      clearTimeout(centerNameReturnTimeout);
      centerNameReturnTimeout = null;
    }

    if (centerNameSettleTimeout) {
      clearTimeout(centerNameSettleTimeout);
      centerNameSettleTimeout = null;
    }
  }

  function hideCenterNameAnimated() {
    cancelCenterNameReturn();
    hideNameShadowSpot();

    getCenterNameElements().forEach((element) => {
      element.style.transformOrigin = "50% 50%";

      element.style.transition =
        "opacity 2200ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "filter 2600ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "transform 3000ms cubic-bezier(0.22, 1, 0.36, 1)";

      element.style.opacity = "0";
      element.style.filter = "blur(7px)";
      element.style.transform = "scale(0.955)";
      element.style.pointerEvents = "none";
    });
  }

  function showCenterNameAnimated(delay) {
    cancelCenterNameReturn();
    showNameShadowSpot(delay || 0);

    centerNameReturnTimeout = setTimeout(() => {
      getCenterNameElements().forEach((element) => {
        element.style.transformOrigin = "50% 50%";

        element.style.transition =
          "opacity 4200ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "filter 5200ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "transform 6800ms cubic-bezier(0.13, 1, 0.22, 1)";

        element.style.visibility = "visible";
        element.style.opacity = "1";
        element.style.filter = "blur(0)";
        element.style.transform = "scale(1.014)";
        element.style.pointerEvents = "";
      });

      centerNameSettleTimeout = setTimeout(() => {
        getCenterNameElements().forEach((element) => {
          element.style.transition =
            "transform 8200ms cubic-bezier(0.16, 1, 0.3, 1)";

          element.style.transform = "scale(1)";
        });

        centerNameSettleTimeout = null;
      }, 4600);

      centerNameReturnTimeout = null;
    }, delay || 0);
  }

  function installClientVideoLoadingStyles() {
    if (document.getElementById("dcr-client-video-loading-styles")) return;

    const style = document.createElement("style");
    style.id = "dcr-client-video-loading-styles";
    style.textContent = `
      .dcr-client-video-loading-still,
      .dcr-client-video-loading-text,
      .dcr-client-video-credit-text,
      .dcr-client-video-swipe-hint {
        pointer-events: none !important;
      }

      .dcr-client-video-loading-still {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-size: cover !important;
        background-position: center center !important;
        background-repeat: no-repeat !important;
        opacity: 0;
        visibility: hidden;
        z-index: 4 !important;
        transform: scale(1.012);
        filter: brightness(0.86) saturate(0.98);
        transition:
          opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 3600ms cubic-bezier(0.13, 1, 0.22, 1),
          filter 3200ms cubic-bezier(0.16, 1, 0.3, 1),
          visibility 0s linear 1200ms;
      }

      html.dcr-client-video-loading-still-on .dcr-client-video-loading-still {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
        filter: brightness(0.9) saturate(1);
        transition:
          opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 4200ms cubic-bezier(0.13, 1, 0.22, 1),
          filter 3600ms cubic-bezier(0.16, 1, 0.3, 1),
          visibility 0s;
      }

      html.dcr-client-video-end-card-on .dcr-client-video-loading-still {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
        filter: brightness(0.86) saturate(1);
        transition:
          opacity 2800ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 6800ms cubic-bezier(0.13, 1, 0.22, 1),
          filter 6200ms cubic-bezier(0.16, 1, 0.3, 1),
          visibility 0s;
      }

      html.dcr-client-video-still-dimmed .dcr-client-video-loading-still {
        opacity: 1;
        visibility: visible;
        transform: scale(1.018);
        filter: blur(7px) brightness(0.56) saturate(0.92);
        transition:
          opacity 1800ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 5200ms cubic-bezier(0.22, 1, 0.36, 1),
          filter 5200ms cubic-bezier(0.22, 1, 0.36, 1),
          visibility 0s;
      }

      .dcr-client-video-loading-text {
        position: fixed !important;
        left: 50vw !important;
        top: 50vh !important;
        top: 50svh !important;
        z-index: 62 !important;
        transform: translate(-50%, -50%) scale(0.965);
        opacity: 0;
        visibility: hidden;
        color: rgba(255, 255, 255, 0.9);
        font: inherit;
        font-size: clamp(10px, 1.05vw, 14px);
        line-height: 1;
        letter-spacing: 0.42em;
        text-transform: uppercase;
        text-align: center;
        white-space: nowrap;
        filter: blur(2.8px);
        text-shadow: 0 0 22px rgba(0, 0, 0, 0.48);
        transition:
          opacity 520ms cubic-bezier(0.22, 1, 0.36, 1),
          visibility 0s linear 520ms;
      }

      html.dcr-client-video-loading-active .dcr-client-video-loading-text {
        opacity: 1;
        visibility: visible;
        animation: dcr-client-loading-pulse 1850ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        transition:
          opacity 620ms cubic-bezier(0.22, 1, 0.36, 1),
          visibility 0s;
      }

      @keyframes dcr-client-loading-pulse {
        0%, 100% {
          opacity: 0.38;
          transform: translate(-50%, -50%) scale(0.962);
          filter: blur(2.8px);
          letter-spacing: 0.44em;
        }

        50% {
          opacity: 0.92;
          transform: translate(-50%, -50%) scale(1.028);
          filter: blur(0);
          letter-spacing: 0.40em;
        }
      }

      .dcr-client-video-credit-subline {
        display: block;
        margin-top: 0.42em;
        font-size: 0.82em;
        line-height: 1;
        letter-spacing: 0.22em;
        text-transform: lowercase;
        opacity: 0.82;
      }

      .dcr-client-video-credit-text {
        position: fixed !important;
        left: 50vw !important;
        top: 50vh !important;
        top: 50svh !important;
        z-index: 64 !important;
        transform: translate(-50%, -50%) scale(0.982);
        opacity: 0;
        visibility: hidden;
        color: rgba(255, 255, 255, 0.92);
        font: inherit;
        font-size: clamp(10px, 1.08vw, 15px);
        line-height: 1.35;
        letter-spacing: 0.30em;
        text-transform: uppercase;
        text-align: center;
        white-space: pre-line;
        filter: blur(8px);
        padding: 0;
        border-radius: 0;
        background: transparent;
        text-shadow: 0 0 26px rgba(0, 0, 0, 0.54);
        transition:
          opacity 2850ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 3400ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 3900ms cubic-bezier(0.13, 1, 0.22, 1),
          visibility 0s linear 2850ms;
      }

      html.dcr-client-video-credit-on .dcr-client-video-credit-text {
        opacity: 1;
        visibility: visible;
        filter: blur(0);
        transform: translate(-50%, -50%) scale(1);
        transition:
          opacity 1500ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 2100ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 2600ms cubic-bezier(0.13, 1, 0.22, 1),
          visibility 0s;
      }

      .dcr-client-video-swipe-hint {
        position: fixed !important;
        left: 50vw !important;
        top: 50vh !important;
        top: 50svh !important;
        z-index: 180 !important;
        width: max-content;
        max-width: 86vw;
        transform: translate(-50%, -50%) translateY(10px) scale(0.985);
        opacity: 0;
        visibility: hidden;
        color: rgba(255, 255, 255, 0.84);
        font: inherit;
        font-size: clamp(9px, 2.2vw, 12px);
        line-height: 1;
        letter-spacing: 0.36em;
        text-transform: uppercase;
        text-align: center;
        white-space: nowrap;
        filter: blur(4px);
        text-shadow: 0 0 22px rgba(0, 0, 0, 0.54);
        transition:
          opacity 1150ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 1600ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 1900ms cubic-bezier(0.13, 1, 0.22, 1),
          visibility 0s linear 1150ms;
      }

      html.dcr-client-video-swipe-hint-on .dcr-client-video-swipe-hint {
        opacity: 1;
        visibility: visible;
        filter: blur(0);
        transform: translate(-50%, -50%) scale(1);
        animation: dcr-client-swipe-hint-drift 2600ms cubic-bezier(0.45, 0, 0.2, 1) 1;
        transition:
          opacity 1250ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 1650ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 1900ms cubic-bezier(0.13, 1, 0.22, 1),
          visibility 0s;
      }

      @keyframes dcr-client-swipe-hint-drift {
        0% {
          transform: translate(-50%, -50%) translateX(0) scale(1);
          letter-spacing: 0.36em;
        }

        34% {
          transform: translate(-50%, -50%) translateX(-7px) scale(1.006);
          letter-spacing: 0.39em;
        }

        68% {
          transform: translate(-50%, -50%) translateX(7px) scale(1.006);
          letter-spacing: 0.39em;
        }

        100% {
          transform: translate(-50%, -50%) translateX(0) scale(1);
          letter-spacing: 0.36em;
        }
      }

      @media (max-width: 1024px) {
        .dcr-client-video-loading-text {
          font-size: clamp(10px, 2.45vw, 13px);
          letter-spacing: 0.38em;
        }

        .dcr-client-video-credit-text {
          font-size: clamp(10px, 2.65vw, 13px);
          letter-spacing: 0.24em;
          max-width: 84vw;
          white-space: normal;
        }

        .dcr-client-video-swipe-hint {
          font-size: clamp(9px, 2.2vw, 12px);
          letter-spacing: 0.34em;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureClientVideoLoadingLayer() {
    installClientVideoLoadingStyles();

    let still = document.querySelector(".dcr-client-video-loading-still");
    let text = document.querySelector(".dcr-client-video-loading-text");
    let credit = document.querySelector(".dcr-client-video-credit-text");
    let swipeHint = document.querySelector(".dcr-client-video-swipe-hint");

    if (!still) {
      still = document.createElement("div");
      still.className = "dcr-client-video-loading-still";
      still.setAttribute("aria-hidden", "true");
      document.body.appendChild(still);
    }

    if (!text) {
      text = document.createElement("div");
      text.className = "dcr-client-video-loading-text";
      text.setAttribute("aria-live", "polite");
      document.body.appendChild(text);
    }

    text.textContent = "LOADING...";

    if (!credit) {
      credit = document.createElement("div");
      credit.className = "dcr-client-video-credit-text";
      credit.setAttribute("aria-hidden", "true");
      document.body.appendChild(credit);
    }

    if (!swipeHint) {
      swipeHint = document.createElement("div");
      swipeHint.className = "dcr-client-video-swipe-hint";
      swipeHint.setAttribute("aria-hidden", "true");
      document.body.appendChild(swipeHint);
    }

    swipeHint.textContent = isMobileClientVideoViewport() ? "SWIPE TO CLEAR" : "";

    return { still, text, credit, swipeHint };
  }

  function getClientVideoKeyByVideo(video) {
    return Object.keys(clientVideoSourceConfig).find((key) => videos[key] === video) || "";
  }

  function shouldSuppressClientVideoLoading(key) {
    const video = videos[key];
    const config = clientVideoSourceConfig[key];

    if (!video || !config) return true;

    return Boolean(config.hasCompleted || config.suppressLoading || video.ended);
  }

  function getClientLoadingStillUrlForViewport(key) {
    const config = clientVideoSourceConfig[key];

    if (!config) return "";

    return isMobileClientVideoViewport()
      ? config.mobileStillUrl || config.desktopStillUrl || ""
      : config.desktopStillUrl || config.mobileStillUrl || "";
  }

  function getClientEndStillUrlForViewport(key) {
    const config = clientVideoSourceConfig[key];

    if (!config) return "";

    return isMobileClientVideoViewport()
      ? config.mobileEndStillUrl || config.desktopEndStillUrl || config.mobileStillUrl || config.desktopStillUrl || ""
      : config.desktopEndStillUrl || config.mobileEndStillUrl || config.desktopStillUrl || config.mobileStillUrl || "";
  }

  function clearClientVideoLoadingTextDelay() {
    if (clientVideoLoadingTextDelayTimer) {
      clearTimeout(clientVideoLoadingTextDelayTimer);
      clientVideoLoadingTextDelayTimer = null;
    }
  }

  function showClientVideoLoadingState(key, includeStill) {
    if (!isClientVideoKey(key) || shouldSuppressClientVideoLoading(key)) return;

    const layer = ensureClientVideoLoadingLayer();
    const root = document.documentElement;
    const stillUrl = getClientLoadingStillUrlForViewport(key);
    const config = clientVideoSourceConfig[key];

    if (clientVideoLoadingHideTimeout) {
      clearTimeout(clientVideoLoadingHideTimeout);
      clientVideoLoadingHideTimeout = null;
    }

    root.classList.remove("dcr-client-video-loading-active");
    root.classList.remove("dcr-client-video-end-card-on");
    clearClientVideoLoadingTextDelay();

    if (includeStill && stillUrl) {
      layer.still.style.transition = "";
      layer.still.style.opacity = "";
      layer.still.style.visibility = "";
      layer.still.style.transform = "";
      layer.still.style.filter = "";
      layer.still.style.backgroundImage = "url(\"" + stillUrl.replace(/"/g, "%22") + "\")";
      root.classList.add("dcr-client-video-loading-still-on");

      clientVideoLoadingTextDelayTimer = setTimeout(() => {
        clientVideoLoadingTextDelayTimer = null;

        if (
          current === key &&
          config &&
          !config.playbackReady &&
          !shouldSuppressClientVideoLoading(key) &&
          root.classList.contains("dcr-client-video-loading-still-on")
        ) {
          root.classList.add("dcr-client-video-loading-active");
        }
      }, 2000);
    } else {
      root.classList.remove("dcr-client-video-loading-still-on");
    }
  }

  function hideClientVideoLoadingState() {
    const root = document.documentElement;

    if (clientVideoLoadingWatchTimer) {
      clearTimeout(clientVideoLoadingWatchTimer);
      clientVideoLoadingWatchTimer = null;
    }

    clearClientVideoLoadingTextDelay();

    root.classList.remove("dcr-client-video-loading-active");
    root.classList.remove("dcr-client-video-loading-still-on");
    root.classList.remove("dcr-client-video-end-card-on");
    root.classList.remove("dcr-client-video-still-dimmed");

    if (clientVideoLoadingHideTimeout) {
      clearTimeout(clientVideoLoadingHideTimeout);
    }

    clientVideoLoadingHideTimeout = setTimeout(() => {
      const layer = ensureClientVideoLoadingLayer();
      layer.still.style.backgroundImage = "";
      layer.still.style.transition = "";
      layer.still.style.opacity = "";
      layer.still.style.visibility = "";
      layer.still.style.transform = "";
      layer.still.style.filter = "";
      clientVideoLoadingHideTimeout = null;
    }, 1300);
  }

  function showClientVideoEndCardState(key) {
    hideClientVideoSwipeHint(false);

    if (!isClientVideoKey(key)) return;

    const stillUrl = getClientEndStillUrlForViewport(key);
    const root = document.documentElement;

    if (!stillUrl) return;

    const layer = ensureClientVideoLoadingLayer();

    if (clientVideoLoadingHideTimeout) {
      clearTimeout(clientVideoLoadingHideTimeout);
      clientVideoLoadingHideTimeout = null;
    }

    clearClientVideoLoadingTextDelay();
    root.classList.remove("dcr-client-video-loading-active");
    root.classList.remove("dcr-client-video-loading-still-on");

    layer.still.style.backgroundImage = "url(\"" + stillUrl.replace(/"/g, "%22") + "\")";
    layer.still.style.transition = "none";
    layer.still.style.opacity = "0";
    layer.still.style.visibility = "visible";
    layer.still.style.transform = "scale(1.018)";
    layer.still.style.filter = "brightness(0.72) saturate(0.96)";

    layer.still.getBoundingClientRect();

    requestAnimationFrame(() => {
      if (current !== key) return;

      layer.still.style.transition = "";
      root.classList.add("dcr-client-video-end-card-on");
      layer.still.style.opacity = "";
      layer.still.style.visibility = "";
      layer.still.style.transform = "";
      layer.still.style.filter = "";
    });
  }

  function dimClientVideoStillForOverlay() {
    const root = document.documentElement;

    if (!isClientVideoKey(current)) return;

    const video = videos[current];
    const config = clientVideoSourceConfig[current];

    if (!video || !config) return;

    const isActivePlayingClientVideo = Boolean(
      config.playbackReady &&
      !config.hasCompleted &&
      !video.ended
    );

    if (isActivePlayingClientVideo) {
      root.classList.remove("dcr-client-video-loading-active");
      root.classList.remove("dcr-client-video-loading-still-on");
      root.classList.remove("dcr-client-video-end-card-on");
      root.classList.remove("dcr-client-video-still-dimmed");
      return;
    }

    const isTrueEndCard = Boolean(
      (config.hasCompleted || video.ended) &&
      root.classList.contains("dcr-client-video-end-card-on")
    );

    const isStillLoading = Boolean(
      !config.playbackReady &&
      root.classList.contains("dcr-client-video-loading-still-on")
    );

    if (isTrueEndCard || isStillLoading) {
      root.classList.add("dcr-client-video-still-dimmed");
    }
  }

  function clearClientVideoStillOverlayDim() {
    document.documentElement.classList.remove("dcr-client-video-still-dimmed");
  }

  function isCurrentClientVideoHoldingEndCard() {
    if (!isClientVideoKey(current)) return false;

    const config = clientVideoSourceConfig[current];
    const video = videos[current];

    return Boolean(
      config &&
      (config.hasCompleted || (video && video.ended)) &&
      document.documentElement.classList.contains("dcr-client-video-end-card-on")
    );
  }

  function shouldKeepCenterNameHiddenAfterApproachClose() {
    return isClientVideoKey(current) && !isCurrentClientVideoHoldingEndCard();
  }

  function restoreCenterNameAfterApproachClose(delay) {
    if (shouldKeepCenterNameHiddenAfterApproachClose()) {
      cancelCenterNameReturn();
      hideNameShadowSpot();
      return;
    }

    showCenterNameAnimated(delay);
  }

  function isElementVisiblyOnScreen(element) {
    if (!element || !element.getBoundingClientRect) return false;

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < (window.innerHeight || 1) &&
      rect.left < (window.innerWidth || 1) &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || 0) > 0.04
    );
  }

  function getMobileClientFullscreenNavTargets() {
    const leftTargets = Array.from(new Set([
      ...Array.from(document.querySelectorAll(".side-nav .nav-text")),
      ...Array.from(document.querySelectorAll(".side-nav a"))
    ])).filter(isElementVisiblyOnScreen);

    const rightTargets = Array.from(new Set(Array.from(document.querySelectorAll(
      ".post-production-projects-panel .nav-text, " +
      ".post-production-projects-panel a, " +
      ".direction-projects-panel .nav-text, " +
      ".direction-projects-panel a, " +
      ".colour-projects-panel .nav-text, " +
      ".colour-projects-panel a, " +
      ".color-projects-panel .nav-text, " +
      ".color-projects-panel a"
    )))).filter(isElementVisiblyOnScreen);

    return [
      ...leftTargets.map((element, index) => ({ element, direction: "left", index })),
      ...rightTargets.map((element, index) => ({ element, direction: "right", index }))
    ];
  }

  function saveMobileClientFullscreenNavStyle(element) {
    return {
      transition: element.style.transition,
      transitionDelay: element.style.transitionDelay,
      opacity: element.style.opacity,
      filter: element.style.filter,
      transform: element.style.transform,
      transformOrigin: element.style.transformOrigin,
      visibility: element.style.visibility,
      pointerEvents: element.style.pointerEvents,
      willChange: element.style.willChange
    };
  }

  function isClientVideoFullscreenGestureViewport() {
    // Swipe-to-clear/fullscreen nav hiding is mobile-only.
    // Desktop should keep the client navigation visible and should not show the hint.
    return isMobileClientVideoViewport();
  }

  function isMobileClientVideoFullscreenEligible() {
    if (!isClientVideoFullscreenGestureViewport()) return false;
    if (isApproachOpen || isContactOpen) return false;
    if (!isClientVideoKey(current)) return false;

    const config = clientVideoSourceConfig[current];
    const video = videos[current];

    return Boolean(
      config &&
      video &&
      config.playbackReady &&
      !config.hasCompleted &&
      !video.ended &&
      !video.paused
    );
  }

  function hideMobileClientNavForFullscreen() {
    if (!isMobileClientVideoFullscreenEligible()) return;
    if (mobileClientFullscreenNavActive) return;

    const targets = getMobileClientFullscreenNavTargets();
    if (!targets.length) return;

    if (mobileClientFullscreenNavCleanupTimeout) {
      clearTimeout(mobileClientFullscreenNavCleanupTimeout);
      mobileClientFullscreenNavCleanupTimeout = null;
    }

    mobileClientFullscreenNavEntries = targets.map((item) => ({
      element: item.element,
      direction: item.direction,
      index: item.index,
      saved: saveMobileClientFullscreenNavStyle(item.element)
    }));

    mobileClientFullscreenNavActive = true;
    document.documentElement.classList.add("dcr-mobile-client-fullscreen-nav-hidden");
    hideClientVideoSwipeHint(true);

    mobileClientFullscreenNavEntries.forEach((entry) => {
      const offset = entry.direction === "left" ? "-34px" : "34px";
      const delay = Math.min(entry.index * 36, 220);

      entry.element.style.transformOrigin = entry.direction === "left" ? "0% 50%" : "100% 50%";
      entry.element.style.transition =
        "opacity 1350ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "filter 1750ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "transform 2050ms cubic-bezier(0.22, 1, 0.36, 1)";
      entry.element.style.transitionDelay = delay + "ms";
      entry.element.style.opacity = "0";
      entry.element.style.filter = "blur(8px)";
      entry.element.style.transform = "translateX(" + offset + ") scale(0.986)";
      entry.element.style.pointerEvents = "none";
      entry.element.style.willChange = "opacity, filter, transform";
    });
  }

  function showMobileClientNavAfterFullscreen() {
    if (!mobileClientFullscreenNavActive && !mobileClientFullscreenNavEntries.length) return;

    if (mobileClientFullscreenNavCleanupTimeout) {
      clearTimeout(mobileClientFullscreenNavCleanupTimeout);
      mobileClientFullscreenNavCleanupTimeout = null;
    }

    const entries = mobileClientFullscreenNavEntries.slice();
    mobileClientFullscreenNavActive = false;
    document.documentElement.classList.remove("dcr-mobile-client-fullscreen-nav-hidden");

    entries.forEach((entry) => {
      if (!entry.element) return;

      const delay = Math.min(entry.index * 46, 280);

      entry.element.style.transition =
        "opacity 1850ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "filter 2400ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "transform 2850ms cubic-bezier(0.13, 1, 0.22, 1)";
      entry.element.style.transitionDelay = delay + "ms";
      entry.element.style.opacity = entry.saved.opacity;
      entry.element.style.filter = entry.saved.filter;
      entry.element.style.transform = entry.saved.transform;
      entry.element.style.transformOrigin = entry.saved.transformOrigin;
      entry.element.style.visibility = entry.saved.visibility;
      entry.element.style.pointerEvents = entry.saved.pointerEvents;
    });

    mobileClientFullscreenNavCleanupTimeout = setTimeout(() => {
      entries.forEach((entry) => {
        if (!entry.element) return;

        Object.keys(entry.saved).forEach((property) => {
          entry.element.style[property] = entry.saved[property];
        });
      });

      mobileClientFullscreenNavEntries = [];
      mobileClientFullscreenNavCleanupTimeout = null;

      if (activeProjectButton) {
        returnToActiveProjectFocus();
      } else if (activeSection) {
        restoreActiveSectionRestingState();
      }
    }, 3200);
  }

  function handleClientFullscreenSwipeGesture(startX, startY, endX, endY, duration) {
    const dx = endX - startX;
    const dy = endY - startY;
    const absoluteX = Math.abs(dx);
    const absoluteY = Math.abs(dy);
    const width = window.innerWidth || 1;

    if (duration > 1400) return;
    if (absoluteX < 72) return;
    if (absoluteX < absoluteY * 1.55) return;

    if (mobileClientFullscreenNavActive) {
      const startsAtLeftEdge = startX < width * 0.26 && dx > 0;
      const startsAtRightEdge = startX > width * 0.74 && dx < 0;

      if (startsAtLeftEdge || startsAtRightEdge || absoluteX > 115) {
        showMobileClientNavAfterFullscreen();
      }

      return;
    }

    if (!isMobileClientVideoFullscreenEligible()) return;

    const startsNearCentre = startX > width * 0.22 && startX < width * 0.78;
    const movesLeftFromCentre = dx < 0 && endX < startX;
    const movesRightFromCentre = dx > 0 && endX > startX;

    if (startsNearCentre && (movesLeftFromCentre || movesRightFromCentre)) {
      hideMobileClientNavForFullscreen();
    }
  }

  function installMobileClientVideoFullscreenGesture() {
    if (document.documentElement.dataset.dcrMobileClientFullscreenGestureReady) return;

    document.documentElement.dataset.dcrMobileClientFullscreenGestureReady = "true";

    document.addEventListener("touchstart", (event) => {
      if (!isMobileClientVideoViewport()) return;
      if (!isClientVideoKey(current)) return;
      if (!event.touches || event.touches.length !== 1) return;

      const touch = event.touches[0];

      mobileClientFullscreenTouchStart = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    }, { passive: true });

    document.addEventListener("touchend", (event) => {
      if (!mobileClientFullscreenTouchStart) return;
      if (!isMobileClientVideoViewport()) {
        mobileClientFullscreenTouchStart = null;
        return;
      }

      const changedTouch = event.changedTouches && event.changedTouches.length
        ? event.changedTouches[0]
        : null;

      if (!changedTouch) {
        mobileClientFullscreenTouchStart = null;
        return;
      }

      const start = mobileClientFullscreenTouchStart;
      mobileClientFullscreenTouchStart = null;

      handleClientFullscreenSwipeGesture(
        start.x,
        start.y,
        changedTouch.clientX,
        changedTouch.clientY,
        Date.now() - start.time
      );
    }, { passive: true });

    document.addEventListener("pointerdown", (event) => {
      if (!isDesktopLikePointer()) return;
      if (!isClientVideoKey(current)) return;
      if (event.button !== 0) return;

      desktopClientFullscreenPointerStart = {
        x: event.clientX,
        y: event.clientY,
        time: Date.now()
      };
    }, { passive: true });

    document.addEventListener("pointerup", (event) => {
      if (!desktopClientFullscreenPointerStart) return;

      const start = desktopClientFullscreenPointerStart;
      desktopClientFullscreenPointerStart = null;

      if (!isDesktopLikePointer()) return;
      if (!isClientVideoKey(current) && !mobileClientFullscreenNavActive) return;

      handleClientFullscreenSwipeGesture(
        start.x,
        start.y,
        event.clientX,
        event.clientY,
        Date.now() - start.time
      );
    }, { passive: true });

    document.addEventListener("wheel", (event) => {
      if (!isDesktopLikePointer()) return;
      if (desktopClientFullscreenWheelLock) return;
      if (!isClientVideoKey(current) && !mobileClientFullscreenNavActive) return;

      const dx = event.deltaX || 0;
      const dy = event.deltaY || 0;
      const absoluteX = Math.abs(dx);
      const absoluteY = Math.abs(dy);

      if (absoluteX < 42) return;
      if (absoluteX < absoluteY * 1.35) return;

      desktopClientFullscreenWheelLock = true;

      setTimeout(() => {
        desktopClientFullscreenWheelLock = false;
      }, 900);

      const startX = event.clientX || (window.innerWidth || 1) / 2;
      const startY = event.clientY || (window.innerHeight || 1) / 2;
      const endX = startX + (dx < 0 ? -130 : 130);

      handleClientFullscreenSwipeGesture(startX, startY, endX, startY, 220);
    }, { passive: true });
  }

  function hasClientVideoSwipeHintBeenShown() {
    if (clientVideoSwipeHintShownThisSession) return true;

    try {
      return window.sessionStorage &&
        window.sessionStorage.getItem("dcrClientSwipeHintShownV4") === "true";
    } catch (error) {
      return false;
    }
  }

  function markClientVideoSwipeHintShown() {
    clientVideoSwipeHintShownThisSession = true;

    try {
      if (window.sessionStorage) {
        window.sessionStorage.setItem("dcrClientSwipeHintShownV4", "true");
      }
    } catch (error) {}
  }

  function clearClientVideoSwipeHintTimers() {
    if (clientVideoSwipeHintShowTimeout) {
      clearTimeout(clientVideoSwipeHintShowTimeout);
      clientVideoSwipeHintShowTimeout = null;
    }

    if (clientVideoSwipeHintHideTimeout) {
      clearTimeout(clientVideoSwipeHintHideTimeout);
      clientVideoSwipeHintHideTimeout = null;
    }
  }

  function hideClientVideoSwipeHint(markAsSeen) {
    clearClientVideoSwipeHintTimers();
    document.documentElement.classList.remove("dcr-client-video-swipe-hint-on");

    if (markAsSeen) {
      markClientVideoSwipeHintShown();
    }
  }

  function scheduleClientVideoSwipeHint(key) {
    if (hasClientVideoSwipeHintBeenShown()) return;
    if (!isClientVideoFullscreenGestureViewport()) return;
    if (!isClientVideoKey(key)) return;

    clearClientVideoSwipeHintTimers();

    clientVideoSwipeHintShowTimeout = setTimeout(() => {
      clientVideoSwipeHintShowTimeout = null;

      const config = clientVideoSourceConfig[key];
      const video = videos[key];

      if (hasClientVideoSwipeHintBeenShown()) return;
      if (current !== key) return;
      if (!isClientVideoFullscreenGestureViewport()) return;
      if (!config || !config.playbackReady || config.hasCompleted) return;
      if (!video || video.ended || video.paused) return;
      if (mobileClientFullscreenNavActive) return;
      if (isApproachOpen || isContactOpen) return;

      ensureClientVideoLoadingLayer();
      markClientVideoSwipeHintShown();
      document.documentElement.classList.add("dcr-client-video-swipe-hint-on");

      clientVideoSwipeHintHideTimeout = setTimeout(() => {
        clientVideoSwipeHintHideTimeout = null;
        document.documentElement.classList.remove("dcr-client-video-swipe-hint-on");
      }, 3600);
    }, 8500);
  }

  function clearClientVideoCreditTimers() {
    if (clientVideoCreditShowTimeout) {
      clearTimeout(clientVideoCreditShowTimeout);
      clientVideoCreditShowTimeout = null;
    }

    if (clientVideoCreditHideTimeout) {
      clearTimeout(clientVideoCreditHideTimeout);
      clientVideoCreditHideTimeout = null;
    }
  }

  function hideClientVideoCredit() {
    clearClientVideoCreditTimers();
    hideClientVideoSwipeHint(false);
    document.documentElement.classList.remove("dcr-client-video-credit-on");
  }

  function hideClientVideoCreditForOverlay() {
    const root = document.documentElement;
    const credit = document.querySelector(".dcr-client-video-credit-text");

    clearClientVideoCreditTimers();
    hideClientVideoSwipeHint(false);

    if (credit) {
      credit.style.transition =
        "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "filter 1150ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "transform 1350ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "visibility 0s linear 1150ms";
    }

    root.classList.remove("dcr-client-video-credit-on");

    if (credit) {
      setTimeout(() => {
        if (!root.classList.contains("dcr-client-video-credit-on")) {
          credit.style.transition = "";
        }
      }, 1300);
    }
  }

  function clearClientVideoEndReturnTimer() {
    if (clientVideoEndReturnTimeout) {
      clearTimeout(clientVideoEndReturnTimeout);
      clientVideoEndReturnTimeout = null;
    }
  }

  function scheduleClientVideoEndReturn(key) {
    clearClientVideoEndReturnTimer();

    clientVideoEndReturnTimeout = setTimeout(() => {
      clientVideoEndReturnTimeout = null;

      if (current === key && !isApproachOpen && !isContactOpen) {
        returnToMainWebsiteVideo();
      }
    }, 10000);
  }

  function scheduleClientVideoCredit(key) {
    const config = clientVideoSourceConfig[key];

    hideClientVideoCredit();

    if (!config || !config.creditTitle) return;

    clientVideoCreditShowTimeout = setTimeout(() => {
      clientVideoCreditShowTimeout = null;

      if (current !== key || !config.playbackReady) return;

      const layer = ensureClientVideoLoadingLayer();

      if (config.creditHtml) {
        layer.credit.innerHTML = String(config.creditHtml || "");
      } else {
        layer.credit.textContent = String(config.creditTitle || "").toUpperCase();
      }

      document.documentElement.classList.add("dcr-client-video-credit-on");

      clientVideoCreditHideTimeout = setTimeout(() => {
        clientVideoCreditHideTimeout = null;
        document.documentElement.classList.remove("dcr-client-video-credit-on");
      }, 4000);
    }, typeof config.creditDelayMs === "number" ? config.creditDelayMs : 1000);

    scheduleClientVideoSwipeHint(key);
  }

  function markClientVideoPlaybackReady(key) {
    const config = clientVideoSourceConfig[key];

    if (!config || current !== key) return;

    const wasReady = Boolean(config.playbackReady);

    clearClientDesktopHlsFallbackTimer(key);
    config.playbackReady = true;
    hideClientVideoLoadingState();

    if (!wasReady) {
      scheduleClientVideoCredit(key);
    }
  }

  function watchClientVideoMotion(key, startTime) {
    const video = videos[key];
    const config = clientVideoSourceConfig[key];

    if (!video || !config) return;

    const initialTime = typeof startTime === "number" ? startTime : video.currentTime || 0;
    let checks = 0;

    if (clientVideoLoadingWatchTimer) {
      clearTimeout(clientVideoLoadingWatchTimer);
      clientVideoLoadingWatchTimer = null;
    }

    function check() {
      if (current !== key || !videos[key]) return;
      if (shouldSuppressClientVideoLoading(key)) {
        hideClientVideoLoadingState();
        return;
      }

      checks += 1;

      const activeVideo = videos[key];
      const hasAdvanced = (activeVideo.currentTime || 0) > initialTime + 0.08;
      const isActuallyPlaying =
        !activeVideo.paused &&
        !activeVideo.ended &&
        activeVideo.readyState >= 2;

      if (hasAdvanced || (isActuallyPlaying && checks >= 3)) {
        markClientVideoPlaybackReady(key);
        return;
      }

      if (checks < 18) {
        clientVideoLoadingWatchTimer = setTimeout(check, 180);
      } else {
        showClientVideoLoadingState(key, true);
      }
    }

    clientVideoLoadingWatchTimer = setTimeout(check, 180);
  }

  function handleClientVideoWaiting(key) {
    const config = clientVideoSourceConfig[key];
    const video = videos[key];

    if (!config || !video || current !== key) return;

    if (shouldSuppressClientVideoLoading(key)) {
      hideClientVideoLoadingState();
      return;
    }

    // Only use the loading treatment before the client video has actually begun.
    // Once playback has started, browser buffering/stall events should not bring
    // the loading text back over the film.
    if (config.playbackReady || (video.currentTime || 0) > 0.08) {
      return;
    }

    showClientVideoLoadingState(key, true);
  }

  function setClientVideoFullBrightness(video) {
    if (!video) return;

    video.style.transition =
      "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
      "filter 900ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1.4s ease";

    video.style.filter = "blur(0) brightness(1)";
    video.style.transform = "scale(1)";
  }

  function settleClientVideoStill(video) {
    if (!video) return;

    video.style.transition =
      "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
      "filter 6500ms cubic-bezier(0.16, 1, 0.3, 1), " +
      "transform 6500ms cubic-bezier(0.16, 1, 0.3, 1)";

    video.style.filter = "blur(0) brightness(0.74)";
    video.style.transform = "scale(1)";
  }

  function prepareClientOneShotVideo(video, key) {
    if (!video) return;

    video.loop = false;
    video.removeAttribute("loop");

    video.addEventListener("loadedmetadata", () => {
      video.loop = false;
      video.removeAttribute("loop");
    });

    ["loadstart", "waiting", "stalled", "seeking"].forEach((eventName) => {
      video.addEventListener(eventName, () => {
        handleClientVideoWaiting(key);
      });
    });

    video.addEventListener("error", () => {
      const config = clientVideoSourceConfig[key];

      if (
        current === key &&
        config &&
        !config.playbackReady &&
        !isMobileClientVideoViewport() &&
        !isHlsSourceUrl(config.activeSourceUrl)
      ) {
        switchDesktopClientVideoToHlsFallback(key);
      }
    });

    ["playing", "canplay", "canplaythrough"].forEach((eventName) => {
      video.addEventListener(eventName, () => {
        watchClientVideoMotion(key, video.currentTime || 0);
      });
    });

    video.addEventListener("timeupdate", () => {
      if (current === key && !clientVideoSourceConfig[key].playbackReady && video.currentTime > 0.08) {
        markClientVideoPlaybackReady(key);
      }
    });

    video.addEventListener("ended", () => {
      clearClientDesktopHlsFallbackTimer(key);
      showMobileClientNavAfterFullscreen();

      if (clientVideoSourceConfig[key]) {
        clientVideoSourceConfig[key].hasCompleted = true;
        clientVideoSourceConfig[key].suppressLoading = true;
        clientVideoSourceConfig[key].playbackReady = true;
        clientVideoSourceConfig[key].autoplayAfterSourceReady = false;
      }

      hideClientVideoLoadingState();
      hideClientVideoCredit();

      video.loop = false;
      video.removeAttribute("loop");

      video.pause();
      safelySetPlaybackRate(video, 1);

      setTimeout(() => {
        if (current === key && !isApproachOpen && !isContactOpen) {
          showClientVideoEndCardState(key);
          settleClientVideoStill(video);
          showCenterNameAnimated(250);
          scheduleClientVideoEndReturn(key);
        }
      }, 350);
    });
  }

  function isMobileClientVideoViewport() {
    return Boolean(
      window.matchMedia &&
        window.matchMedia("(max-width: 1024px)").matches
    );
  }

  function shouldPreserveMobileClientVideoDuringProjectNav(sectionName) {
    if (!isMobileClientVideoViewport()) return false;
    if (isApproachOpen || isContactOpen) return false;
    if (sectionName !== "colour" && sectionName !== "direction") return false;
    if (!isClientVideoKey(current)) return false;

    const video = videos[current];
    const config = clientVideoSourceConfig[current];

    const hasStartedPlayback = Boolean(
      config.playbackReady ||
      (video.currentTime || 0) > 0.08 ||
      (!video.paused && video.readyState >= 2)
    );

    return Boolean(
      video &&
      config &&
      hasStartedPlayback &&
      !config.hasCompleted &&
      !video.ended
    );
  }

  function preserveMobileClientVideoPlaybackDuringProjectNav(sectionName) {
    if (!shouldPreserveMobileClientVideoDuringProjectNav(sectionName)) return;

    const video = videos[current];
    const config = clientVideoSourceConfig[current];

    if (!video || !config) return;

    clearClientDesktopHlsFallbackTimer(current);
    clearClientVideoEndReturnTimer();
    clearClientVideoLoadingTextDelay();

    config.autoplayAfterSourceReady = true;
    config.suppressLoading = true;
    config.playbackReady = true;

    document.documentElement.classList.remove("dcr-client-video-loading-active");
    document.documentElement.classList.remove("dcr-client-video-loading-still-on");
    document.documentElement.classList.remove("dcr-client-video-end-card-on");
    document.documentElement.classList.remove("dcr-client-video-still-dimmed");

    video.style.opacity = "1";
    video.style.filter = "blur(0) brightness(1)";
    video.style.transform = "scale(1)";
    safelySetPlaybackRate(video, 1);
    safelySetMuted(video, false);
    safelySetVolume(video, CLIENT_VIDEO_PLAYBACK_VOLUME);

    if (video.paused && !video.ended) {
      playVideoWithResumeRetries(video);
    }
  }

  function getVideoSourceUrl(video) {
    if (!video) return "";

    const source = video.querySelector("source");

    return (source && source.getAttribute("src")) || video.getAttribute("src") || "";
  }

  function setDirectVideoSourceUrl(video, sourceUrl) {
    if (!video || !sourceUrl) return;

    const currentSource = getVideoSourceUrl(video);

    if (currentSource === sourceUrl) return;

    try {
      video.pause();
    } catch (error) {}

    const source = video.querySelector("source");

    if (source) {
      source.setAttribute("src", sourceUrl);
      video.removeAttribute("src");
    } else {
      video.setAttribute("src", sourceUrl);
    }

    try {
      video.load();
    } catch (error) {}
  }

  function fallbackClientVideoToMp4(key) {
    const video = videos[key];
    const config = clientVideoSourceConfig[key];
    const fallbackUrl = getClientFallbackSourceUrlForViewport(key);

    if (!video || !config || !fallbackUrl) return;

    clearClientDesktopHlsFallbackTimer(key);
    destroyClientHlsInstance(key);
    config.activeSourceUrl = fallbackUrl;
    setDirectVideoSourceUrl(video, fallbackUrl);

    if (current === key && config.autoplayAfterSourceReady) {
      playVideo(video);
    }
  }

  function setClientHlsVideoSource(key, sourceUrl) {
    const video = videos[key];
    const config = clientVideoSourceConfig[key];

    if (!video || !config || !sourceUrl) return;

    if (config.activeSourceUrl === sourceUrl && clientVideoHlsInstances[key]) return;

    destroyClientHlsInstance(key);
    config.activeSourceUrl = sourceUrl;

    const source = video.querySelector("source");

    if (source) {
      source.removeAttribute("src");
    }

    video.removeAttribute("src");

    if (supportsNativeHls(video)) {
      setDirectVideoSourceUrl(video, sourceUrl);

      if (current === key && config.autoplayAfterSourceReady) {
        playVideo(video);
      }

      return;
    }

    loadHlsJsLibrary()
      .then((Hls) => {
        if (!Hls || typeof Hls.isSupported !== "function" || !Hls.isSupported()) {
          fallbackClientVideoToMp4(key);
          return;
        }

        if (config.activeSourceUrl !== sourceUrl) return;

        const hls = new Hls({
          enableWorker: true,
          capLevelToPlayerSize: true,
          maxBufferLength: 18,
          maxMaxBufferLength: 36
        });

        clientVideoHlsInstances[key] = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (current === key && config.autoplayAfterSourceReady) {
            playVideo(video);
          }
        });

        hls.on(Hls.Events.ERROR, (eventName, data) => {
          if (!data || !data.fatal) return;

          fallbackClientVideoToMp4(key);
        });

        hls.attachMedia(video);
        hls.loadSource(sourceUrl);
      })
      .catch(() => {
        fallbackClientVideoToMp4(key);
      });
  }

  function setVideoSourceUrl(video, sourceUrl, key) {
    if (!video || !sourceUrl) return;

    const clientKey = key || getClientVideoKeyByVideo(video);

    if (clientKey && isHlsSourceUrl(sourceUrl)) {
      setClientHlsVideoSource(clientKey, sourceUrl);
      return;
    }

    if (clientKey) {
      destroyClientHlsInstance(clientKey);

      const config = clientVideoSourceConfig[clientKey];

      if (config) {
        config.activeSourceUrl = sourceUrl;
      }
    }

    setDirectVideoSourceUrl(video, sourceUrl);
  }

  function prepareClientSourceForViewport(key) {
    const video = videos[key];
    const config = clientVideoSourceConfig[key];

    if (!video || !config) return;

    if (!config.desktopUrl) {
      config.desktopUrl = getVideoSourceUrl(video);
    }

    const sourceMode = isMobileClientVideoViewport() ? "mobile" : "desktop";
    const nextSource = getClientSourceUrlForViewport(key);
    const sourceSignature = sourceMode + "|" + nextSource;

    if (!nextSource || config.activeSourceMode === sourceSignature) return;

    config.activeSourceMode = sourceSignature;
    config.playbackReady = false;

    try {
      video.preload = "auto";
      video.setAttribute("preload", "auto");
    } catch (error) {}

    setVideoSourceUrl(video, nextSource, key);

    if (!isHlsSourceUrl(nextSource)) {
      scheduleDesktopClientVideoHlsFallback(key);
    } else {
      clearClientDesktopHlsFallbackTimer(key);
    }
  }

  function prepareAllClientSourcesForViewport() {
    // Keep hidden client videos unloaded. They should only request video data
    // after the user clicks a specific client item.
    unloadInactiveClientVideoSources();
  }

  function resetClientVideoToStartFrame(video) {
    if (!video) return;

    const clientKey = Object.keys(clientVideoSourceConfig).find((key) => videos[key] === video);

    if (clientKey) {
      clearClientDesktopHlsFallbackTimer(clientKey);
      clientVideoSourceConfig[clientKey].suppressLoading = true;
      clientVideoSourceConfig[clientKey].playbackReady = false;
    }

    video.loop = false;
    video.removeAttribute("loop");

    try {
      video.pause();
    } catch (error) {}

    try {
      if (video.readyState >= 1) {
        video.currentTime = 0;
      } else {
        video.addEventListener("loadedmetadata", () => {
          try {
            video.currentTime = 0;
          } catch (error) {}
        }, { once: true });
      }
    } catch (error) {}

    if (clientKey) {
      unloadClientVideoSource(clientKey);
    }
  }

  function playClientVideoFromStart(video) {
    if (!video) return;

    showMobileClientNavAfterFullscreen();

    const clientKey = getClientVideoKeyByVideo(video);

    if (clientKey) {
      const config = clientVideoSourceConfig[clientKey];

      clearClientVideoEndReturnTimer();
      hideClientVideoCredit();

      config.playbackReady = false;
      config.hasCompleted = false;
      config.suppressLoading = false;
      config.autoplayAfterSourceReady = true;

      prepareClientSourceForViewport(clientKey);

      document.documentElement.classList.remove("dcr-client-video-end-card-on");
      document.documentElement.classList.remove("dcr-client-video-still-dimmed");
      showClientVideoLoadingState(clientKey, true);
    }

    hideCenterNameAnimated();

    video.loop = false;
    video.removeAttribute("loop");

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    setClientVideoFullBrightness(video);

    safelySetPlaybackRate(video, 1);
    safelySetMuted(video, false);
    safelySetVolume(video, CLIENT_VIDEO_PLAYBACK_VOLUME);

    let startTime = 0;

    try {
      video.pause();
      video.currentTime = 0;
      startTime = video.currentTime || 0;
    } catch (error) {}

    playVideo(video);

    if (clientKey) {
      watchClientVideoMotion(clientKey, startTime);
    }
  }

  function dimElement(element) {
    if (isNavAnimationItem(element)) {
      setNavItemDimmed(element);
      return;
    }

    element.style.transition =
      "opacity 1.35s cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1.55s cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1.55s cubic-bezier(0.22, 1, 0.36, 1)";

    element.style.opacity = "0.5";
    element.style.filter = "blur(1.4px)";
    element.style.transform = "scale(0.994)";
  }

  function softenElementWithoutBlur(element) {
    element.style.transition =
      "opacity 1.35s cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1.35s cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1.35s cubic-bezier(0.22, 1, 0.36, 1)";

    element.style.opacity = "0.5";
    element.style.filter = "blur(0)";
    element.style.transform = "scale(1)";
  }

  function focusElement(element) {
    if (isNavAnimationItem(element)) {
      setNavItemFocused(element);
      return;
    }

    element.style.transition =
      "opacity 0.95s cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1.15s cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1.15s cubic-bezier(0.22, 1, 0.36, 1)";

    element.style.opacity = "1";
    element.style.filter = "blur(0)";
    element.style.transform = "scale(1)";
  }

  function resetElement(element) {
    if (isNavAnimationItem(element)) {
      setNavItemResting(element);
      element.style.visibility = "";
      element.style.pointerEvents = "";
      return;
    }

    element.style.transition =
      "opacity 1.35s cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1.55s cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1.55s cubic-bezier(0.22, 1, 0.36, 1)";

    element.style.opacity = "";
    element.style.filter = "";
    element.style.transform = "";
    element.style.visibility = "";
    element.style.pointerEvents = "";
  }

  function getProjectButtons() {
    return document.querySelectorAll(
      ".post-production-projects-panel .nav-text, " +
      ".post-production-projects-panel a, " +
      ".direction-projects-panel .nav-text, " +
      ".direction-projects-panel a, " +
      ".colour-projects-panel .nav-text, " +
      ".colour-projects-panel a, " +
      ".color-projects-panel .nav-text, " +
      ".color-projects-panel a"
    );
  }

  function normalizeMainNavLabel(text) {
    return (text || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function mainNavTextMatchesSection(text, sectionName) {
    const normalizedText = normalizeMainNavLabel(text);

    if (sectionName === "colour") {
      return (
        normalizedText === "colour" ||
        normalizedText === "color" ||
        normalizedText === "post production"
      );
    }

    if (sectionName === "direction") {
      return normalizedText === "direction";
    }

    if (sectionName === "approach") {
      return (
        normalizedText === "my approach" ||
        normalizedText === "approach" ||
        normalizedText === "my philosophy"
      );
    }

    if (sectionName === "contact") {
      return normalizedText === "contact";
    }

    return false;
  }

  function elementContainsMultipleMainNavLabels(element) {
    if (!element) return false;

    const text = normalizeMainNavLabel(element.textContent);
    let matches = 0;

    if (text.includes("colour") || text.includes("color") || text.includes("post production")) matches += 1;
    if (text.includes("direction")) matches += 1;
    if (text.includes("approach")) matches += 1;
    if (text.includes("contact")) matches += 1;

    return matches > 1;
  }

  function elementMatchesMainNavSection(element, sectionName) {
    if (!element) return false;

    const attributeValue =
      element.getAttribute && element.getAttribute("data-main-nav")
        ? element.getAttribute("data-main-nav")
        : "";

    return (
      mainNavTextMatchesSection(attributeValue, sectionName) ||
      mainNavTextMatchesSection(element.textContent, sectionName)
    );
  }

  function smallestExactMainNavElement(elements, sectionName) {
    const candidates = elements
      .filter(Boolean)
      .filter((element) => {
        if (elementContainsMultipleMainNavLabels(element)) return false;
        return elementMatchesMainNavSection(element, sectionName);
      });

    if (!candidates.length) return null;

    candidates.sort((a, b) => {
      const aChildren = a.querySelectorAll ? a.querySelectorAll("*").length : 0;
      const bChildren = b.querySelectorAll ? b.querySelectorAll("*").length : 0;

      if (aChildren !== bChildren) return aChildren - bChildren;

      return normalizeMainNavLabel(a.textContent).length -
        normalizeMainNavLabel(b.textContent).length;
    });

    return candidates[0];
  }

  function getMobileMainNavButton(sectionName) {
    const sideNav = document.querySelector(".side-nav") || document;
    const attributeElement = document.querySelector("[data-main-nav='" + sectionName + "']");

    if (attributeElement) {
      const exactChild = smallestExactMainNavElement(
        Array.from(attributeElement.querySelectorAll(".nav-text, a, span, div")),
        sectionName
      );

      if (exactChild) return exactChild;

      if (
        !elementContainsMultipleMainNavLabels(attributeElement) &&
        elementMatchesMainNavSection(attributeElement, sectionName)
      ) {
        return attributeElement;
      }
    }

    const exactSideNavText = smallestExactMainNavElement(
      Array.from(sideNav.querySelectorAll(".nav-text")),
      sectionName
    );

    if (exactSideNavText) return exactSideNavText;

    const exactSideNavLink = smallestExactMainNavElement(
      Array.from(sideNav.querySelectorAll("a, [data-main-nav]")),
      sectionName
    );

    if (exactSideNavLink) return exactSideNavLink;

    return null;
  }

  function getMobileMainNavButtons() {
    const orderedButtons = ["colour", "direction", "approach", "contact"]
      .map((sectionName) => getMobileMainNavButton(sectionName))
      .filter(Boolean);

    return Array.from(new Set(orderedButtons));
  }

  function isMobileMainNavButton(element) {
    if (!element) return false;

    return getMobileMainNavButtons().some((button) => button === element);
  }

  function getMainNavRelatedElements() {
    return Array.from(new Set([
      ...Array.from(document.querySelectorAll(".side-nav .nav-text")),
      ...Array.from(document.querySelectorAll(".side-nav a")),
      ...Array.from(document.querySelectorAll("[data-main-nav]"))
    ])).filter(Boolean);
  }

  function prepareMobileMainNavIntroTargets() {
    if (!isMobileLayoutViewport()) return;

    const mobileButtons = getMobileMainNavButtons();
    const mobileButtonSet = new Set(mobileButtons);

    getMainNavRelatedElements().forEach((element) => {
      const isChosenButton = mobileButtonSet.has(element);
      const isAncestorOfChosenButton = mobileButtons.some((button) => {
        return element !== button && element.contains && element.contains(button);
      });
      const isDescendantOfChosenButton = mobileButtons.some((button) => {
        return element !== button && button.contains && button.contains(element);
      });

      element.style.transition = "none";
      element.style.transitionDelay = "0ms";

      if (isChosenButton) {
        element.style.transformOrigin = "0% 50%";
        element.style.visibility = "visible";
        element.style.opacity = "0";
        element.style.filter = "blur(8px)";
        element.style.transform = "translateX(-18px) scale(0.988)";
        element.style.pointerEvents = "none";
        element.style.willChange = "opacity, filter, transform";
        return;
      }

      if (isAncestorOfChosenButton || isDescendantOfChosenButton) {
        element.style.opacity = "";
        element.style.filter = "";
        element.style.transform = "";
        element.style.visibility = "visible";
        element.style.pointerEvents = "none";
        return;
      }

      element.style.opacity = "0";
      element.style.filter = "blur(8px)";
      element.style.transform = "translateX(-18px) scale(0.988)";
      element.style.visibility = "hidden";
      element.style.pointerEvents = "none";
    });
  }

  function applyMobileMainNavStaticState(activeSectionName) {
    if (!isMobileLayoutViewport()) return;
    if (isApproachOpen) return;
    if (document.documentElement.classList.contains("dcr-mobile-approach-focus-active")) return;

    getMobileMainNavButtons().forEach((button) => {
      button.style.transition = "none";
      button.style.transitionDelay = "0ms";
      button.style.visibility = "visible";
      button.style.pointerEvents = "auto";
      button.style.filter = "blur(0)";
      button.style.transform = "scale(1)";

      if (activeSectionName && elementMatchesMainNavSection(button, activeSectionName)) {
        button.style.opacity = "1";
      } else {
        button.style.opacity = "0.5";
      }
    });
  }

  function getLeftNavButtons() {
    return document.querySelectorAll(
      ".side-nav .nav-text, .side-nav a"
    );
  }

  function getInstagramNavItems() {
    return document.querySelectorAll(
      ".approach-ig-link, " +
      "[data-approach-ig], " +
      "[data-instagram-link]"
    );
  }

  function isNavAnimationItem(element) {
    if (!element || !element.closest) return false;

    return (
      element.closest(".side-nav") ||
      element.matches(".dcr-mobile-approach-back, .approach-ig-link, [data-approach-ig], [data-instagram-link]") ||
      element.closest(".dcr-mobile-approach-back, .approach-ig-link, [data-approach-ig], [data-instagram-link]")
    );
  }

  function elementIsHovered(element) {
    try {
      return element.matches(":hover");
    } catch (error) {
      return false;
    }
  }

  function setNavItemFocused(element) {
    if (!element) return;

    element.style.transition =
      "opacity 950ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1150ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1150ms cubic-bezier(0.22, 1, 0.36, 1)";

    element.style.transitionDelay = "";
    element.style.opacity = "1";
    element.style.filter = "blur(0)";
    element.style.transform = "scale(1)";
  }

  function setNavItemResting(element) {
    if (!element) return;

    element.style.transition =
      "opacity 1850ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1850ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1850ms cubic-bezier(0.22, 1, 0.36, 1)";

    element.style.transitionDelay = "";
    element.style.opacity = "0.5";
    element.style.filter = "blur(0)";
    element.style.transform = "scale(1)";
  }

  function setNavItemDimmed(element) {
    if (!element) return;

    element.style.transition =
      "opacity 1350ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1550ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1550ms cubic-bezier(0.22, 1, 0.36, 1)";

    element.style.transitionDelay = "";
    element.style.opacity = "0.42";
    element.style.filter = "blur(1.4px)";
    element.style.transform = "scale(0.994)";
  }

  function settleNavItemAfterArrival(element) {
    if (!element) return;
    if (element === activeMainNavButton) return;
    if (elementIsHovered(element)) return;

    setNavItemResting(element);
  }

  function ensureNameShadowSpot() {
    let spot = document.querySelector(".dcr-name-shadow-spot");

    if (!spot) {
      spot = document.createElement("div");
      spot.className = "dcr-name-shadow-spot";
      document.body.appendChild(spot);
    }

    return spot;
  }

  function updateNameShadowSpotPosition() {
    const spot = ensureNameShadowSpot();

    const candidates = Array.from(getCenterNameElements()).filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 0) > 0.05
      );
    });

    const centerName =
      candidates.find((element) => !element.classList.contains("center-name-wrapper-opening")) ||
      candidates[0];

    if (!centerName) return;

    const nameStack =
      centerName.querySelector(".name-stack") ||
      centerName.querySelector("[class*='name-stack']") ||
      centerName.querySelector("h1") ||
      centerName;

    const rect = nameStack.getBoundingClientRect();
    const mobileSpot = isMobileLayoutViewport();

    const spotWidth = window.innerWidth * (mobileSpot ? 0.92 : 0.68);
    const spotHeight = window.innerHeight * (mobileSpot ? 0.34 : 0.30);

    const spotX = rect.left + rect.width / 2;
    const spotY = rect.top + rect.height * (mobileSpot ? 0.54 : 0.56);

    spot.style.left = spotX + "px";
    spot.style.top = spotY + "px";
    spot.style.width = spotWidth + "px";
    spot.style.height = spotHeight + "px";
  }

  function showNameShadowSpot(delay) {
    const spot = ensureNameShadowSpot();
    const revealDelay = typeof delay === "number" ? delay : 0;

    const revealSpot = () => {
      updateNameShadowSpotPosition();
      document.documentElement.classList.add("dcr-name-shadow-spot-on");
      spot.style.visibility = "visible";

      requestAnimationFrame(updateNameShadowSpotPosition);
      setTimeout(updateNameShadowSpotPosition, 650);
      setTimeout(updateNameShadowSpotPosition, 1800);
    };

    if (revealDelay > 0) {
      const timeoutId = setTimeout(revealSpot, revealDelay);
      revealTimeouts.push(timeoutId);
    } else {
      revealSpot();
    }
  }

  function hideNameShadowSpot() {
    ensureNameShadowSpot();
    document.documentElement.classList.remove("dcr-name-shadow-spot-on");
  }

  function installReactiveCornerVignettes() {
    if (document.querySelector(".dcr-corner-vignette-tl")) return;

    const topLeft = document.createElement("div");
    const bottomRight = document.createElement("div");

    topLeft.className = "dcr-corner-vignette dcr-corner-vignette-tl";
    bottomRight.className = "dcr-corner-vignette dcr-corner-vignette-br";

    document.body.appendChild(topLeft);
    document.body.appendChild(bottomRight);

    const supportsFinePointer =
      window.matchMedia && window.matchMedia("(pointer: fine)").matches;

    let frameId = null;
    let lastEvent = null;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function updateVignettes() {
      frameId = null;

      if (!lastEvent) return;

      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const x = lastEvent.clientX;
      const y = lastEvent.clientY;
      const radius = Math.min(width, height) * 0.48;

      const topLeftDistance = Math.sqrt((x * x) + (y * y));
      const bottomRightDistance = Math.sqrt(
        ((width - x) * (width - x)) + ((height - y) * (height - y))
      );

      const topLeftStrength = Math.pow(
        clamp(1 - (topLeftDistance / radius), 0, 1),
        1.35
      );

      const bottomRightStrength = Math.pow(
        clamp(1 - (bottomRightDistance / radius), 0, 1),
        1.35
      );

      topLeft.style.opacity = (topLeftStrength * 0.72).toFixed(3);
      bottomRight.style.opacity = (bottomRightStrength * 0.98).toFixed(3);
    }

    if (supportsFinePointer) {
      document.addEventListener("mousemove", (event) => {
        lastEvent = event;

        if (!frameId) {
          frameId = requestAnimationFrame(updateVignettes);
        }
      });

      document.addEventListener("mouseleave", () => {
        lastEvent = null;
        topLeft.style.opacity = "0";
        bottomRight.style.opacity = "0";
      });
    }

    function holdTouchVignette(event) {
      const touch = event.touches && event.touches.length ? event.touches[0] : event;
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      if (touch.clientX > width * 0.55 && touch.clientY > height * 0.55) {
        bottomRight.style.opacity = "0.92";

        clearTimeout(bottomRight._dcrTouchFadeTimeout);
        bottomRight._dcrTouchFadeTimeout = setTimeout(() => {
          bottomRight.style.opacity = "0";
        }, 1800);
      }
    }

    ["touchstart", "touchmove", "pointerdown", "click"].forEach((eventName) => {
      document.addEventListener(eventName, holdTouchVignette, { passive: true });
    });

    window.addEventListener("resize", updateNameShadowSpotPosition);
    window.addEventListener("orientationchange", () => {
      setTimeout(updateNameShadowSpotPosition, 300);
    });
  }

  let mobileApproachNavTimeouts = [];
  let mobileApproachFocusIsExiting = false;
  let mobileApproachNavForcedItems = [];

  function isMobileLayoutViewport() {
    return false;
  }

  function isPhase2AMobileViewport() {
    return window.matchMedia("(max-width: 1024px)").matches;
  }

  function clearMobileApproachNavTimeouts() {
    mobileApproachNavTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    mobileApproachNavTimeouts = [];
  }

  function getMobileApproachBackButton() {
    return document.querySelector(".dcr-mobile-approach-back");
  }

  function prepareMobileApproachBackButton(button) {
    if (!button) return;

    button.style.transition = "none";
    button.style.visibility = "hidden";
    button.style.opacity = "0";
    button.style.filter = "blur(6px)";
    button.style.transform = "translateX(-14px) scale(0.988)";
    button.style.pointerEvents = "none";
  }

  function revealMobileApproachBackButton(delay) {
    if (!isPhase2AMobileViewport()) return;

    const button = ensureMobileApproachBackButton();
    const revealDelay = typeof delay === "number" ? delay : 0;

    prepareMobileApproachBackButton(button);

    const revealTimeout = setTimeout(() => {
      if (!isPhase2AMobileViewport()) return;

      button.style.visibility = "visible";
      button.style.pointerEvents = "auto";
      button.style.transition =
        "opacity 1450ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "filter 1850ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "transform 2200ms cubic-bezier(0.13, 1, 0.22, 1)";

      button.style.opacity = "1";
      button.style.filter = "blur(0)";
      button.style.transform = "translateX(0) scale(1)";
    }, revealDelay);

    mobileApproachNavTimeouts.push(revealTimeout);
  }

  function hideMobileApproachBackButton() {
    const button = getMobileApproachBackButton();

    if (!button) return;

    button.style.transition =
      "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 900ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)";

    button.style.opacity = "0";
    button.style.filter = "blur(6px)";
    button.style.transform = "translateX(-14px) scale(0.988)";
    button.style.pointerEvents = "none";

    const hideTimeout = setTimeout(() => {
      button.style.visibility = "hidden";
    }, 1000);

    mobileApproachNavTimeouts.push(hideTimeout);
  }

  function setMobileApproachStyle(element, property, value) {
    if (!element || !element.style) return;
    element.style.setProperty(property, value, "important");
  }

  function clearMobileApproachStyle(element, property) {
    if (!element || !element.style) return;
    element.style.removeProperty(property);
  }

  function clearMobileApproachNavForcedStyles(items) {
    const targets = Array.from(new Set(items || mobileApproachNavForcedItems));

    targets.forEach((item) => {
      [
        "transition",
        "transition-delay",
        "opacity",
        "filter",
        "transform",
        "transform-origin",
        "visibility",
        "pointer-events",
        "will-change"
      ].forEach((property) => clearMobileApproachStyle(item, property));
    });
  }

  function getPhase2BEMobileReturnItems() {
    const sideNavItems = Array.from(document.querySelectorAll(
      ".side-nav > .nav-text, " +
      ".side-nav > .ig-link, " +
      ".side-nav > a, " +
      ".side-nav .nav-text, " +
      ".side-nav .ig-link, " +
      ".side-nav a"
    ));

    return Array.from(new Set([
      ...getMobileMainNavButtons(),
      ...sideNavItems
    ])).filter(Boolean).filter((item) => {
      if (!item.getBoundingClientRect) return true;

      const rect = item.getBoundingClientRect();
      const style = window.getComputedStyle(item);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none"
      );
    });
  }

  function isApproachNavElement(element) {
    return Boolean(
      element &&
      (
        elementMatchesMainNavSection(element, "approach") ||
        element === approachLink ||
        (approachLink && element.contains && element.contains(approachLink)) ||
        (approachLink && approachLink.contains && approachLink.contains(element))
      )
    );
  }

  function getMobileApproachNavDelay(element, index) {
    if (isApproachNavElement(element)) return 0;
    if (elementMatchesMainNavSection(element, "direction")) return 170;
    if (elementMatchesMainNavSection(element, "contact")) return 170;
    if (elementMatchesMainNavSection(element, "colour")) return 340;

    return Math.min(420, 220 + (index * 45));
  }

  function animateMobileNavOut() {
    if (!isPhase2AMobileViewport()) return;

    const items = getPhase2BEMobileReturnItems();
    if (!items.length) return;

    clearMobileApproachNavForcedStyles(mobileApproachNavForcedItems);
    mobileApproachNavForcedItems = items;

    items.forEach((item, index) => {
      const delay = getMobileApproachNavDelay(item, index);
      const offset = isApproachNavElement(item) ? "-18px" : "-28px";

      setMobileApproachStyle(item, "visibility", "visible");
      setMobileApproachStyle(item, "pointer-events", "none");
      setMobileApproachStyle(item, "transform-origin", "0% 50%");
      setMobileApproachStyle(item, "will-change", "opacity, filter, transform");
      setMobileApproachStyle(
        item,
        "transition",
        "opacity 2050ms cubic-bezier(0.22, 1, 0.36, 1), " +
          "filter 2700ms cubic-bezier(0.22, 1, 0.36, 1), " +
          "transform 3200ms cubic-bezier(0.22, 1, 0.36, 1)"
      );
      setMobileApproachStyle(item, "transition-delay", delay + "ms");
      setMobileApproachStyle(item, "opacity", "0");
      setMobileApproachStyle(item, "filter", "blur(8px)");
      setMobileApproachStyle(item, "transform", "translateX(" + offset + ") scale(0.988)");
    });
  }

  function animateMobileNavIn() {
    if (!isPhase2AMobileViewport()) return;

    const items = Array.from(new Set([
      ...mobileApproachNavForcedItems,
      ...getPhase2BEMobileReturnItems()
    ])).filter(Boolean);

    if (!items.length) return;

    items.forEach((item, index) => {
      setMobileApproachStyle(item, "visibility", "visible");
      setMobileApproachStyle(item, "pointer-events", "auto");
      setMobileApproachStyle(item, "will-change", "opacity, filter, transform");
      setMobileApproachStyle(
        item,
        "transition",
        "opacity 1850ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "filter 2450ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "transform 2900ms cubic-bezier(0.13, 1, 0.22, 1)"
      );
      setMobileApproachStyle(item, "transition-delay", Math.min(index * 115, 460) + "ms");
      setMobileApproachStyle(item, "opacity", "0.5");
      setMobileApproachStyle(item, "filter", "blur(0)");
      setMobileApproachStyle(item, "transform", "translateX(0) scale(1)");
    });
  }

  function preparePhase2BEMobileNavReturn() {
    animateMobileNavIn();
  }

  function clearPhase2BEMobileNavReturn() {
    const items = Array.from(new Set([
      ...mobileApproachNavForcedItems,
      ...getPhase2BEMobileReturnItems()
    ])).filter(Boolean);

    clearMobileApproachNavForcedStyles(items);

    items.forEach((item) => {
      item.style.visibility = "visible";
      item.style.pointerEvents = "auto";
      settleNavItemAfterArrival(item);
    });

    mobileApproachNavForcedItems = [];
  }

  function ensureMobileApproachBackButton() {
    let button = getMobileApproachBackButton();

    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "dcr-mobile-approach-back";
      button.textContent = "BACK";
      button.setAttribute("aria-label", "Back to navigation");
      document.body.appendChild(button);
    }

    if (!button.dataset.dcrPhase2ABackReady) {
      button.dataset.dcrPhase2ABackReady = "true";

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (isApproachOpen) {
          hideApproachAnimated(true);
        } else {
          hideMobileApproachBackButton();
        }
      });
    }

    return button;
  }

  function forceMobileApproachNavHidden() {
    if (!isPhase2AMobileViewport()) return;

    const items = Array.from(new Set([
      ...mobileApproachNavForcedItems,
      ...getPhase2BEMobileReturnItems()
    ])).filter(Boolean);

    if (!items.length) return;

    mobileApproachNavForcedItems = items;

    items.forEach((item) => {
      setMobileApproachStyle(item, "visibility", "visible");
      setMobileApproachStyle(item, "pointer-events", "none");
      setMobileApproachStyle(item, "opacity", "0");
      setMobileApproachStyle(item, "filter", "blur(8px)");
      setMobileApproachStyle(item, "transform", "translateX(-28px) scale(0.988)");
    });
  }

  function enterMobileApproachFocus() {
    if (!isPhase2AMobileViewport()) {
      document.documentElement.classList.remove("dcr-phase2b-mobile-approach-active");
      return;
    }

    clearMobileApproachNavTimeouts();
    mobileApproachFocusIsExiting = false;

    document.documentElement.classList.add("dcr-phase2b-mobile-approach-active");
    animateMobileNavOut();

    [520, 1180, 1900].forEach((delay) => {
      const reinforceTimeout = setTimeout(() => {
        if (!isApproachOpen) return;
        if (!document.documentElement.classList.contains("dcr-phase2b-mobile-approach-active")) return;

        forceMobileApproachNavHidden();
      }, delay);

      mobileApproachNavTimeouts.push(reinforceTimeout);
    });

    revealMobileApproachBackButton(2250);
  }

  function exitMobileApproachFocus(delay) {
    const root = document.documentElement;

    root.classList.remove("dcr-phase2b-mobile-approach-entering");

    if (!isPhase2AMobileViewport()) {
      root.classList.remove("dcr-phase2b-mobile-approach-active");
      mobileApproachFocusIsExiting = false;
      return;
    }

    const hadMobileApproachActive =
      root.classList.contains("dcr-phase2b-mobile-approach-active");

    if (!hadMobileApproachActive) {
      hideMobileApproachBackButton();
      mobileApproachFocusIsExiting = false;
      return;
    }

    const navReturnDelay = typeof delay === "number" ? delay : 0;

    mobileApproachFocusIsExiting = true;
    clearMobileApproachNavTimeouts();
    hideMobileApproachBackButton();

    const navReturnTimeout = setTimeout(() => {
      preparePhase2BEMobileNavReturn();

      requestAnimationFrame(() => {
        root.classList.remove("dcr-phase2b-mobile-approach-active");
      });

      const navReturnCleanupTimeout = setTimeout(() => {
        clearPhase2BEMobileNavReturn();
      }, 3600);

      mobileApproachNavTimeouts.push(navReturnCleanupTimeout);
    }, Math.max(0, navReturnDelay));

    const clearStateTimeout = setTimeout(() => {
      mobileApproachFocusIsExiting = false;
    }, Math.max(4200, navReturnDelay + 4200));

    mobileApproachNavTimeouts.push(navReturnTimeout);
    mobileApproachNavTimeouts.push(clearStateTimeout);
  }

  function installMobileLayoutFixes() {
    if (document.getElementById("dcr-global-visual-fixes")) return;

    const style = document.createElement("style");
    style.id = "dcr-global-visual-fixes";
    style.textContent = `
      video::-webkit-media-controls,
      video::-webkit-media-controls-panel,
      video::-webkit-media-controls-play-button,
      video::-webkit-media-controls-start-playback-button,
      video::-webkit-media-controls-overlay-play-button,
      video::-webkit-media-controls-enclosure {
        display: none !important;
        opacity: 0 !important;
        -webkit-appearance: none !important;
        appearance: none !important;
      }

      video {
        -webkit-user-select: none !important;
        user-select: none !important;
      }

      .dcr-video-still-fallback {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-size: cover !important;
        background-position: center center !important;
        background-repeat: no-repeat !important;
        opacity: 0;
        visibility: hidden;
        pointer-events: none !important;
        z-index: 2 !important;
        transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      html.dcr-video-fallback-active .dcr-video-still-fallback {
        opacity: 1;
        visibility: visible;
      }

      .dcr-corner-vignette {
        position: fixed !important;
        inset: 0 !important;
        pointer-events: none !important;
        opacity: 0;
        z-index: 7 !important;
        transition: opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .dcr-corner-vignette-tl {
        background:
          radial-gradient(
            ellipse 58vw 62vh at 0% 0%,
            rgba(0, 0, 0, 0.34) 0%,
            rgba(0, 0, 0, 0.20) 28%,
            rgba(0, 0, 0, 0.08) 48%,
            rgba(0, 0, 0, 0) 74%
          );
      }

      .dcr-corner-vignette-br {
        background:
          radial-gradient(
            ellipse 76vw 72vh at 100% 100%,
            rgba(0, 0, 0, 0.48) 0%,
            rgba(0, 0, 0, 0.30) 28%,
            rgba(0, 0, 0, 0.13) 52%,
            rgba(0, 0, 0, 0) 78%
          );
      }

      .dcr-name-shadow-spot {
        position: fixed !important;
        left: 50vw !important;
        top: 50vh !important;
        width: 68vw !important;
        height: 30vh !important;
        transform: translate(-50%, -50%) scale(0.96);
        transform-origin: 50% 50%;
        background:
          radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.18) 0%,
            rgba(0, 0, 0, 0.10) 34%,
            rgba(0, 0, 0, 0.045) 58%,
            rgba(0, 0, 0, 0) 82%
          );
        filter: blur(38px);
        opacity: 0;
        visibility: hidden;
        pointer-events: none !important;
        z-index: 38 !important;
        mix-blend-mode: multiply;
        transition:
          opacity 2800ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 5200ms cubic-bezier(0.13, 1, 0.22, 1);
      }

      html.dcr-name-shadow-spot-on .dcr-name-shadow-spot {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) scale(1);
      }

      .dcr-intro-atmosphere,
      .dcr-intro-grain {
        position: fixed !important;
        inset: -2.5vh -2.5vw !important;
        pointer-events: none !important;
        visibility: hidden;
        opacity: 0;
      }

      .dcr-intro-atmosphere {
        z-index: 12 !important;
        background:
          radial-gradient(
            ellipse 62vw 46vh at 50% 48%,
            rgba(255, 255, 255, 0.055) 0%,
            rgba(20, 20, 20, 0.20) 34%,
            rgba(0, 0, 0, 0.62) 100%
          ),
          linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.72) 0%,
            rgba(0, 0, 0, 0.48) 48%,
            rgba(0, 0, 0, 0.70) 100%
          );
        transform: scale(1.018);
        transform-origin: 50% 50%;
        transition:
          opacity 7200ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 9200ms cubic-bezier(0.13, 1, 0.22, 1);
      }

      .dcr-intro-grain {
        z-index: 13 !important;
        background-image:
          radial-gradient(circle at 17% 23%, rgba(255, 255, 255, 0.12) 0 0.55px, transparent 0.9px),
          radial-gradient(circle at 73% 68%, rgba(255, 255, 255, 0.08) 0 0.5px, transparent 0.85px),
          radial-gradient(circle at 39% 82%, rgba(0, 0, 0, 0.18) 0 0.65px, transparent 1px);
        background-size: 3px 3px, 4px 4px, 5px 5px;
        mix-blend-mode: soft-light;
        transform: scale(1.01);
        transition:
          opacity 5200ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 9200ms cubic-bezier(0.13, 1, 0.22, 1);
      }

      html.dcr-intro-atmosphere-prep .dcr-intro-atmosphere,
      html.dcr-intro-atmosphere-prep .dcr-intro-grain {
        visibility: visible;
      }

      html.dcr-intro-atmosphere-prep .dcr-intro-atmosphere {
        opacity: 1;
      }

      html.dcr-intro-atmosphere-prep .dcr-intro-grain {
        opacity: 0.07;
      }

      html.dcr-intro-atmosphere-live .dcr-intro-atmosphere {
        opacity: 0;
        transform: scale(1);
      }

      html.dcr-intro-atmosphere-live .dcr-intro-grain {
        opacity: 0;
        transform: scale(1);
      }

      @media (max-width: 1024px) {
        html.dcr-mobile-scroll-lock-active,
        html.dcr-mobile-scroll-lock-active body {
          position: fixed !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          height: 100svh !important;
          height: 100dvh !important;
          min-height: 100vh !important;
          min-height: 100svh !important;
          min-height: 100dvh !important;
          overflow: hidden !important;
          overscroll-behavior: none !important;
          -webkit-overflow-scrolling: auto !important;
          background: #000 !important;
        }

        html.dcr-mobile-scroll-lock-active body {
          touch-action: manipulation;
        }

        html.dcr-mobile-scroll-lock-active .hero-section,
        html.dcr-mobile-scroll-lock-active .video-blur-wrapper-2,
        html.dcr-mobile-scroll-lock-active .video-wrapper,
        html.dcr-mobile-scroll-lock-active .video-overlay {
          overscroll-behavior: none !important;
        }

        html,
        body,
        a,
        button,
        [role="button"],
        .nav-text,
        .side-nav *,
        .approach-ig-link,
        [data-approach-ig],
        [data-instagram-link],
        .post-production-projects-panel *,
        .direction-projects-panel *,
        .colour-projects-panel *,
        .color-projects-panel *,
        .contact-overlay * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
          tap-highlight-color: rgba(0, 0, 0, 0) !important;
        }

        a,
        button,
        [role="button"],
        .nav-text {
          outline: none !important;
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }

        a:active,
        button:active,
        [role="button"]:active,
        .nav-text:active {
          background: transparent !important;
          background-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
        }

        a:focus,
        button:focus,
        [role="button"]:focus,
        .nav-text:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        .center-name-wrapper,
        .center-name-wrapper-opening {
          position: fixed !important;
          left: 50vw !important;
          top: 50vh !important;
          top: 50svh !important;
          right: auto !important;
          bottom: auto !important;
          transform: translate(-50%, -50%) !important;
          translate: none !important;
          width: max-content !important;
          max-width: 86vw !important;
          text-align: center !important;
          z-index: 45 !important;
        }

        .center-name-wrapper .name-stack,
        .center-name-wrapper .subheadline,
        .center-name-wrapper-opening .name-stack,
        .center-name-wrapper-opening .subheadline {
          text-align: center !important;
        }

        .center-name-wrapper .name-stack,
        .center-name-wrapper-opening .name-stack {
          word-spacing: normal !important;
        }

        .center-name-wrapper .name-stack > div:first-child,
        .center-name-wrapper-opening .name-stack > div:first-child,
        .center-name-wrapper .name-stack > div:has(.center-name-text-3),
        .center-name-wrapper-opening .name-stack > div:has(.center-name-text-3) {
          display: flex !important;
          align-items: baseline !important;
          justify-content: center !important;
          gap: clamp(34px, 9vw, 54px) !important;
          column-gap: clamp(34px, 9vw, 54px) !important;
          width: 100% !important;
          max-width: 86vw !important;
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
        }

        .center-name-wrapper .name-stack > div:first-child > *,
        .center-name-wrapper-opening .name-stack > div:first-child > *,
        .center-name-wrapper .center-name-text-3,
        .center-name-wrapper-opening .center-name-text-3 {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        .center-name-wrapper .subheadline,
        .center-name-wrapper-opening .subheadline {
          display: block !important;
          width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
        }

        .dcr-mobile-approach-back {
          position: fixed !important;
          left: 8.5vw !important;
          top: 5.8vh !important;
          top: 5.8svh !important;
          z-index: 160 !important;
          display: block !important;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          appearance: none;
          -webkit-appearance: none;
          background: transparent !important;
          background-color: transparent !important;
          border: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          color: rgba(255, 255, 255, 0.92);
          font: inherit;
          font-size: clamp(11px, 2.45vw, 14px);
          line-height: 1;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          cursor: pointer;
          filter: blur(6px);
          transform: translateX(-14px) scale(0.988);
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .dcr-mobile-approach-back:active,
        .dcr-mobile-approach-back:focus {
          background: transparent !important;
          background-color: transparent !important;
          outline: none !important;
          box-shadow: none !important;
        }

        html.dcr-phase2b-mobile-approach-active .side-nav > .nav-text,
        html.dcr-phase2b-mobile-approach-active .side-nav > .ig-link {
          transition:
            opacity 2050ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 2700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 3200ms cubic-bezier(0.22, 1, 0.36, 1) !important;
          opacity: 0 !important;
          filter: blur(8px) !important;
          transform: translateX(-28px) scale(0.988) !important;
          pointer-events: none !important;
          will-change: opacity, filter, transform;
        }

        html.dcr-phase2b-mobile-approach-active .side-nav > .nav-text:nth-child(3) {
          transition-delay: 0ms !important;
        }

        html.dcr-phase2b-mobile-approach-active .side-nav > .nav-text:nth-child(2),
        html.dcr-phase2b-mobile-approach-active .side-nav > .nav-text:nth-child(4) {
          transition-delay: 170ms !important;
        }

        html.dcr-phase2b-mobile-approach-active .side-nav > .nav-text:nth-child(1),
        html.dcr-phase2b-mobile-approach-active .side-nav > .ig-link {
          transition-delay: 340ms !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  function installMobileViewportScrollLock() {
    if (window.__dcrMobileViewportScrollLockInstalled) return;

    window.__dcrMobileViewportScrollLockInstalled = true;

    const root = document.documentElement;
    const mobileQuery = window.matchMedia
      ? window.matchMedia("(max-width: 1024px)")
      : null;

    function isMobileLockedViewport() {
      return Boolean(mobileQuery ? mobileQuery.matches : window.innerWidth <= 1024);
    }

    function allowNativeTouchMove(target) {
      if (!target || !target.closest) return false;

      return Boolean(
        target.closest("input, textarea, select, option, [contenteditable='true'], [data-allow-touch-scroll]")
      );
    }

    function syncMobileScrollLock() {
      if (isMobileLockedViewport()) {
        root.classList.add("dcr-mobile-scroll-lock-active");

        if (window.scrollX || window.scrollY) {
          window.scrollTo(0, 0);
        }
      } else {
        root.classList.remove("dcr-mobile-scroll-lock-active");
      }
    }

    function preventMobileRubberBand(event) {
      if (!root.classList.contains("dcr-mobile-scroll-lock-active")) return;
      if (allowNativeTouchMove(event.target)) return;

      if (event.cancelable) {
        event.preventDefault();
      }
    }

    document.addEventListener("touchmove", preventMobileRubberBand, {
      passive: false
    });

    document.addEventListener("gesturestart", preventMobileRubberBand, {
      passive: false
    });

    window.addEventListener("scroll", () => {
      if (!root.classList.contains("dcr-mobile-scroll-lock-active")) return;

      if (window.scrollX || window.scrollY) {
        window.scrollTo(0, 0);
      }
    }, { passive: true });

    window.addEventListener("resize", syncMobileScrollLock);
    window.addEventListener("orientationchange", () => {
      setTimeout(syncMobileScrollLock, 120);
      setTimeout(syncMobileScrollLock, 420);
    });

    window.addEventListener("pageshow", syncMobileScrollLock);

    if (mobileQuery && mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", syncMobileScrollLock);
    } else if (mobileQuery && mobileQuery.addListener) {
      mobileQuery.addListener(syncMobileScrollLock);
    }

    syncMobileScrollLock();
    setTimeout(syncMobileScrollLock, 350);
  }

  function ensureIntroAtmosphereElements() {
    let atmosphere = document.querySelector(".dcr-intro-atmosphere");
    let grain = document.querySelector(".dcr-intro-grain");

    if (!atmosphere) {
      atmosphere = document.createElement("div");
      atmosphere.className = "dcr-intro-atmosphere";
      atmosphere.setAttribute("aria-hidden", "true");
      document.body.appendChild(atmosphere);
    }

    if (!grain) {
      grain = document.createElement("div");
      grain.className = "dcr-intro-grain";
      grain.setAttribute("aria-hidden", "true");
      document.body.appendChild(grain);
    }

    return { atmosphere, grain };
  }

  function prepareIntroAtmosphere() {
    ensureIntroAtmosphereElements();

    document.documentElement.classList.remove("dcr-intro-atmosphere-live");
    document.documentElement.classList.add("dcr-intro-atmosphere-prep");
  }

  function runIntroAtmosphere() {
    ensureIntroAtmosphereElements();

    document.documentElement.classList.add("dcr-intro-atmosphere-live");
  }

  function cleanupIntroAtmosphere() {
    document.documentElement.classList.remove("dcr-intro-atmosphere-prep");
    document.documentElement.classList.remove("dcr-intro-atmosphere-live");
  }

  function getIntroNameElements() {
    const namePieces = document.querySelectorAll(
      ".center-name-wrapper .center-name-text-3, .center-name-wrapper-opening .center-name-text-3"
    );

    if (namePieces.length) {
      return namePieces;
    }

    const nameStacks = document.querySelectorAll(
      ".center-name-wrapper .name-stack, .center-name-wrapper-opening .name-stack"
    );

    if (nameStacks.length) {
      return nameStacks;
    }

    return getCenterNameElements();
  }

  function getIntroSubtitleElements() {
    return document.querySelectorAll(".center-name-wrapper .subheadline");
  }

  let customPageLoadIntroHasRun = false;

  function prepareCustomPageLoadIntro() {
    document.documentElement.classList.add("custom-page-load-intro-active");
    prepareIntroAtmosphere();

    const openingName = document.querySelector(".center-name-wrapper-opening");

    if (openingName) {
      openingName.style.transition = "none";
      openingName.style.opacity = "0";
      openingName.style.visibility = "hidden";
      openingName.style.pointerEvents = "none";
    }

    getIntroNameElements().forEach((element, index) => {
      element.style.transformOrigin = "50% 52%";
      element.style.transition = "none";
      element.style.transitionDelay = "0ms";
      element.style.visibility = "visible";
      element.style.opacity = "0.38";
      element.style.filter = "blur(6.2px)";
      element.style.transform = "translateY(8px) scale(1.018)";
      element.style.pointerEvents = "none";
      element.style.willChange = "opacity, filter, transform";
      element.dataset.dcrIntroNameIndex = String(index);
    });

    getIntroSubtitleElements().forEach((element) => {
      element.style.transformOrigin = "50% 50%";
      element.style.transition = "none";
      element.style.visibility = "visible";
      element.style.opacity = "0.10";
      element.style.filter = "blur(5.4px)";
      element.style.transform = "translateY(5px) scale(1.003)";
      element.style.pointerEvents = "none";
      element.style.willChange = "opacity, filter, transform";
    });

    ensureNameShadowSpot();
    document.documentElement.classList.add("dcr-name-shadow-spot-on");

    getLeftNavButtons().forEach((item) => {
      item.style.transformOrigin = "0% 50%";
      item.style.transition = "none";
      item.style.visibility = "visible";
      item.style.opacity = "0";
      item.style.filter = "blur(8px)";
      item.style.transform = "translateX(-18px) scale(0.988)";
      item.style.pointerEvents = "none";
      item.style.willChange = "opacity, filter, transform";
    });

    hideMainReelMobileStillOnDesktop();

    if (videos.main) {
      videos.main.style.transition = "none";
      videos.main.style.opacity =
        "1";
      videos.main.style.filter = "blur(18px) brightness(0.68) saturate(0.92)";
      videos.main.style.transform = "scale(1.026)";
      videos.main.style.willChange = "filter, transform";

      if (isMobileViewportForMainReel() && !mainReelMobileMotionReady) {
        keepMobileStillVisible();
      }
    }

    const introOverlay = document.querySelector(".intro-overlay");

    if (introOverlay) {
      introOverlay.style.transition = "opacity 900ms ease";
      introOverlay.style.opacity = "0";
      introOverlay.style.visibility = "hidden";
      introOverlay.style.pointerEvents = "none";
    }
  }

  function runCustomPageLoadIntro() {
    if (customPageLoadIntroHasRun) return;

    customPageLoadIntroHasRun = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        runIntroAtmosphere();

        if (videos.main) {
          videos.main.style.transition =
            "filter 8200ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 8600ms cubic-bezier(0.13, 1, 0.22, 1)";

          videos.main.style.opacity =
            "1";
          videos.main.style.filter = "blur(0) brightness(1) saturate(1)";
          videos.main.style.transform = "scale(1)";

          if (isMobileViewportForMainReel()) {
            requestMobileMainReelMotion();
          } else {
            hideMainReelMobileStillOnDesktop();
            playVideo(videos.main);
          }
        }

        getIntroNameElements().forEach((element, index) => {
          element.style.transition =
            "opacity 3200ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "filter 5200ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 7200ms cubic-bezier(0.13, 1, 0.22, 1)";

          element.style.transitionDelay = 120 + index * 105 + "ms";
          element.style.visibility = "visible";
          element.style.opacity = "1";
          element.style.filter = "blur(0)";
          element.style.transform = "translateY(0) scale(1)";
          element.style.pointerEvents = "";
        });

        getIntroSubtitleElements().forEach((element) => {
          element.style.transition =
            "opacity 4700ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "filter 6200ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 7200ms cubic-bezier(0.13, 1, 0.22, 1)";

          element.style.transitionDelay = "980ms";
          element.style.visibility = "visible";
          element.style.opacity = "1";
          element.style.filter = "blur(0)";
          element.style.transform = "translateY(0) scale(1)";
          element.style.pointerEvents = "";
        });

        showNameShadowSpot(220);

        getLeftNavButtons().forEach((item, index) => {
          const isMobileIntro = isPhase2AMobileViewport();
          const delay = (isMobileIntro ? 3150 : 2850) + index * (isMobileIntro ? 140 : 115);
          const opacityDuration = isMobileIntro ? 2700 : 2300;
          const filterDuration = isMobileIntro ? 3600 : 3100;
          const transformDuration = isMobileIntro ? 4300 : 3600;
          const settleDelay = isMobileIntro ? 3300 : 2700;
          const settleStagger = isMobileIntro ? 80 : 65;

          item.style.transition =
            "opacity " + opacityDuration + "ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "filter " + filterDuration + "ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform " + transformDuration + "ms cubic-bezier(0.13, 1, 0.22, 1)";

          item.style.transitionDelay = delay + "ms";
          item.style.visibility = "visible";
          item.style.opacity = "1";
          item.style.filter = "blur(0)";
          item.style.transform = "translateX(0) scale(1)";
          item.style.pointerEvents = "auto";

          const navSettleTimeout = setTimeout(() => {
            settleNavItemAfterArrival(item);
          }, delay + settleDelay + index * settleStagger);

          revealTimeouts.push(navSettleTimeout);
        });

        const cleanupTimeout = setTimeout(() => {
          document.documentElement.classList.remove("custom-page-load-intro-active");
          cleanupIntroAtmosphere();

          getLeftNavButtons().forEach((item) => {
            item.style.transitionDelay = "";
            item.style.willChange = "";
          });

          getCenterNameElements().forEach((element) => {
            element.style.transitionDelay = "";
            element.style.willChange = "";
          });

          if (videos.main) {
            videos.main.style.willChange = "";
          }
        }, 9800);

        revealTimeouts.push(cleanupTimeout);
      });
    });
  }

  function getAllHoverButtons() {
    return document.querySelectorAll(
      ".side-nav .nav-text, " +
      ".side-nav a, " +
      ".approach-ig-link, " +
      "[data-approach-ig], " +
      "[data-instagram-link], " +
      ".post-production-projects-panel .nav-text, " +
      ".post-production-projects-panel a, " +
      ".direction-projects-panel .nav-text, " +
      ".direction-projects-panel a, " +
      ".colour-projects-panel .nav-text, " +
      ".colour-projects-panel a, " +
      ".color-projects-panel .nav-text, " +
      ".color-projects-panel a"
    );
  }

  function getMainNavButton(sectionName) {
    const buttonByAttribute = document.querySelector("[data-main-nav='" + sectionName + "']");
    if (buttonByAttribute) return buttonByAttribute;

    return Array.from(getLeftNavButtons()).find((button) => {
      return mainNavTextMatchesSection(button.textContent, sectionName);
    });
  }

  function getSectionPanels(sectionName) {
    if (sectionName === "colour") {
      return document.querySelectorAll(
        ".post-production-projects-panel, " +
        ".colour-projects-panel, " +
        ".color-projects-panel"
      );
    }

    if (sectionName === "direction") {
      return document.querySelectorAll(".direction-projects-panel");
    }

    return [];
  }

  function elementBelongsToInactiveProjectPanel(element) {
    const isInColourPanel =
      element.closest(".post-production-projects-panel") ||
      element.closest(".colour-projects-panel") ||
      element.closest(".color-projects-panel");

    const isInDirectionPanel =
      element.closest(".direction-projects-panel");

    if (activeSection === "colour" && isInDirectionPanel) {
      return true;
    }

    if (activeSection === "direction" && isInColourPanel) {
      return true;
    }

    return false;
  }

  function getElementsToDim() {
    return Array.from(document.querySelectorAll(
      ".side-nav .nav-text, " +
      ".side-nav a, " +
      ".approach-ig-link, " +
      "[data-approach-ig], " +
      "[data-instagram-link], " +
      ".post-production-projects-panel .nav-text, " +
      ".post-production-projects-panel a, " +
      ".direction-projects-panel .nav-text, " +
      ".direction-projects-panel a, " +
      ".colour-projects-panel .nav-text, " +
      ".colour-projects-panel a, " +
      ".color-projects-panel .nav-text, " +
      ".color-projects-panel a"
    )).filter((element) => {
      return !elementBelongsToInactiveProjectPanel(element);
    });
  }

  function isProjectButton(element) {
    return (
      element.closest(".post-production-projects-panel") ||
      element.closest(".direction-projects-panel") ||
      element.closest(".colour-projects-panel") ||
      element.closest(".color-projects-panel")
    );
  }

  function shouldStayFocused(element, clickedButton) {
    return element === clickedButton || element === activeMainNavButton;
  }

  function clearProjectMenuTransitionFlags() {
    document.querySelectorAll(
      ".post-production-projects-panel, " +
      ".direction-projects-panel, " +
      ".colour-projects-panel, " +
      ".color-projects-panel"
    ).forEach((panel) => {
      delete panel.dataset.projectMenuTransitioning;
    });
  }

  function clearRevealTimeouts() {
    revealTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });

    revealTimeouts = [];
    clearProjectMenuTransitionFlags();
  }

  function clearApproachTimeouts() {
    approachTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });

    approachTimeouts = [];
  }

  function clearContactTimeouts() {
    contactTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });

    contactTimeouts = [];
  }

  function clearOverlayVideoTimeouts() {
    overlayVideoTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });

    overlayVideoTimeouts = [];
  }

  function forceInactiveProjectPanelsHidden() {
    ["colour", "direction"].forEach((sectionName) => {
      if (activeSection === sectionName) return;

      getSectionPanels(sectionName).forEach((panel) => {
        if (panel.dataset.projectMenuTransitioning === "true") return;

        hidePanelWithoutBreakingLayout(panel);

        panel.querySelectorAll(".nav-text, a").forEach((item) => {
          item.style.pointerEvents = "none";
        });
      });
    });
  }

  function activateProjectFocus(clickedButton) {
    clearRevealTimeouts();
    forceInactiveProjectPanelsHidden();

    activeProjectButton = clickedButton;

    getElementsToDim().forEach((element) => {
      if (shouldStayFocused(element, clickedButton)) {
        focusElement(element);
      } else {
        dimElement(element);
      }
    });

    forceInactiveProjectPanelsHidden();
  }

  function returnToActiveProjectFocus() {
    if (!activeProjectButton) return;

    forceInactiveProjectPanelsHidden();

    getElementsToDim().forEach((element) => {
      if (shouldStayFocused(element, activeProjectButton)) {
        focusElement(element);
      } else {
        dimElement(element);
      }
    });

    forceInactiveProjectPanelsHidden();
  }

  function clearProjectFocus() {
    activeProjectButton = null;

    getElementsToDim().forEach((element) => {
      resetElement(element);
    });

    if (activeMainNavButton) {
      focusElement(activeMainNavButton);
    }

    forceInactiveProjectPanelsHidden();
  }

  function restoreActiveSectionRestingState() {
    activeProjectButton = null;

    getLeftNavButtons().forEach((element) => {
      if (element === activeMainNavButton) {
        focusElement(element);
      } else {
        resetElement(element);
      }
    });

    if (activeSection) {
      getSectionPanels(activeSection).forEach((panel) => {
        showPanelWithoutBreakingLayout(panel);

        panel.querySelectorAll(".nav-text").forEach((button) => {
          softenElementWithoutBlur(button);
          button.style.visibility = "visible";
          button.style.pointerEvents = "auto";
        });
      });
    }

    if (activeMainNavButton) {
      focusElement(activeMainNavButton);
    }

    forceInactiveProjectPanelsHidden();
  }

  function hideAndResetClientVideos() {
    showMobileClientNavAfterFullscreen();
    hideClientVideoLoadingState();
    hideClientVideoCredit();
    clearClientVideoEndReturnTimer();

    Object.keys(clientVideoSourceConfig).forEach((key) => {
      const video = videos[key];

      clientVideoSourceConfig[key].playbackReady = false;

      if (!video) return;

      safelySetMuted(video, true);
      safelySetVolume(video, 0);
      safelySetPlaybackRate(video, 1);
      resetClientVideoToStartFrame(video);

      video.style.transition =
        "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
        "filter 1.4s cubic-bezier(0.8, 0, 0.2, 1), " +
        "transform 1.4s ease";

      video.style.opacity = "0";
      video.style.filter = "blur(2px) brightness(1)";
      video.style.transform = "scale(1.02)";
    });
  }

  function returnToMainWebsiteVideo() {
    hideClientVideoSwipeHint(false);
    showMainReelHolderForWebsiteVideo();

    const mainVideo = videos.main;

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    hideAndResetClientVideos();

    current = "main";

    if (mainVideo) {
      safelySetMuted(mainVideo, true);
      safelySetPlaybackRate(mainVideo, 1);

      mainVideo.style.transition =
        "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
        "filter 1.4s cubic-bezier(0.8, 0, 0.2, 1), " +
        "transform 1.4s ease";

      mainVideo.style.opacity =
        "1";
      mainVideo.style.filter = "blur(0) brightness(1)";
      mainVideo.style.transform = "scale(1)";

      restartMainReelFromBeginning();
    }

    if (activeSection) {
      restoreActiveSectionRestingState();
    } else {
      clearProjectFocus();
    }

    showCenterNameAnimated(600);

    setTimeout(() => {
      if (activeSection) {
        restoreActiveSectionRestingState();
      }
    }, 120);

    setTimeout(() => {
      if (activeSection) {
        restoreActiveSectionRestingState();
      }
    }, 800);
  }

  function moveToMainVideoBehindContact() {
    showMainReelHolderForWebsiteVideo();

    const mainVideo = videos.main;

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    hideAndResetClientVideos();

    current = "main";

    if (mainVideo) {
      safelySetMuted(mainVideo, true);
      safelySetPlaybackRate(mainVideo, 1);
      mainVideo.style.opacity =
        "1";
      mainVideo.style.filter = "blur(0) brightness(1)";
      mainVideo.style.transform = "scale(1)";

      restartMainReelFromBeginning();
    }

  }

  function captureApproachResumeState() {
    const video = videos[current];
    const key = getClientVideoKeyByVideo(video);
    const config = key ? clientVideoSourceConfig[key] : null;

    approachResumeState = {
      key: key || current,
      isClient: Boolean(key),
      video: video || null,
      wasPaused: video ? Boolean(video.paused) : true,
      wasEnded: video ? Boolean(video.ended) : false,
      hadCompleted: Boolean(config && config.hasCompleted),
      time: video ? (video.currentTime || 0) : 0,
      startVolume: video ? Math.max(0, Math.min(1, video.volume || 0)) : 0,
      wasMuted: video ? Boolean(video.muted) : true,
      playbackRate: video ? (video.playbackRate || 1) : 1,
      token: String(Date.now()) + "-" + String(Math.random()).slice(2)
    };

    if (key) {
      clearClientDesktopHlsFallbackTimer(key);
    }
  }

  function clearApproachResumeState() {
    clearOverlayVideoTimeouts();
    approachResumeState = null;
  }

  function getApproachResumeVideo() {
    if (approachResumeState && approachResumeState.video) {
      return approachResumeState.video;
    }

    if (approachPausedVideo) {
      return approachPausedVideo;
    }

    return videos[current] || null;
  }

  function getApproachResumeKey(video) {
    if (approachResumeState && approachResumeState.key) {
      return approachResumeState.key;
    }

    return getClientVideoKeyByVideo(video) || current;
  }

  function shouldResumeApproachClientVideo(key, video) {
    if (!key || !video || !isClientVideoKey(key)) return false;

    const config = clientVideoSourceConfig[key];

    if (!config) return false;
    if (config.hasCompleted || video.ended) return false;

    return true;
  }

  function playVideoWithResumeRetries(video) {
    if (!video) return;

    playVideo(video);

    [180, 520, 1150, 1900].forEach((delay) => {
      const retry = setTimeout(() => {
        if (!video) return;
        if (!isApproachOpen && !isContactOpen && video.paused && !video.ended) {
          playVideo(video);
        }
      }, delay);

      approachTimeouts.push(retry);
      contactTimeouts.push(retry);
    });
  }

  function cancelApproachPlaybackAnimation() {
    if (approachPlaybackAnimation) {
      cancelAnimationFrame(approachPlaybackAnimation);
      approachPlaybackAnimation = null;
    }
  }

  function animatePlaybackRate(video, fromRate, toRate, duration, onComplete, easingFunction) {
    cancelApproachPlaybackAnimation();

    const startTime = performance.now();
    const easing = easingFunction || easeInOutCubic;

    safelySetPlaybackRate(video, fromRate);

    function animate(now) {
      if (!video) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const rate = fromRate + ((toRate - fromRate) * easedProgress);

      safelySetPlaybackRate(video, rate);

      if (progress < 1) {
        approachPlaybackAnimation = requestAnimationFrame(animate);
      } else {
        safelySetPlaybackRate(video, toRate);
        approachPlaybackAnimation = null;

        if (onComplete) {
          onComplete();
        }
      }
    }

    approachPlaybackAnimation = requestAnimationFrame(animate);
  }

  function removeApproachFreezeFrameImmediately() {}

  function fadeOutApproachFreezeFrame() {}

  function isVideoOverlayOpen() {
    return isApproachOpen || isContactOpen;
  }

  function useMobileOverlayPauseMode() {
    return isPhase2AMobileViewport();
  }

  function slowCurrentVideoForApproach() {
    clearOverlayVideoTimeouts();

    const video = getApproachResumeVideo();
    if (!video) return;

    const savedToken = approachResumeState ? approachResumeState.token : "";

    approachPausedVideo = video;
    approachVideoWasPaused = video.paused;

    if (approachVideoWasPaused || video.ended) return;

    playVideo(video);

    function pauseAtOverlayFrame() {
      const tokenStillMatches = !savedToken || !approachResumeState || approachResumeState.token === savedToken;

      if (!isVideoOverlayOpen() || approachPausedVideo !== video || video.ended || !tokenStillMatches) return;

      safelySetPlaybackRate(video, useMobileOverlayPauseMode() ? 1 : 0.24);

      try {
        video.pause();
      } catch (error) {}

      if (approachResumeState && approachResumeState.video === video) {
        approachResumeState.time = Number.isFinite(video.currentTime)
          ? video.currentTime
          : approachResumeState.time;
      }
    }

    if (useMobileOverlayPauseMode()) {
      // Mobile browsers, especially iOS Safari, do not reliably support
      // playbackRate/volume animation. For mobile, keep the premium visual
      // blur/dim, but freeze the real video frame quickly and safely.
      safelySetPlaybackRate(video, 1);

      const pauseTimeout = setTimeout(pauseAtOverlayFrame, 120);
      const safetyPauseTimeout = setTimeout(pauseAtOverlayFrame, 360);

      overlayVideoTimeouts.push(pauseTimeout);
      overlayVideoTimeouts.push(safetyPauseTimeout);
      return;
    }

    const startRate = Math.max(0.25, Math.min(1, video.playbackRate || 1));
    const finalRate = 0.24;
    const duration = 3300;

    animatePlaybackRate(video, startRate, finalRate, duration, () => {
      const pauseTimeout = setTimeout(pauseAtOverlayFrame, 280);
      overlayVideoTimeouts.push(pauseTimeout);
    }, approachSlowdownEase);

    const safetyPauseTimeout = setTimeout(pauseAtOverlayFrame, duration + 850);
    overlayVideoTimeouts.push(safetyPauseTimeout);
  }

  function restoreSavedVideoVisibility(savedKey, video) {
    if (!savedKey || !video || !videos[savedKey]) return;

    current = savedKey;

    Object.entries(videos).forEach(([key, otherVideo]) => {
      if (!otherVideo || key === savedKey) return;

      safelySetMuted(otherVideo, true);
      safelySetPlaybackRate(otherVideo, 1);
      otherVideo.style.opacity = "0";
      otherVideo.style.filter = "blur(2px) brightness(1)";
      otherVideo.style.transform = "scale(1.02)";
    });

    video.style.opacity = "1";
  }

  function fadeOverlayAudioIn(video, targetVolume) {
    if (!video) return;

    const target = Math.max(0, Math.min(1, targetVolume));
    const start = Math.max(0, Math.min(target, video.volume || 0));
    const duration = useMobileOverlayPauseMode() ? 1400 : 2200;
    const startTime = performance.now();

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    safelySetMuted(video, false);
    safelySetVolume(video, start);

    function fade(now) {
      if (isApproachOpen || isContactOpen) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      const volume = start + ((target - start) * easedProgress);

      safelySetMuted(video, false);
      safelySetVolume(video, volume);

      if (progress < 1) {
        audioFadeAnimation = requestAnimationFrame(fade);
      } else {
        safelySetMuted(video, false);
        safelySetVolume(video, target);
        audioFadeAnimation = null;
      }
    }

    audioFadeAnimation = requestAnimationFrame(fade);
  }

  function resumeApproachVideoPlayback() {
    const savedState = approachResumeState;
    const video =
      (savedState && savedState.video) ||
      (savedState && savedState.key && videos[savedState.key]) ||
      approachPausedVideo ||
      videos[current];

    if (!video) {
      clearApproachResumeState();
      return;
    }

    const savedKey = getApproachResumeKey(video);
    const resumeClientKey = isClientVideoKey(savedKey)
      ? savedKey
      : getClientVideoKeyByVideo(video);
    const wasPausedBeforeOverlay = savedState
      ? Boolean(savedState.wasPaused)
      : approachVideoWasPaused;
    const wasEndedBeforeOverlay = savedState
      ? Boolean(savedState.wasEnded || savedState.hadCompleted)
      : Boolean(video.ended);
    const targetVolume = resumeClientKey
      ? CLIENT_VIDEO_PLAYBACK_VOLUME
      : Math.max(0, Math.min(1, savedState && typeof savedState.startVolume === "number" ? savedState.startVolume : (video.volume || 0)));

    restoreSavedVideoVisibility(savedKey || current, video);

    approachPausedVideo = null;
    approachVideoWasPaused = false;

    cancelApproachPlaybackAnimation();

    setApproachVideoTransition(video, 5200);
    video.style.filter = "blur(0) brightness(1)";
    video.style.transform = "scale(1)";
    clearClientVideoStillOverlayDim();

    if (wasPausedBeforeOverlay || wasEndedBeforeOverlay) {
      safelySetPlaybackRate(video, 1);
      if (resumeClientKey && !wasEndedBeforeOverlay) {
        fadeOverlayAudioIn(video, targetVolume);
      }
      clearApproachResumeState();
      return;
    }

    if (resumeClientKey) {
      const config = clientVideoSourceConfig[resumeClientKey];

      clearClientDesktopHlsFallbackTimer(resumeClientKey);

      if (config) {
        config.autoplayAfterSourceReady = true;
        config.suppressLoading = true;
        config.playbackReady = true;
      }

      safelySetMuted(video, false);
      safelySetVolume(video, 0);

      if (useMobileOverlayPauseMode()) {
        // On mobile, do not fake a slow ramp with playbackRate. It can run the
        // video ahead underneath the overlay. Resume cleanly, then let the visual
        // blur/focus transition and audio fade do the luxury work.
        safelySetPlaybackRate(video, 1);
        playVideoWithResumeRetries(video);
        fadeOverlayAudioIn(video, targetVolume);
        clearApproachResumeState();
        return;
      }

      safelySetPlaybackRate(video, 0.28);

      playVideoWithResumeRetries(video);
      fadeOverlayAudioIn(video, targetVolume);

      animatePlaybackRate(video, 0.28, 1, 3200, () => {
        safelySetPlaybackRate(video, 1);
      }, easeOutCubic);

      clearApproachResumeState();
      return;
    }

    if ((savedKey || current) === "main") {
      current = "main";

      const resumeTime = savedState && Number.isFinite(savedState.time)
        ? savedState.time
        : (Number.isFinite(video.currentTime) ? video.currentTime : 0);

      safelySetPlaybackRate(video, 1);
      safelySetMuted(video, savedState ? Boolean(savedState.wasMuted) : true);

      if (savedState && typeof savedState.startVolume === "number") {
        safelySetVolume(video, Math.max(0, Math.min(1, savedState.startVolume)));
      }

      // The homepage reel source is already loaded. Do not prepare, reload,
      // or reset it here: Approach must resume the same frame/time.
      if (
        Number.isFinite(resumeTime) &&
        Math.abs((video.currentTime || 0) - resumeTime) > 0.35
      ) {
        try {
          video.currentTime = resumeTime;
        } catch (error) {}
      }

      if (!wasPausedBeforeOverlay && !wasEndedBeforeOverlay) {
        playVideoWithResumeRetries(video);
      }

      clearApproachResumeState();
      return;
    }

    const startRate = 0.34;

    if (useMobileOverlayPauseMode()) {
      safelySetPlaybackRate(video, 1);

      if (video.paused && !video.ended) {
        playVideoWithResumeRetries(video);
      }

      clearApproachResumeState();
      return;
    }

    safelySetPlaybackRate(video, startRate);

    if (video.paused && !video.ended) {
      playVideoWithResumeRetries(video);
    }

    animatePlaybackRate(video, startRate, 1, 3000, () => {
      safelySetPlaybackRate(video, 1);
    }, easeOutCubic);

    clearApproachResumeState();
  }

  function fadeCurrentAudioToZero() {
    const video = getApproachResumeVideo();
    if (!video) return;

    const startVolume = Math.max(0, Math.min(1, video.volume || 0));
    const duration = useMobileOverlayPauseMode() ? 900 : 2200;
    const startTime = performance.now();

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    if (useMobileOverlayPauseMode()) {
      const quickMuteTimeout = setTimeout(() => {
        if (!isVideoOverlayOpen()) return;

        safelySetVolume(video, 0);
        safelySetMuted(video, true);
      }, 180);

      overlayVideoTimeouts.push(quickMuteTimeout);
    }

    if (startVolume <= 0.01) {
      safelySetVolume(video, 0);
      safelySetMuted(video, true);
      return;
    }

    function fade(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      safelySetVolume(video, startVolume * (1 - easedProgress));

      if (progress < 1 && isVideoOverlayOpen()) {
        audioFadeAnimation = requestAnimationFrame(fade);
      } else {
        safelySetVolume(video, 0);
        safelySetMuted(video, true);
        audioFadeAnimation = null;
      }
    }

    audioFadeAnimation = requestAnimationFrame(fade);
  }

  function fadeClientVideoAudioIn(video, key) {
    if (!video || !isClientVideoKey(key) || current !== key) return;

    const config = clientVideoSourceConfig[key];
    if (!config || config.hasCompleted || video.ended) return;

    fadeOverlayAudioIn(video, CLIENT_VIDEO_PLAYBACK_VOLUME);
  }

  function setApproachVideoTransition(video, duration) {
    video.style.transition =
      "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
      "filter " + duration + "ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform " + duration + "ms cubic-bezier(0.22, 1, 0.36, 1)";
  }

  function blurCurrentVideoForApproach() {
    const video = getApproachResumeVideo();

    dimClientVideoStillForOverlay();

    if (!video) return;

    setApproachVideoTransition(video, 5400);

    video.style.filter = "blur(7px) brightness(0.58)";
    video.style.transform = "scale(1.018)";
  }

  function clearApproachVideoBlur() {
    const video = getApproachResumeVideo();

    clearClientVideoStillOverlayDim();

    if (!video) return;

    setApproachVideoTransition(video, 5400);

    video.style.filter = "blur(0) brightness(1)";
    video.style.transform = "scale(1)";
  }

  function showVideo(target) {
    if (!videos[target]) return;

    const isOpeningClientVideo = isClientVideoKey(target);

    if (isOpeningClientVideo) {
      hideMainReelHolderForClientVideo();
    } else {
      showMainReelHolderForWebsiteVideo();
    }

    if (current === target) {
      if (isClientVideoKey(target)) {
        returnToMainWebsiteVideo();
      }

      return;
    }

    removeApproachFreezeFrameImmediately();
    cancelApproachPlaybackAnimation();

    Object.entries(videos).forEach(([key, video]) => {
      if (key !== target) {
        safelySetMuted(video, true);
        safelySetPlaybackRate(video, 1);

        if (isMobileClientVideoViewport() && isClientVideoKey(target)) {
          try {
            video.pause();
          } catch (error) {}
        }

        if (isClientVideoKey(key)) {
          resetClientVideoToStartFrame(video);
        }
      }
    });

    if (!isClientVideoKey(target) && !isApproachOpen && !isContactOpen) {
      showCenterNameAnimated(250);
    }

    if (videos[current]) {
      videos[current].style.opacity = "0";
      videos[current].style.filter = "blur(2px) brightness(1)";
      videos[current].style.transform = "scale(1.02)";
    }

    if (isClientVideoKey(target)) {
      hideMainReelHolderForClientVideo();
      prepareClientSourceForViewport(target);
    } else {
      hideClientVideoLoadingState();
      hideClientVideoCredit();
    }

    try {
      videos[target].currentTime = 0;
    } catch (error) {}

    if (isClientVideoKey(target)) {
      if (audioFadeAnimation) {
        cancelAnimationFrame(audioFadeAnimation);
      }

      safelySetMuted(videos[target], false);
      safelySetVolume(videos[target], CLIENT_VIDEO_PLAYBACK_VOLUME);
      videos[target].loop = false;
      videos[target].removeAttribute("loop");
    } else {
      safelySetMuted(videos[target], true);
    }

    videos[target].style.opacity = "1";

    if (isApproachOpen) {
      setApproachVideoTransition(videos[target], 5200);
      videos[target].style.filter = "blur(7px) brightness(0.62)";
      videos[target].style.transform = "scale(1.015)";
    } else {
      videos[target].style.filter = "blur(0) brightness(1)";
      videos[target].style.transform = "scale(1)";
    }

    if (isClientVideoKey(target)) {
      playClientVideoFromStart(videos[target]);
    } else {
      playVideo(videos[target]);
    }

    current = target;

    if (isApproachOpen) {
      const delayedSlowdown = setTimeout(() => {
        if (isApproachOpen) {
          slowCurrentVideoForApproach();
        }
      }, 1600);

      overlayVideoTimeouts.push(delayedSlowdown);
    }
  }

  function getSectionButtons(sectionName) {
    const buttons = [];

    getSectionPanels(sectionName).forEach((panel) => {
      panel.querySelectorAll(".nav-text").forEach((button) => {
        buttons.push(button);
      });
    });

    return buttons;
  }

  function getMedianRowGap(buttons) {
    const tops = buttons
      .map((button) => button.getBoundingClientRect().top)
      .sort((a, b) => a - b);

    const gaps = [];

    for (let i = 1; i < tops.length; i++) {
      const gap = tops[i] - tops[i - 1];

      if (gap > 4) {
        gaps.push(gap);
      }
    }

    if (!gaps.length) return 22;

    gaps.sort((a, b) => a - b);

    return gaps[Math.floor(gaps.length / 2)];
  }

  function buildLinkedRevealDelayMap(incomingSection, outgoingSection) {
    const delayMap = new Map();

    const stagger = 180;
    const visualGapRows = 2;

    const incomingButtons = getSectionButtons(incomingSection);
    const outgoingButtons = getSectionButtons(outgoingSection)
      .map((button) => {
        return {
          button: button,
          top: button.getBoundingClientRect().top
        };
      })
      .sort((a, b) => a.top - b.top);

    if (!incomingButtons.length || !outgoingButtons.length) {
      return delayMap;
    }

    const rowGap = getMedianRowGap(
      incomingButtons.concat(outgoingButtons.map((item) => item.button))
    );

    incomingButtons.forEach((incomingButton) => {
      const incomingTop = incomingButton.getBoundingClientRect().top;
      const targetOutgoingTop = incomingTop + (rowGap * visualGapRows);

      let outgoingIndex = outgoingButtons.findIndex((item) => {
        return item.top >= targetOutgoingTop;
      });

      if (outgoingIndex === -1) {
        const lastOutgoing = outgoingButtons[outgoingButtons.length - 1];
        const extraRowsPastLast = Math.ceil(
          Math.max(0, targetOutgoingTop - lastOutgoing.top) / rowGap
        );

        outgoingIndex =
          outgoingButtons.length - 1 + Math.max(1, extraRowsPastLast);
      }

      delayMap.set(incomingButton, outgoingIndex * stagger);
    });

    return delayMap;
  }

  function getApproachElements() {
    return document.querySelectorAll(
      ".approach-overlay, " +
      ".approach-ig-link, " +
      ".approach-container, " +
      ".approach-text, " +
      ".approach-copy"
    );
  }

  function getApproachTextElements() {
    return Array.from(
      document.querySelectorAll(".approach-text, .approach-copy")
    );
  }

  function prepareApproachLineRevealElement(element) {
    if (!element.dataset.approachOriginalHtml) {
      element.dataset.approachOriginalHtml = element.innerHTML;
    }

    element.innerHTML = element.dataset.approachOriginalHtml;

    const text = element.textContent.replace(/\s+/g, " ").trim();
    if (!text) return [];

    element.style.opacity = "1";
    element.style.visibility = "visible";
    element.style.pointerEvents = "auto";
    element.style.filter = "";
    element.style.transform = "";

    const words = text.split(" ");
    const measuringWords = [];

    element.innerHTML = "";

    words.forEach((word, index) => {
      const wordSpan = document.createElement("span");

      wordSpan.textContent = word + (index < words.length - 1 ? " " : "");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "pre";
      wordSpan.style.margin = "0";
      wordSpan.style.padding = "0";

      element.appendChild(wordSpan);
      measuringWords.push(wordSpan);
    });

    const lineGroups = [];

    measuringWords.forEach((wordSpan) => {
      const top = Math.round(wordSpan.offsetTop);

      let lineGroup = lineGroups.find((group) => {
        return Math.abs(group.top - top) <= 2;
      });

      if (!lineGroup) {
        lineGroup = {
          top: top,
          words: []
        };

        lineGroups.push(lineGroup);
      }

      lineGroup.words.push(wordSpan.textContent);
    });

    lineGroups.sort((a, b) => a.top - b.top);

    element.innerHTML = "";

    return lineGroups.map((group) => {
      const line = document.createElement("span");

      line.className = "approach-reveal-line";
      line.textContent = group.words.join("").trimEnd();

      line.style.display = "block";
      line.style.opacity = "0";
      line.style.visibility = "visible";
      line.style.pointerEvents = "auto";
      line.style.filter = "blur(6px)";
      line.style.transform = "";
      line.style.willChange = "opacity, filter";

      element.appendChild(line);

      return line;
    });
  }

  function getApproachHideItems() {
    const items = [];

    document.querySelectorAll(".approach-reveal-line").forEach((line) => {
      items.push(line);
    });

    if (!items.length) {
      document.querySelectorAll(".approach-text, .approach-copy").forEach((element) => {
        items.push(element);
      });
    }

    document.querySelectorAll(".approach-ig-link").forEach((element) => {
      items.push(element);
    });

    return items.sort((a, b) => {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
  }

  function revealApproachLinesStaggered() {
    clearApproachTimeouts();

    const textElements = getApproachTextElements();
    const igLinks = Array.from(document.querySelectorAll(".approach-ig-link"));

    const isMobileApproachFocus =
      (isMobileLayoutViewport() &&
        document.documentElement.classList.contains("dcr-mobile-approach-focus-active")) ||
      (isPhase2AMobileViewport() &&
        document.documentElement.classList.contains("dcr-phase2b-mobile-approach-active"));

    const textStartDelay = isMobileApproachFocus ? 1050 : 1550;
    const lineStagger = isMobileApproachFocus ? 145 : 170;
    const groupPause = isMobileApproachFocus ? 410 : 460;
    const fadeInDuration = isMobileApproachFocus ? 3400 : 3600;
    const luxuryEase = "cubic-bezier(0.22, 1, 0.36, 1)";

    let delay = textStartDelay;

    textElements.forEach((element) => {
      const lines = prepareApproachLineRevealElement(element);

      lines.forEach((line) => {
        const revealTimeout = setTimeout(() => {
          line.style.transition =
            "opacity " + fadeInDuration + "ms " + luxuryEase + ", " +
            "filter " + fadeInDuration + "ms " + luxuryEase;

          line.style.opacity = "1";
          line.style.filter = "blur(0)";
        }, delay);

        approachTimeouts.push(revealTimeout);

        delay += lineStagger;
      });

      delay += groupPause;
    });

    igLinks.forEach((igLink) => {
      igLink.style.transition = "none";
      igLink.style.opacity = "0";
      igLink.style.visibility = "visible";
      igLink.style.pointerEvents = "auto";
      igLink.style.filter = "blur(6px)";
      igLink.style.transform = "";

      const igRevealTimeout = setTimeout(() => {
        igLink.style.transition =
          "opacity " + fadeInDuration + "ms " + luxuryEase + ", " +
          "filter " + fadeInDuration + "ms " + luxuryEase;

        igLink.style.opacity = "1";
        igLink.style.filter = "blur(0)";

        const igSettleTimeout = setTimeout(() => {
          settleNavItemAfterArrival(igLink);
        }, fadeInDuration + 360);

        approachTimeouts.push(igSettleTimeout);
      }, delay + 360);

      approachTimeouts.push(igRevealTimeout);
    });
  }

  function hideApproachFinal(shouldResetButton) {
    isApproachOpen = false;

    const isMobileApproachReturn =
      isMobileLayoutViewport() &&
      (document.documentElement.classList.contains("dcr-mobile-approach-focus-active") ||
        mobileApproachFocusIsExiting);

    getApproachElements().forEach((element) => {
      element.style.display = "";
      element.style.transition = "none";
      element.style.opacity = "0";
      element.style.visibility = "hidden";
      element.style.pointerEvents = "none";
      element.style.filter = "";
      element.style.transform = "";
      element.style.clipPath = "";
      element.style.webkitClipPath = "";
    });

    exitMobileApproachFocus(0);

    if (shouldResetButton && activeMainNavButton === approachLink) {
      if (approachLink && !isMobileApproachReturn) {
        resetElement(approachLink);
      }

      activeMainNavButton = null;
    }
  }

  function hideApproachAnimated(shouldResetButton) {
    if (!isApproachOpen) return;

    clearApproachTimeouts();

    const items = getApproachHideItems();
    const isMobileApproachExit = isPhase2AMobileViewport() || isMobileLayoutViewport();

    const textFadeStartDelay = isMobileApproachExit ? 80 : 260;
    const staggerOut = isMobileApproachExit ? 65 : 145;
    const fadeOutDuration = isMobileApproachExit ? 1850 : 3400;
    const backgroundReturnDelay = isMobileApproachExit
      ? Math.min(2400, textFadeStartDelay + (Math.max(0, items.length - 1) * staggerOut) + 1500)
      : 150;
    const luxuryEase = "cubic-bezier(0.22, 1, 0.36, 1)";

    isApproachOpen = false;

    exitMobileApproachFocus(isPhase2AMobileViewport() ? 1200 : 5200);

    resumeApproachVideoPlayback();

    restoreCenterNameAfterApproachClose(1500);

    if (shouldResetButton && activeMainNavButton === approachLink) {
      const isMobileApproachReturn =
        isMobileLayoutViewport() &&
        (document.documentElement.classList.contains("dcr-mobile-approach-focus-active") ||
          mobileApproachFocusIsExiting);

      if (approachLink && !isMobileApproachReturn) {
        resetElement(approachLink);
      }

      activeMainNavButton = null;
    }

    document.querySelectorAll(".approach-overlay, .approach-container").forEach((element) => {
      element.style.pointerEvents = "none";
    });

    items.forEach((item) => {
      const currentOpacity = window.getComputedStyle(item).opacity;

      item.style.transition = "none";
      item.style.opacity = currentOpacity;
      item.style.visibility = "visible";
      item.style.pointerEvents = "none";
      item.style.filter = window.getComputedStyle(item).filter;
      item.style.transform = "";
    });

    items.forEach((item, index) => {
      const hideTimeout = setTimeout(() => {
        item.style.transition =
          "opacity " + fadeOutDuration + "ms " + luxuryEase + ", " +
          "filter " + fadeOutDuration + "ms " + luxuryEase;

        item.style.opacity = "0";
        item.style.filter = "blur(6px)";
      }, textFadeStartDelay + (index * staggerOut));

      approachTimeouts.push(hideTimeout);
    });

    const backgroundReturnTimeout = setTimeout(() => {
      clearApproachVideoBlur();
    }, backgroundReturnDelay);

    const finalHideTimeout = setTimeout(() => {
      hideApproachFinal(shouldResetButton);
    }, textFadeStartDelay + ((items.length - 1) * staggerOut) + fadeOutDuration + 80);

    approachTimeouts.push(backgroundReturnTimeout);
    approachTimeouts.push(finalHideTimeout);
  }

  function showApproachAnimated() {
    if (isContactOpen) return;

    hideClientVideoCreditForOverlay();
    hideProjectsGradient();
    hideCenterNameAnimated();

    clearApproachTimeouts();
    captureApproachResumeState();

    if (activeSection) {
      closeActiveSectionAnimated();
    } else {
      clearRevealTimeouts();
      activeProjectButton = null;
    }

    removeApproachFreezeFrameImmediately();
    fadeCurrentAudioToZero();

    isApproachOpen = true;
    activeSection = null;
    activeMainNavButton = approachLink;

    if (approachLink) {
      focusElement(approachLink);
    }

    enterMobileApproachFocus();

    blurCurrentVideoForApproach();
    slowCurrentVideoForApproach();

    getApproachElements().forEach((element) => {
      element.style.display = "";
      element.style.transition = "none";
      element.style.opacity = "1";
      element.style.visibility = "visible";
      element.style.pointerEvents = "auto";
      element.style.filter = "";
      element.style.transform = "";
      element.style.clipPath = "";
      element.style.webkitClipPath = "";
    });

    revealApproachLinesStaggered();
  }

  function hideApproachImmediate(shouldResetButton) {
    const wasOpen = isApproachOpen;

    if (!isApproachOpen && !document.querySelector(".approach-overlay")) return;

    clearApproachTimeouts();

    if (wasOpen) {
      clearApproachVideoBlur();
      resumeApproachVideoPlayback();
      restoreCenterNameAfterApproachClose(700);
    } else {
      removeApproachFreezeFrameImmediately();
      clearApproachResumeState();
    }

    hideApproachFinal(shouldResetButton);
  }

  function isApproachClickTarget(target) {
    if (!target || !target.closest) return false;

    const approachByAttribute = target.closest("[data-main-nav='approach']");
    if (approachByAttribute) return true;

    return approachLink && (target === approachLink || approachLink.contains(target));
  }

  function hideInactivePanelsWithoutBreakingLayout() {
    ["colour", "direction"].forEach((sectionName) => {
      if (activeSection === sectionName) return;

      getSectionPanels(sectionName).forEach((panel) => {
        panel.style.transition = "none";
        panel.style.opacity = "0";
        panel.style.visibility = "hidden";
        panel.style.pointerEvents = "none";

        panel.querySelectorAll(".nav-text, a").forEach((item) => {
          item.style.pointerEvents = "none";
        });
      });
    });
  }

  function showPanelWithoutBreakingLayout(panel) {
    panel.style.transition = "none";
    panel.style.opacity = "1";
    panel.style.visibility = "visible";
    panel.style.pointerEvents = "auto";

    panel.querySelectorAll(".nav-text, a").forEach((item) => {
      item.style.pointerEvents = "auto";
    });
  }

  function hidePanelWithoutBreakingLayout(panel) {
    panel.style.transition = "none";
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";

    panel.querySelectorAll(".nav-text, a").forEach((item) => {
      item.style.pointerEvents = "none";
    });
  }

  function revealProjectButtonsStaggered(panel, customDelayMap) {
    const buttons = Array.from(panel.querySelectorAll(".nav-text"));

    const staggerIn = 180;
    const fadeInDuration = 1750;
    const holdAfterEachIn = 125;
    const fadeDownDuration = 1800;
    const luxuryEase = "cubic-bezier(0.22, 1, 0.36, 1)";

    buttons.forEach((button) => {
      button.style.transition = "none";
      button.style.visibility = "visible";
      button.style.opacity = "0";
      button.style.filter = "blur(1.2px)";
      button.style.transform = "translate3d(10px, 0, 0) scale(0.996)";
      button.style.pointerEvents = "auto";
    });

    buttons.forEach((button, index) => {
      const startDelay = customDelayMap && customDelayMap.has(button)
        ? customDelayMap.get(button)
        : index * staggerIn;

      const fadeInTimeout = setTimeout(() => {
        button.style.transition =
          "opacity " + fadeInDuration + "ms " + luxuryEase + ", " +
          "filter " + fadeInDuration + "ms " + luxuryEase + ", " +
          "transform " + fadeInDuration + "ms " + luxuryEase;

        button.style.visibility = "visible";
        button.style.opacity = "1";
        button.style.filter = "blur(0)";
        button.style.transform =
          "translate3d(0, 0, 0) scale(1)";
      }, startDelay);

      const fadeDownTimeout = setTimeout(() => {
        if (activeProjectButton) return;

        button.style.transition =
          "opacity " + fadeDownDuration + "ms " + luxuryEase + ", " +
          "filter " + fadeDownDuration + "ms " + luxuryEase + ", " +
          "transform " + fadeDownDuration + "ms " + luxuryEase;

        button.style.opacity = "0.5";
        button.style.filter = "blur(0)";
        button.style.transform =
          "translate3d(0, 0, 0) scale(1)";
      }, startDelay + fadeInDuration + holdAfterEachIn);

      revealTimeouts.push(fadeInTimeout);
      revealTimeouts.push(fadeDownTimeout);
    });
  }

  function hideProjectButtonsStaggered(panel, sectionName) {
    panel.dataset.projectMenuTransitioning = "true";

    const buttons = Array.from(panel.querySelectorAll(".nav-text"));

    const staggerOut = 180;
    const fadeOutDuration = 1750;
    const outVisibleDistance = 10;
    const outTotalDistance = 34;
    const fadeOutMotionDuration = (outTotalDistance / outVisibleDistance) * fadeOutDuration;
    const luxuryEase = "cubic-bezier(0.22, 1, 0.36, 1)";

    showPanelWithoutBreakingLayout(panel);

    buttons.forEach((button) => {
      const currentOpacity = window.getComputedStyle(button).opacity;

      button.style.transition = "none";
      button.style.visibility = "visible";
      button.style.opacity = currentOpacity;
      button.style.filter = "blur(0)";
      button.style.transform = "translate3d(0, 0, 0) scale(1)";
      button.style.pointerEvents = "none";
    });

    buttons.forEach((button, index) => {
      const fadeOutTimeout = setTimeout(() => {
        button.style.transition =
          "opacity " + fadeOutDuration + "ms " + luxuryEase + ", " +
          "filter " + fadeOutDuration + "ms " + luxuryEase + ", " +
          "transform " + fadeOutMotionDuration + "ms linear";

        button.style.opacity = "0";
        button.style.filter = "blur(1.2px)";
        button.style.transform =
          "translate3d(" + outTotalDistance + "px, 0, 0) scale(0.996)";
      }, index * staggerOut);

      revealTimeouts.push(fadeOutTimeout);
    });

    const hidePanelTimeout = setTimeout(() => {
      delete panel.dataset.projectMenuTransitioning;

      if (activeSection === sectionName) return;

      hidePanelWithoutBreakingLayout(panel);
      forceInactiveProjectPanelsHidden();
    }, ((buttons.length - 1) * staggerOut) + fadeOutDuration + 50);

    revealTimeouts.push(hidePanelTimeout);
  }

  function revealSectionPanels(sectionName, customDelayMap) {
    getSectionPanels(sectionName).forEach((panel) => {
      showPanelWithoutBreakingLayout(panel);
      revealProjectButtonsStaggered(panel, customDelayMap);
    });

    forceInactiveProjectPanelsHidden();
  }

  function hideSectionPanelsImmediately(sectionName) {
    getSectionPanels(sectionName).forEach((panel) => {
      hidePanelWithoutBreakingLayout(panel);
    });
  }

  function showSection(sectionName) {
    if (isContactOpen) return;

    const wasApproachOpen = isApproachOpen;
    const preserveMobileClientVideo = shouldPreserveMobileClientVideoDuringProjectNav(sectionName);

    if (isApproachOpen) {
      hideApproachAnimated(true);
    } else {
      hideApproachImmediate(true);
    }

    const previousSection = activeSection;
    const navButton = getMainNavButton(sectionName);

    const isSwitchingBetweenProjectMenus =
      previousSection &&
      previousSection !== sectionName &&
      (previousSection === "colour" || previousSection === "direction") &&
      (sectionName === "colour" || sectionName === "direction");

    clearRevealTimeouts();

    if (!isSwitchingBetweenProjectMenus && !preserveMobileClientVideo) {
      fadeCurrentAudioToZero();
    }

    if (preserveMobileClientVideo) {
      preserveMobileClientVideoPlaybackDuringProjectNav(sectionName);
    }

    activeSection = sectionName;
    activeMainNavButton = navButton;

    if (isSwitchingBetweenProjectMenus) {
      getSectionPanels(previousSection).forEach((panel) => {
        panel.dataset.projectMenuTransitioning = "true";
        showPanelWithoutBreakingLayout(panel);

        panel.querySelectorAll(".nav-text, a").forEach((item) => {
          item.style.pointerEvents = "none";
        });
      });
    }

    showProjectsGradient({ peak: !isSwitchingBetweenProjectMenus });

    clearProjectFocus();
    forceInactiveProjectPanelsHidden();

    if (navButton) {
      focusElement(navButton);
    }

    const linkedRevealDelayMap = isSwitchingBetweenProjectMenus
      ? buildLinkedRevealDelayMap(sectionName, previousSection)
      : null;

    if (previousSection && previousSection !== sectionName) {
      getSectionPanels(previousSection).forEach((panel) => {
        hideProjectButtonsStaggered(panel, previousSection);
      });
    }

    ["colour", "direction"].forEach((otherSection) => {
      if (otherSection === sectionName) return;
      if (otherSection === previousSection) return;

      getSectionPanels(otherSection).forEach((panel) => {
        hidePanelWithoutBreakingLayout(panel);
      });
    });

    function revealChosenSectionPanels() {
      if (activeSection !== sectionName || isContactOpen) return;

      if (isSwitchingBetweenProjectMenus) {
        hideSectionPanelsImmediately(sectionName);
        revealSectionPanels(sectionName, linkedRevealDelayMap);
      } else {
        revealSectionPanels(sectionName);
      }

      setTimeout(() => {
        forceInactiveProjectPanelsHidden();
      }, 80);

      setTimeout(() => {
        forceInactiveProjectPanelsHidden();
        preserveMobileClientVideoPlaybackDuringProjectNav(sectionName);
      }, 600);
    }

    if (wasApproachOpen) {
      hideSectionPanelsImmediately(sectionName);

      const approachToProjectRevealDelay = 1750;

      const delayedRevealTimeout = setTimeout(() => {
        revealChosenSectionPanels();
      }, approachToProjectRevealDelay);

      revealTimeouts.push(delayedRevealTimeout);
    } else {
      revealChosenSectionPanels();
    }
  }

  function closeActiveSectionAnimated() {
    if (!activeSection) return;

    const sectionToClose = activeSection;
    const navButton = getMainNavButton(sectionToClose);

    activeSection = null;
    activeMainNavButton = null;
    activeProjectButton = null;

    hideProjectsGradient();

    clearRevealTimeouts();

    if (navButton) {
      resetElement(navButton);
    }

    getElementsToDim().forEach((element) => {
      if (!isProjectButton(element)) {
        resetElement(element);
      }
    });

    getSectionPanels(sectionToClose).forEach((panel) => {
      hideProjectButtonsStaggered(panel, sectionToClose);
    });
  }

  function toggleSection(sectionName) {
    if (isContactOpen) return;

    if (activeSection === sectionName) {
      closeActiveSectionAnimated();
      return;
    }

    showSection(sectionName);
  }

  function toggleApproach() {
    if (isContactOpen) return;

    if (isApproachOpen) {
      hideApproachAnimated(true);
      return;
    }

    showApproachAnimated();
  }

  function installRefinedContactPanelStyles() {
    if (document.getElementById("dcr-refined-contact-panel-styles")) return;

    const style = document.createElement("style");
    style.id = "dcr-refined-contact-panel-styles";
    style.textContent = `
      @keyframes dcrContactGlassSweep {
        0% {
          opacity: 0;
          transform: translateX(-135%) skewX(-14deg);
        }

        18% {
          opacity: 0.34;
        }

        58% {
          opacity: 0.18;
        }

        100% {
          opacity: 0;
          transform: translateX(135%) skewX(-14deg);
        }
      }

      .contact-overlay.dcr-contact-pass-through {
        pointer-events: none !important;
      }

      .contact-overlay.dcr-contact-pass-through .contact-modal {
        pointer-events: auto !important;
      }

      .contact-modal.dcr-refined-contact-modal {
        width: min(300px, calc(100vw - 52px)) !important;
        min-height: 142px !important;
        height: auto !important;
        padding: 42px 44px 40px !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        text-align: center !important;
      }

      .contact-modal.dcr-refined-contact-modal::after {
        content: "" !important;
        position: absolute !important;
        inset: -2px !important;
        pointer-events: none !important;
        z-index: 1 !important;
        opacity: 0 !important;
        background:
          linear-gradient(
            112deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 38%,
            rgba(255, 255, 255, 0.085) 48%,
            rgba(255, 255, 255, 0.026) 54%,
            rgba(255, 255, 255, 0) 66%,
            rgba(255, 255, 255, 0) 100%
          ) !important;
        transform: translateX(-135%) skewX(-14deg);
      }

      .contact-modal.dcr-refined-contact-modal.dcr-contact-revealing::after {
        animation: dcrContactGlassSweep 3600ms cubic-bezier(0.16, 1, 0.3, 1) 900ms 1 both !important;
      }

      .contact-modal.dcr-refined-contact-modal .dcr-contact-actions {
        position: relative !important;
        z-index: 2 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 22px !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        text-align: center !important;
      }

      .contact-modal.dcr-refined-contact-modal .dcr-contact-action {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        color: rgba(255, 255, 255, 0.68) !important;
        font-family: inherit, "Helvetica Neue", Helvetica, Arial, sans-serif !important;
        font-size: clamp(11px, 0.9vw, 13px) !important;
        line-height: 1.1 !important;
        letter-spacing: 0.29em !important;
        text-transform: uppercase !important;
        text-decoration: none !important;
        font-weight: 400 !important;
        white-space: nowrap !important;
        cursor: pointer !important;
        opacity: 0.5 !important;
        filter: blur(0) !important;
        transform: scale(1) !important;
        transition:
          opacity 950ms cubic-bezier(0.22, 1, 0.36, 1),
          color 950ms cubic-bezier(0.22, 1, 0.36, 1),
          filter 1150ms cubic-bezier(0.22, 1, 0.36, 1),
          transform 1150ms cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      @media (hover: hover) and (pointer: fine) {
        .contact-modal.dcr-refined-contact-modal .dcr-contact-actions:hover .dcr-contact-action {
          opacity: 0.42 !important;
          filter: blur(1.4px) !important;
          transform: scale(0.994) !important;
        }

        .contact-modal.dcr-refined-contact-modal .dcr-contact-actions:hover .dcr-contact-action:hover,
        .contact-modal.dcr-refined-contact-modal .dcr-contact-actions:hover .dcr-contact-action:focus-visible {
          opacity: 1 !important;
          color: rgba(255, 255, 255, 0.96) !important;
          filter: blur(0) !important;
          transform: scale(1) !important;
        }
      }

      .contact-modal.dcr-refined-contact-modal .dcr-contact-action:active,
      .contact-modal.dcr-refined-contact-modal .dcr-contact-action.dcr-contact-action-active {
        opacity: 1 !important;
        color: rgba(255, 255, 255, 1) !important;
        filter: blur(0) !important;
        transform: none !important;
      }

      .contact-modal.dcr-refined-contact-modal .dcr-contact-action:focus {
        outline: none !important;
      }

      .contact-modal.dcr-refined-contact-modal .dcr-contact-action:focus-visible {
        opacity: 1 !important;
        color: rgba(255, 255, 255, 0.96) !important;
        filter: blur(0) !important;
      }

      .contact-modal.dcr-refined-contact-modal.dcr-contact-open .dcr-contact-action {
        pointer-events: auto !important;
      }

      .contact-modal.dcr-refined-contact-modal [data-contact-close],
      .contact-modal.dcr-refined-contact-modal .exit-contact,
      .contact-modal.dcr-refined-contact-modal .Exit-Contact,
      .contact-modal.dcr-refined-contact-modal .contact-close,
      .contact-modal.dcr-refined-contact-modal .close-contact {
        position: absolute !important;
        top: 19px !important;
        right: 19px !important;
        z-index: 3 !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        color: rgba(255, 255, 255, 0.48) !important;
        opacity: 0.58 !important;
        transition:
          opacity 1050ms cubic-bezier(0.22, 1, 0.36, 1),
          color 1050ms cubic-bezier(0.22, 1, 0.36, 1),
          filter 1050ms cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      .contact-modal.dcr-refined-contact-modal [data-contact-close]:hover,
      .contact-modal.dcr-refined-contact-modal .exit-contact:hover,
      .contact-modal.dcr-refined-contact-modal .Exit-Contact:hover,
      .contact-modal.dcr-refined-contact-modal .contact-close:hover,
      .contact-modal.dcr-refined-contact-modal .close-contact:hover {
        color: rgba(255, 255, 255, 0.92) !important;
        opacity: 1 !important;
        filter: blur(0) !important;
      }

      @media (max-width: 1024px) {
        .contact-modal.dcr-refined-contact-modal {
          width: min(286px, calc(100vw - 44px)) !important;
          min-height: 134px !important;
          padding: 40px 40px 38px !important;
        }

        .contact-modal.dcr-refined-contact-modal .dcr-contact-actions {
          gap: 21px !important;
        }

        .contact-modal.dcr-refined-contact-modal .dcr-contact-action {
          color: rgba(255, 255, 255, 0.72) !important;
          opacity: 0.9 !important;
          filter: blur(0) !important;
          font-size: 11px !important;
          letter-spacing: 0.28em !important;
          transform: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function getContactCloseCandidate(modal) {
    if (!modal) return null;

    return (
      modal.querySelector("[data-contact-close]") ||
      modal.querySelector(".exit-contact") ||
      modal.querySelector(".Exit-Contact") ||
      modal.querySelector(".contact-close") ||
      modal.querySelector(".close-contact") ||
      modal.querySelector("[class*='Exit']") ||
      modal.querySelector("[class*='exit']") ||
      modal.querySelector("[class*='Close']") ||
      modal.querySelector("[class*='close']")
    );
  }

  function buildRefinedContactPanel(modal) {
    if (!modal || modal.getAttribute("data-dcr-refined-contact-ready") === "true") return;

    installRefinedContactPanelStyles();

    const existingClose = getContactCloseCandidate(modal);
    const closeButton = existingClose || document.createElement("button");

    if (!existingClose) {
      closeButton.type = "button";
      closeButton.className = "Exit-Contact";
      closeButton.textContent = "×";
    }

    closeButton.setAttribute("data-contact-close", "");
    closeButton.setAttribute("aria-label", "Close contact");

    while (modal.firstChild) {
      modal.removeChild(modal.firstChild);
    }

    const actions = document.createElement("div");
    actions.className = "dcr-contact-actions";
    actions.style.display = "flex";
    actions.style.flexDirection = "column";
    actions.style.alignItems = "center";
    actions.style.justifyContent = "center";
    actions.style.gap = isMobileClientVideoViewport() ? "21px" : "22px";
    actions.style.width = "100%";
    actions.style.textAlign = "center";

    const emailLink = document.createElement("a");
    emailLink.className = "dcr-contact-action";
    emailLink.href = CONTACT_MAILTO_URL;
    emailLink.target = "_self";
    emailLink.textContent = "EMAIL";
    emailLink.setAttribute("data-contact-email-link", "");
    emailLink.setAttribute("aria-label", "Email David C. Rose");
    emailLink.setAttribute("title", CONTACT_EMAIL_ADDRESS);

    emailLink.addEventListener("click", () => {
      const originalText = emailLink.textContent;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CONTACT_EMAIL_ADDRESS).then(() => {
          emailLink.textContent = "COPIED";

          setTimeout(() => {
            emailLink.textContent = originalText;
          }, 1400);
        }).catch(() => {});
      }

      // Do not prevent the native mailto link. This delayed assignment is only
      // a desktop fallback if the browser fails to hand the native anchor to Mail.
      setTimeout(() => {
        try {
          window.location.href = CONTACT_MAILTO_URL;
        } catch (error) {}
      }, 80);
    });

    const instagramLink = document.createElement("a");
    instagramLink.className = "dcr-contact-action";
    instagramLink.href = CONTACT_INSTAGRAM_URL;
    instagramLink.target = "_blank";
    instagramLink.rel = "noopener noreferrer";
    instagramLink.setAttribute("data-instagram-link", "");
    instagramLink.setAttribute("aria-label", "Open Instagram");
    instagramLink.textContent = "INSTAGRAM";

    [emailLink, instagramLink].forEach((link) => {
      link.style.display = "block";
      link.style.textAlign = "center";
      link.style.transform = "none";
      link.style.filter = "blur(0)";
    });

    [emailLink, instagramLink].forEach((link) => {
      link.addEventListener("pointerdown", () => {
        link.classList.add("dcr-contact-action-active");
      });

      ["pointerup", "pointercancel", "mouseleave", "blur"].forEach((eventName) => {
        link.addEventListener(eventName, () => {
          link.classList.remove("dcr-contact-action-active");
        });
      });
    });

    actions.appendChild(emailLink);
    actions.appendChild(instagramLink);

    modal.appendChild(closeButton);
    modal.appendChild(actions);
    modal.classList.add("dcr-refined-contact-modal");
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.textAlign = "center";
    modal.setAttribute("data-dcr-refined-contact-ready", "true");
  }

  function prepareRefinedContactPanel() {
    installRefinedContactPanelStyles();

    const overlay = document.querySelector(".contact-overlay");
    const modal = document.querySelector(".contact-modal");

    if (modal) {
      buildRefinedContactPanel(modal);
    }

    if (overlay && overlay.getAttribute("data-dcr-refined-contact-overlay-bound") !== "true") {
      overlay.setAttribute("data-dcr-refined-contact-overlay-bound", "true");

      overlay.addEventListener("click", (event) => {
        if (!isContactOpen || !contactLink) return;

        const modal = getContactModal();

        if (modal && modal.contains(event.target)) return;

        const rect = contactLink.getBoundingClientRect();
        const pad = 18;
        const clickedContactZone =
          event.clientX >= rect.left - pad &&
          event.clientX <= rect.right + pad &&
          event.clientY >= rect.top - pad &&
          event.clientY <= rect.bottom + pad;

        if (!clickedContactZone) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        hideContactAnimated();
      }, true);
    }
  }

  function getCurrentVisibleVideoForContact() {
    const currentVideo = videos[current];

    if (currentVideo) return currentVideo;

    const videoList = Object.values(videos).filter(Boolean);

    return videoList.find((video) => {
      const computed = window.getComputedStyle(video);
      const opacity = parseFloat(video.style.opacity || computed.opacity || "0");

      return opacity > 0.2 && computed.display !== "none" && computed.visibility !== "hidden";
    }) || null;
  }

  function captureContactVideoState() {
    const video = getCurrentVisibleVideoForContact();
    const isMobileContactMode = isMobileLayoutViewport();

    contactVideoState = null;

    if (!video) return;

    const state = {
      video,
      key: getApproachResumeKey(video) || current,
      wasPaused: video.paused,
      wasEnded: video.ended,
      startTime: Number.isFinite(video.currentTime) ? video.currentTime : 0,
      lockedTime: Number.isFinite(video.currentTime) ? video.currentTime : 0,
      playbackRate: video.playbackRate || 1,
      volume: typeof video.volume === "number" ? video.volume : 0,
      muted: Boolean(video.muted),
      filter: video.style.filter || "",
      transform: video.style.transform || "",
      transition: video.style.transition || "",
      mode: isMobileContactMode ? "mobile" : "desktop",
      freezeTimeout: null
    };

    contactVideoState = state;

    cancelApproachPlaybackAnimation();
    clearOverlayVideoTimeouts();
    clearClientVideoStillOverlayDim();

    safelySetPlaybackRate(video, 1);

    if (state.wasPaused || state.wasEnded) {
      state.lockedTime = Number.isFinite(video.currentTime) ? video.currentTime : state.startTime;
      return;
    }

    if (isMobileContactMode) {
      try {
        video.pause();
      } catch (error) {}

      state.lockedTime = Number.isFinite(video.currentTime) ? video.currentTime : state.startTime;
      safelySetPlaybackRate(video, 1);

      video.style.transition = state.transition;
      video.style.filter = state.filter;
      video.style.transform = state.transform;
      return;
    }

    // Desktop: keep the premium slow-down, but isolate it from the Approach
    // resume code so it cannot restart or swap video source on close.
    animatePlaybackRate(video, Math.max(0.25, Math.min(1, video.playbackRate || 1)), 0.24, 3600, () => {
      if (!contactVideoState || contactVideoState.video !== video || !isContactOpen) return;

      try {
        video.pause();
      } catch (error) {}

      state.lockedTime = Number.isFinite(video.currentTime) ? video.currentTime : state.startTime;
      safelySetPlaybackRate(video, 1);
    }, approachSlowdownEase);

    const freezeTimeout = setTimeout(() => {
      if (!contactVideoState || contactVideoState.video !== video || !isContactOpen) return;

      try {
        video.pause();
      } catch (error) {}

      state.lockedTime = Number.isFinite(video.currentTime) ? video.currentTime : state.startTime;
      safelySetPlaybackRate(video, 1);
    }, 4300);

    state.freezeTimeout = freezeTimeout;
    contactTimeouts.push(freezeTimeout);
  }


  function restoreContactVideoAfterContact() {
    const savedState = contactVideoState;

    contactVideoState = null;

    if (!savedState || !savedState.video) return;

    const video = savedState.video;

    if (savedState.freezeTimeout) {
      clearTimeout(savedState.freezeTimeout);
    }

    cancelApproachPlaybackAnimation();
    clearOverlayVideoTimeouts();
    clearClientVideoStillOverlayDim();

    video.style.transition = savedState.transition;
    video.style.filter = savedState.filter;
    video.style.transform = savedState.transform;

    safelySetPlaybackRate(video, 1);
    safelySetMuted(video, savedState.muted);

    if (typeof savedState.volume === "number") {
      safelySetVolume(video, savedState.volume);
    }

    const resumeTime = Number.isFinite(savedState.lockedTime)
      ? savedState.lockedTime
      : savedState.startTime;

    if (Number.isFinite(resumeTime) && Math.abs((video.currentTime || 0) - resumeTime) > 0.65) {
      try {
        video.currentTime = resumeTime;
      } catch (error) {}
    }

    if (!savedState.wasPaused && !savedState.wasEnded) {
      playVideoWithResumeRetries(video);
    }
  }

  function refreezeContactVideoIfNeeded() {
    const savedState = contactVideoState;

    if (!isContactOpen || !savedState || !savedState.video) return;

    const video = savedState.video;
    const lockedTime = Number.isFinite(savedState.lockedTime)
      ? savedState.lockedTime
      : (Number.isFinite(video.currentTime) ? video.currentTime : savedState.startTime);

    try {
      if (Math.abs((video.currentTime || 0) - lockedTime) > 0.35) {
        video.currentTime = lockedTime;
      }

      video.pause();
    } catch (error) {}

    savedState.lockedTime = lockedTime;
    safelySetPlaybackRate(video, 1);
  }


  function getContactOverlay() {
    return document.querySelector(".contact-overlay");
  }

  function getContactModal() {
    return document.querySelector(".contact-modal");
  }

  function getContactCloseButton() {
    return (
      document.querySelector("[data-contact-close]") ||
      document.querySelector(".exit-contact") ||
      document.querySelector(".Exit-Contact") ||
      document.querySelector(".contact-close") ||
      document.querySelector(".close-contact") ||
      document.querySelector(".contact-modal [class*='Exit']") ||
      document.querySelector(".contact-modal [class*='exit']") ||
      document.querySelector(".contact-modal [class*='Close']") ||
      document.querySelector(".contact-modal [class*='close']")
    );
  }

  function prepareContactHidden() {
    prepareRefinedContactPanel();

    const overlay = getContactOverlay();
    const modal = getContactModal();
    const closeButton = getContactCloseButton();

    if (overlay) {
      overlay.classList.remove("dcr-contact-pass-through");
      overlay.style.transition = "none";
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      overlay.style.pointerEvents = "none";
    }

    if (modal) {
      modal.style.transformOrigin = "50% 50%";
      modal.style.transition = "none";
      modal.style.opacity = "0";
      modal.style.filter = "blur(10px)";
      modal.style.transform = "scale(0.965)";
      modal.style.pointerEvents = "none";
    }

    if (closeButton) {
      closeButton.style.cursor = "pointer";
      closeButton.style.pointerEvents = "auto";
    }
  }

  function keepContactNavActive() {
    if (!contactLink) return;

    contactLink.style.transition =
      "opacity 1800ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 2200ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 2200ms cubic-bezier(0.22, 1, 0.36, 1)";

    contactLink.style.opacity = "1";
    contactLink.style.filter = "blur(0)";
    contactLink.style.transform = "scale(1)";
    contactLink.style.pointerEvents = "auto";
    contactLink.style.position = contactLink.style.position || "relative";
    contactLink.style.zIndex = "120";
  }

  function softenNavForContact() {
    getLeftNavButtons().forEach((button) => {
      if (button === contactLink) {
        keepContactNavActive();
        return;
      }

      button.style.transition =
        "opacity 4200ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "filter 5200ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "transform 5200ms cubic-bezier(0.22, 1, 0.36, 1)";

      button.style.opacity = "0.34";
      button.style.filter = "blur(2.2px)";
      button.style.transform = "scale(0.992)";
      button.style.pointerEvents = "none";
    });
  }

  function restoreNavAfterContact() {
    activeMainNavButton = null;
    activeProjectButton = null;

    getLeftNavButtons().forEach((button) => {
      resetElement(button);
      button.style.pointerEvents = "";

      if (button === contactLink) {
        button.style.zIndex = "";
      }
    });
  }

  function showContactAnimated() {
    prepareRefinedContactPanel();

    const overlay = getContactOverlay();
    const modal = getContactModal();
    const closeButton = getContactCloseButton();

    if (!overlay || !modal) return;

    hideClientVideoCreditForOverlay();
    clearContactTimeouts();

    if (isApproachOpen) {
      hideApproachAnimated(true);
    }

    if (activeSection) {
      closeActiveSectionAnimated();
    }

    const useMobileContactMode = isMobileLayoutViewport();

    captureContactVideoState();

    isContactOpen = true;

    hideProjectsGradient();
    hideCenterNameAnimated();
    softenNavForContact();

    if (useMobileContactMode) {
      clearApproachVideoBlur();
    } else {
      blurCurrentVideoForApproach();
      fadeCurrentAudioToZero();
    }
    activeSection = null;
    activeProjectButton = null;
    activeMainNavButton = contactLink || null;

    const emailRevealItem = modal.querySelector("[data-contact-email-link]");
    const instagramRevealItem = modal.querySelector("[data-instagram-link]");
    const closeRevealItem = getContactCloseButton();

    const modalRevealItems = [
      emailRevealItem,
      instagramRevealItem,
      closeRevealItem
    ].filter(Boolean);

    modalRevealItems.forEach((item) => {
      item.style.transition = "none";
      item.style.transitionDelay = "0ms";
      item.style.opacity = "0";
      item.style.filter = "blur(0)";
      item.style.transform = "none";
      item.style.visibility = "hidden";
      item.style.pointerEvents = "auto";
    });

    overlay.style.display = "";
    overlay.style.transition = "none";
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
    overlay.classList.remove("dcr-contact-pass-through");
    overlay.style.pointerEvents = "auto";

    modal.style.display = "";
    modal.style.transformOrigin = "50% 50%";
    modal.style.transition = "none";
    modal.style.visibility = "visible";
    modal.style.setProperty("opacity", "0", "important");
    modal.classList.remove("dcr-contact-open");
    modal.classList.add("dcr-contact-opening");

    /* Build the glass deliberately slowly: background settles first,
       the pane forms, then EMAIL, INSTAGRAM, and the close mark arrive in order. */
    modal.style.setProperty("background-color", "rgba(255, 255, 255, 0)", "important");
    modal.style.setProperty("border-color", "rgba(255, 255, 255, 0)", "important");
    modal.style.setProperty("backdrop-filter", "blur(0px)", "important");
    modal.style.setProperty("-webkit-backdrop-filter", "blur(0px)", "important");
    modal.style.filter = "blur(0)";
    modal.classList.remove("dcr-contact-revealing");
    void modal.offsetWidth;
    modal.classList.add("dcr-contact-revealing");
    modal.style.setProperty("transform", "scale(0.955)", "important");
    modal.style.setProperty("box-shadow", "0 0 0 rgba(0, 0, 0, 0)", "important");
    modal.style.willChange = "opacity, background-color, border-color, backdrop-filter, transform, box-shadow";
    modal.style.backfaceVisibility = "hidden";
    modal.style.webkitBackfaceVisibility = "hidden";
    modal.style.pointerEvents = "auto";

    if (closeButton) {
      closeButton.style.cursor = "pointer";
      closeButton.style.pointerEvents = "auto";
    }

    modal.getBoundingClientRect();

    const revealTimeout = setTimeout(() => {
      modal.style.transition =
        "opacity 3200ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "background-color 5200ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "border-color 5400ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "backdrop-filter 5800ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "-webkit-backdrop-filter 5800ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "box-shadow 6200ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "transform 6800ms cubic-bezier(0.13, 1, 0.22, 1)";

      modal.style.setProperty("opacity", "1", "important");
      modal.style.setProperty("background-color", "rgba(255, 255, 255, 0.08)", "important");
      modal.style.setProperty("border-color", "rgba(255, 255, 255, 0.15)", "important");
      modal.style.setProperty("backdrop-filter", "blur(12px)", "important");
      modal.style.setProperty("-webkit-backdrop-filter", "blur(12px)", "important");
      modal.style.setProperty("box-shadow", "0 24px 90px rgba(0, 0, 0, 0.18)", "important");
      modal.style.setProperty("transform", "scale(1)", "important");

      modalRevealItems.forEach((item, index) => {
        const revealDelays = [1700, 2600, 3950];

        item.style.transition =
          "opacity 2300ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "filter 1800ms cubic-bezier(0.16, 1, 0.3, 1)";

        item.style.transitionDelay = (revealDelays[index] || 3950) + "ms";
        item.style.visibility = "visible";
        item.style.opacity = "1";
        item.style.filter = "blur(0)";
        item.style.transform = "none";

        const pointerTimeout = setTimeout(() => {
          item.style.pointerEvents = "auto";
        }, revealDelays[index] || 3950);

        contactTimeouts.push(pointerTimeout);
      });

      keepContactNavActive();
    }, 420);

    const revealClassTimeout = setTimeout(() => {
      modal.classList.remove("dcr-contact-revealing");
      modal.classList.remove("dcr-contact-opening");
      modal.classList.add("dcr-contact-open");

      modalRevealItems.forEach((item) => {
        item.style.pointerEvents = "auto";
      });

      keepContactNavActive();
    }, 5600);

    contactTimeouts.push(revealTimeout, revealClassTimeout);
  }

  function hideContactAnimated() {
    const overlay = getContactOverlay();
    const modal = getContactModal();

    if (!overlay || !modal) return;

    clearContactTimeouts();
    clearApproachTimeouts();

    const hasContactVideoState = Boolean(contactVideoState);

    isContactOpen = false;

    if (hasContactVideoState) {
      restoreContactVideoAfterContact();
      restoreCenterNameAfterApproachClose(600);
    } else {
      resumeApproachVideoPlayback();
      restoreCenterNameAfterApproachClose(600);
    }

    modal.classList.remove("dcr-contact-revealing");

    modal.classList.remove("dcr-contact-opening");
    modal.classList.remove("dcr-contact-open");

    const emailRevealItem = modal.querySelector("[data-contact-email-link]");
    const instagramRevealItem = modal.querySelector("[data-instagram-link]");
    const closeRevealItem = getContactCloseButton();

    const modalRevealItems = [
      closeRevealItem,
      instagramRevealItem,
      emailRevealItem
    ].filter(Boolean);

    /* Exit composite fade:
       Keep the glass fully formed, then fade the entire modal as one object.
       This avoids the empty transparent rectangle caused by fading the contents
       and backdrop-filter separately. */
    modalRevealItems.forEach((item, index) => {
      item.style.transitionDelay = (index * 80) + "ms";
      item.style.transition =
        "opacity 900ms cubic-bezier(0.66, 0, 0.2, 1), " +
        "filter 900ms cubic-bezier(0.66, 0, 0.2, 1)";
      item.style.opacity = "0";
      item.style.filter = "blur(0)";
      item.style.transform = "none";
      item.style.pointerEvents = "none";
    });

    modal.style.transition =
      "opacity 1650ms cubic-bezier(0.66, 0, 0.2, 1), " +
      "background-color 1650ms cubic-bezier(0.66, 0, 0.2, 1), " +
      "border-color 1650ms cubic-bezier(0.66, 0, 0.2, 1), " +
      "backdrop-filter 1850ms cubic-bezier(0.66, 0, 0.2, 1), " +
      "-webkit-backdrop-filter 1850ms cubic-bezier(0.66, 0, 0.2, 1), " +
      "filter 1650ms cubic-bezier(0.66, 0, 0.2, 1), " +
      "transform 1850ms cubic-bezier(0.66, 0, 0.2, 1)";

    modal.style.opacity = "0";
    modal.style.backgroundColor = "rgba(255, 255, 255, 0)";
    modal.style.borderColor = "rgba(255, 255, 255, 0)";
    modal.style.backdropFilter = "blur(0px)";
    modal.style.webkitBackdropFilter = "blur(0px)";
    modal.style.filter = "blur(0)";
    modal.style.transform = "scale(0.976)";
    modal.style.pointerEvents = "none";

    overlay.classList.remove("dcr-contact-pass-through");
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "none";
    overlay.style.opacity = "1";

    const backgroundReturnTimeout = setTimeout(() => {
      clearApproachVideoBlur();
    }, 150);

    const restoreNavTimeout = setTimeout(() => {
      restoreNavAfterContact();
    }, 550);

    const finalHideTimeout = setTimeout(() => {
      overlay.classList.remove("dcr-contact-pass-through");
      overlay.style.visibility = "hidden";
      overlay.style.pointerEvents = "none";
      overlay.style.opacity = "0";

      modal.style.visibility = "hidden";
      modal.style.pointerEvents = "none";
      modal.style.removeProperty("opacity");
      modal.style.setProperty("opacity", "0", "important");
      modal.classList.remove("dcr-contact-revealing");
      modal.classList.remove("dcr-contact-opening");
      modal.classList.remove("dcr-contact-open");

      restoreNavAfterContact();
    }, 2650);

    contactTimeouts.push(backgroundReturnTimeout);
    contactTimeouts.push(restoreNavTimeout);
    contactTimeouts.push(finalHideTimeout);
  }

  function hideContactImmediate() {
    const overlay = getContactOverlay();
    const modal = getContactModal();
    const wasOpen = isContactOpen;

    clearApproachTimeouts();
    isContactOpen = false;

    if (wasOpen && contactVideoState) {
      restoreContactVideoAfterContact();
      restoreCenterNameAfterApproachClose(700);
    } else if (wasOpen) {
      clearApproachVideoBlur();
      resumeApproachVideoPlayback();
      restoreCenterNameAfterApproachClose(700);
    } else {
      clearApproachVideoBlur();
      clearApproachResumeState();
      contactVideoState = null;
    }

    if (overlay) {
      overlay.style.transition = "none";
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      overlay.style.pointerEvents = "none";
    }

    if (modal) {
      modal.style.transition = "none";
      modal.style.opacity = "0";
      modal.style.filter = "blur(10px)";
      modal.style.transform = "scale(0.965)";
      modal.style.pointerEvents = "none";
    }
  }

  if (videos.main) {
    videos.main.addEventListener("canplay", () => {
      const placeholder = document.querySelector(".video-placeholder");
      if (placeholder) {
        placeholder.style.transition = "opacity 0.5s ease";
        placeholder.style.opacity = "0";
      }
    });
  }

  const commercialLink = document.querySelector("[data-link='commercial']");
  const narrativeLink = document.querySelector("[data-link='narrative']");
  const tomFordLink = document.querySelector("[data-link='tom-ford']");
  const mrPorterLink = document.querySelector("[data-link='mr-porter']");
  const christiesSpringSeason25Link = document.querySelector("[data-link='christies-spring-season-25']");
  const vogueBicesterVillageLink = document.querySelector("[data-link='vogue-bicester-village']");
  const christiesTheWinterEggLink = document.querySelector("[data-link='christies-the-winter-egg']");
  const christiesClassicWeekLink = document.querySelector("[data-link='christies-classic-week']");
  const vogueSuntoryLink = document.querySelector("[data-link='vogue-suntory']");
  const christiesLuxuryAw23Link = document.querySelector("[data-link='christies-luxury-aw23']");
  const christiesLuxurySs24Link = document.querySelector("[data-link='christies-luxury-ss24']");
  const diamonds77Ss24Link = document.querySelector("[data-link='77-diamonds-ss24']");
  const lovebiteLink = document.querySelector("[data-link='lovebite']");
  const halfSickOfShadowsLink = document.querySelector("[data-link='half-sick-of-shadows']");
  const colourLink = getMainNavButton("colour");
  const directionLink = getMainNavButton("direction");
  const approachLink = getMainNavButton("approach");
  const contactLink = getMainNavButton("contact");

  function clearMobileStickyNavHoverSoon(activeToken) {
    if (!isMobileLayoutViewport()) return;

    const sectionName =
      typeof activeToken === "string"
        ? activeToken
        : activeSection;

    applyMobileMainNavStaticState(sectionName);
  }

  hideMainReelMobileStillOnDesktop();
  configureVideoAutoplayFallbacks();
  installClientVideoLoadingStyles();
  prepareClientOneShotVideo(videos["tom-ford"], "tom-ford");
  prepareClientOneShotVideo(videos["mr-porter"], "mr-porter");
  prepareClientOneShotVideo(videos["christies-spring-season-25"], "christies-spring-season-25");
  prepareClientOneShotVideo(videos["vogue-bicester-village"], "vogue-bicester-village");
  prepareClientOneShotVideo(videos["christies-the-winter-egg"], "christies-the-winter-egg");
  prepareClientOneShotVideo(videos["christies-classic-week"], "christies-classic-week");
  prepareClientOneShotVideo(videos["vogue-suntory"], "vogue-suntory");
  prepareClientOneShotVideo(videos["christies-luxury-aw23"], "christies-luxury-aw23");
  prepareClientOneShotVideo(videos["christies-luxury-ss24"], "christies-luxury-ss24");
  prepareClientOneShotVideo(videos["77-diamonds-ss24"], "77-diamonds-ss24");
  prepareClientOneShotVideo(videos["lovebite"], "lovebite");
  prepareClientOneShotVideo(videos["half-sick-of-shadows"], "half-sick-of-shadows");

  installMobileLayoutFixes();
  installMobileViewportScrollLock();
  installMobileClientVideoFullscreenGesture();
  installReactiveCornerVignettes();
  ensureNameShadowSpot();
  ensureMobileApproachBackButton();
  prepareCustomPageLoadIntro();

  hideProjectsGradient();
  hideInactivePanelsWithoutBreakingLayout();
  hideApproachImmediate(false);
  prepareContactHidden();
  hideContactImmediate();

  document.documentElement.classList.add("dcr-js-ready");
  document.documentElement.setAttribute("data-dcr-contact-version", "v7-contact-stable");
  document.documentElement.setAttribute("data-dcr-approach-reel-version", "v8-resume");

  setTimeout(() => {
    runCustomPageLoadIntro();
  }, 120);

  setTimeout(() => {
    hideInactivePanelsWithoutBreakingLayout();
    hideApproachImmediate(false);
    prepareContactHidden();
  }, 100);

  setTimeout(() => {
    hideInactivePanelsWithoutBreakingLayout();
    forceInactiveProjectPanelsHidden();
  }, 500);

  const instagramUrl = CONTACT_INSTAGRAM_URL;

  function getApproachInstagramLinks() {
    return document.querySelectorAll(
      ".approach-ig-link, " +
      "[data-approach-ig], " +
      "[data-instagram-link]"
    );
  }

  getApproachInstagramLinks().forEach((link) => {
    link.style.cursor = "pointer";
    link.style.pointerEvents = "auto";

    if (link.tagName && link.tagName.toLowerCase() === "a") {
      link.setAttribute("href", instagramUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }

    link.addEventListener("mouseenter", () => {
      if (isContactOpen) return;
      setNavItemFocused(link);
    });

    link.addEventListener("mouseleave", () => {
      if (isContactOpen) return;
      settleNavItemAfterArrival(link);
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target || !event.target.closest) return;

    const instagramLink = event.target.closest(
      ".approach-ig-link, [data-approach-ig], [data-instagram-link]"
    );

    if (!instagramLink) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    window.open(instagramUrl, "_blank", "noopener,noreferrer");
  }, true);

  document.addEventListener("click", (event) => {
    if (!isApproachClickTarget(event.target)) return;
    if (isContactOpen) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    toggleApproach();
  }, true);

  if (narrativeLink) {
    narrativeLink.addEventListener("mouseenter", () => {
      if (isContactOpen) return;
      hasHoveredNarrative = true;
      showVideo("narrative");
    });
  }

  if (commercialLink) {
    commercialLink.addEventListener("mouseenter", () => {
      if (isContactOpen) return;
      if (hasHoveredNarrative) {
        showVideo("commercial");
      }
    });
  }

  function installClientVideoLink(link, key) {
    if (!link || !videos[key]) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (isContactOpen) return;

      if (current === key) {
        returnToMainWebsiteVideo();
        return;
      }

      showVideo(key);
      activateProjectFocus(link);
    });
  }

  installClientVideoLink(tomFordLink, "tom-ford");
  installClientVideoLink(mrPorterLink, "mr-porter");
  installClientVideoLink(christiesSpringSeason25Link, "christies-spring-season-25");
  installClientVideoLink(vogueBicesterVillageLink, "vogue-bicester-village");
  installClientVideoLink(christiesTheWinterEggLink, "christies-the-winter-egg");
  installClientVideoLink(christiesClassicWeekLink, "christies-classic-week");
  installClientVideoLink(vogueSuntoryLink, "vogue-suntory");
  installClientVideoLink(christiesLuxuryAw23Link, "christies-luxury-aw23");
  installClientVideoLink(christiesLuxurySs24Link, "christies-luxury-ss24");
  installClientVideoLink(diamonds77Ss24Link, "77-diamonds-ss24");
  installClientVideoLink(lovebiteLink, "lovebite");
  installClientVideoLink(halfSickOfShadowsLink, "half-sick-of-shadows");

  if (colourLink) {
    colourLink.addEventListener("mouseenter", () => {
      if (isMobileLayoutViewport()) return;
      if (isContactOpen) return;
      focusElement(colourLink);
    });

    colourLink.addEventListener("mouseleave", () => {
      if (isMobileLayoutViewport()) return;
      if (isContactOpen) return;
      if (activeMainNavButton !== colourLink) {
        resetElement(colourLink);
      }
    });

    colourLink.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleSection("colour");
    });
  }

  if (directionLink) {
    directionLink.addEventListener("mouseenter", () => {
      if (isMobileLayoutViewport()) return;
      if (isContactOpen) return;
      focusElement(directionLink);
    });

    directionLink.addEventListener("mouseleave", () => {
      if (isMobileLayoutViewport()) return;
      if (isContactOpen) return;
      if (activeMainNavButton !== directionLink) {
        resetElement(directionLink);
      }
    });

    directionLink.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleSection("direction");
    });
  }

  if (approachLink) {
    approachLink.addEventListener("mouseenter", () => {
      if (isMobileLayoutViewport()) return;
      if (isContactOpen) return;
      focusElement(approachLink);
    });

    approachLink.addEventListener("mouseleave", () => {
      if (isMobileLayoutViewport()) return;
      if (isContactOpen) return;
      if (activeMainNavButton !== approachLink) {
        resetElement(approachLink);
      }
    });
  }

  if (contactLink) {
    contactLink.addEventListener("mouseenter", () => {
      if (isMobileLayoutViewport()) return;
      if (isContactOpen) return;
      focusElement(contactLink);
    });

    contactLink.addEventListener("mouseleave", () => {
      if (isMobileLayoutViewport()) return;
      if (isContactOpen) return;
      if (activeMainNavButton !== contactLink) {
        resetElement(contactLink);
      }
    });

    contactLink.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (isContactOpen) {
        hideContactAnimated();
        return;
      }

      showContactAnimated();
    });
  }

  document.addEventListener("click", (event) => {
    if (!contactLink || !event.target || !event.target.closest) return;

    const clickedContact = event.target === contactLink || contactLink.contains(event.target);

    if (!clickedContact) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (isContactOpen) {
      hideContactAnimated();
      return;
    }

    showContactAnimated();
  }, true);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreezeContactVideoIfNeeded();
    }
  });

  window.addEventListener("focus", () => {
    refreezeContactVideoIfNeeded();
  });

  const projectButtons = getProjectButtons();

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (isContactOpen) return;
      if (button === tomFordLink) return;
      if (button === mrPorterLink) return;
      if (button === christiesSpringSeason25Link) return;
      if (button === vogueBicesterVillageLink) return;
      if (button === christiesTheWinterEggLink) return;
      if (button === christiesClassicWeekLink) return;
      if (button === christiesLuxuryAw23Link) return;
      if (button === christiesLuxurySs24Link) return;
      if (button === diamonds77Ss24Link) return;
      activateProjectFocus(button);
    });
  });

  const allHoverButtons = getAllHoverButtons();

  allHoverButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      if (isMobileLayoutViewport() && isNavAnimationItem(button)) return;
      if (isContactOpen) return;
      if (elementBelongsToInactiveProjectPanel(button)) return;
      focusElement(button);
    });

    button.addEventListener("mouseleave", () => {
      if (isMobileLayoutViewport() && isNavAnimationItem(button)) return;
      if (isContactOpen) return;
      if (elementBelongsToInactiveProjectPanel(button)) return;

      if (activeProjectButton) {
        returnToActiveProjectFocus();
      } else if (isProjectButton(button)) {
        softenElementWithoutBlur(button);
      } else if (button !== activeMainNavButton) {
        resetElement(button);
      }
    });
  });

  const leftNavItems = getLeftNavButtons();

  leftNavItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const clickedMainNavButton = event.target.closest("[data-main-nav]");

      if (clickedMainNavButton) {
        const clickedSectionName =
          clickedMainNavButton.getAttribute("data-main-nav");

        if (
          clickedSectionName === "colour" ||
          clickedSectionName === "direction" ||
          clickedSectionName === "approach" ||
          clickedSectionName === "contact"
        ) {
          return;
        }
      }

      if (item === colourLink || item === directionLink || item === approachLink || item === contactLink) return;
      if (colourLink && item.contains(colourLink)) return;
      if (directionLink && item.contains(directionLink)) return;
      if (approachLink && item.contains(approachLink)) return;
      if (contactLink && item.contains(contactLink)) return;

      if (isContactOpen) return;

      hideProjectsGradient();

      if (isApproachOpen) {
        hideApproachAnimated(true);
      } else {
        hideApproachImmediate(true);
      }

      closeActiveSectionAnimated();

      fadeCurrentAudioToZero();
    });
  });

  document.addEventListener("click", (event) => {
    const closeButton = getContactCloseButton();

    if (!closeButton) return;

    if (event.target === closeButton || closeButton.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      hideContactAnimated();
    }
  }, true);

  setTimeout(() => {
    const closeButton = getContactCloseButton();

    if (closeButton) {
      closeButton.style.cursor = "pointer";
      closeButton.style.pointerEvents = "auto";
    }
  }, 600);

  setTimeout(() => {
    const overlay = document.querySelector(".intro-overlay");
    if (overlay) {
      overlay.style.pointerEvents = "none";
    }
  }, 3000);
