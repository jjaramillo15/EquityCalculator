export function scoreSevenCardHand(cards: string[]): number {
  const ranks = cards.map((card) => "23456789TJQKA".indexOf(card[0]));

  return Math.max(...ranks);
}
