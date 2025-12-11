"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./CustomVideoPlayer.module.scss";
import Pauseicon from "../../../public/assets/icons/pauseicon.js";
import Audiofullicon from "../../../public/assets/icons/audiofullicon.js";
import Audiomuteicon from "../../../public/assets/icons/audiomuteicon.js";
import Fullscreenicon from "../../../public/assets/icons/fullscreenicon.js";
import Minimizedicon from "../../../public/assets/icons/minimizedicon.js";
import Forward10Icon from "../../../public/assets/icons/forward.js";
import Replay10Icon from "../../../public/assets/icons/backward.js";

const THROTTLE_REPORT_DELTA = 0.00; // 0.01% threshold for reporting
const MIN_SEEK_DIFF_SECONDS = 0.00; // minimal difference to perform a seek
const SUBTITLE_OFFSET = -4; // Offset in seconds to make subtitles appear earlier (negative = earlier)

// Simple SRT parser: returns array of { start, end, text }
function parseSRT(srtText) {
  if (!srtText) return [];
  // Normalize line endings
  const text = srtText.replace(/\r/g, "");
  const blocks = text.split(/\n\n+/);

  const cues = [];
  for (const block of blocks) {
    const lines = block
      .trim()
      .split(/\n/)
      .map((l) => l.trim());
    if (lines.length >= 2) {
      // First line often index - skip if numeric
      let timeLineIndex = 0;
      if (/^\d+$/.test(lines[0])) {
        timeLineIndex = 1;
      }
      const timeLine = lines[timeLineIndex];
      const m = timeLine.match(
        /(\d{2}:\d{2}:\d{2}[.,]\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[.,]\d{1,3})/
      );
      if (!m) continue;

      const toSeconds = (ts) => {
        const parts = ts.replace(",", ".").split(":");
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const s = parseFloat(parts[2]);
        return h * 3600 + m * 60 + s;
      };

      const start = toSeconds(m[1]);
      const end = toSeconds(m[2]);
      const textLines = lines.slice(timeLineIndex + 1);
      const cueText = textLines.join("\n");

      cues.push({ start, end, text: cueText });
    }
  }
  return cues;
}

const CustomVideoPlayer = React.memo(function CustomVideoPlayer({
  src,
  srtFile = null, // legacy / unused right now
  userId,
  className = "",
  percentage = 0,
  onPercentageChange,
  isIntro,
  thumbnail,
  subtitleOffset = 0,
  ...props
}) {
  // refs
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);

  // percentage refs to preserve your original behavior
  const percentageRef = useRef(
    typeof percentage === "number" ? percentage : parseFloat(percentage) || 0
  );
  const maxPercentageRef = useRef(percentageRef.current);
  const lastReportedPercentageRef = useRef(percentageRef.current);
  const ignoreNextPercentagePropRef = useRef(false);

  // other refs
  const watchedSetRef = useRef(new Set());
  const isMountedRef = useRef(false);
  const wasPlayingBeforeDragRef = useRef(false);

  // NEW: track "was playing before hide" via ref to avoid update-depth loops
  const wasPlayingBeforeHideRef = useRef(false);

  // video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(percentageRef.current); // shown progress %
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(null); // temporary progress while dragging

  // ✅ subtitles / CC state
  const [subtitles, setSubtitles] = useState([]); // parsed SRT cues
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(() =>
    Array.isArray(srtFile) && srtFile.length > 0 ? srtFile[0].language : ""
  );
  const [showCcOptions, setShowCcOptions] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const hasSubtitles = srtFile?.length > 0;

  console.log(hasSubtitles, "hasSubtitles");

  // 🔹 Helper to compute current subtitle with high precision
  const updateSubtitle = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || !hasSubtitles || subtitles.length === 0) {
      setCurrentSubtitle("");
      return;
    }

    // Subtract offset from currentTime to make subtitles appear earlier
    // Negative offset value means subtitles will display before their actual timestamp
    const t = vid.currentTime - (subtitleOffset || 0);
    const cue = subtitles.find((c) => t >= c.start && t <= c.end);
    const text = cue ? cue.text : "";

    if (currentSubtitle !== text) {
      setCurrentSubtitle(text);
    }
  }, [hasSubtitles, subtitles, currentSubtitle, subtitleOffset]);

  useEffect(() => {
    const startHideTimer = () => {
      // Clear any existing timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      // Set a new timeout to hide controls after 3 seconds of inactivity
      controlsTimeoutRef.current = setTimeout(() => {
        if (
          !isDragging &&
          !showVolumeSlider &&
          !showSpeedOptions &&
          !showCcOptions
        ) {
          setShowControls(false);
        }
      }, 3000);
    };

    const showControlsHandler = () => {
      setShowControls(true);
      startHideTimer();
    };

    // Add event listeners
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", showControlsHandler);
      container.addEventListener("mouseenter", showControlsHandler);
      container.addEventListener("mouseleave", () => {
        if (!isDragging) {
          setShowControls(false);
        }
      });

      // Also show controls when any control is focused (keyboard navigation)
      container.addEventListener("focusin", showControlsHandler);
    }

    // Initial show of controls
    startHideTimer();

    // Clean up
    return () => {
      if (container) {
        container.removeEventListener("mousemove", showControlsHandler);
        container.removeEventListener("mouseenter", showControlsHandler);
        container.removeEventListener("mouseleave", () => setShowControls(false));
        container.removeEventListener("focusin", showControlsHandler);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isDragging, showVolumeSlider, showSpeedOptions, showCcOptions]);

  // keep selectedLanguage sensible when srtVideoFile changes
  useEffect(() => {
    if (Array.isArray(srtFile) && srtFile.length > 0) {
      setSelectedLanguage((prev) => prev || srtFile[0].language);
    } else {
      setSelectedLanguage("");
    }
  }, [srtFile]);

  const ccDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ccDropdownRef.current && !ccDropdownRef.current.contains(event.target)) {
        setShowCcOptions(false);
      }
    };

    // Only add the event listener when the dropdown is open
    if (showCcOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCcOptions]);

  console.log(srtFile, "srtFile");

  // Helper: format time
  const formatTime = (t = 0) => {
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Seek forward/backward by seconds
  const seek = (seconds) => {
    const video = videoRef.current;
    if (!video) return;

    let newTime = video.currentTime + seconds;
    // Ensure time is within valid range
    newTime = Math.max(0, Math.min(newTime, duration));

    video.currentTime = newTime;
    setCurrentTime(newTime);

    // Update progress
    const newProgress = (newTime / duration) * 100;
    setProgress(newProgress);

    // Update percentage if needed
    if (typeof onPercentageChange === "function") {
      const newPercentage = (newTime / duration) * 100;
      onPercentageChange(newPercentage);
    }
  };

  // Handle playback rate change
  const handlePlaybackRateChange = (rate) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSpeedOptions(false);
    }
  };

  // Toggle speed options
  const toggleSpeedOptions = () => {
    setShowSpeedOptions(!showSpeedOptions);
  };

  // Resize canvas to element size
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // draw a frame to avoid blank
    forceCanvasUpdate();
  }, []);

  // draw current video frame to canvas
  const forceCanvasUpdate = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    const videoAspect = vw / vh;
    const canvasAspect = canvas.width / canvas.height;

    let renderWidth, renderHeight, offsetX, offsetY;
    if (videoAspect > canvasAspect) {
      renderHeight = canvas.height;
      renderWidth = renderHeight * videoAspect;
      offsetX = (canvas.width - renderWidth) / 2;
      offsetY = 0;
    } else {
      renderWidth = canvas.width;
      renderHeight = renderWidth / videoAspect;
      offsetX = 0;
      offsetY = (canvas.height - renderHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      ctx.drawImage(
        video,
        0,
        0,
        vw,
        vh,
        offsetX,
        offsetY,
        renderWidth,
        renderHeight
      );
    } catch (e) {
      // sometimes drawImage can throw if video not ready; ignore
    }
  }, []);

  // Render loop while video is playing
  const startRenderLoop = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
    const loop = () => {
      forceCanvasUpdate();
      updateSubtitle(); // <– update subtitles every animation frame
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
  }, [forceCanvasUpdate, updateSubtitle]);

  const stopRenderLoop = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
  }, []);

  // Apply muted state to DOM video
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !!isMuted;
  }, [isMuted]);

  // Listen to window resize
  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // ✅ IntersectionObserver: pause when not in view, resume if it was playing before
  useEffect(() => {
    const container = containerRef.current;
    const vid = videoRef.current;
    if (!container || !vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (wasPlayingBeforeHideRef.current) {
            const p = vid.play();
            if (p && p.catch) {
              p.catch(() => {
                wasPlayingBeforeHideRef.current = false;
              });
            }
          }
        } else {
          if (!vid.paused) {
            wasPlayingBeforeHideRef.current = true;
            vid.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Handle incoming src / percentage props: initialize refs and set video src
  useEffect(() => {
    const vid = videoRef.current;
    if (!src || !vid) return;

    // initialize trackers
    const newPerc =
      typeof percentage === "number" ? percentage : parseFloat(percentage) || 0;
    percentageRef.current = newPerc;
    maxPercentageRef.current = newPerc;
    lastReportedPercentageRef.current = newPerc;
    ignoreNextPercentagePropRef.current = false;
    watchedSetRef.current = new Set();

    // set up video element
    vid.src = src;
    vid.preload = "auto";
    vid.playsInline = true;

    // Ensure we update UI and canvas once metadata available
    const onLoadedMetadata = () => {
      setDuration(vid.duration || 0);
      resizeCanvas();

      // seek to incoming percentage if meaningful
      if (vid.duration && percentageRef.current > 0) {
        const target = (percentageRef.current / 100) * vid.duration;
        if (Math.abs(vid.currentTime - target) > MIN_SEEK_DIFF_SECONDS) {
          vid.currentTime = target;
          setCurrentTime(target);
          setProgress(percentageRef.current);
          forceCanvasUpdate();
        }
      } else {
        forceCanvasUpdate();
      }
    };

    const onCanPlay = () => {
      forceCanvasUpdate();
    };

    vid.addEventListener("loadedmetadata", onLoadedMetadata);
    vid.addEventListener("canplay", onCanPlay);

    return () => {
      vid.removeEventListener("loadedmetadata", onLoadedMetadata);
      vid.removeEventListener("canplay", onCanPlay);
      // cleanup src to avoid memory leak
      try {
        vid.pause();
        vid.removeAttribute("src");
        vid.load();
      } catch (e) { }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, resizeCanvas, forceCanvasUpdate, percentage]);

  // 🔹 Load subtitles whenever language or srtVideoFile changes
  useEffect(() => {
    if (!hasSubtitles || !selectedLanguage) {
      setSubtitles([]);
      setCurrentSubtitle("");
      return;
    }

    const entry = srtFile.find((item) => item.language === selectedLanguage);
    if (!entry || !entry.videoFile) {
      setSubtitles([]);
      setCurrentSubtitle("");
      return;
    }

    let isCancelled = false;

    (async () => {
      try {
        const res = await fetch(entry.videoFile);
        const text = await res.text();
        if (isCancelled) return;
        const cues = parseSRT(text);
        setSubtitles(cues || []);
      } catch (err) {
        console.error("Failed to load SRT:", err);
        if (!isCancelled) {
          setSubtitles([]);
          setCurrentSubtitle("");
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [hasSubtitles, selectedLanguage, srtFile]);

  // Core video event handlers
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handlePlay = () => {
      setIsPlaying(true);
      wasPlayingBeforeHideRef.current = true;
      startRenderLoop();
    };

    const handlePause = () => {
      setIsPlaying(false);
      wasPlayingBeforeHideRef.current = false;
      stopRenderLoop();

      if (!vid.duration) return;
      const current = vid.currentTime;
      setCurrentTime(current);
      const currentPercentage = (current / vid.duration) * 100;
      setProgress(currentPercentage);

      const prevMax = maxPercentageRef.current || 0;
      const updatedMax = Math.max(prevMax, currentPercentage);
      maxPercentageRef.current = updatedMax;
      percentageRef.current = currentPercentage;

      const normalized = Number(updatedMax.toFixed(2));
      if (
        typeof onPercentageChange === "function" &&
        normalized >=
        (lastReportedPercentageRef.current ?? 0) + THROTTLE_REPORT_DELTA
      ) {
        ignoreNextPercentagePropRef.current = true;
        lastReportedPercentageRef.current = normalized;
        onPercentageChange(normalized);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      wasPlayingBeforeHideRef.current = false;
      stopRenderLoop();
      setCurrentSubtitle(""); // clear subtitles when video ends

      if (!vid.duration) return;
      const finalPercentage = Math.max(
        maxPercentageRef.current || 0,
        (vid.currentTime / vid.duration) * 100
      );
      maxPercentageRef.current = finalPercentage;
      percentageRef.current = (vid.currentTime / vid.duration) * 100;

      const normalized = Number(finalPercentage.toFixed(2));
      if (
        typeof onPercentageChange === "function" &&
        normalized >=
        (lastReportedPercentageRef.current ?? 0) + THROTTLE_REPORT_DELTA
      ) {
        ignoreNextPercentagePropRef.current = true;
        lastReportedPercentageRef.current = normalized;
        onPercentageChange(normalized);
      }
      // Update UI
      setProgress(finalPercentage);
      setCurrentTime(vid.currentTime || 0);
    };

    const handleTimeUpdate = () => {
      if (!vid.duration) return;
      const current = vid.currentTime;
      setCurrentTime(current);
      const currentPercentage = (current / vid.duration) * 100;
      // update internal refs
      if (!isDragging) setProgress(currentPercentage);
      if (currentPercentage > maxPercentageRef.current)
        maxPercentageRef.current = currentPercentage;
      percentageRef.current = currentPercentage;

      // only re-draw canvas on new second to reduce work
      const sec = Math.floor(current);
      if (!watchedSetRef.current.has(sec)) {
        watchedSetRef.current.add(sec);
        forceCanvasUpdate();
      }
      // Update subtitles on every timeupdate for better sync
      updateSubtitle();
    };

    const handleError = (e) => {
      console.error("Video error:", e);
    };

    vid.addEventListener("play", handlePlay);
    vid.addEventListener("pause", handlePause);
    vid.addEventListener("ended", handleEnded);
    vid.addEventListener("timeupdate", handleTimeUpdate);
    vid.addEventListener("error", handleError);

    return () => {
      vid.removeEventListener("play", handlePlay);
      vid.removeEventListener("pause", handlePause);
      vid.removeEventListener("ended", handleEnded);
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      vid.removeEventListener("error", handleError);
      stopRenderLoop();
    };
  }, [
    onPercentageChange,
    isDragging,
    startRenderLoop,
    stopRenderLoop,
    forceCanvasUpdate,
    updateSubtitle,
  ]);

  // Respond to external percentage prop updates
  useEffect(() => {
    const numericPercentage =
      typeof percentage === "number" ? percentage : parseFloat(percentage);
    if (!Number.isFinite(numericPercentage)) return;

    if (numericPercentage > maxPercentageRef.current)
      maxPercentageRef.current = numericPercentage;
    if (numericPercentage > lastReportedPercentageRef.current)
      lastReportedPercentageRef.current = numericPercentage;

    if (ignoreNextPercentagePropRef.current) {
      ignoreNextPercentagePropRef.current = false;
      percentageRef.current = numericPercentage;
      return;
    }

    percentageRef.current = numericPercentage;
    const vid = videoRef.current;
    if (
      vid &&
      vid.duration &&
      numericPercentage >= 0 &&
      numericPercentage <= 100
    ) {
      const targetTime = (numericPercentage / 100) * vid.duration;
      if (Math.abs(vid.currentTime - targetTime) > 0.5) {
        try {
          vid.currentTime = targetTime;
          setCurrentTime(targetTime);
          setProgress(numericPercentage);
          forceCanvasUpdate();
        } catch (e) {
          // ignore
        }
      }
    }
  }, [percentage, forceCanvasUpdate]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // This will be called whenever the video’s volume OR muted state changes
    const syncVolumeFromVideo = () => {
      setVolume(vid.volume); // update React volume
      setIsMuted(vid.muted || vid.volume === 0); // update React isMuted
    };

    // Listen to native volume changes
    vid.addEventListener("volumechange", syncVolumeFromVideo);

    // Sync once initially (in case browser set any defaults)
    syncVolumeFromVideo();

    // Cleanup
    return () => {
      vid.removeEventListener("volumechange", syncVolumeFromVideo);
    };
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    // Toggle mute state
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);

    // If unmuting and volume was 0, set a default volume
    if (newMutedState === false && volume === 0) {
      const newVolume = 0.5; // Default volume when unmuting from 0
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, [isMuted, volume]);

  // Volume change
  const handleVolumeChange = useCallback(
    (e) => {
      if (!videoRef.current) return;

      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);

      // Update mute state based on volume
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  // Progress calculations (clientX/touches)
  const getRelativePosition = (clientX) => {
    const bar = progressBarRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));
    return pos;
  };

  // Start dragging (mouse or touch)
  const startDrag = (clientX) => {
    if (!videoRef.current || !progressBarRef.current) return;
    wasPlayingBeforeDragRef.current = !videoRef.current.paused;
    setIsDragging(true);
    const pos = getRelativePosition(clientX);
    const newPerc = pos * 100 || 0;
    setDragProgress(newPerc);
  };

  // Update dragging position
  const updateDrag = (clientX) => {
    if (!isDragging || !videoRef.current) return;
    const pos = getRelativePosition(clientX);
    const newPerc = pos * 100;
    setDragProgress(newPerc);
  };

  // End dragging: seek video and report percentage if required
  const endDrag = (clientX) => {
    if (!videoRef.current) {
      setIsDragging(false);
      setDragProgress(null);
      return;
    }
    const vid = videoRef.current;
    const pos = getRelativePosition(clientX);
    const newPerc = pos * 100;
    const newTime = (vid.duration || 0) * pos;

    if (Math.abs(vid.currentTime - newTime) > MIN_SEEK_DIFF_SECONDS) {
      try {
        vid.currentTime = newTime;
      } catch (e) { }
    }

    setIsDragging(false);
    setDragProgress(null);
    setCurrentTime(newTime);
    setProgress(newPerc);

    // ensure subtitle matches new position, even if paused
    updateSubtitle();

    const prevMax = maxPercentageRef.current || 0;
    const updatedMax = Math.max(prevMax, newPerc);
    maxPercentageRef.current = updatedMax;
    percentageRef.current = newPerc;

    const normalized = Number(updatedMax.toFixed(2));
    if (
      typeof onPercentageChange === "function" &&
      normalized >=
      (lastReportedPercentageRef.current ?? 0) + THROTTLE_REPORT_DELTA
    ) {
      ignoreNextPercentagePropRef.current = true;
      lastReportedPercentageRef.current = normalized;
      onPercentageChange(normalized);
    }

    if (wasPlayingBeforeDragRef.current && vid.paused) {
      const p = vid.play();
      if (p && p.catch) {
        p.catch((err) => {
          console.log("Play after seek failed:", err);
          setIsPlaying(false);
        });
      }
    }
  };

  // Global mouse/touch move & up handlers while dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      updateDrag(e.clientX);
    };
    const handleMouseUp = (e) => {
      if (!isDragging) return;
      endDrag(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !e.touches || e.touches.length === 0) return;
      updateDrag(e.touches[0].clientX);
      e.preventDefault();
    };
    const handleTouchEnd = (e) => {
      if (!isDragging) return;
      const touch = e.changedTouches && e.changedTouches[0];
      endDrag(touch ? touch.clientX : 0);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  // click on progress bar (seek)
  const handleProgressClick = (e) => {
    const clientX =
      e.clientX ??
      (e.touches && e.touches[0] && e.touches[0].clientX) ??
      0;
    endDrag(clientX);
  };

  // pointer down on handle / bar
  const handleProgressPointerDown = (e) => {
    const clientX =
      e.clientX ??
      (e.touches && e.touches[0] && e.touches[0].clientX) ??
      0;
    startDrag(clientX);
  };

  // Toggle fullscreen (CSS class-based)
  const toggleFullscreen = () => setIsFullscreen((s) => !s);

  // cleanup animation on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // compute UI progress to show (drag override)
  const shownProgress =
    isDragging && dragProgress !== null ? dragProgress : progress;

  // lines for current subtitle
  const subtitleLines = currentSubtitle ? currentSubtitle.split("\n") : [];

  return (
    <div
      ref={containerRef}
      className={`${styles.videoContainer} ${className} ${isFullscreen ? styles.fullscreen : ""
        }`}
    >
      {thumbnail && !isPlaying && currentTime === 0 && (
        <img
          src={thumbnail}
          alt="Chapter thumbnail"
          className={styles.thumbnailOverlay}
          onClick={togglePlay}
        />
      )}

      <canvas
        ref={canvasRef}
        className={styles.videoCanvas}
        onClick={togglePlay}
      />

      {/* 🔹 Subtitle overlay */}
      {subtitleLines.length > 0 && (
        <div className={styles.subtitles}>
          {subtitleLines.map((line, idx) => (
            <span key={idx}>
              {line}
              {idx < subtitleLines.length - 1 && <br />}
            </span>
          ))}
        </div>
      )}

      <video
        ref={videoRef}
        className={styles.videoElement}
        src={src}
        {...props}
        style={{ display: "none" }}
      />

      {showControls && (
        <div className={styles.controls}>
          <div className={styles.timelineflx}>
            <div className={styles.timer}>
              <span>{formatTime(currentTime)}</span>
            </div>

            <div
              className={styles.timelinerelative}
              ref={progressBarRef}
              onClick={handleProgressClick}
              onMouseDown={handleProgressPointerDown}
              onTouchStart={handleProgressPointerDown}
              role="button"
              aria-label="Seek"
            >
              <div className={styles.loadprogress} />
              <div
                className={styles.progressmain}
                style={{ width: `${shownProgress}%` }}
              >
                <div className={styles.progress}>
                  <div
                    className={styles.progressdotmain}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleProgressPointerDown(e);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleProgressPointerDown(e);
                    }}
                    style={{ cursor: isDragging ? "grabbing" : "grab" }}
                  >
                    <div className={styles.progressdot} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.timer}>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className={styles.videcontrolsflx}>
            <div className={styles.videcontrolsflxleft}>
              <div
                className={styles.icons}
                onClick={() => seek(-10)}
                role="button"
                aria-label="Rewind 10 seconds"
                title="Rewind 10 seconds"
              >
                <img
                  src="/assets/icons/backward.svg"
                  alt="Play"
                  width="24"
                  height="24"
                />
              </div>

              <div
                className={styles.icons}
                onClick={togglePlay}
                role="button"
                aria-label="Play/Pause"
              >
                {isPlaying ? (
                  <img
                    src="/assets/icons/Play.svg"
                    alt="Play"
                    width="24"
                    height="24"
                  />
                ) : (
                  <img
                    src="/assets/icons/Pause.svg"
                    alt="Play"
                    width="24"
                    height="24"
                  />
                )}
              </div>

              <div
                className={styles.icons}
                onClick={() => seek(10)}
                role="button"
                aria-label="Forward 10 seconds"
                title="Forward 10 seconds"
              >
                <img
                  src="/assets/icons/forward.svg"
                  alt="Play"
                  width="24"
                  height="24"
                />
              </div>

              <div
                className={styles.volumeContainer}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <div
                  className={styles.icons}
                  onClick={toggleMute}
                  role="button"
                  aria-label="Mute/Unmute"
                >
                  {isMuted || volume === 0 ? (
                    <img
                      src="/assets/icons/soundoff.svg"
                      alt="Play"
                      width="24"
                      height="24"
                    />
                  ) : (
                    <img
                      src="/assets/icons/sound.svg"
                      alt="Play"
                      width="24"
                      height="24"
                    />
                  )}
                </div>
                {showVolumeSlider && (
                  <div className={styles.volumeSliderContainer}>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className={styles.volumeSlider}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.videcontrolsflxright}>
              <div
                className={`${styles.speedControl} ${showSpeedOptions ? styles.active : ""
                  }`}
                onMouseEnter={() => setShowSpeedOptions(true)}
                onMouseLeave={() => setShowSpeedOptions(false)}
              >
                <button
                  className={styles.speedButton}
                  onClick={toggleSpeedOptions}
                  aria-label="Playback speed"
                  aria-expanded={showSpeedOptions}
                >
                  {playbackRate}x
                </button>
                {showSpeedOptions && (
                  <div className={styles.speedOptions}>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        className={`${styles.speedOption} ${playbackRate === speed ? styles.active : ""
                          }`}
                        onClick={() => handlePlaybackRateChange(speed)}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 🔹 CC language selector – only if we actually have subtitles */}
              {hasSubtitles && (
                <div
                  ref={ccDropdownRef}
                  className={`${styles.ccControl} ${showCcOptions ? styles.active : ""
                    }`}
                >
                  <button
                    className={styles.ccButton}
                    onClick={() => setShowCcOptions((v) => !v)}
                    aria-label="Subtitles"
                    aria-expanded={showCcOptions}
                  >
                    {selectedLanguage ? (
                      <img
                        src="/assets/icons/CC.svg"
                        alt="Play"
                        width="24"
                        height="24"
                      />
                    ) : (
                      <img
                        src="/assets/icons/CCOff.svg"
                        alt="Play"
                        width="24"
                        height="24"
                      />
                    )}
                  </button>
                  {showCcOptions && (
                    <div className={styles.ccOptions}>
                      <button
                        className={`${styles.ccOption} ${!selectedLanguage ? styles.active : ""
                          }`}
                        onClick={() => {
                          setSelectedLanguage("");
                          setShowCcOptions(false);
                        }}
                      >
                        Off
                      </button>
                      {srtFile.map(({ language, _id }) => (
                        <button
                          key={_id || language}
                          className={`${styles.ccOption} ${selectedLanguage === language ? styles.active : ""
                            }`}
                          onClick={() => {
                            setSelectedLanguage(language);
                            setShowCcOptions(false);
                          }}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div
                className={styles.icons}
                onClick={toggleFullscreen}
                role="button"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <img
                    src="/assets/icons/minimize.svg"
                    alt="Play"
                    width="24"
                    height="24"
                  />
                ) : (
                  <img
                    src="/assets/icons/maximize.svg"
                    alt="Play"
                    width="24"
                    height="24"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default CustomVideoPlayer;
