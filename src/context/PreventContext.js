"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const PreventContext = createContext();

export function PreventProvider({ children }) {
  const [showBlackout, setShowBlackout] = useState(false);
  const pressedKeys = useRef(new Set());
  const blackoutTimeoutRef = useRef(null);
  console.log(pressedKeys.current);
  console.log(blackoutTimeoutRef.current,'-----------------------');
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    // Hide content on tab switch/minimize
    let originalDisplay = null;
    const sensitiveContent = document.getElementById("sensitive-content");
    const handleVisibility = () => {
      if (document.hidden && sensitiveContent) {
        originalDisplay = sensitiveContent.style.display;
        sensitiveContent.style.display = "none";
      } else if (sensitiveContent) {
        sensitiveContent.style.display = originalDisplay || "";
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Track pressed keys for Shift+S combos using ref
    const handleKeyDown = (e) => {
      pressedKeys.current.add(e.key.toLowerCase());
      let blocked = false;
      if (
        e.key === "printscreen" ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["i", "j", "c"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === "s") ||
        (e.metaKey &&
          e.shiftKey &&
          ["i", "j", "c"].includes(e.key.toLowerCase())) ||
        (e.metaKey && e.key.toLowerCase() === "s") ||
        (e.metaKey && e.key.toLowerCase() === "p") ||
        (e.metaKey && e.key.toLowerCase() === "g") ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === "r")
      ) {
        blocked = true;
      }
      // Prevent Shift+S and any combination with Shift+S
      if (
        e.shiftKey &&
        pressedKeys.current.has("s") &&
        pressedKeys.current.size > 1
      ) {
        blocked = true;
      }

      if (e.keyCode === 91 || e.keyCode === 93) {
        e.preventDefault(); // Prevents the default action of the Windows key
        blocked = true;

      }




      document.addEventListener("keydown", (e) => {
        if ((e.keyCode === 91 || e.keyCode === 93) && e.keyCode === 71) {
          console.log("Meta + G pressed!");
          e.preventDefault();
          e.stopPropagation()
          setShowBlackout(true);
          if (blackoutTimeoutRef.current) clearTimeout(blackoutTimeoutRef.current);
          blackoutTimeoutRef.current = setTimeout(() => setShowBlackout(false), 60000);
        }
      });
      
      // ESC key to remove blackout
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
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Blackout overlay style
  const blackoutStyle = {
    opacity: showBlackout ? 1 : 0,
  };
  console.log(showBlackout);

  return (
    <PreventContext.Provider value={{ prevent: true }}>
      {/* Blackout overlay */}
      <div style={blackoutStyle} className="blocker"></div>
      {/* Wrap children in a sensitive-content div for visibility control */}
      <div id="sensitive-content">{children}</div>
    </PreventContext.Provider>
  );
}

export function usePrevent() {
  return useContext(PreventContext);
}
