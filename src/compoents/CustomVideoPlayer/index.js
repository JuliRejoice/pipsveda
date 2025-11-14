"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./CustomVideoPlayer.module.scss";
import Playicon from "../../../public/assets/icons/playicon";
import Pauseicon from "../../../public/assets/icons/pauseicon";
import Audiofullicon from "../../../public/assets/icons/audiofullicon";
import Audiomuteicon from "../../../public/assets/icons/audiomuteicon";
import Fullscreenicon from "../../../public/assets/icons/fullscreenicon";
import Minimizedicon from "../../../public/assets/icons/minimizedicon";
import Watermark from "../watermark/watermark";

const CustomVideoPlayer = React.memo(({ src, userId, className = "", percentage = 0, onPercentageChange, isIntro, ...props }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [hasSeekedInitially, setHasSeekedInitially] = useState(false);

  const initialPercentage = typeof percentage === "number" ? percentage : parseFloat(percentage) || 0;
  const percentageRef = useRef(initialPercentage);
  const maxPercentageRef = useRef(initialPercentage);
  const lastReportedPercentageRef = useRef(initialPercentage);
  const ignoreNextPercentagePropRef = useRef(false);

  // Update video position when percentage or src changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const newPercentage = typeof percentage === "number" ? percentage : parseFloat(percentage) || 0;

    // Always update the refs when src changes or percentage is 0
    const shouldUpdate = src !== video.src ||
      newPercentage === 0 ||
      Math.abs(newPercentage - percentageRef.current) > 0.1;

    if (shouldUpdate) {
      // Reset max percentage when src changes
      if (src !== video.src) {
        maxPercentageRef.current = newPercentage;
      } else {
        maxPercentageRef.current = Math.max(maxPercentageRef.current, newPercentage);
      }

      percentageRef.current = newPercentage;

      // Reset video and force seek to 0 when src changes or percentage is 0
      const resetAndSeek = () => {
        if (video.duration > 0) {
          const seekTime = (newPercentage / 100) * video.duration;
          video.currentTime = seekTime;
          setCurrentTime(seekTime);
          setProgress(newPercentage);
          forceCanvasUpdate();
        }
      };

      if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        resetAndSeek();
      } else {
        const onLoadedData = () => {
          resetAndSeek();
          video.removeEventListener('loadeddata', onLoadedData);
        };
        video.addEventListener('loadeddata', onLoadedData);
      }
    }
  }, [percentage, src]);

  // Force update canvas
  const forceCanvasUpdate = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const videoAspect = video.videoWidth / video.videoHeight;
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
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, offsetX, offsetY, renderWidth, renderHeight);
  };

  // --- Watch Tracking ---
  const watchedSetRef = useRef(new Set());

  console.log(percentage, '------------------')
  // Set initial video position based on percentage
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seekToPercentage = () => {
      if (video.duration > 0 && percentage >= 0 && percentage <= 100) {
        const seekTime = (percentage / 100) * video.duration;
        // Only seek if this is a meaningful change
        if (Math.abs(video.currentTime - seekTime) > 0.05) {
          video.currentTime = seekTime;
          setCurrentTime(seekTime);
          setProgress(percentage);

          // If paused, manually render a frame
          if (video.paused) {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              const videoAspect = video.videoWidth / video.videoHeight;
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
              ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, offsetX, offsetY, renderWidth, renderHeight);
            }
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      seekToPercentage();
      setDuration(video.duration);
    };

    const handleCanPlay = () => {
      // Ensure we seek when video is ready to play
      if (video.readyState >= 2 && video.duration > 0) {
        seekToPercentage();
      }
    };

    if (video.readyState >= 2 && video.duration > 0) {
      seekToPercentage();
      setDuration(video.duration);
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("canplay", handleCanPlay);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [percentage]);

  // Handle scroll visibility
  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    const handleIntersection = (entries) => {
      const [entry] = entries;
      const video = videoRef.current;

      if (entry.isIntersecting) {
        // When coming back into view
        setIsInView(true);
        if (wasPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Playback failed:", error);
              setWasPlaying(false);
            });
          }
        }
      } else {
        // When going out of view
        setIsInView(false);
        if (!video.paused) {
          setWasPlaying(true);
          video.pause();
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.5,
      rootMargin: "0px",
    });

    const currentContainer = containerRef.current;
    observer.observe(currentContainer);

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [wasPlaying]);

  // Replace your existing useEffect([src, userId]) that creates document.createElement("video")
  // with this updated version that re-uses the JSX video element.
  console.log(percentage, 'percentage')

  useEffect(() => {
    if (!src) {
      console.error("No video source provided");
      return;
    }
    console.log('src', src)
    console.log(percentage, 'percentage')

    const startPercentage = typeof percentage === "number" ? percentage : parseFloat(percentage) || 0;
    console.log(startPercentage, '----------startPercentage----------')
    maxPercentageRef.current = startPercentage;
    lastReportedPercentageRef.current = startPercentage;
    percentageRef.current = startPercentage;
    ignoreNextPercentagePropRef.current = false;
    watchedSetRef.current = new Set();

    const video = videoRef.current;
    if (!video) return;

    // make sure the DOM video element has the correct attributes
    video.src = src;
    video.preload = "auto";
    video.playsInline = true;
    video.muted = true;

    const renderFrame = () => {
      if (!video || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth && video.videoHeight) {
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const canvasAspectRatio = canvas.width / canvas.height;

        let renderWidth, renderHeight, offsetX, offsetY;
        if (videoAspectRatio > canvasAspectRatio) {
          renderHeight = canvas.height;
          renderWidth = renderHeight * videoAspectRatio;
          offsetX = (canvas.width - renderWidth) / 2;
          offsetY = 0;
        } else {
          renderWidth = canvas.width;
          renderHeight = renderWidth / videoAspectRatio;
          offsetX = 0;
          offsetY = (canvas.height - renderHeight) / 2;
        }

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, offsetX, offsetY, renderWidth, renderHeight);
      }

      if (!video.paused && !video.ended) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      resizeCanvas();

      const currentPercentage = percentageRef.current;
      if (video.duration > 0 && currentPercentage > 0 && currentPercentage <= 100) {
        const seekTime = (currentPercentage / 100) * video.duration;
        // only seek if meaningful
        if (Math.abs(video.currentTime - seekTime) > 0.05) {
          video.currentTime = seekTime;
          setCurrentTime(seekTime);
          setProgress(currentPercentage);
          setHasSeekedInitially(false);
        }
      }

      renderFrame();
    };

    const handlePlay = () => {
      if (!video || !video.duration) return;

      const currentPercentage = percentageRef.current;
      const targetTime = (currentPercentage / 100) * video.duration;
      if (Math.abs(video.currentTime - targetTime) > 0.1 && video.readyState >= 2 && currentPercentage > 0) {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          setHasSeekedInitially(true);
          const playPromise = video.play();
          handlePlayPromise(playPromise);
        };
        video.addEventListener("seeked", onSeeked, { once: true });
        video.currentTime = targetTime;
        setCurrentTime(targetTime);
        setProgress(currentPercentage);
        return;
      }

      if (!hasSeekedInitially) setHasSeekedInitially(true);
      const playPromise = video.play();
      handlePlayPromise(playPromise);
    };

    const handlePlayPromise = (playPromise) => {
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setWasPlaying(true);
            renderFrame();
          })
          .catch((error) => {
            console.log("Playback failed:", error);
            setIsPlaying(false);
            setWasPlaying(false);
          });
      }
    };

    const handlePause = () => {
      cancelAnimationFrame(animationFrameRef.current);
      setIsPlaying(false);

      if (!video) return;
      const current = video.currentTime;
      setCurrentTime(current);

      if (video.duration > 0) {
        const currentPercentage = (current / video.duration) * 100;
        setProgress(currentPercentage);
        console.log(currentPercentage)

        const previousMax = maxPercentageRef.current;
        console.log(previousMax, '--------previousMax----------')
        const updatedPercentage = Math.max(previousMax, currentPercentage);
        console.log(updatedPercentage, '----------updatedPercentage---------------')
        maxPercentageRef.current = updatedPercentage;
        percentageRef.current = currentPercentage;

        const normalizedPercentage = Number(updatedPercentage.toFixed(2));
        console.log(normalizedPercentage, '----------dhjhgdf---------------')
        if (typeof onPercentageChange === "function" && normalizedPercentage >= (lastReportedPercentageRef.current ?? 0) + 0.01) {
          ignoreNextPercentagePropRef.current = true;
          lastReportedPercentageRef.current = normalizedPercentage;
          console.log('handlePause', normalizedPercentage)
          onPercentageChange(normalizedPercentage);
        }
      }
    };

    const handleEnded = () => {
      cancelAnimationFrame(animationFrameRef.current);
      setIsPlaying(false);

      if (!video || !video.duration) return;
      const currentPercentage = (video.currentTime / video.duration) * 100;
      const previousMax = maxPercentageRef.current;
      const finalPercentage = Math.max(previousMax, currentPercentage);
      maxPercentageRef.current = finalPercentage;
      percentageRef.current = currentPercentage;

      const normalizedPercentage = Number(finalPercentage.toFixed(2));
      if (typeof onPercentageChange === "function" && normalizedPercentage >= (lastReportedPercentageRef.current ?? 0) + 0.01) {
        ignoreNextPercentagePropRef.current = true;
        lastReportedPercentageRef.current = normalizedPercentage;
        onPercentageChange(normalizedPercentage);
      }
      handleTimeUpdate();
    };

    const handleError = (e) => {
      console.error("Video error:", e);
    };

    const handleTimeUpdate = () => {
      if (!video || !video.duration) return;
      const current = video.currentTime;
      const currentPercentage = (current / video.duration) * 100;
      setCurrentTime(current);
      if (!isDragging) setProgress(currentPercentage);

      if (currentPercentage > maxPercentageRef.current) {
        maxPercentageRef.current = currentPercentage;
      }
      percentageRef.current = currentPercentage;
      const currentSecond = Math.floor(current);
      if (!watchedSetRef.current.has(currentSecond)) {
        watchedSetRef.current.add(currentSecond);
        renderFrame();
      }
    };

    // Attach events to the DOM video element
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    // video.addEventListener("pause", ()=>{console.log('pause')});
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    // Save ref flags
    videoRef.current = video;

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      // remove listeners
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [src, userId, percentage]);


  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    resizeCanvas();
  }, [isFullscreen]);

  useEffect(() => {
    const numericPercentage = typeof percentage === "number" ? percentage : parseFloat(percentage);

    if (!Number.isFinite(numericPercentage)) {
      return;
    }

    if (numericPercentage > maxPercentageRef.current) {
      maxPercentageRef.current = numericPercentage;
    }

    if (numericPercentage > lastReportedPercentageRef.current) {
      lastReportedPercentageRef.current = numericPercentage;
    }

    if (ignoreNextPercentagePropRef.current) {
      ignoreNextPercentagePropRef.current = false;
      return;
    }

    percentageRef.current = numericPercentage;

    const video = videoRef.current;
    if (video && video.duration > 0 && numericPercentage > 0 && Math.abs(video.currentTime - (numericPercentage / 100) * video.duration) > 0.5) {
      setHasSeekedInitially(false);
    }
  }, [percentage]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setWasPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setWasPlaying(true);
          })
          .catch((error) => {
            console.log("Playback failed:", error);
            setIsPlaying(false);
            setWasPlaying(false);
          });
      }
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeSliderChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (isMuted && newVolume > 0) setIsMuted(false);
    }
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    let pos = (e.clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));
    const video = videoRef.current;
    const newTime = pos * (video.duration || 0);
    video.currentTime = newTime;
    // Update states immediately when paused (timeupdate may not fire)
    setCurrentTime(newTime);
    if (video.duration > 0) {
      const newPercentage = (newTime / video.duration) * 100;
      setProgress(newPercentage);
      const previousMax = maxPercentageRef.current;
      if (newPercentage > previousMax) {
        maxPercentageRef.current = newPercentage;
      }
      percentageRef.current = newPercentage;

      const normalizedPercentage = Number(maxPercentageRef.current.toFixed(2));

      if (typeof onPercentageChange === "function" && normalizedPercentage > (lastReportedPercentageRef.current ?? 0) + 0.01) {
        ignoreNextPercentagePropRef.current = true;
        lastReportedPercentageRef.current = normalizedPercentage;
        onPercentageChange(normalizedPercentage);
      }
    }

  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !videoRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    let pos = (e.clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));
    const video = videoRef.current;
    const newTime = pos * (video.duration || 0);
    video.currentTime = newTime;
    // Live-update UI and internal percentage while dragging
    setCurrentTime(newTime);
    if (video.duration > 0) {
      // const newPercentage = (newTime / video.duration) * 100;
      // setProgress(newPercentage);
      // percentageRef.current = newPercentage;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) handleMouseMove(e);
    };
    const handleGlobalMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const resizeCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div ref={containerRef} className={`${styles.videoContainer} ${className} ${isFullscreen ? styles.fullscreen : ""}`}>

      <canvas ref={canvasRef} className={styles.videoCanvas} onClick={togglePlay} />
      <video ref={videoRef} className={styles.videoElement} src={src} {...props} style={{ display: "none" }} />
      {!isIntro && <Watermark isPlaying={isPlaying} />}

      <div className={styles.controls}>
        <div className={styles.timelineflx}>
          <div className={styles.timer}>
            <span>{formatTime(currentTime)}</span>
          </div>

          <div className={styles.timelinerelative} onClick={handleProgressClick} ref={progressBarRef}>
            <div className={styles.loadprogress}></div>
            <div className={styles.progressmain} style={{ width: `${progress}%` }}>
              <div className={styles.progress}>
                <div className={styles.progressdotmain} onMouseDown={handleMouseDown} style={{ cursor: isDragging ? "grabbing" : "grab" }}>
                  <div className={styles.progressdot}></div>
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
            <div className={styles.icons} onClick={togglePlay}>
              {isPlaying ? <Pauseicon /> : <Playicon />}
            </div>

            <div className={styles.volumeContainer}>
              <div className={styles.icons} onClick={toggleMute}>
                {isMuted || volume === 0 ? <Audiomuteicon /> : <Audiofullicon />}
              </div>
              {showVolumeSlider && (
                <div className={styles.volumeSliderContainer}>
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeSliderChange} className={styles.volumeSlider} ref={volumeSliderRef} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.videcontrolsflxright}>
            <div className={styles.icons} onClick={toggleFullscreen}>
              {isFullscreen ? <Minimizedicon /> : <Fullscreenicon />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CustomVideoPlayer;
