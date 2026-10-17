"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

// Knob diameter in px. The native knob travels between half a knob in from each
// edge, so the track and the orange fill are inset by the same amount.
const THUMB = 16;
const fillLeft = (p: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${p / 100})`;
const fillWidth = (from: number, to: number) => `calc((100% - ${THUMB}px) * ${(to - from) / 100})`;

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = "",
}) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef<HTMLDivElement>(null);

  // Synchronize internal state with external value changes (e.g., from a 'Clear All' button)
  useEffect(() => {
    // Check if the external value is actually different from our current values
    if (value[0] !== minVal || value[1] !== maxVal) {
      setMinVal(value[0]);
      setMaxVal(value[1]);
      minValRef.current = value[0];
      maxValRef.current = value[1];
    }
  }, [value[0], value[1], minVal, maxVal]);

  // Convert to percentage
  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = fillLeft(minPercent);
      range.current.style.width = fillWidth(minPercent, maxPercent);
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = fillWidth(minPercent, maxPercent);
    }
  }, [maxVal, getPercent]);


  return (
    <div className={`relative w-full h-5 ${className}`}>
      {/* Track and orange fill, centred on the same line as the knobs */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-light-gray"
        style={{ left: THUMB / 2, right: THUMB / 2 }}
      />
      <div
        ref={range}
        className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-brand-orange"
      />

      <input
        type="range"
        aria-label="Minimum price"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onChange={(event) => {
          const v = Math.min(Number(event.target.value), maxVal - step);
          setMinVal(v);
          minValRef.current = v;
          onChange([v, maxVal]);
        }}
        className={`thumb absolute inset-0 w-full h-full m-0 ${minVal > max - (max - min) / 10 ? "z-[5]" : "z-[3]"}`}
      />
      <input
        type="range"
        aria-label="Maximum price"
        min={min}
        max={max}
        value={maxVal}
        step={step}
        onChange={(event) => {
          const v = Math.max(Number(event.target.value), minVal + step);
          setMaxVal(v);
          maxValRef.current = v;
          onChange([minVal, v]);
        }}
        className="thumb absolute inset-0 w-full h-full m-0 z-[4]"
      />

      <style jsx>{`
        .thumb {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
          outline: none;
        }
        .thumb::-webkit-slider-runnable-track {
          height: 100%;
          background: transparent;
        }
        .thumb::-moz-range-track {
          height: 100%;
          background: transparent;
        }
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          box-sizing: border-box;
          width: ${THUMB}px;
          height: ${THUMB}px;
          margin-top: calc((20px - ${THUMB}px) / 2);
          border-radius: 9999px;
          background: var(--color-white, #fff);
          border: 2px solid var(--color-brand-orange);
          cursor: grab;
          pointer-events: auto;
          transition: transform 150ms ease;
        }
        .thumb::-moz-range-thumb {
          box-sizing: border-box;
          width: ${THUMB}px;
          height: ${THUMB}px;
          border-radius: 9999px;
          background: var(--color-white, #fff);
          border: 2px solid var(--color-brand-orange);
          cursor: grab;
          pointer-events: auto;
        }
        .thumb:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.1);
        }
        .thumb:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand-orange) 25%, transparent);
        }
      `}</style>
    </div>
  );
};

export { RangeSlider };
