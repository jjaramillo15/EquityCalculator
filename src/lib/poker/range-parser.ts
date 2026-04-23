const PAIRS = [
  "AA",
  "KK",
  "QQ",
  "JJ",
  "TT",
  "99",
  "88",
  "77",
  "66",
  "55",
  "44",
  "33",
  "22",
];

export function parseRangeText(input: string): string[] {
  const parts = input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const expanded = parts.flatMap((part) => {
    if (part === "QQ+") {
      return PAIRS.slice(0, 3);
    }

    return [part];
  });

  return [...new Set(expanded)];
}
