const RANK_VALUE: Record<string, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const SCORE_BASE = 15;
const CATEGORY_WEIGHT = SCORE_BASE ** 5;

type ParsedCard = {
  rank: number;
  suit: string;
};

export function scoreSevenCardHand(cards: string[]): number {
  if (cards.length !== 7) {
    throw new Error("scoreSevenCardHand expects exactly 7 cards.");
  }

  const parsed = cards.map(parseCard);
  let bestScore = 0;

  for (let first = 0; first < parsed.length - 4; first += 1) {
    for (let second = first + 1; second < parsed.length - 3; second += 1) {
      for (let third = second + 1; third < parsed.length - 2; third += 1) {
        for (let fourth = third + 1; fourth < parsed.length - 1; fourth += 1) {
          for (
            let fifth = fourth + 1;
            fifth < parsed.length;
            fifth += 1
          ) {
            const score = scoreFiveCardHand([
              parsed[first],
              parsed[second],
              parsed[third],
              parsed[fourth],
              parsed[fifth],
            ]);

            if (score > bestScore) {
              bestScore = score;
            }
          }
        }
      }
    }
  }

  return bestScore;
}

function scoreFiveCardHand(cards: ParsedCard[]): number {
  const ranks = cards
    .map((card) => card.rank)
    .sort((left, right) => right - left);
  const uniqueRanks = [...new Set(ranks)];
  const straightHigh = getStraightHigh(uniqueRanks);
  const flush = cards.every((card) => card.suit === cards[0].suit);
  const groups = [...countRanks(ranks).entries()].sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    return right[0] - left[0];
  });

  if (flush && straightHigh) {
    return encodeScore(8, [straightHigh]);
  }

  if (groups[0][1] === 4) {
    return encodeScore(7, [groups[0][0], groups[1][0]]);
  }

  if (groups[0][1] === 3 && groups[1][1] === 2) {
    return encodeScore(6, [groups[0][0], groups[1][0]]);
  }

  if (flush) {
    return encodeScore(5, ranks);
  }

  if (straightHigh) {
    return encodeScore(4, [straightHigh]);
  }

  if (groups[0][1] === 3) {
    const kickers = groups
      .filter((group) => group[1] === 1)
      .map((group) => group[0])
      .sort((left, right) => right - left);

    return encodeScore(3, [groups[0][0], ...kickers]);
  }

  if (groups[0][1] === 2 && groups[1][1] === 2) {
    const pairs = groups
      .filter((group) => group[1] === 2)
      .map((group) => group[0])
      .sort((left, right) => right - left);
    const kicker = groups.find((group) => group[1] === 1)?.[0] ?? 0;

    return encodeScore(2, [...pairs, kicker]);
  }

  if (groups[0][1] === 2) {
    const kickers = groups
      .filter((group) => group[1] === 1)
      .map((group) => group[0])
      .sort((left, right) => right - left);

    return encodeScore(1, [groups[0][0], ...kickers]);
  }

  return encodeScore(0, ranks);
}

function parseCard(card: string): ParsedCard {
  return {
    rank: RANK_VALUE[card[0]],
    suit: card[1],
  };
}

function countRanks(ranks: number[]) {
  return ranks.reduce((counts, rank) => {
    counts.set(rank, (counts.get(rank) ?? 0) + 1);
    return counts;
  }, new Map<number, number>());
}

function getStraightHigh(sortedRanks: number[]) {
  const ranks = [...sortedRanks];

  if (ranks.includes(14)) {
    ranks.push(1);
  }

  let run = 1;

  for (let index = 0; index < ranks.length - 1; index += 1) {
    if (ranks[index] - 1 === ranks[index + 1]) {
      run += 1;

      if (run >= 5) {
        return ranks[index - 3];
      }
    } else {
      run = 1;
    }
  }

  return null;
}

function encodeScore(category: number, values: number[]) {
  let score = category * CATEGORY_WEIGHT;

  for (const value of values) {
    score = score * SCORE_BASE + value;
  }

  return score;
}
