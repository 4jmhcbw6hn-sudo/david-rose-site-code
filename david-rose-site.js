/* DCR update: reliable mobile SWIPE TO CLEAR hint + earlier client credits â€” cache bump 129 */
const videos = {
    main: document.getElementById("main-reel"),
    commercial: document.getElementById("commercial-reel"),
    narrative: document.getElementById("narrative-reel"),
    "tom-ford": document.getElementById("tom-ford-reel"),
    "mr-porter": document.getElementById("mr-porter-reel"),
    "christies-spring-season-25": document.getElementById("christies-spring-season-25-reel"),
    "christies-the-winter-egg": document.getElementById("christies-the-winter-egg-reel"),
    "vogue-suntory": document.getElementById("vogue-suntory-reel")
  };

  let current = "main";
  let mainReelMobileMotionReady = false;
  let mainReelMobileMotionTimer = null;
  let mainReelMobileMotionAttempts = 0;
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
    "christies-the-winter-egg": {
      creditTitle: "EDITOR + COMPOSER",
      desktopHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/94ab113a-943d-4a5e-851d-b846d46d7363/playlist.m3u8",
      mobileHlsUrl: "https://vz-636468bf-dd1.b-cdn.net/d3d2fc38-a7ea-47d3-a18f-20c56ba9422c/playlist.m3u8",
      desktopUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/01_CHRISTIE'S_WINTER_EGG__WITH_TITLES_WEBSITE_RES.mp4",
      mobileUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/01_CHRISTIE'S_WINTER_EGG_SOCIAL_EDIT_V2_WITH_TITLES_WEBSITE_RES.mp4",
      desktopStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/STILL_01_CHRISTIE'S_WINTER_EGG__WITH_TITLES_1.4.1_1.4.1.jpg",
      mobileStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/STILL_01_CHRISTIE'S_WINTER_EGG_SOCIAL_EDIT_V2_WITH_TITLES_1.4.1_1.4.1.jpg",
      desktopEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/STILL_01_CHRISTIE'S_WINTER_EGG__WITH_TITLES_1.4.1.jpg",
      mobileEndStillUrl: "https://portfolio-pullzone.b-cdn.net/POST_PRODUCTION/CHRISTIE'S/THE_WINTER_EGG/STILL_01_CHRISTIE'S_WINTER_EGG_SOCIAL_EDIT_V2_WITH_TITLES_1.4.1.jpg",
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
  let approachPlaybackAnimation = null;
  let approachPausedVideo = null;
  let approachVideoWasPaused = false;
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
  let clientVideoSwipeHintShowTimeout = null;
  let clientVideoSwipeHintHideTimeout = null;
  let clientVideoSwipeHintShownThisSession = false;

  const CLIENT_VIDEO_PLAYBACK_VOLUME = 0.68;
  const CLIENT_DESKTOP_MP4_FALLBACK_TO_HLS_MS = 3000;
  const CLIENT_HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js";
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
      return config.mobileHlsUrl || config.mobileUrl || config.desktopHlsUrl || config.desktopUrl || "";
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

    if (!video || !config || !hlsUrl) return;
    if (current !== key || config.playbackReady || isMobileClientVideoViewport()) return;
    if (isHlsSourceUrl(config.activeSourceUrl)) return;

    config.activeSourceMode = "desktop-hls-fallback|" + hlsUrl;
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
    const hlsUrl = getClientHlsSourceUrlForViewport(key);

    if (!config || !hlsUrl || isMobileClientVideoViewport()) return;
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

    video.style.opacity =
      key === "main" &&
      !(window.matchMedia && window.matchMedia("(max-width: 1024px)").matches)
        ? "1"
        : "0";
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
    return document.querySelector(".dcr-main-reel-mobile-still");
  }

  function hideMainReelMobileStillOnDesktop() {
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
    const mainVideo = videos.main;

    if (!mainVideo) return;

    try {
      mainVideo.muted = true;
      mainVideo.defaultMuted = true;
      mainVideo.loop = true;
      mainVideo.playsInline = true;
      mainVideo.controls = false;
      mainVideo.removeAttribute("controls");
      mainVideo.setAttribute("muted", "");
      mainVideo.setAttribute("loop", "");
      mainVideo.setAttribute("playsinline", "");
      mainVideo.setAttribute("webkit-playsinline", "");
      mainVideo.setAttribute("preload", "auto");
      mainVideo.setAttribute("disablepictureinpicture", "");
      mainVideo.setAttribute("disableremoteplayback", "");
      mainVideo.disablePictureInPicture = true;
      mainVideo.style.pointerEvents = "none";
    } catch (error) {}
  }

  function keepMobileStillVisible() {
    const still = getMainReelMobileStill();

    if (!still || !isMobileViewportForMainReel()) return;

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

    configureMainReelAsDecorative();
    keepMobileStillVisible();

    mainReelMobileMotionAttempts += 1;

    const startTime = videos.main.currentTime || 0;

    try {
      const playPromise = videos.main.play();

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

        setTimeout(requestMobileMainReelMotion, 350);
        setTimeout(requestMobileMainReelMotion, 1600);
        setTimeout(requestMobileMainReelMotion, 3600);

        ["touchstart", "pointerdown"].forEach((eventName) => {
          document.addEventListener(eventName, requestMobileMainReelMotion, {
            passive: true
          });
        });
      } else {
        hideMainReelMobileStillOnDesktop();
        playVideo(videos.main);
      }
    }

    window.addEventListener("pageshow", () => {
      if (isMobileViewportForMainReel()) {
        requestMobileMainReelMotion();
      } else if (videos.main) {
        hideMainReelMobileStillOnDesktop();
        playVideo(videos.main);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;

      if (isMobileViewportForMainReel()) {
        requestMobileMainReelMotion();
      } else if (videos.main) {
        hideMainReelMobileStillOnDesktop();
        playVideo(videos.main);
      }

      if (!isClientVideoKey(current)) {
        prepareAllClientSourcesForViewport();
      }
    });

    window.addEventListener("resize", () => {
      hideMainReelMobileStillOnDesktop();

      if (!isClientVideoKey(current)) {
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
        white-space: nowrap;
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
        top: 71vh !important;
        top: 71svh !important;
        z-index: 150 !important;
        transform: translate(-50%, 10px) scale(0.985);
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
        transform: translate(-50%, 0) scale(1);
        animation: dcr-client-swipe-hint-drift 2600ms cubic-bezier(0.45, 0, 0.2, 1) 1;
        transition:
          opacity 1250ms cubic-bezier(0.16, 1, 0.3, 1),
          filter 1650ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 1900ms cubic-bezier(0.13, 1, 0.22, 1),
          visibility 0s;
      }

      @keyframes dcr-client-swipe-hint-drift {
        0% {
          transform: translate(-50%, 0) translateX(0) scale(1);
          letter-spacing: 0.36em;
        }

        34% {
          transform: translate(-50%, 0) translateX(-7px) scale(1.006);
          letter-spacing: 0.39em;
        }

        68% {
          transform: translate(-50%, 0) translateX(7px) scale(1.006);
          letter-spacing: 0.39em;
        }

        100% {
          transform: translate(-50%, 0) translateX(0) scale(1);
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
      swipeHint.textContent = "SWIPE TO CLEAR";
      document.body.appendChild(swipeHint);
    }

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

    if (
      root.classList.contains("dcr-client-video-end-card-on") ||
      root.classList.contains("dcr-client-video-loading-still-on")
    ) {
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

  function isMobileClientVideoFullscreenEligible() {
    if (!isMobileClientVideoViewport()) return false;
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

      const dx = changedTouch.clientX - start.x;
      const dy = changedTouch.clientY - start.y;
      const absoluteX = Math.abs(dx);
      const absoluteY = Math.abs(dy);
      const width = window.innerWidth || 1;
      const duration = Date.now() - start.time;

      if (duration > 1400) return;
      if (absoluteX < 72) return;
      if (absoluteX < absoluteY * 1.55) return;

      if (mobileClientFullscreenNavActive) {
        const startsAtLeftEdge = start.x < width * 0.26 && dx > 0;
        const startsAtRightEdge = start.x > width * 0.74 && dx < 0;

        if (startsAtLeftEdge || startsAtRightEdge || absoluteX > 115) {
          showMobileClientNavAfterFullscreen();
        }

        return;
      }

      if (!isMobileClientVideoFullscreenEligible()) return;

      const startsNearCentre = start.x > width * 0.22 && start.x < width * 0.78;
      const movesLeftFromCentre = dx < 0 && changedTouch.clientX < start.x;
      const movesRightFromCentre = dx > 0 && changedTouch.clientX > start.x;

      if (startsNearCentre && (movesLeftFromCentre || movesRightFromCentre)) {
        hideMobileClientNavForFullscreen();
      }
    }, { passive: true });
  }

  function hasClientVideoSwipeHintBeenShown() {
    if (clientVideoSwipeHintShownThisSession) return true;

    try {
      return window.sessionStorage &&
        window.sessionStorage.getItem("dcrClientSwipeHintShownV3") === "true";
    } catch (error) {
      return false;
    }
  }

  function markClientVideoSwipeHintShown() {
    clientVideoSwipeHintShownThisSession = true;

    try {
      if (window.sessionStorage) {
        window.sessionStorage.setItem("dcrClientSwipeHintShownV3", "true");
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
    if (!isMobileClientVideoViewport()) return;
    if (!isClientVideoKey(key)) return;

    clearClientVideoSwipeHintTimers();

    clientVideoSwipeHintShowTimeout = setTimeout(() => {
      clientVideoSwipeHintShowTimeout = null;

      const config = clientVideoSourceConfig[key];
      const video = videos[key];

      if (hasClientVideoSwipeHintBeenShown()) return;
      if (current !== key) return;
      if (!isMobileClientVideoViewport()) return;
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
    }, 7600);
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
      layer.credit.textContent = String(config.creditTitle || "").toUpperCase();
      document.documentElement.classList.add("dcr-client-video-credit-on");

      clientVideoCreditHideTimeout = setTimeout(() => {
        clientVideoCreditHideTimeout = null;
        document.documentElement.classList.remove("dcr-client-video-credit-on");
      }, 4000);
    }, 1000);

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

    if (!isMobileClientVideoViewport() && !isHlsSourceUrl(nextSource)) {
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

  function animateMobileNavOut() {}

  function animateMobileNavIn() {}

  function getPhase2BEMobileReturnItems() {
    const items = Array.from(
      document.querySelectorAll(".side-nav > .nav-text, .side-nav > .ig-link")
    );

    return items.slice(0, 5);
  }

  function preparePhase2BEMobileNavReturn() {
    if (!isPhase2AMobileViewport()) return;

    getPhase2BEMobileReturnItems().forEach((item, index) => {
      item.style.visibility = "visible";
      item.style.pointerEvents = "auto";
      item.style.willChange = "opacity, filter, transform";
      item.style.transition =
        "opacity 1850ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "filter 2450ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "transform 2900ms cubic-bezier(0.13, 1, 0.22, 1)";
      item.style.transitionDelay = index * 115 + "ms";
      item.style.opacity = "0.5";
      item.style.filter = "blur(0)";
      item.style.transform = "translateX(0) scale(1)";
    });
  }

  function clearPhase2BEMobileNavReturn() {
    getPhase2BEMobileReturnItems().forEach((item) => {
      item.style.transitionDelay = "";
      item.style.willChange = "";
      item.style.pointerEvents = "";
      settleNavItemAfterArrival(item);
    });
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

  function enterMobileApproachFocus() {
    if (!isPhase2AMobileViewport()) {
      document.documentElement.classList.remove("dcr-phase2b-mobile-approach-active");
      return;
    }

    clearMobileApproachNavTimeouts();
    mobileApproachFocusIsExiting = false;

    document.documentElement.classList.add("dcr-phase2b-mobile-approach-active");

    revealMobileApproachBackButton(2650);
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
        isMobileViewportForMainReel() && !mainReelMobileMotionReady ? "0" : "1";
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
            isMobileViewportForMainReel() && !mainReelMobileMotionReady ? "0" : "1";
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

    const mainVideo = videos.main;

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    hideAndResetClientVideos();

    if (mainVideo) {
      safelySetMuted(mainVideo, true);
      safelySetPlaybackRate(mainVideo, 1);

      mainVideo.style.transition =
        "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
        "filter 1.4s cubic-bezier(0.8, 0, 0.2, 1), " +
        "transform 1.4s ease";

      mainVideo.style.opacity =
        isMobileViewportForMainReel() && !mainReelMobileMotionReady ? "0" : "1";
      mainVideo.style.filter = "blur(0) brightness(1)";
      mainVideo.style.transform = "scale(1)";

      if (isMobileViewportForMainReel()) {
        requestMobileMainReelMotion();
      } else {
        playVideo(mainVideo);
      }
    }

    current = "main";

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
    const mainVideo = videos.main;

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    hideAndResetClientVideos();

    if (mainVideo) {
      safelySetMuted(mainVideo, true);
      safelySetPlaybackRate(mainVideo, 1);
      mainVideo.style.opacity =
        isMobileViewportForMainReel() && !mainReelMobileMotionReady ? "0" : "1";
      mainVideo.style.filter = "blur(0) brightness(1)";
      mainVideo.style.transform = "scale(1)";

      if (isMobileViewportForMainReel()) {
        requestMobileMainReelMotion();
      } else {
        playVideo(mainVideo);
      }
    }

    current = "main";
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

  function slowCurrentVideoForApproach() {
    const video = videos[current];
    if (!video) return;

    approachPausedVideo = video;
    approachVideoWasPaused = video.paused;

    if (approachVideoWasPaused) return;

    const startRate = video.playbackRate || 1;
    const finalRate = 0.24;
    const duration = 2800;

    animatePlaybackRate(video, startRate, finalRate, duration, () => {
      if (!isApproachOpen || approachPausedVideo !== video) return;

      const pauseTimeout = setTimeout(() => {
        if (isApproachOpen && approachPausedVideo === video) {
          safelySetPlaybackRate(video, finalRate);
          video.pause();
        }
      }, 180);

      approachTimeouts.push(pauseTimeout);
    }, approachSlowdownEase);
  }

  function resumeApproachVideoPlayback() {
    const video = approachPausedVideo || videos[current];
    if (!video) return;

    const resumeClientKey = getClientVideoKeyByVideo(video);
    const wasPausedBeforeApproach = approachVideoWasPaused;

    approachPausedVideo = null;
    approachVideoWasPaused = false;

    cancelApproachPlaybackAnimation();

    if (wasPausedBeforeApproach) {
      safelySetPlaybackRate(video, 1);
      return;
    }

    const startRate = 0.7;

    safelySetPlaybackRate(video, startRate);

    if (video.paused) {
      playVideo(video);
    }

    if (resumeClientKey) {
      fadeClientVideoAudioIn(video, resumeClientKey);
    }

    animatePlaybackRate(video, startRate, 1, 2200, () => {
      safelySetPlaybackRate(video, 1);
    });
  }

  function fadeCurrentAudioToZero() {
    const video = videos[current];
    if (!video) return;

    const startVolume = video.volume || 0;
    if (startVolume === 0) return;

    const duration = 2000;
    const startTime = performance.now();

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    function fade(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      safelySetVolume(video, startVolume * (1 - easedProgress));

      if (progress < 1) {
        audioFadeAnimation = requestAnimationFrame(fade);
      } else {
        safelySetVolume(video, 0);
        safelySetMuted(video, true);
      }
    }

    audioFadeAnimation = requestAnimationFrame(fade);
  }

  function fadeClientVideoAudioIn(video, key) {
    if (!video || !isClientVideoKey(key) || current !== key) return;

    const config = clientVideoSourceConfig[key];
    if (!config || config.hasCompleted || video.ended) return;

    const targetVolume = CLIENT_VIDEO_PLAYBACK_VOLUME;
    const startVolume = Math.max(0, Math.min(targetVolume, video.volume || 0));
    const duration = 2200;
    const startTime = performance.now();

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    safelySetMuted(video, false);
    safelySetVolume(video, startVolume);

    if (Math.abs(startVolume - targetVolume) < 0.01) {
      safelySetVolume(video, targetVolume);
      return;
    }

    function fade(now) {
      if (current !== key || isApproachOpen || isContactOpen) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      const volume = startVolume + ((targetVolume - startVolume) * easedProgress);

      safelySetMuted(video, false);
      safelySetVolume(video, volume);

      if (progress < 1) {
        audioFadeAnimation = requestAnimationFrame(fade);
      } else {
        safelySetMuted(video, false);
        safelySetVolume(video, targetVolume);
        audioFadeAnimation = null;
      }
    }

    audioFadeAnimation = requestAnimationFrame(fade);
  }

  function setApproachVideoTransition(video, duration) {
    video.style.transition =
      "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
      "filter " + duration + "ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform " + duration + "ms cubic-bezier(0.22, 1, 0.36, 1)";
  }

  function blurCurrentVideoForApproach() {
    const video = videos[current];

    dimClientVideoStillForOverlay();

    if (!video) return;

    setApproachVideoTransition(video, 5200);

    video.style.filter = "blur(7px) brightness(0.62)";
    video.style.transform = "scale(1.015)";
  }

  function clearApproachVideoBlur() {
    const video = videos[current];

    clearClientVideoStillOverlayDim();

    if (!video) return;

    setApproachVideoTransition(video, 5000);

    video.style.filter = "blur(0) brightness(1)";
    video.style.transform = "scale(1)";
  }

  function showVideo(target) {
    if (!videos[target]) return;

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

      approachTimeouts.push(delayedSlowdown);
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

    const textFadeStartDelay = 260;
    const staggerOut = 145;
    const fadeOutDuration = 3400;
    const backgroundReturnDelay = 1850;
    const luxuryEase = "cubic-bezier(0.22, 1, 0.36, 1)";

    isApproachOpen = false;

    exitMobileApproachFocus(isPhase2AMobileViewport() ? 1800 : 5200);

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

    if (activeSection) {
      closeActiveSectionAnimated();
    } else {
      clearRevealTimeouts();
      activeProjectButton = null;
    }

    clearApproachTimeouts();
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

    const delayedSlowdown = setTimeout(() => {
      if (isApproachOpen) {
        slowCurrentVideoForApproach();
      }
    }, 1600);

    approachTimeouts.push(delayedSlowdown);
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

    if (!isSwitchingBetweenProjectMenus) {
      fadeCurrentAudioToZero();
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
    const overlay = getContactOverlay();
    const modal = getContactModal();
    const closeButton = getContactCloseButton();

    if (overlay) {
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

  function softenNavForContact() {
    getLeftNavButtons().forEach((button) => {
      button.style.transition =
        "opacity 3400ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "filter 4200ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "transform 4200ms cubic-bezier(0.22, 1, 0.36, 1)";

      button.style.opacity = "0.42";
      button.style.filter = "blur(2px)";
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
    });
  }

  function showContactAnimated() {
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

    dimClientVideoStillForOverlay();
    moveToMainVideoBehindContact();
    hideProjectsGradient();
    hideCenterNameAnimated();
    fadeCurrentAudioToZero();
    softenNavForContact();

    isContactOpen = true;
    activeSection = null;
    activeProjectButton = null;
    activeMainNavButton = contactLink || null;

    const modalRevealItems = Array.from(modal.children);

    modalRevealItems.forEach((item) => {
      item.style.transition = "none";
      item.style.transitionDelay = "0ms";
      item.style.opacity = "0";
      item.style.filter = "blur(4px)";
      item.style.transform = "scale(0.998)";
      item.style.visibility = "visible";
    });

    overlay.style.display = "";
    overlay.style.transition = "none";
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";

    modal.style.display = "";
    modal.style.transformOrigin = "50% 50%";
    modal.style.transition = "none";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";

    /* Glass build: do not fade the whole backdrop-filter element.
       Instead, gently build the glass itself using background/border/blur/scale,
       while the contents fade in at the same time. */
    modal.style.backgroundColor = "rgba(255, 255, 255, 0)";
    modal.style.borderColor = "rgba(255, 255, 255, 0)";
    modal.style.backdropFilter = "blur(0px)";
    modal.style.webkitBackdropFilter = "blur(0px)";
    modal.style.filter = "blur(0)";
    modal.style.transform = "scale(0.968)";
    modal.style.willChange = "background-color, border-color, backdrop-filter, transform";
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
        "background-color 2600ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "border-color 2600ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "backdrop-filter 3000ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "-webkit-backdrop-filter 3000ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "transform 4200ms cubic-bezier(0.13, 1, 0.22, 1)";

      modal.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
      modal.style.borderColor = "rgba(255, 255, 255, 0.15)";
      modal.style.backdropFilter = "blur(12px)";
      modal.style.webkitBackdropFilter = "blur(12px)";
      modal.style.transform = "scale(1)";

      modalRevealItems.forEach((item) => {
        item.style.transition =
          "opacity 2400ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "filter 3000ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "transform 3400ms cubic-bezier(0.13, 1, 0.22, 1)";

        item.style.transitionDelay = "120ms";
        item.style.opacity = "1";
        item.style.filter = "blur(0)";
        item.style.transform = "scale(1)";
      });
    }, 90);

    contactTimeouts.push(revealTimeout);
  }

  function hideContactAnimated() {
    const overlay = getContactOverlay();
    const modal = getContactModal();

    if (!overlay || !modal) return;

    clearContactTimeouts();

    isContactOpen = false;
    clearClientVideoStillOverlayDim();

    const modalRevealItems = Array.from(modal.children);

    /* Exit composite fade:
       Keep the glass fully formed, then fade the entire modal as one object.
       This avoids the empty transparent rectangle caused by fading the contents
       and backdrop-filter separately. */
    modalRevealItems.forEach((item) => {
      item.style.transitionDelay = "0ms";
      item.style.transition = "none";
      item.style.opacity = "1";
      item.style.filter = "blur(0)";
      item.style.transform = "scale(1)";
    });

    modal.style.transition =
      "opacity 2200ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 2500ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 2600ms cubic-bezier(0.22, 1, 0.36, 1)";

    modal.style.opacity = "0";
    modal.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
    modal.style.borderColor = "rgba(255, 255, 255, 0.15)";
    modal.style.backdropFilter = "blur(12px)";
    modal.style.webkitBackdropFilter = "blur(12px)";
    modal.style.filter = "blur(5px)";
    modal.style.transform = "scale(0.975)";
    modal.style.pointerEvents = "none";

    overlay.style.pointerEvents = "none";
    overlay.style.transition = "none";
    overlay.style.opacity = "1";

    showCenterNameAnimated(600);

    const restoreNavTimeout = setTimeout(() => {
      restoreNavAfterContact();
    }, 550);

    const finalHideTimeout = setTimeout(() => {
      overlay.style.visibility = "hidden";
      overlay.style.pointerEvents = "none";
      overlay.style.opacity = "0";

      modal.style.visibility = "hidden";
      modal.style.pointerEvents = "none";
      modal.style.opacity = "0";

      restoreNavAfterContact();
    }, 2650);

    contactTimeouts.push(restoreNavTimeout);
    contactTimeouts.push(finalHideTimeout);
  }

  function hideContactImmediate() {
    const overlay = getContactOverlay();
    const modal = getContactModal();

    isContactOpen = false;
    clearClientVideoStillOverlayDim();

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
  const christiesTheWinterEggLink = document.querySelector("[data-link='christies-the-winter-egg']");
  const vogueSuntoryLink = document.querySelector("[data-link='vogue-suntory']");
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
  prepareClientOneShotVideo(videos["christies-the-winter-egg"], "christies-the-winter-egg");
  prepareClientOneShotVideo(videos["vogue-suntory"], "vogue-suntory");

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

  const instagramUrl = "https://www.instagram.com/davidr0se/";

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
  installClientVideoLink(christiesTheWinterEggLink, "christies-the-winter-egg");
  installClientVideoLink(vogueSuntoryLink, "vogue-suntory");

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

      showContactAnimated();
    });
  }

  const projectButtons = getProjectButtons();

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (isContactOpen) return;
      if (button === tomFordLink) return;
      if (button === mrPorterLink) return;
      if (button === christiesSpringSeason25Link) return;
      if (button === christiesTheWinterEggLink) return;
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
