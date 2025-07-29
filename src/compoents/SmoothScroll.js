'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const SmoothScroll = ({ children }) => {
  const scrollRef = useRef(null);
  const [pageHeight, setPageHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const resizePageHeight = () => {
      if (scrollRef.current) {
        setPageHeight(scrollRef.current.scrollHeight);
      }
    };

    // Initial height calculation
    setTimeout(resizePageHeight, 100);
    
    // Listen for resize events
    window.addEventListener('resize', resizePageHeight);
    
    // Listen for content changes
    const observer = new MutationObserver(resizePageHeight);
    if (scrollRef.current) {
      observer.observe(scrollRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // Enhanced smooth scrolling for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const targetPosition = targetElement.offsetTop - 80; // Account for header
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('resize', resizePageHeight);
      document.removeEventListener('click', handleAnchorClick);
      observer.disconnect();
    };
  }, []);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    damping: 30,
    stiffness: 300,
    restDelta: 0.001,
  });

  const y = useTransform(smoothScrollY, (value) => `${-value}px`);

  // Don't render on server to avoid hydration issues
  if (!isClient) {
    return <div>{children}</div>;
  }

  return (
    <>
      <div style={{ height: pageHeight }} />
      <motion.div
        ref={scrollRef}
        style={{ y }}
        className="smooth-scroll-container"
      >
        {children}
      </motion.div>
    </>
  );
};

export default SmoothScroll;
