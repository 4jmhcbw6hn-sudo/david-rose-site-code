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
    element.style.transition =
      "opacity 0.95s cubic-bezier(0.22, 1, 0.36, 1), " +
      "filter 1.15s cubic-bezier(0.22, 1, 0.36, 1), " +
      "transform 1.15s cubic-bezier(0.22, 1, 0.36, 1)";

    element.style.opacity = "1";
    element.style.filter = "blur(0)";
    element.style.transform = "scale(1)";
  }

  function resetElement(element) {
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
    return document.querySelectorAll(
      ".side-nav .nav-text, .side-nav a"
    );
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
      element.style.opacity = "0.72";
      element.style.filter = "blur(7px)";
      element.style.transform = "translateY(8px) scale(0.94)";
      element.style.pointerEvents = "none";
      element.style.willChange = "opacity, filter, transform";
    });

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
            "filter 3800ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 5600ms cubic-bezier(0.13, 1, 0.22, 1)";

          videos.main.style.opacity = "1";
          videos.main.style.filter = "blur(0)";
          videos.main.style.transform = "scale(1)";
        }

        getCenterNameElements().forEach((element) => {
          element.style.transition =
            "opacity 4200ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "filter 6200ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 8200ms cubic-bezier(0.13, 1, 0.22, 1)";

          element.style.transitionDelay = "120ms";
          element.style.visibility = "visible";
          element.style.opacity = "1";
          element.style.filter = "blur(0)";
          element.style.transform = "translateY(0) scale(1)";
          element.style.pointerEvents = "";
        });

        getLeftNavButtons().forEach((item, index) => {
          const delay = 2850 + index * 115;

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
        }, 8800);

        revealTimeouts.push(cleanupTimeout);
      });
    });
  }

  function getAllHoverButtons() {
    return document.querySelectorAll(
      ".side-nav .nav-text, " +
      ".side-nav a, " +
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

    const textStartDelay = 1550;
    const lineStagger = 170;
    const groupPause = 460;
    const fadeInDuration = 3600;
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
      }, delay + 360);

      approachTimeouts.push(igRevealTimeout);
    });
  }

  function hideApproachFinal(shouldResetButton) {
    isApproachOpen = false;

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

    if (shouldResetButton && activeMainNavButton === approachLink) {
      if (approachLink) {
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

    resumeApproachVideoPlayback();
    showCenterNameAnimated(1500);

    if (shouldResetButton && activeMainNavButton === approachLink) {
      if (approachLink) {
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

  prepareClientOneShotVideo(videos["tom-ford"]);

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
