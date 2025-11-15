"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./CustomVideoPlayer.module.scss";
import Playicon from "../../../public/assets/icons/playicon";
import Pauseicon from "../../../public/assets/icons/pauseicon";
import Audiofullicon from "../../../public/assets/icons/audiofullicon";
import Audiomuteicon from "../../../public/assets/icons/audiomuteicon";
import Fullscreenicon from "../../../public/assets/icons/fullscreenicon";
import Minimizedicon from "../../../public/assets/icons/minimizedicon";
import Watermark from "../watermark/watermark";

const THROTTLE_REPORT_DELTA = 0.01; // 0.01% threshold for reporting
const MIN_SEEK_DIFF_SECONDS = 0.05; // minimal difference to perform a seek

const CustomVideoPlayer = React.memo(function CustomVideoPlayer({
  src,
  userId,
  className = "",
  percentage = 0,
  onPercentageChange,
  isIntro,
  ...props
}) {
  // refs
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);

  // percentage refs to preserve your original behavior
  const percentageRef = useRef(typeof percentage === "number" ? percentage : parseFloat(percentage) || 0);
  const maxPercentageRef = useRef(percentageRef.current);
  const lastReportedPercentageRef = useRef(percentageRef.current);
  const ignoreNextPercentagePropRef = useRef(false);

  // other refs
  const watchedSetRef = useRef(new Set());
  const isMountedRef = useRef(false);

  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(percentageRef.current); // shown progress %
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(null); // temporary progress while dragging
  const [wasPlayingBeforeHide, setWasPlayingBeforeHide] = useState(false);

  // Helper: format time
  const formatTime = (t = 0) => {
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
      ctx.drawImage(video, 0, 0, vw, vh, offsetX, offsetY, renderWidth, renderHeight);
    } catch (e) {
      // sometimes drawImage can throw if video not ready; ignore
    }
  }, []);

  // Render loop while video is playing
  const startRenderLoop = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
    const loop = () => {
      forceCanvasUpdate();
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
  }, [forceCanvasUpdate]);

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

  // IntersectionObserver: pause when not in view
  useEffect(() => {
    const container = containerRef.current;
    const vid = videoRef.current;
    if (!container || !vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (wasPlayingBeforeHide) {
            const p = vid.play();
            if (p && p.catch) p.catch(() => setWasPlayingBeforeHide(false));
          }
        } else {
          if (!vid.paused) {
            setWasPlayingBeforeHide(true);
            vid.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [wasPlayingBeforeHide]);

  // Handle incoming src / percentage props: initialize refs and set video src
  useEffect(() => {
    const vid = videoRef.current;
    if (!src || !vid) return;

    // initialize trackers
    const newPerc = typeof percentage === "number" ? percentage : parseFloat(percentage) || 0;
    percentageRef.current = newPerc;
    maxPercentageRef.current = newPerc;
    lastReportedPercentageRef.current = newPerc;
    ignoreNextPercentagePropRef.current = false;
    watchedSetRef.current = new Set();

    // set up video element
    vid.src = src;
    vid.preload = "auto";
    vid.playsInline = true;
    vid.muted = true; // keep initial muted as original

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
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, resizeCanvas, forceCanvasUpdate, percentage]);

  // Core video event handlers
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setWasPlayingBeforeHide(true);
      startRenderLoop();
    };

    const handlePause = () => {
      setIsPlaying(false);
      stopRenderLoop();

      // update time & progress and report percentage if needed
      if (!vid.duration) return;
      const current = vid.currentTime;
      setCurrentTime(current);
      const currentPercentage = (current / vid.duration) * 100;
      setProgress(currentPercentage);

      // update max and report if increased meaningfully
      const prevMax = maxPercentageRef.current || 0;
      const updatedMax = Math.max(prevMax, currentPercentage);
      maxPercentageRef.current = updatedMax;
      percentageRef.current = currentPercentage;

      const normalized = Number(updatedMax.toFixed(2));
      if (typeof onPercentageChange === "function" && normalized >= (lastReportedPercentageRef.current ?? 0) + THROTTLE_REPORT_DELTA) {
        ignoreNextPercentagePropRef.current = true;
        lastReportedPercentageRef.current = normalized;
        onPercentageChange(normalized);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      stopRenderLoop();
      if (!vid.duration) return;
      const finalPercentage = Math.max(maxPercentageRef.current || 0, (vid.currentTime / vid.duration) * 100);
      maxPercentageRef.current = finalPercentage;
      percentageRef.current = (vid.currentTime / vid.duration) * 100;

      const normalized = Number(finalPercentage.toFixed(2));
      if (typeof onPercentageChange === "function" && normalized >= (lastReportedPercentageRef.current ?? 0) + THROTTLE_REPORT_DELTA) {
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
      if (currentPercentage > maxPercentageRef.current) maxPercentageRef.current = currentPercentage;
      percentageRef.current = currentPercentage;

      // only re-draw canvas on new second to reduce work
      const sec = Math.floor(current);
      if (!watchedSetRef.current.has(sec)) {
        watchedSetRef.current.add(sec);
        forceCanvasUpdate();
      }
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
  }, [onPercentageChange, isDragging, startRenderLoop, stopRenderLoop, forceCanvasUpdate]);

  // Respond to external percentage prop updates
  useEffect(() => {
    const numericPercentage = typeof percentage === "number" ? percentage : parseFloat(percentage);
    if (!Number.isFinite(numericPercentage)) return;

    if (numericPercentage > maxPercentageRef.current) maxPercentageRef.current = numericPercentage;
    if (numericPercentage > lastReportedPercentageRef.current) lastReportedPercentageRef.current = numericPercentage;

    if (ignoreNextPercentagePropRef.current) {
      // skip one incoming prop that was caused by our own reporting
      ignoreNextPercentagePropRef.current = false;
      percentageRef.current = numericPercentage;
      return;
    }

    percentageRef.current = numericPercentage;
    const vid = videoRef.current;
    if (vid && vid.duration && numericPercentage >= 0 && numericPercentage <= 100) {
      const targetTime = (numericPercentage / 100) * vid.duration;
      // if difference is meaningful, we need to seek (but don't cause extra re-render)
      if (Math.abs(vid.currentTime - targetTime) > 0.5) {
        // mark that we'll need to seek on play/loadedmetadata
        try {
          vid.currentTime = targetTime;
          setCurrentTime(targetTime);
          setProgress(numericPercentage);
          forceCanvasUpdate();
        } catch (e) {
          // some browsers throw if seeking before metadata; ignore
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage, forceCanvasUpdate]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
    } else {
      const p = vid.play();
      if (p && p.catch) {
        p.catch((err) => {
          console.log("Play failed:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [isPlaying]);

  // Toggle mute
  const toggleMute = useCallback(() => setIsMuted((v) => !v), []);

  // Volume change
  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      if (v > 0 && isMuted) setIsMuted(false);
    }
  };

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
    setIsDragging(true);
    const pos = getRelativePosition(clientX);
    const newPerc = (pos * 100) || 0;
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

    // Seek only if meaningful difference
    if (Math.abs(vid.currentTime - newTime) > MIN_SEEK_DIFF_SECONDS) {
      try {
        vid.currentTime = newTime;
      } catch (e) {
        // ignore seek errors before metadata
      }
    }

    // Update UI states
    setIsDragging(false);
    setDragProgress(null);
    setCurrentTime(newTime);
    setProgress(newPerc);
    // Update percentage tracking
    const prevMax = maxPercentageRef.current || 0;
    const updatedMax = Math.max(prevMax, newPerc);
    maxPercentageRef.current = updatedMax;
    percentageRef.current = newPerc;

    // Report if increased meaningfully
    const normalized = Number(updatedMax.toFixed(2));
    if (typeof onPercentageChange === "function" && normalized >= (lastReportedPercentageRef.current ?? 0) + THROTTLE_REPORT_DELTA) {
      ignoreNextPercentagePropRef.current = true;
      lastReportedPercentageRef.current = normalized;
      onPercentageChange(normalized);
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
      // use last touch position if available
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
    // support mouse or touch
    const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? 0;
    endDrag(clientX);
  };

  // pointer down on handle / bar
  const handleProgressPointerDown = (e) => {
    // support mouse and touch
    const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? 0;
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
  const shownProgress = isDragging && dragProgress !== null ? dragProgress : progress;

  return (
    <div
      ref={containerRef}
      className={`${styles.videoContainer} ${className} ${isFullscreen ? styles.fullscreen : ""}`}
    >
      <canvas ref={canvasRef} className={styles.videoCanvas} onClick={togglePlay} />
      <video ref={videoRef} className={styles.videoElement} src={src} {...props} style={{ display: "none" }} />

      {!isIntro && <Watermark isPlaying={isPlaying} />}

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
            <div className={styles.progressmain} style={{ width: `${shownProgress}%` }}>
              <div className={styles.progress}>
                <div
                  className={styles.progressdotmain}
                  onMouseDown={(e) => { e.stopPropagation(); handleProgressPointerDown(e); }}
                  onTouchStart={(e) => { e.stopPropagation(); handleProgressPointerDown(e); }}
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
            <div className={styles.icons} onClick={togglePlay} role="button" aria-label="Play/Pause">
              {isPlaying ? <Pauseicon /> : <Playicon />}
            </div>

            <div
              className={styles.volumeContainer}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <div className={styles.icons} onClick={toggleMute} role="button" aria-label="Mute/Unmute">
                {isMuted || volume === 0 ? <Audiomuteicon /> : <Audiofullicon />}
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
            <div className={styles.icons} onClick={toggleFullscreen} role="button" aria-label="Toggle Fullscreen">
              {isFullscreen ? <Minimizedicon /> : <Fullscreenicon />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CustomVideoPlayer;
