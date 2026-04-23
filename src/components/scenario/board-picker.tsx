"use client";

type BoardPickerProps = {
  value: string[];
  unavailable: string[];
  onChange: (next: string[]) => void;
};

const CARD_CODES = ["Ah", "As", "Ad", "Ac", "Kh", "Ks", "Kd", "Kc"];

export function BoardPicker({
  value,
  unavailable,
  onChange,
}: BoardPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CARD_CODES.map((card) => {
        const selected = value.includes(card);
        const disabled = unavailable.includes(card);

        return (
          <button
            key={card}
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange(
                selected
                  ? value.filter((item) => item !== card)
                  : [...value, card],
              )
            }
            className="rounded-lg border border-stone-700 px-3 py-2 text-sm font-semibold text-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {card}
          </button>
        );
      })}
    </div>
  );
}
