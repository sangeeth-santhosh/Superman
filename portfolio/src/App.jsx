import { useEffect, useRef, useState } from "react";

/* =======================
   CONSTANTS (UNCHANGED)
======================= */

const H = { h: 0, m: 180 };
const V = { h: 270, m: 90 };
const TL = { h: 180, m: 270 };
const TR = { h: 0, m: 270 };
const BL = { h: 180, m: 90 };
const BR = { h: 0, m: 90 };
const E = { h: 135, m: 135 };

const digits = [
  [
    BR, H, H, BL,
    V, BR, BL, V,
    V, V, V, V,
    V, V, V, V,
    V, TR, TL, V,
    TR, H, H, TL,
  ],
  [
    BR, H, BL, E,
    TR, BL, V, E,
    E, V, V, E,
    E, V, V, E,
    BR, TL, TR, BL,
    TR, H, H, TL,
  ],
  [
    BR, H, H, BL,
    TR, H, BL, V,
    BR, H, TL, V,
    V, BR, H, TL,
    V, TR, H, BL,
    TR, H, H, TL,
  ],
  [
    BR, H, H, BL,
    TR, H, BL, V,
    E, BR, TL, V,
    E, TR, BL, V,
    BR, H, TL, V,
    TR, H, H, TL,
  ],
  [
    BR, BL, BR, BL,
    V, V, V, V,
    V, TR, TL, V,
    TR, H, BL, V,
    E, E, V, V,
    E, E, TR, TL,
  ],
  [
    BR, H, H, BL,
    V, BR, H, TL,
    V, TR, H, BL,
    TR, H, BL, V,
    BR, H, TL, V,
    TR, H, H, TL,
  ],
  [
    BR, H, H, BL,
    V, BR, H, TL,
    V, TR, H, BL,
    V, BR, BL, V,
    V, TR, TL, V,
    TR, H, H, TL,
  ],
  [
    BR, H, H, BL,
    TR, H, BL, V,
    E, E, V, V,
    E, E, V, V,
    E, E, V, V,
    E, E, TR, TL,
  ],
  [
    BR, H, H, BL,
    V, BR, BL, V,
    V, TR, TL, V,
    V, BR, BL, V,
    V, TR, TL, V,
    TR, H, H, TL,
  ],
  [
    BR, H, H, BL,
    V, BR, BL, V,
    V, TR, TL, V,
    TR, H, BL, V,
    BR, H, TL, V,
    TR, H, H, TL,
  ],
];

/* =======================
   HELPERS (UNCHANGED)
======================= */

const normalizeAngle = (next, prev) => {
  const delta = ((next - prev) % 360 + 360) % 360;
  return prev + delta;
};

const randomAngle = () => Math.floor(Math.random() * 360);

const getTimeDigits = () => {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .flatMap(v => String(v).padStart(2, "0").split("").map(Number));
};

/* =======================
   CLOCK COMPONENT
======================= */

function Clock({ h, m, initial }) {
  const prev = useRef({ h: 0, m: 0 });

  const hourAngle = normalizeAngle(h, prev.current.h);
  const minuteAngle = normalizeAngle(m, prev.current.m);

  prev.current = { h: hourAngle, m: minuteAngle };

  return (
    <div
      className="clock"
      style={{
        "--hour-angle": initial ? randomAngle() : hourAngle,
        "--minute-angle": initial ? randomAngle() : minuteAngle,
        "--dur": initial ? 1 : 0.4,
      }}
    />
  );
}

/* =======================
   APP
======================= */

export default function App() {
  const [time, setTime] = useState(Array(6).fill(0));
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    let timer;

    const updateTime = () => {
      setTime(getTimeDigits());
      const now = Date.now();
      timer = setTimeout(updateTime, 1000 - (now % 1000));
    };

    const init = setTimeout(() => {
      setInitial(false);
      updateTime();
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(init);
    };
  }, []);

  return (
    <>
      {/* GLOBAL + CLOCK CSS (UNCHANGED DESIGN) */}
      <style>{`
        body { margin: 0; padding: 0; }
        *, *::before, *::after { box-sizing: border-box; }

        .app {
          --clock-size: 3vw;
          --gap: calc(var(--clock-size) * 0.05);
          --clock-segment-w: calc(var(--clock-size) * 4 + var(--gap) * 5);
          --clock-segment-h: calc(var(--clock-size) * 6 + var(--gap) * 5);
          display: flex;
          gap: var(--gap);
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding-left: calc(var(--clock-size) + var(--gap) * 2);
          font-family: sans-serif;
        }

        .app > div {
          display: flex;
          flex-wrap: wrap;
          gap: var(--gap);
          width: var(--clock-segment-w);
          height: var(--clock-segment-h);
        }

        .app > div:nth-of-type(even) {
          margin-right: var(--clock-size);
        }

        .clock {
          --w: 47%;
          --h: 3px;
          position: relative;
          width: var(--clock-size);
          height: var(--clock-size);
          border-radius: 50%;
          border: 2px solid white;
          background: linear-gradient(225deg, #d0d0d0 10%, white);
          box-shadow: -2px 2px 6px #d0d0d0, 2px -2px 6px #ffffff;
        }

        .clock::before,
        .clock::after {
          content: '';
          position: absolute;
          top: calc(50% - var(--h) / 2);
          left: 50%;
          width: var(--w);
          height: var(--h);
          background: black;
          border-radius: 9999px;
          transform-origin: 0% 50%;
          transition: calc(var(--dur) * 1s) ease-in-out;
          transform: rotate(calc(var(--angle) * 1deg));
        }

        .clock::before { --angle: var(--hour-angle); }
        .clock::after  { --angle: var(--minute-angle); }

        @media (max-width: 700px) {
          .clock { --h: 2px; border: 1px solid white; }
        }

        @media (max-width: 500px) {
          .clock { --h: 1px; --w: 50%; }
        }

        /* Mobile layout only: HH / MM / SS in 3 rows (no visual redesign) */
        @media (max-width: 640px) {
          .app {
            display: grid;
            grid-template-columns: repeat(2, var(--clock-segment-w));
            grid-auto-rows: var(--clock-segment-h);
            justify-content: center;
            align-content: center;
            justify-items: center;
            gap: var(--clock-size);
            padding-left: 0;
            padding: calc(var(--clock-size) + var(--gap) * 2);
          }

          .app > div:nth-of-type(even) {
            margin-right: 0;
          }
        }
      `}</style>

      <div className="app">
        {time.map((digit, i) => (
          <div key={i}>
            {digits[digit].map((cfg, j) => (
              <Clock key={j} {...cfg} initial={initial} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
