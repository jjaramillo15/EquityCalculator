"use client";

import { useEffect, useRef, useState } from "react";

type RangeMatrixProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

const CELLS = ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AKo"];

export function RangeMatrix({ value, onChange }: RangeMatrixProps) {
  const valueRef = useRef(value);
  const [dragMode, setDragMode] = useState<{
    active: boolean;
    shouldSelect: boolean;
  }>({
    active: false,
    shouldSelect: false,
  });

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    function stopDragging() {
      setDragMode((current) =>
        current.active
          ? { active: false, shouldSelect: current.shouldSelect }
          : current,
      );
    }

    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mouseup", stopDragging);
    };
  }, []);

  function updateCell(cell: string, shouldSelect: boolean) {
    const current = valueRef.current;
    const selected = current.includes(cell);

    if (shouldSelect && !selected) {
      const next = [...current, cell];

      valueRef.current = next;
      onChange(next);
    }

    if (!shouldSelect && selected) {
      const next = current.filter((item) => item !== cell);

      valueRef.current = next;
      onChange(next);
    }
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {CELLS.map((cell) => {
        const selected = value.includes(cell);

        return (
          <button
            key={cell}
            type="button"
            aria-label={cell}
            aria-pressed={selected}
            className={
              selected
                ? "rounded-lg bg-brass-400 px-3 py-2 text-sm font-semibold text-felt-950"
                : "rounded-lg bg-stone-800 px-3 py-2 text-sm font-semibold text-stone-100"
            }
            onMouseDown={() => {
              const shouldSelect = !selected;

              setDragMode({ active: true, shouldSelect });
              updateCell(cell, shouldSelect);
            }}
            onMouseEnter={() => {
              if (dragMode.active) {
                updateCell(cell, dragMode.shouldSelect);
              }
            }}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
