export function filterBlockedCombos(
  combos: string[],
  blockedCards: string[],
): string[] {
  const blocked = new Set(blockedCards);

  return combos.filter((combo) => {
    const cards = [combo.slice(0, 2), combo.slice(2, 4)];

    return cards.every((card) => !blocked.has(card));
  });
}
