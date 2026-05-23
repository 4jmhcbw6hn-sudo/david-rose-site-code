const videos = {
    main: document.getElementById("main-reel"),
    commercial: document.getElementById("commercial-reel"),
    narrative: document.getElementById("narrative-reel"),
    "tom-ford": document.getElementById("tom-ford-reel")
  };

  let current = "main";
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

  Object.keys(videos).forEach((key) => {
    if (!videos[key]) {
      delete videos[key];
    }
  });

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

  function configureVideoAutoplayFallbacks() {
    const videoStillUrls = new WeakMap();

    function getVideoStillFallbackElement() {
      let fallback = document.querySelector(".dcr-video-still-fallback");

      if (!fallback) {
        fallback = document.createElement("div");
        fallback.className = "dcr-video-still-fallback";
        document.body.appendChild(fallback);
      }

      return fallback;
    }

    function captureVideoStill(video) {
      if (!video || videoStillUrls.has(video)) return;

      const poster = video.getAttribute("poster");

      if (poster) {
        videoStillUrls.set(video, poster);
        return;
      }

      try {
        if (!video.videoWidth || !video.videoHeight) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        videoStillUrls.set(video, canvas.toDataURL("image/jpeg", 0.78));
      } catch (error) {}
    }

    function showVideoStillFallback(video) {
      captureVideoStill(video);

      const stillUrl = videoStillUrls.get(video);
      const fallback = getVideoStillFallbackElement();

      if (stillUrl) {
        fallback.style.backgroundImage = "url('" + stillUrl + "')";
        fallback.style.backgroundColor = "transparent";
      } else {
        fallback.style.backgroundImage = "";
        fallback.style.backgroundColor = "rgba(0, 0, 0, 0.16)";
        fallback.style.backdropFilter = "blur(0px)";
        fallback.style.webkitBackdropFilter = "blur(0px)";
      }

      document.documentElement.classList.add("dcr-video-fallback-active");
    }

    function hideVideoStillFallback() {
      document.documentElement.classList.remove("dcr-video-fallback-active");
    }

    function attemptAutoplay(video) {
      if (!video) return;

      try {
        video.controls = false;
        video.removeAttribute("controls");
      } catch (error) {}

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hideVideoStillFallback();
          })
          .catch(() => {
            showVideoStillFallback(video);
          });
      }

      setTimeout(() => {
        if (video.paused || video.readyState < 2) {
          showVideoStillFallback(video);
        }
      }, 650);

      setTimeout(() => {
        if (video.paused || video.readyState < 2) {
          showVideoStillFallback(video);
        }
      }, 1550);
    }

    Object.values(videos).forEach((video) => {
      if (!video) return;

      try {
        video.controls = false;
        video.removeAttribute("controls");
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.setAttribute("preload", "auto");
        video.setAttribute("autoplay", "");
        video.disablePictureInPicture = true;
        video.setAttribute("disablepictureinpicture", "");
        video.setAttribute("controlslist", "nodownload noplaybackrate nofullscreen");
      } catch (error) {}

      video.addEventListener("loadeddata", () => {
        captureVideoStill(video);
        attemptAutoplay(video);
      });

      video.addEventListener("playing", hideVideoStillFallback);
    });

    function kickstartCurrentVideo() {
      const currentVideo = videos[current] || videos.main;

      if (currentVideo) {
        if (currentVideo !== videos["tom-ford"]) {
          safelySetMuted(currentVideo, true);
        }

        attemptAutoplay(currentVideo);
      }

      if (videos.main && currentVideo !== videos.main) {
        attemptAutoplay(videos.main);
      }
    }

    window.addEventListener("pageshow", kickstartCurrentVideo);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        kickstartCurrentVideo();
      }
    });

    ["touchstart", "pointerdown"].forEach((eventName) => {
      document.addEventListener(eventName, kickstartCurrentVideo, {
        once: true,
        passive: true
      });
    });

    setTimeout(kickstartCurrentVideo, 250);
    setTimeout(kickstartCurrentVideo, 1200);
    setTimeout(kickstartCurrentVideo, 2600);
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

  function showProjectsGradient() {
    document.documentElement.classList.add("projects-gradient-on");
  }

  function hideProjectsGradient() {
    document.documentElement.classList.remove("projects-gradient-on");
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

  function prepareClientOneShotVideo(video) {
    if (!video) return;

    video.loop = false;
    video.removeAttribute("loop");

    video.addEventListener("loadedmetadata", () => {
      video.loop = false;
      video.removeAttribute("loop");
    });

    video.addEventListener("ended", () => {
      video.loop = false;
      video.removeAttribute("loop");

      video.pause();
      safelySetPlaybackRate(video, 1);

      try {
        video.currentTime = 0;
      } catch (error) {}

      setTimeout(() => {
        if (current === "tom-ford" && !isApproachOpen && !isContactOpen) {
          settleClientVideoStill(video);
          showCenterNameAnimated(250);
        }
      }, 350);
    });
  }

  function resetClientVideoToStartFrame(video) {
    if (!video) return;

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
  }

  function playClientVideoFromStart(video) {
    if (!video) return;

    hideCenterNameAnimated();

    video.loop = false;
    video.removeAttribute("loop");

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    setClientVideoFullBrightness(video);

    safelySetPlaybackRate(video, 1);
    safelySetMuted(video, false);
    safelySetVolume(video, 1);

    try {
      video.pause();
      video.currentTime = 0;
    } catch (error) {}

    playVideo(video);
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

  function getLeftNavButtons() {
    const candidates = Array.from(document.querySelectorAll(
      ".side-nav [data-main-nav], " +
      ".side-nav .nav-text, " +
      ".side-nav a, " +
      "[data-main-nav]"
    ));

    const seen = new Set();
    const items = [];

    candidates.forEach((candidate) => {
      if (!candidate || !candidate.closest) return;

      const navRoot = candidate.closest("[data-main-nav]") || candidate;
      const key =
        navRoot.getAttribute && navRoot.getAttribute("data-main-nav")
          ? "main-nav:" + navRoot.getAttribute("data-main-nav")
          : navRoot;

      if (seen.has(key)) return;

      seen.add(key);
      items.push(navRoot);
    });

    return items;
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

  function navItemsBelongTogether(item, activeItem) {
    if (!item || !activeItem) return false;
    if (item === activeItem) return true;

    return (
      (item.contains && item.contains(activeItem)) ||
      (activeItem.contains && activeItem.contains(item))
    );
  }

  function applyActiveMainNavContrast() {
    if (!activeMainNavButton) return;

    getLeftNavButtons().forEach((item) => {
      if (navItemsBelongTogether(item, activeMainNavButton)) {
        focusElement(item);
      } else {
        dimElement(item);
      }
    });
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
        style.visibility !== "hidden" &&
        style.display !== "none" &&
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

    const spotWidth = Math.min(
      Math.max(rect.width * (mobileSpot ? 0.92 : 0.86), mobileSpot ? 150 : 210),
      window.innerWidth * (mobileSpot ? 0.66 : 0.42)
    );

    const spotHeight = Math.min(
      Math.max(rect.height * (mobileSpot ? 0.24 : 0.22), mobileSpot ? 26 : 36),
      window.innerHeight * 0.09
    );

    const spotX = rect.left + rect.width / 2;
    const spotY = rect.bottom + (mobileSpot ? 3 : 7);

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

    if (!supportsFinePointer) return;

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

    document.addEventListener("mousemove", (event) => {
      lastEvent = event;

      if (!frameId) {
        frameId = requestAnimationFrame(updateVignettes);
      }
    });

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

    document.addEventListener("mouseleave", () => {
      lastEvent = null;
      topLeft.style.opacity = "0";
      bottomRight.style.opacity = "0";
    });
  }

  let mobileApproachNavTimeouts = [];
  let mobileApproachFocusIsExiting = false;

  function isMobileLayoutViewport() {
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
    button.style.transform = "translateX(-16px) scale(0.986)";
    button.style.pointerEvents = "none";
  }

  function revealMobileApproachBackButton(delay) {
    const button = ensureMobileApproachBackButton();
    const revealDelay = typeof delay === "number" ? delay : 0;

    prepareMobileApproachBackButton(button);

    const revealTimeout = setTimeout(() => {
      button.style.visibility = "visible";
      button.style.pointerEvents = "auto";
      button.style.transition =
        "opacity 2100ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "filter 2600ms cubic-bezier(0.16, 1, 0.3, 1), " +
        "transform 3200ms cubic-bezier(0.13, 1, 0.22, 1)";

      button.style.opacity = "1";
      button.style.filter = "blur(0)";
      button.style.transform = "translateX(0) scale(1)";

      const settleTimeout = setTimeout(() => {
        settleNavItemAfterArrival(button);
      }, 2600);

      mobileApproachNavTimeouts.push(settleTimeout);
    }, revealDelay);

    mobileApproachNavTimeouts.push(revealTimeout);
  }

  function hideMobileApproachBackButton() {
    const button = getMobileApproachBackButton();

    if (!button) return;

    button.style.transition =
      "opacity 1150ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1500ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1700ms cubic-bezier(0.22, 1, 0.36, 1)";

    button.style.opacity = "0";
    button.style.filter = "blur(6px)";
    button.style.transform = "translateX(-16px) scale(0.986)";
    button.style.pointerEvents = "none";

    const hideTimeout = setTimeout(() => {
      button.style.visibility = "hidden";
    }, 1750);

    mobileApproachNavTimeouts.push(hideTimeout);
  }

  function animateMobileNavOut() {
    const items = Array.from(getLeftNavButtons());

    items.forEach((item, index) => {
      item.style.transitionDelay = "0ms";
      item.style.pointerEvents = "none";

      const outTimeout = setTimeout(() => {
        item.style.transition =
          "opacity 2400ms cubic-bezier(0.22, 1, 0.36, 1), " +
          "filter 3000ms cubic-bezier(0.22, 1, 0.36, 1), " +
          "transform 3400ms cubic-bezier(0.22, 1, 0.36, 1)";

        item.style.opacity = "0";
        item.style.filter = "blur(9px)";
        item.style.transform = "translateX(-30px) scale(0.986)";
      }, 180 + index * 145);

      mobileApproachNavTimeouts.push(outTimeout);
    });
  }

  function animateMobileNavIn(delay) {
    const introDelay = typeof delay === "number" ? delay : 0;
    const items = Array.from(getLeftNavButtons());

    items.forEach((item, index) => {
      item.style.transition = "none";
      item.style.transitionDelay = "0ms";
      item.style.visibility = "visible";
      item.style.opacity = "0";
      item.style.filter = "blur(8px)";
      item.style.transform = "translateX(-22px) scale(0.988)";
      item.style.pointerEvents = "none";

      const inTimeout = setTimeout(() => {
        item.style.transition =
          "opacity 2500ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "filter 3300ms cubic-bezier(0.16, 1, 0.3, 1), " +
          "transform 3900ms cubic-bezier(0.13, 1, 0.22, 1)";

        item.style.opacity = "1";
        item.style.filter = "blur(0)";
        item.style.transform = "translateX(0) scale(1)";
        item.style.pointerEvents = "auto";

        const settleTimeout = setTimeout(() => {
          settleNavItemAfterArrival(item);
        }, 2950 + index * 70);

        mobileApproachNavTimeouts.push(settleTimeout);
      }, introDelay + index * 125);

      mobileApproachNavTimeouts.push(inTimeout);
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

    if (!button.dataset.dcrBackReady) {
      button.dataset.dcrBackReady = "true";

      button.addEventListener("mouseenter", () => {
        if (!isMobileLayoutViewport()) return;
        setNavItemFocused(button);
      });

      button.addEventListener("mouseleave", () => {
        if (!isMobileLayoutViewport()) return;
        settleNavItemAfterArrival(button);
      });

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        setNavItemFocused(button);

        if (isApproachOpen) {
          hideApproachAnimated(true);
        } else {
          exitMobileApproachFocus(0);
        }
      });
    }

    return button;
  }

  function enterMobileApproachFocus() {
    if (!isMobileLayoutViewport()) return;

    clearMobileApproachNavTimeouts();
    mobileApproachFocusIsExiting = false;
    ensureMobileApproachBackButton();
    document.documentElement.classList.add("dcr-mobile-approach-focus-active");

    animateMobileNavOut();
    revealMobileApproachBackButton(5200);
  }

  function exitMobileApproachFocus(delay) {
    if (!isMobileLayoutViewport()) {
      document.documentElement.classList.remove("dcr-mobile-approach-focus-active");
      mobileApproachFocusIsExiting = false;
      return;
    }

    const focusIsActive =
      document.documentElement.classList.contains("dcr-mobile-approach-focus-active");

    const exitDelay = typeof delay === "number" ? delay : 0;

    if (mobileApproachFocusIsExiting && exitDelay <= 0) {
      document.documentElement.classList.remove("dcr-mobile-approach-focus-active");

      const clearExistingExitStateTimeout = setTimeout(() => {
        mobileApproachFocusIsExiting = false;
      }, 3600);

      mobileApproachNavTimeouts.push(clearExistingExitStateTimeout);
      return;
    }

    if (!focusIsActive && mobileApproachFocusIsExiting) return;

    mobileApproachFocusIsExiting = true;
    clearMobileApproachNavTimeouts();
    hideMobileApproachBackButton();

    getLeftNavButtons().forEach((item) => {
      item.style.transition = "none";
      item.style.transitionDelay = "0ms";
      item.style.opacity = "0";
      item.style.filter = "blur(8px)";
      item.style.transform = "translateX(-22px) scale(0.988)";
      item.style.pointerEvents = "none";
    });

    const runNavReturn = () => {
      animateMobileNavIn(120);
    };

    const runFinalExit = () => {
      document.documentElement.classList.remove("dcr-mobile-approach-focus-active");

      const clearExitStateTimeout = setTimeout(() => {
        mobileApproachFocusIsExiting = false;
      }, 3600);

      mobileApproachNavTimeouts.push(clearExitStateTimeout);
    };

    if (exitDelay > 0) {
      const navReturnDelay = Math.min(1450, Math.max(650, exitDelay - 3200));

      const navReturnTimeout = setTimeout(runNavReturn, navReturnDelay);
      const finalExitTimeout = setTimeout(runFinalExit, exitDelay);

      mobileApproachNavTimeouts.push(navReturnTimeout, finalExitTimeout);
      approachTimeouts.push(finalExitTimeout);
    } else {
      runFinalExit();
      runNavReturn();
    }
  }

  function installMobileLayoutFixes() {
    if (document.getElementById("dcr-mobile-layout-fixes")) return;

    const style = document.createElement("style");
    style.id = "dcr-mobile-layout-fixes";
    style.textContent = `
      .dcr-video-still-fallback {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: var(--dcr-mobile-vh, 100vh) !important;
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
        top: calc(var(--dcr-mobile-vh, 100vh) * 0.545) !important;
        width: min(46vw, 560px) !important;
        height: min(14vw, 155px) !important;
        transform: translate(-50%, -50%) scale(0.96);
        transform-origin: 50% 50%;
        background:
          radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.28) 0%,
            rgba(0, 0, 0, 0.14) 38%,
            rgba(0, 0, 0, 0.05) 58%,
            rgba(0, 0, 0, 0) 78%
          );
        filter: blur(18px);
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

      @media (max-width: 1024px) {
        .dcr-name-shadow-spot {
          top: calc(var(--dcr-mobile-vh, 100svh) * 0.552) !important;
          width: 62vw !important;
          height: 18vw !important;
          filter: blur(15px);
        }
      }

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

      @media (max-width: 1024px) {
        html,
        body {
          width: 100% !important;
          height: var(--dcr-mobile-vh, 100svh) !important;
          min-height: var(--dcr-mobile-vh, 100svh) !important;
          max-height: var(--dcr-mobile-vh, 100svh) !important;
          overflow: hidden !important;
          overscroll-behavior: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        body {
          position: relative !important;
          touch-action: manipulation;
        }

        .hero-section {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: var(--dcr-mobile-vh, 100svh) !important;
          min-height: var(--dcr-mobile-vh, 100svh) !important;
          max-height: var(--dcr-mobile-vh, 100svh) !important;
          overflow: hidden !important;
        }

        #main-reel,
        #commercial-reel,
        #narrative-reel,
        #tom-ford-reel {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: var(--dcr-mobile-vh, 100svh) !important;
          min-height: var(--dcr-mobile-vh, 100svh) !important;
          max-height: var(--dcr-mobile-vh, 100svh) !important;
          object-fit: cover !important;
          object-position: center center !important;
        }

        .center-name-wrapper,
        .center-name-wrapper-opening {
          position: fixed !important;
          left: 50vw !important;
          top: calc(var(--dcr-mobile-vh, 100svh) * 0.5) !important;
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
        .center-name-wrapper .subheadline {
          text-align: center !important;
        }

        .center-name-wrapper .name-stack {
          line-height: 0.82 !important;
        }

        .center-name-wrapper .name-stack > * {
          margin-top: 0 !important;
          margin-bottom: clamp(0px, 0.22vh, 2px) !important;
          line-height: 0.82 !important;
        }

        .center-name-wrapper .name-stack > *:last-child {
          margin-bottom: 0 !important;
        }

        .side-nav {
          position: fixed !important;
          left: 8.5vw !important;
          top: calc(var(--dcr-mobile-vh, 100svh) * 0.058) !important;
          right: auto !important;
          bottom: auto !important;
          z-index: 110 !important;
        }

        .side-nav .nav-text,
        .side-nav a {
          max-width: 76vw !important;
        }

        .approach-overlay {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: var(--dcr-mobile-vh, 100svh) !important;
          min-height: var(--dcr-mobile-vh, 100svh) !important;
          max-height: var(--dcr-mobile-vh, 100svh) !important;
          overflow: hidden !important;
          z-index: 32 !important;
        }

        .approach-overlay {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: flex-start !important;
          box-sizing: border-box !important;
          padding: calc(var(--dcr-mobile-vh, 100svh) * 0.18) 7vw calc(var(--dcr-mobile-vh, 100svh) * 0.10) 8vw !important;
        }

        .approach-container {
          position: fixed !important;
          left: 11.8vw !important;
          right: 7vw !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: auto !important;
          max-width: none !important;
          height: auto !important;
          max-height: calc(var(--dcr-mobile-vh, 100svh) * 0.62) !important;
          overflow: hidden !important;
          z-index: 36 !important;
        }

        .approach-txt,
        .approach-text,
        .approach-copy {
          position: relative !important;
          left: auto !important;
          top: auto !important;
          right: auto !important;
          bottom: auto !important;
          width: 100% !important;
          max-width: none !important;
          transform: none !important;
          font-size: clamp(12px, 2.9vw, 16px) !important;
          line-height: 1.5 !important;
          letter-spacing: 0.11em !important;
          z-index: 36 !important;
        }

        .approach-txt {
          align-self: center !important;
          text-align: center !important;
          margin: 0 0 calc(var(--dcr-mobile-vh, 100svh) * 0.035) 0 !important;
        }

        .approach-copy {
          margin: 0 !important;
        }

        .approach-copy + .approach-copy {
          margin-top: calc(var(--dcr-mobile-vh, 100svh) * 0.035) !important;
        }

        .approach-reveal-line {
          max-width: 100% !important;
        }

        .approach-ig-link {
          position: fixed !important;
          right: 6.8vw !important;
          bottom: calc(var(--dcr-mobile-vh, 100svh) * 0.075) !important;
          z-index: 120 !important;
        }

        .post-production-projects-panel,
        .direction-projects-panel,
        .colour-projects-panel,
        .color-projects-panel,
        .contact-overlay {
          max-height: var(--dcr-mobile-vh, 100svh) !important;
          overflow: hidden !important;
        }

        .dcr-mobile-approach-back {
          position: fixed !important;
          left: 8.5vw !important;
          top: calc(var(--dcr-mobile-vh, 100svh) * 0.058) !important;
          z-index: 160 !important;
          display: block !important;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          border: 0;
          margin: 0;
          padding: 0;
          color: rgba(255, 255, 255, 0.92);
          font: inherit;
          font-size: clamp(11px, 2.45vw, 14px);
          line-height: 1;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          cursor: pointer;
          filter: blur(6px);
          transform: translateX(-16px) scale(0.986);
          transition:
            opacity 2100ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 2600ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 3200ms cubic-bezier(0.13, 1, 0.22, 1);
        }

        html.dcr-mobile-approach-focus-active .side-nav {
          pointer-events: none !important;
        }

        html.dcr-mobile-approach-focus-active .approach-container {
          left: 8vw !important;
          right: 8vw !important;
          top: 34.5% !important;
          transform: translateY(-50%) !important;
          max-height: calc(var(--dcr-mobile-vh, 100svh) * 0.72) !important;
        }

        html.dcr-mobile-approach-focus-active .approach-txt {
          margin-bottom: calc(var(--dcr-mobile-vh, 100svh) * 0.04) !important;
        }

        html.dcr-mobile-approach-focus-active .approach-txt,
        html.dcr-mobile-approach-focus-active .approach-text,
        html.dcr-mobile-approach-focus-active .approach-copy {
          transform: translateY(calc(var(--dcr-mobile-vh, 100svh) * -0.095)) !important;
        }

        html.dcr-mobile-approach-focus-active .approach-ig-link,
        html.dcr-mobile-approach-focus-active .ig-link,
        html.dcr-mobile-approach-focus-active [data-approach-ig],
        html.dcr-mobile-approach-focus-active [data-instagram-link] {
          opacity: 0 !important;
          filter: blur(6px) !important;
          pointer-events: none !important;
          transition:
            opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 1600ms cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
      }
    `;

    document.head.appendChild(style);

    function setMobileViewportHeight() {
      const viewportHeight =
        window.visualViewport && window.visualViewport.height
          ? window.visualViewport.height
          : window.innerHeight;

      document.documentElement.style.setProperty(
        "--dcr-mobile-vh",
        viewportHeight + "px"
      );
    }

    setMobileViewportHeight();

    window.addEventListener("resize", setMobileViewportHeight);
    window.addEventListener("orientationchange", () => {
      setTimeout(setMobileViewportHeight, 250);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setMobileViewportHeight);
    }
  }

  let customPageLoadIntroHasRun = false;

  function prepareCustomPageLoadIntro() {
    document.documentElement.classList.add("custom-page-load-intro-active");

    const openingName = document.querySelector(".center-name-wrapper-opening");

    if (openingName) {
      openingName.style.transition = "none";
      openingName.style.opacity = "0";
      openingName.style.visibility = "hidden";
      openingName.style.pointerEvents = "none";
    }

    getCenterNameElements().forEach((element) => {
      element.style.transformOrigin = "50% 50%";
      element.style.transition = "none";
      element.style.visibility = "visible";
      element.style.opacity = "0.94";
      element.style.filter = "blur(1.15px)";
      element.style.transform = "translateY(1.5px) scale(0.98)";
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

    if (videos.main) {
      videos.main.style.transition = "none";
      videos.main.style.opacity = "1";
      videos.main.style.filter = "blur(18px)";
      videos.main.style.transform = "scale(1.026)";
      videos.main.style.willChange = "filter, transform";
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
        if (videos.main) {
          videos.main.style.transition =
            "filter 8200ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 8600ms cubic-bezier(0.13, 1, 0.22, 1)";

          videos.main.style.opacity = "1";
          videos.main.style.filter = "blur(0)";
          videos.main.style.transform = "scale(1)";
        }

        getCenterNameElements().forEach((element) => {
          element.style.transition =
            "opacity 1500ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "filter 1850ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 4200ms cubic-bezier(0.13, 1, 0.22, 1)";

          element.style.transitionDelay = "20ms";
          element.style.visibility = "visible";
          element.style.opacity = "1";
          element.style.filter = "blur(0)";
          element.style.transform = "translateY(0) scale(1)";
          element.style.pointerEvents = "";
        });

        showNameShadowSpot(0);

        const introNavItems = Array.from(getLeftNavButtons());
        const mobileIntroNav = isMobileLayoutViewport();
        const introNavBaseDelay = mobileIntroNav ? 3350 : 3350;
        const introNavStagger = mobileIntroNav ? 0 : 72;
        const introNavSettleBase = mobileIntroNav ? 6180 : 6100;
        const introNavSettleStagger = mobileIntroNav ? 0 : 92;

        introNavItems.forEach((item, index) => {
          const delay = introNavBaseDelay + index * introNavStagger;

          item.style.transition =
            "opacity 2300ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "filter 3100ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 3600ms cubic-bezier(0.13, 1, 0.22, 1)";

          item.style.transitionDelay = delay + "ms";
          item.style.visibility = "visible";
          item.style.opacity = "1";
          item.style.filter = "blur(0)";
          item.style.transform = "translateX(0) scale(1)";
          item.style.pointerEvents = "auto";

          const navSettleTimeout = setTimeout(() => {
            settleNavItemAfterArrival(item);
          }, introNavSettleBase + index * introNavSettleStagger);

          revealTimeouts.push(navSettleTimeout);
        });

        const cleanupTimeout = setTimeout(() => {
          document.documentElement.classList.remove("custom-page-load-intro-active");

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
      const text = button.textContent.trim().toLowerCase();

      if (sectionName === "colour") {
        return text === "colour" || text === "color" || text === "post production";
      }

      if (sectionName === "direction") {
        return text === "direction";
      }

      if (sectionName === "approach") {
        return text === "my approach" || text === "approach" || text === "my philosophy";
      }

      if (sectionName === "contact") {
        return text === "contact";
      }

      return false;
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

  function returnToMainWebsiteVideo() {
    const tomFordVideo = videos["tom-ford"];
    const mainVideo = videos.main;

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    if (tomFordVideo) {
      safelySetMuted(tomFordVideo, true);
      safelySetVolume(tomFordVideo, 0);
      safelySetPlaybackRate(tomFordVideo, 1);
      resetClientVideoToStartFrame(tomFordVideo);

      tomFordVideo.style.transition =
        "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
        "filter 1.4s cubic-bezier(0.8, 0, 0.2, 1), " +
        "transform 1.4s ease";

      tomFordVideo.style.opacity = "0";
      tomFordVideo.style.filter = "blur(2px) brightness(1)";
      tomFordVideo.style.transform = "scale(1.02)";
    }

    if (mainVideo) {
      safelySetMuted(mainVideo, true);
      safelySetPlaybackRate(mainVideo, 1);

      mainVideo.style.transition =
        "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
        "filter 1.4s cubic-bezier(0.8, 0, 0.2, 1), " +
        "transform 1.4s ease";

      mainVideo.style.opacity = "1";
      mainVideo.style.filter = "blur(0) brightness(1)";
      mainVideo.style.transform = "scale(1)";

      playVideo(mainVideo);
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
    const tomFordVideo = videos["tom-ford"];
    const mainVideo = videos.main;

    if (audioFadeAnimation) {
      cancelAnimationFrame(audioFadeAnimation);
    }

    if (tomFordVideo) {
      safelySetMuted(tomFordVideo, true);
      safelySetVolume(tomFordVideo, 0);
      safelySetPlaybackRate(tomFordVideo, 1);
      resetClientVideoToStartFrame(tomFordVideo);

      tomFordVideo.style.opacity = "0";
      tomFordVideo.style.filter = "blur(2px) brightness(1)";
      tomFordVideo.style.transform = "scale(1.02)";
    }

    if (mainVideo) {
      safelySetMuted(mainVideo, true);
      safelySetPlaybackRate(mainVideo, 1);
      mainVideo.style.opacity = "1";
      mainVideo.style.filter = "blur(0) brightness(1)";
      mainVideo.style.transform = "scale(1)";
      playVideo(mainVideo);
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

  function setApproachVideoTransition(video, duration) {
    video.style.transition =
      "opacity 1.4s cubic-bezier(0.66, 0, 0.2, 1), " +
      "filter " + duration + "ms cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform " + duration + "ms cubic-bezier(0.22, 1, 0.36, 1)";
  }

  function blurCurrentVideoForApproach() {
    const video = videos[current];
    if (!video) return;

    setApproachVideoTransition(video, 5200);

    video.style.filter = "blur(7px) brightness(0.62)";
    video.style.transform = "scale(1.015)";
  }

  function clearApproachVideoBlur() {
    const video = videos[current];
    if (!video) return;

    setApproachVideoTransition(video, 5000);

    video.style.filter = "blur(0) brightness(1)";
    video.style.transform = "scale(1)";
  }

  function showVideo(target) {
    if (!videos[target]) return;

    if (current === target) {
      if (target === "tom-ford") {
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

        if (key === "tom-ford") {
          resetClientVideoToStartFrame(video);
        }
      }
    });

    if (target !== "tom-ford" && !isApproachOpen && !isContactOpen) {
      showCenterNameAnimated(250);
    }

    if (videos[current]) {
      videos[current].style.opacity = "0";
      videos[current].style.filter = "blur(2px) brightness(1)";
      videos[current].style.transform = "scale(1.02)";
    }

    videos[target].currentTime = 0;

    if (target === "tom-ford") {
      if (audioFadeAnimation) {
        cancelAnimationFrame(audioFadeAnimation);
      }

      safelySetMuted(videos[target], false);
      safelySetVolume(videos[target], 1);
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

    if (target === "tom-ford") {
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
      isMobileLayoutViewport() &&
      document.documentElement.classList.contains("dcr-mobile-approach-focus-active");

    const textStartDelay = isMobileApproachFocus ? 420 : 1550;
    const lineStagger = isMobileApproachFocus ? 135 : 170;
    const groupPause = isMobileApproachFocus ? 360 : 460;
    const fadeInDuration = isMobileApproachFocus ? 3000 : 3600;
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

    exitMobileApproachFocus(5200);

    resumeApproachVideoPlayback();
    showCenterNameAnimated(1500);

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
      showCenterNameAnimated(700);
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
    fadeCurrentAudioToZero();

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

    showProjectsGradient();

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

    clearContactTimeouts();

    if (isApproachOpen) {
      hideApproachAnimated(true);
    }

    if (activeSection) {
      closeActiveSectionAnimated();
    }

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
  const colourLink = getMainNavButton("colour");
  const directionLink = getMainNavButton("direction");
  const approachLink = getMainNavButton("approach");
  const contactLink = getMainNavButton("contact");

  configureVideoAutoplayFallbacks();
  prepareClientOneShotVideo(videos["tom-ford"]);

  installMobileLayoutFixes();
  installReactiveCornerVignettes();
  ensureNameShadowSpot();
  ensureMobileApproachBackButton();
  prepareCustomPageLoadIntro();

  hideProjectsGradient();
  hideInactivePanelsWithoutBreakingLayout();
  hideApproachImmediate(false);
  prepareContactHidden();
  hideContactImmediate();

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

  if (tomFordLink) {
    tomFordLink.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (isContactOpen) return;

      if (current === "tom-ford") {
        returnToMainWebsiteVideo();
        return;
      }

      showVideo("tom-ford");
      activateProjectFocus(tomFordLink);
    });
  }

  if (colourLink) {
    colourLink.addEventListener("mouseenter", () => {
      if (isContactOpen) return;
      focusElement(colourLink);
    });

    colourLink.addEventListener("mouseleave", () => {
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
      if (isContactOpen) return;
      focusElement(directionLink);
    });

    directionLink.addEventListener("mouseleave", () => {
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
      if (isContactOpen) return;
      focusElement(approachLink);
    });

    approachLink.addEventListener("mouseleave", () => {
      if (isContactOpen) return;
      if (activeMainNavButton !== approachLink) {
        resetElement(approachLink);
      }
    });
  }

  if (contactLink) {
    contactLink.addEventListener("mouseenter", () => {
      if (isContactOpen) return;
      focusElement(contactLink);
    });

    contactLink.addEventListener("mouseleave", () => {
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
      activateProjectFocus(button);
    });
  });

  const allHoverButtons = getAllHoverButtons();

  allHoverButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      if (isContactOpen) return;
      if (elementBelongsToInactiveProjectPanel(button)) return;
      focusElement(button);
    });

    button.addEventListener("mouseleave", () => {
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
