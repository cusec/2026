"use client";

import { useState, useEffect, useRef } from "react";

export default function SmoothFollower() {
  const mousePosition = useRef({ x: 0, y: 0 });

  const dotPosition = useRef({ x: 0, y: 0 });
  const borderDotPosition = useRef({ x: 0, y: 0 });

  const [renderPos, setRenderPos] = useState({
    dot: { x: 0, y: 0 },
    border: { x: 0, y: 0 },
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const DOT_SMOOTHNESS = 0.8;
  const BORDER_DOT_SMOOTHNESS = 0.6;

  useEffect(() => {
    // Mark as mounted on client
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);

    const interactiveElements = document.querySelectorAll(
      "a, button, img, input, textarea, select"
    );
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    // Animation function for smooth movement
    const animate = () => {
      const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
      };

      dotPosition.current.x = lerp(
        dotPosition.current.x,
        mousePosition.current.x,
        DOT_SMOOTHNESS
      );
      dotPosition.current.y = lerp(
        dotPosition.current.y,
        mousePosition.current.y,
        DOT_SMOOTHNESS
      );

      borderDotPosition.current.x = lerp(
        borderDotPosition.current.x,
        mousePosition.current.x,
        BORDER_DOT_SMOOTHNESS
      );
      borderDotPosition.current.y = lerp(
        borderDotPosition.current.y,
        mousePosition.current.y,
        BORDER_DOT_SMOOTHNESS
      );

      setRenderPos({
        dot: { x: dotPosition.current.x, y: dotPosition.current.y },
        border: {
          x: borderDotPosition.current.x,
          y: borderDotPosition.current.y,
        },
      });

      requestAnimationFrame(animate);
    };

    // Start animation loop
    const animationId = requestAnimationFrame(animate);

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });

      cancelAnimationFrame(animationId);
    };
  }, []);

  // Return the same structure on both server and client
  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-50">
      <div
        className="absolute rounded-full bg-light-mode/70"
        style={{
          width: "8px",
          height: "8px",
          transform: "translate(-50%, -50%)",
          left: isMounted ? `${renderPos.dot.x}px` : "0px",
          top: isMounted ? `${renderPos.dot.y}px` : "0px",
          opacity: isMounted ? 1 : 0, // Hide until client-side hydration
        }}
      />

      <div
        className="absolute rounded-full border border-light-mode/70"
        style={{
          width: isHovering ? "44px" : "28px",
          height: isHovering ? "44px" : "28px",
          transform: "translate(-50%, -50%)",
          left: isMounted ? `${renderPos.border.x}px` : "0px",
          top: isMounted ? `${renderPos.border.y}px` : "0px",
          transition: "width 0.1s, height 0.1s",
          opacity: isMounted ? 1 : 0, // Hide until client-side hydration
        }}
      />
    </div>
  );
}
