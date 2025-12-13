"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMousePosition } from "@/lib/mouse";
import ParticleTooltip from "./ParticleTooltip";

interface ParticlesProps {
  className?: string;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  desktopParticleCount?: number;
  sizeMultiplier?: number;
}

export default function Particles({
  className = "absolute inset-0 animate-fade-in",
  ease = 50,
  refresh = false,
  desktopParticleCount = 300,
  sizeMultiplier = 1,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const [frozen, setFrozen] = useState(true);
  const [islandHovered, setIslandHovered] = useState(false);

  const mobileParticleCount = 200;

  const mobileStaticity = 100;
  const desktopStaticity = 15;

  const averageParticleSize = 2 * sizeMultiplier;

  // Always run the animation loop, but skip updates if frozen
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      if (!frozen) {
        clearContext();
        circles.current.forEach((circle: Circle, i: number) => {
          // ...existing update/draw logic...
          const edge = [
            circle.x + circle.translateX - circle.size,
            canvasSize.current.w - circle.x - circle.translateX - circle.size,
            circle.y + circle.translateY - circle.size,
            canvasSize.current.h - circle.y - circle.translateY - circle.size,
          ];
          const closestEdge = edge.reduce((a, b) => Math.min(a, b));
          const remapClosestEdge = parseFloat(
            remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
          );
          if (remapClosestEdge > 1) {
            circle.alpha += 0.02;
            if (circle.alpha > circle.targetAlpha) {
              circle.alpha = circle.targetAlpha;
            }
          } else {
            circle.alpha = circle.targetAlpha * remapClosestEdge;
          }
          circle.x += circle.dx;
          circle.y += circle.dy;
          circle.translateX +=
            (mouse.current.x /
              (window.innerWidth < 768 ? mobileStaticity : desktopStaticity) /
              circle.magnetism -
              circle.translateX) /
            ease;
          circle.translateY +=
            (mouse.current.y /
              (window.innerWidth < 768 ? mobileStaticity : desktopStaticity) /
              circle.magnetism -
              circle.translateY) /
            ease;
          if (
            circle.x < -circle.size ||
            circle.x > canvasSize.current.w + circle.size ||
            circle.y < -circle.size ||
            circle.y > canvasSize.current.h + circle.size
          ) {
            circles.current.splice(i, 1);
            const newCircle = circleParams();
            drawCircle(newCircle);
          } else {
            drawCircle(
              {
                ...circle,
                x: circle.x,
                y: circle.y,
                translateX: circle.translateX,
                translateY: circle.translateY,
                alpha: circle.alpha,
              },
              true
            );
          }
        });
      }
      requestAnimationFrame(loop);
    };
    loop();
    return () => {
      running = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen, ease, mobileStaticity, desktopStaticity]);

  useEffect(() => {
    // checks if we need to unfreeze (only unfreezes when specified in session storage)
    if (typeof window !== "undefined") {
      const frozen = sessionStorage.getItem("frozen");
      if (frozen === "f") {
        setFrozen(false);
      }
    }

    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }

    // Add a small delay to ensure DOM is ready, especially in Firefox
    const initTimeout = setTimeout(() => {
      initCanvas();
    }, 100);

    window.addEventListener("resize", initCanvas);

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener("resize", initCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  // Additional effect to handle visibility and force re-initialization in Firefox
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && canvasContainerRef.current) {
        // Small delay to ensure proper initialization after visibility change
        setTimeout(() => {
          initCanvas();
        }, 50);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initCanvas = () => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      resizeCanvas();
      drawParticles();
    });
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;

      // Ensure we have valid dimensions
      const containerWidth =
        canvasContainerRef.current.offsetWidth || window.innerWidth;
      const containerHeight =
        canvasContainerRef.current.offsetHeight || window.innerHeight;

      canvasSize.current.w = containerWidth;
      canvasSize.current.h = containerHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.floor(Math.random() * 2) + averageParticleSize;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.2;
    const dy = (Math.random() - 0.5) * 0.2;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const drawParticles = () => {
    clearContext();

    // Ensure we have valid canvas dimensions before drawing
    if (canvasSize.current.w === 0 || canvasSize.current.h === 0) {
      return;
    }

    const particleCount =
      window.innerWidth < 768 ? mobileParticleCount : desktopParticleCount;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  return (
    <div
      className={`${className} hidden md:block`}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="z-0" />
      {/* Island Button */}
      <ParticleTooltip setIslandHovered={setIslandHovered} />
      <div
        onMouseEnter={() => setIslandHovered(true)}
        onMouseLeave={() => setIslandHovered(false)}
        onClick={() => {
          sessionStorage.setItem("frozen", !frozen ? "t" : "f");
          setFrozen((f) => !f);
        }}
        style={{
          position: "fixed",
          left: "50vw",
          bottom: "20px",
          transform: "translateX(-50%)",
          zIndex: 30,
          cursor: "pointer",
          transition: "width 0.3s, background 0.3s, box-shadow 0.3s",
          width: islandHovered ? 150 : 48,
          height: 48,
          background: "rgba(30,30,40,0.85)",
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: islandHovered ? "center" : "center",
          boxShadow: islandHovered
            ? "0 4px 24px rgba(0,0,0,0.25)"
            : "0 2px 8px rgba(0,0,0,0.15)",
          overflow: "hidden",
          userSelect: "none",
        }}
        tabIndex={0}
        aria-label="Freeze Particles"
      >
        <a
          style={{
            fontSize: 22,
            marginRight: islandHovered ? 12 : 0,
            transition: "margin 0.3s",
            color: frozen ? "#60a5fa" : "#fff",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {/* Snowflake Icon */}
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 2v20M12 12l7.07-7.07M12 12l-7.07-7.07M12 12l7.07 7.07M12 12l-7.07 7.07M4 12h16"
              stroke={frozen ? "#60a5fa" : "#fff"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </a>
        <a
          style={{
            opacity: islandHovered ? 1 : 0,
            maxWidth: islandHovered ? 120 : 0,
            transition: "opacity 0.3s, max-width 0.3s",
            whiteSpace: "nowrap",
            color: "#fff",
            fontWeight: 500,
            fontSize: 16,
            letterSpacing: 0.2,
          }}
        >
          Ambience
        </a>
      </div>
    </div>
  );
}
