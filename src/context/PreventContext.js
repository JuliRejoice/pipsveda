"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const PreventContext = createContext();

export function PreventProvider({ children }) {
  const [showBlackout, setShowBlackout] = useState(false);
  const pressedKeys = useRef(new Set());
  const blackoutTimeoutRef = useRef(null);

  useEffect(() => {
    const sensitiveContent = document.getElementById("sensitive-content");

    // Context menu prevent
    const handleContextMenu = (e) => e.preventDefault();

    // Hide content on tab switch/minimize
    let originalDisplay = null;
    const handleVisibility = () => {
      if (document.hidden && sensitiveContent) {
        originalDisplay = sensitiveContent.style.display;
        sensitiveContent.style.display = "none";
      } else if (sensitiveContent) {
        sensitiveContent.style.display = originalDisplay || "";
      }
    };

    // Detect possible recording APIs (monkey patch getDisplayMedia)
    if (navigator.mediaDevices?.getDisplayMedia) {
      console.log("getDisplayMedia is available");
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
      navigator.mediaDevices.getDisplayMedia = async (...args) => {
        // When screen recording is requested, blackout
        setShowBlackout(true);
        if (blackoutTimeoutRef.current) clearTimeout(blackoutTimeoutRef.current);
        blackoutTimeoutRef.current = setTimeout(() => setShowBlackout(false), 60000);
        throw new Error("Screen recording is blocked by policy"); // deny
        // If you want to allow but blackout content, just remove throw
        // return await originalGetDisplayMedia.apply(navigator.mediaDevices, args);
      };
    }

    // Track pressed keys
    const handleKeyDown = (e) => {
      pressedKeys.current.add(e.key.toLowerCase());
      let blocked = false;

      // Block printscreen + devtools + save/print
      if (
        e.key === "printscreen" ||
        (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === "s") ||
        (e.metaKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
        (e.metaKey && ["s", "p", "g"].includes(e.key.toLowerCase())) ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === "r")
      ) {
        blocked = true;
      }

      // Block Shift+S combos
      if (e.shiftKey && pressedKeys.current.has("s") && pressedKeys.current.size > 1) {
        blocked = true;
      }

      // Block Windows / Cmd keys
      if (e.keyCode === 91 || e.keyCode === 93) {
        e.preventDefault();
        blocked = true;
      }

      // Escape clears blackout
      if (e.key === "Escape") {
        setShowBlackout(false);
        if (blackoutTimeoutRef.current) clearTimeout(blackoutTimeoutRef.current);
        return;
      }

      if (blocked) {
        e.preventDefault();
        setShowBlackout(true);
        setTimeout(() => setShowBlackout(false), 1500);
      }
    };

    const handleKeyUp = (e) => {
      pressedKeys.current.delete(e.key.toLowerCase());
    };

    // Attach listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const blackoutStyle = {
    opacity: showBlackout ? 1 : 0,
  };

  return (
    <PreventContext.Provider value={{ prevent: true }}>
      {/* Blackout overlay */}
      <div style={blackoutStyle} className="blocker"></div>
      {/* Sensitive content */}
      <div id="sensitive-content">{children}</div>
    </PreventContext.Provider>
  );
}

export function usePrevent() {
  return useContext(PreventContext);
}
