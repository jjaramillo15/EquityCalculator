"use client";

import { RangeMatrix } from "@/components/range/range-matrix";
import { RangePercentSlider } from "@/components/range/range-percent-slider";
import { RangeTextInput } from "@/components/range/range-text-input";

export function PlayerPanel() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <h2 className="text-xl font-semibold text-white">Player</h2>
      <div className="mt-4 space-y-4">
        <RangeTextInput value="" onChange={() => undefined} />
        <RangePercentSlider value={15} onChange={() => undefined} />
        <RangeMatrix value={[]} onChange={() => undefined} />
      </div>
    </section>
  );
}
