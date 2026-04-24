import { allCards } from "./cards";
import { scoreSevenCardHand } from "./hand-evaluator";

type EnginePlayer = {
  label: string;
  fixedHand: string[] | null;
  rangeText: string | null;
};

type EngineRequest = {
  board: string[];
  players: EnginePlayer[];
  iterations: number;
};

type PreparedPlayer =
  | {
      label: string;
      fixedHand: string[];
      combos: null;
    }
  | {
      label: string;
      fixedHand: null;
      combos: string[][];
    };

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const SUITS = ["s", "h", "d", "c"];

export async function calculateEquity(input: EngineRequest) {
  if (input.players.length < 2 || input.players.length > 3) {
    throw new Error("The MVP equity engine supports 2 to 3 players.");
  }

  validateKnownCards(input.board, input.players);

  const wins = input.players.map(() => 0);
  const deck = allCards().map((card) => card.code);
  const preparedPlayers = input.players.map(preparePlayer);
  let completedIterations = 0;
  let attempts = 0;
  const maxAttempts = Math.max(input.iterations * 50, 100);

  while (completedIterations < input.iterations && attempts < maxAttempts) {
    attempts += 1;

    const sample = sampleHandsAndBoard(preparedPlayers, input.board, deck);

    if (!sample) {
      continue;
    }

    const scores = sample.hands.map((hand) =>
      scoreSevenCardHand([...hand, ...sample.board]),
    );
    const bestScore = Math.max(...scores);
    const winners = scores
      .map((score, index) => (score === bestScore ? index : -1))
      .filter((index) => index >= 0);
    const share = 1 / winners.length;

    for (const winner of winners) {
      wins[winner] += share;
    }

    completedIterations += 1;
  }

  if (completedIterations === 0) {
    throw new Error("No legal combinations available for this scenario.");
  }

  return {
    players: input.players.map((player, index) => ({
      label: player.label,
      equity: Number(((wins[index] / completedIterations) * 100).toFixed(2)),
    })),
  };
}

function preparePlayer(player: EnginePlayer): PreparedPlayer {
  if (player.fixedHand) {
    return {
      label: player.label,
      fixedHand: player.fixedHand,
      combos: null,
    };
  }

  return {
    label: player.label,
    fixedHand: null,
    combos: expandRangeTextToCombos(player.rangeText ?? ""),
  };
}

function sampleHandsAndBoard(
  players: PreparedPlayer[],
  board: string[],
  deck: string[],
) {
  const used = new Set(board);
  const sampledHands: string[][] = [];

  for (const player of players) {
    if (player.fixedHand) {
      if (player.fixedHand.some((card) => used.has(card))) {
        return null;
      }

      player.fixedHand.forEach((card) => used.add(card));
      sampledHands.push(player.fixedHand);
      continue;
    }

    const legalCombos = player.combos.filter((combo) =>
      combo.every((card) => !used.has(card)),
    );

    if (legalCombos.length === 0) {
      return null;
    }

    const chosen = legalCombos[Math.floor(Math.random() * legalCombos.length)];

    chosen.forEach((card) => used.add(card));
    sampledHands.push(chosen);
  }

  const remainingDeck = deck.filter((card) => !used.has(card));
  const completedBoard = [...board];

  while (completedBoard.length < 5) {
    const index = Math.floor(Math.random() * remainingDeck.length);
    completedBoard.push(remainingDeck[index]);
    remainingDeck.splice(index, 1);
  }

  return {
    hands: sampledHands,
    board: completedBoard,
  };
}

function validateKnownCards(board: string[], players: EnginePlayer[]) {
  const knownCards = [
    ...board,
    ...players.flatMap((player) => player.fixedHand ?? []),
  ];

  if (new Set(knownCards).size !== knownCards.length) {
    throw new Error("Duplicate known cards make the scenario invalid.");
  }

  if (board.length > 5) {
    throw new Error("Board cannot contain more than 5 cards.");
  }
}

function expandRangeTextToCombos(rangeText: string) {
  const handClasses = [
    ...new Set(
      rangeText
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean)
        .flatMap(expandToken),
    ),
  ];

  return handClasses.flatMap(buildCombosForHandClass);
}

function expandToken(token: string): string[] {
  const pairPlusMatch = token.match(/^([AKQJT98765432])\1\+$/);

  if (pairPlusMatch) {
    const startIndex = RANKS.indexOf(pairPlusMatch[1]);
    return RANKS.slice(0, startIndex + 1).map((rank) => `${rank}${rank}`);
  }

  const broadwayPlusMatch = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])\+$/);

  if (broadwayPlusMatch) {
    const [, firstRank, secondRank, suitedness] = broadwayPlusMatch;
    const firstIndex = RANKS.indexOf(firstRank);
    const secondIndex = RANKS.indexOf(secondRank);
    const expanded: string[] = [];

    for (let index = secondIndex; index > firstIndex; index -= 1) {
      expanded.push(`${firstRank}${RANKS[index]}${suitedness}`);
    }

    return expanded;
  }

  return [token];
}

function buildCombosForHandClass(handClass: string) {
  if (
    handClass.length === 2 &&
    handClass[0] === handClass[1] &&
    RANKS.includes(handClass[0])
  ) {
    const combos: string[][] = [];

    for (let left = 0; left < SUITS.length - 1; left += 1) {
      for (let right = left + 1; right < SUITS.length; right += 1) {
        combos.push([
          `${handClass[0]}${SUITS[left]}`,
          `${handClass[1]}${SUITS[right]}`,
        ]);
      }
    }

    return combos;
  }

  const nonPairMatch = handClass.match(
    /^([AKQJT98765432])([AKQJT98765432])([so])$/,
  );

  if (!nonPairMatch) {
    return [];
  }

  const [, firstRank, secondRank, suitedness] = nonPairMatch;

  if (suitedness === "s") {
    return SUITS.map((suit) => [`${firstRank}${suit}`, `${secondRank}${suit}`]);
  }

  return SUITS.flatMap((firstSuit) =>
    SUITS.filter((secondSuit) => secondSuit !== firstSuit).map((secondSuit) => [
      `${firstRank}${firstSuit}`,
      `${secondRank}${secondSuit}`,
    ]),
  );
}
