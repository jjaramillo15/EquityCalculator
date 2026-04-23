const DEFAULT_RANKING = ["AA", "KK", "QQ", "JJ", "AKs", "TT", "AQs", "AKo"];

export function fillRangeByPercent(percent: number): string[] {
  const capped = Math.max(0, Math.min(percent, 100));
  const count = Math.max(0, Math.ceil((DEFAULT_RANKING.length * capped) / 100));

  return DEFAULT_RANKING.slice(0, count);
}
