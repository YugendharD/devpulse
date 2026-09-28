import { useRef } from "react";

function Tilt({ as: Tag = "div", className = "", max = 8, children, ...rest }) {
  const ref = useRef(null);

  function handleMove(event) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  }

  function handleLeave() {
    const el = ref.current;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Tilt;