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

const CustomVideoPlayer = React.memo(({ src, userId, className = "", percentage = 0, onPercentageChange, ...props }) => {
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
  const lastReportedTimeRef = useRef(0);
  const [hasSeekedInitially, setHasSeekedInitially] = useState(false);

  // --- Watch Tracking ---
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [totalWatched, setTotalWatched] = useState(0);
  const watchedSetRef = useRef(new Set());

  console.log(percentage)
  console.log(currentTime)



  // Set initial video position based on percentage
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    console.log('------------ho rha hai---------------')

    const seekToPercentage = () => {
      if (video.duration > 0 && percentage >= 0) {
        const seekTime = (percentage / 100) * video.duration;
        // Only seek if this is a meaningful change
        console.log(seekTime,"seekTime")
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

    if (video.readyState >= 2) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);


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
            playPromise.catch(error => {
              console.log('Playback failed:', error);
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
      rootMargin: '0px'
    });

    const currentContainer = containerRef.current;
    observer.observe(currentContainer);

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [wasPlaying]);



  useEffect(() => {
    if (!src) {
      console.error("No video source provided");
      return;
    }

    const video = document.createElement("video");
    video.src = src;
    video.preload = "auto";
    video.playsInline = true;
    video.muted = true;

    const renderFrame = () => {
      if (!video || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
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
        drawWatermark(ctx, canvas);
      }

      if (!video.paused && !video.ended) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    const drawWatermark = (ctx, canvas) => {
      if (!userId) return;
      const text = `User: ${userId}`;
      const fontSize = Math.max(12, canvas.width * 0.02);
      const padding = 10;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.textBaseline = "middle";
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize * 1.2;
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(padding, canvas.height - textHeight - padding * 2, textWidth + padding * 2, textHeight + padding);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText(text, padding * 2, canvas.height - textHeight / 2 - padding);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      resizeCanvas();
      renderFrame();
    };



    const handlePlay = () => {
      const video = videoRef.current;
      if (!video) return;

      if (!hasSeekedInitially && video.readyState >= 2) {
        const targetTime = (percentage / 100) * video.duration;
        console.log('targetTime', targetTime);
        if (Math.abs(video.currentTime - targetTime) > 0.1) {
          // video.currentTime = targetTime;
          setCurrentTime(targetTime);
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            setHasSeekedInitially(true);
            const playPromise = video.play();
            handlePlayPromise(playPromise);
          };
          video.addEventListener('seeked', onSeeked, { once: true });
          return;
        }
        setHasSeekedInitially(true);
      }

      const playPromise = video.play();
      handlePlayPromise(playPromise);
    };

    const handlePlayPromise = (playPromise) => {
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          setWasPlaying(true);
          renderFrame();
        }).catch(error => {
          console.log('Playback failed:', error);
          setIsPlaying(false);
          setWasPlaying(false);
        });
      }
    };
    const handlePause = () => {
      const video = videoRef.current;
      if (!video) return;

      // Stop animation frame loop immediately
      cancelAnimationFrame(animationFrameRef.current);
      setIsPlaying(false);

      // Update the current time immediately
      const current = video.currentTime;
      console.log(current, "handlePause")
      setCurrentTime(current);

      if (video.duration > 0) {
        const currentPercentage = (current / video.duration) * 100;
        setProgress(currentPercentage);

        if (typeof onPercentageChange === "function") {
          onPercentageChange(currentPercentage.toFixed(2));
        }
      }
    };

    const handleEnded = () => {
      const video = videoRef.current;
      if (!video) return;

      setIsPlaying(false);
      cancelAnimationFrame(animationFrameRef.current);

      // Calculate and update percentage
      if (video.duration > 0) {
        const currentPercentage = (video.currentTime / video.duration) * 100;
        onPercentageChange(currentPercentage.toFixed(2));
        // console.log(`Ended at: ${video.currentTime.toFixed(1)}s (${currentPercentage.toFixed(1)}%)`);
      }
      handleTimeUpdate();
    };


    const handleError = (e) => {
      console.error("Video error:", e);
    };
    const handleTimeUpdate = () => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      const current = video.currentTime;
      // const seekTime = (percentage / 100) * video.duration;
      const currentPercentage = (current / video.duration) * 100;
      console.log(current, "handleTimeUpdate")
      setCurrentTime(current);
      // video.currentTime = current;
      if (!isDragging) {
        setProgress(currentPercentage);
      }

      // Track watched time (only track full seconds to avoid too many updates)
      const currentSecond = Math.floor(current);
      if (!watchedSetRef.current.has(currentSecond)) {
        watchedSetRef.current.add(currentSecond);
        renderFrame();
      }
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    videoRef.current = video;

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [src, userId]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    resizeCanvas();
  }, [isFullscreen]);

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
        playPromise.then(() => {
          setIsPlaying(true);
          setWasPlaying(true);
        }).catch(error => {
          console.log('Playback failed:', error);
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
    videoRef.current.currentTime = pos * videoRef.current.duration;
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
    videoRef.current.currentTime = pos * videoRef.current.duration;
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
      <Watermark isPlaying={isPlaying} />

      <div className={styles.controls}>
        <div className={styles.timelineflx}>
          <div className={styles.timer}>
            <span>{formatTime(currentTime)}</span>
          </div>

          <div className={styles.timelinerelative} onClick={handleProgressClick} ref={progressBarRef}>
            <div className={styles.loadprogress}></div>
            <div className={styles.progressmain} style={{ width: `${progress}%` }}>
              <div className={styles.progress}>
                <div
                  className={styles.progressdotmain}
                  onMouseDown={handleMouseDown}
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                >
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
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeSliderChange}
                    className={styles.volumeSlider}
                    ref={volumeSliderRef}
                  />
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

