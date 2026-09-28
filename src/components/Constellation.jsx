import { useEffect, useRef } from "react";

const LINK_DISTANCE = 130;
const MOUSE_DISTANCE = 180;
const MAX_DOTS = 220;

function Constellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dots = [];
    let frameId = 0;
    const mouse = { x: null, y: null };

    function makeDot(x, y) {
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.4 + 0.7,
      };
    }

    function createDots() {
      const count = Math.min(150, Math.floor((width * height) / 10000));
      dots = Array.from({ length: count }, () =>
        makeDot(Math.random() * width, Math.random() * height)
      );
    }

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const nextWidth = window.innerWidth;
      const widthChanged = nextWidth !== width;

      width = nextWidth;
      height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      if (widthChanged || dots.length === 0) {
        createDots();
      }
      draw();
    }

    function update() {
      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (mouse.x !== null) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MOUSE_DISTANCE && dist > 70) {
            const pull = (1 - dist / MOUSE_DISTANCE) * 0.35;
            dot.x += (dx / dist) * pull;
            dot.y += (dy / dist) * pull;
          }
        }

        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];

        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);

          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(88, 166, 255, ${
              (1 - dist / LINK_DISTANCE) * 0.3
            })`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null) {
          const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);

          if (dist < MOUSE_DISTANCE) {
            ctx.strokeStyle = `rgba(160, 210, 255, ${
              (1 - dist / MOUSE_DISTANCE) * 0.6
            })`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = "rgba(205, 228, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      frameId = requestAnimationFrame(loop);
    }

    function handleMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }

    function handleLeave() {
      mouse.x = null;
      mouse.y = null;
    }

    function handleClick(event) {
      if (event.target.closest("button, a, input, form")) return;

      for (let i = 0; i < 4; i++) {
        dots.push(
          makeDot(
            event.clientX + (Math.random() - 0.5) * 30,
            event.clientY + (Math.random() - 0.5) * 30
          )
        );
      }

      if (dots.length > MAX_DOTS) {
        dots.splice(0, dots.length - MAX_DOTS);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    if (!reduceMotion) {
      window.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseleave", handleLeave);
      window.addEventListener("click", handleClick);
      frameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="constellation" aria-hidden="true" />;
}

export default Constellation;