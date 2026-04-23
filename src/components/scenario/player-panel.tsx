"use client";

import { RangeMatrix } from "@/components/range/range-matrix";
import { RangePercentSlider } from "@/components/range/range-percent-slider";
import { RangeTextInput } from "@/components/range/range-text-input";

type PlayerPanelProps = {
  title: string;
  rangeText: string;
  fillPercent: number;
  selectedHands: string[];
  onRangeTextChange: (next: string) => void;
  onFillPercentChange: (next: number) => void;
  onSelectedHandsChange: (next: string[]) => void;
};

export function PlayerPanel({
  title,
  rangeText,
  fillPercent,
  selectedHands,
  onRangeTextChange,
  onFillPercentChange,
  onSelectedHandsChange,
}: PlayerPanelProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4">
        <RangeTextInput
          label={`${title} Range Text`}
          value={rangeText}
          onChange={onRangeTextChange}
        />
        <RangePercentSlider
          label={`${title} Fill Percent`}
          value={fillPercent}
          onChange={onFillPercentChange}
        />
        <RangeMatrix value={selectedHands} onChange={onSelectedHandsChange} />
      </div>
    </section>
  );
}
