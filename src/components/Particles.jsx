import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

const hexToRgb = (hex) => {
  let value = hex.replace("#", "");

  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const parsed = parseInt(value, 16);
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
};

export const Particles = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const contextRef = useRef(null);
  const circlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const canvasSizeRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);
  const rafIdRef = useRef(0);
  const resizeTimeoutRef = useRef(0);

  const remapValue = (value, start1, end1, start2, end2) => {
    const mapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return mapped > 0 ? mapped : 0;
  };

  const createCircle = () => {
    const { w, h } = canvasSizeRef.current;
    return {
      x: Math.floor(Math.random() * w),
      y: Math.floor(Math.random() * h),
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + size,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  };

  const drawCircle = (circle, rgb, update = false) => {
    const context = contextRef.current;
    if (!context) return;

    const { x, y, translateX, translateY, size: circleSize, alpha } = circle;
    context.translate(translateX, translateY);
    context.beginPath();
    context.arc(x, y, circleSize, 0, 2 * Math.PI);
    context.fillStyle = `rgba(${rgb.join(",")}, ${alpha})`;
    context.fill();
    context.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

    if (!update) {
      circlesRef.current.push(circle);
    }
  };

  const clearContext = () => {
    const context = contextRef.current;
    if (!context) return;

    context.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h);
  };

  const resizeCanvas = () => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!container || !canvas || !context) return;

    canvasSizeRef.current.w = container.offsetWidth;
    canvasSizeRef.current.h = container.offsetHeight;
    dprRef.current =
      typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio || 1, 1.5)
        : 1;

    canvas.width = canvasSizeRef.current.w * dprRef.current;
    canvas.height = canvasSizeRef.current.h * dprRef.current;
    canvas.style.width = `${canvasSizeRef.current.w}px`;
    canvas.style.height = `${canvasSizeRef.current.h}px`;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dprRef.current, dprRef.current);

    circlesRef.current = [];
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;

    const rgb = hexToRgb(color);

    const refillParticles = () => {
      circlesRef.current = [];
      for (let i = 0; i < quantity; i++) {
        drawCircle(createCircle(), rgb);
      }
    };

    const animate = () => {
      clearContext();
      const circles = circlesRef.current;

      for (let index = circles.length - 1; index >= 0; index -= 1) {
        const circle = circles[index];
        const edgeDistances = [
          circle.x + circle.translateX - circle.size,
          canvasSizeRef.current.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSizeRef.current.h - circle.y - circle.translateY - circle.size,
        ];

        const closestEdge = Math.min(...edgeDistances);
        const remappedEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));

        if (remappedEdge > 1) {
          circle.alpha = Math.min(circle.alpha + 0.02, circle.targetAlpha);
        } else {
          circle.alpha = circle.targetAlpha * remappedEdge;
        }

        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;

        circle.translateX +=
          (mouseRef.current.x / (staticity / circle.magnetism) - circle.translateX) /
          ease;
        circle.translateY +=
          (mouseRef.current.y / (staticity / circle.magnetism) - circle.translateY) /
          ease;

        drawCircle(circle, rgb, true);

        if (
          circle.x < -circle.size ||
          circle.x > canvasSizeRef.current.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSizeRef.current.h + circle.size
        ) {
          circles.splice(index, 1);
          drawCircle(createCircle(), rgb);
        }
      }

      rafIdRef.current = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSizeRef.current;
      if (!w || !h) return;

      const x = event.clientX - rect.left - w / 2;
      const y = event.clientY - rect.top - h / 2;

      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      }
    };

    const startAnimation = () => {
      if (!rafIdRef.current) {
        rafIdRef.current = window.requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        resizeCanvas();
        refillParticles();
      }, 180);
    };

    resizeCanvas();
    refillParticles();
    startAnimation();

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopAnimation();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [color, ease, quantity, refresh, size, staticity, vx, vy]);

  return (
    <div
      className={twMerge("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
