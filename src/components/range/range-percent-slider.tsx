"use client";

type RangePercentSliderProps = {
  value: number;
  onChange: (next: number) => void;
};

export function RangePercentSlider({
  value,
  onChange,
}: RangePercentSliderProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
        Fill Percent
      </span>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-brass-400"
        />
        <span className="min-w-14 text-right text-sm font-semibold text-stone-200">
          {value}%
        </span>
      </div>
    </label>
  );
}
