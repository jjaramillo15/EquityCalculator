"use client";

type RangeTextInputProps = {
  value: string;
  onChange: (next: string) => void;
};

export function RangeTextInput({ value, onChange }: RangeTextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
        Range Text
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        placeholder="QQ+,AKs,AKo"
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-brass-300"
      />
    </label>
  );
}
