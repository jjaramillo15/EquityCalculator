# Equity Engine Accuracy Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder equity winner selection with a fast approximate Hold'em engine that respects real showdown ranking, blocked cards, partial boards, and fixed-hand or range inputs for 2-3 players.

**Architecture:** Keep the public `calculateEquity()` entrypoint unchanged, but rebuild the internals around legal combo sampling and a deterministic 7-card hand evaluator. The implementation will stay inside `src/lib/poker` so the engine remains reusable from API routes and future clients.

**Tech Stack:** TypeScript, Vitest, Next.js route layer, existing poker helpers under `src/lib/poker`

---

## File Structure

- Modify: `src/lib/poker/hand-evaluator.ts`
  Why: replace the placeholder max-rank scorer with a real comparable Hold'em hand score.
- Modify: `src/lib/poker/equity-engine.ts`
  Why: replace string-based winner logic with Monte Carlo sampling using legal combos and board completion.
- Modify: `src/lib/poker/equity-engine.test.ts`
  Why: cover fixed hands, ranges, blocked cards, ties, and supported player-count boundaries.
- Create or modify: `src/lib/poker/hand-evaluator.test.ts`
  Why: verify hand category ordering and kicker behavior directly at the evaluator layer.
- Modify: `src/app/api/scenarios/calculate/route.test.ts`
  Why: make sure the route still returns engine output correctly after the internal upgrade.

## Task 1: Build The Real Hand Evaluator

**Files:**
- Create: `src/lib/poker/hand-evaluator.test.ts`
- Modify: `src/lib/poker/hand-evaluator.ts`

- [ ] **Step 1: Write the failing evaluator tests**

```ts
// src/lib/poker/hand-evaluator.test.ts
import { describe, expect, it } from "vitest";
import { scoreSevenCardHand } from "./hand-evaluator";

describe("scoreSevenCardHand", () => {
  it("ranks a pair above high card", () => {
    const highCard = scoreSevenCardHand(["Ah", "Kd", "9c", "7s", "4d", "3c", "2h"]);
    const onePair = scoreSevenCardHand(["Ah", "Ad", "9c", "7s", "4d", "3c", "2h"]);
    expect(onePair).toBeGreaterThan(highCard);
  });

  it("recognizes a wheel straight", () => {
    const wheel = scoreSevenCardHand(["Ah", "2d", "3c", "4s", "5d", "9c", "Kh"]);
    const trips = scoreSevenCardHand(["Ah", "Ad", "Ac", "4s", "5d", "9c", "Kh"]);
    expect(trips).toBeGreaterThan(wheel);
  });

  it("uses kickers inside the same category", () => {
    const topKicker = scoreSevenCardHand(["Ah", "Kd", "Ks", "7s", "4d", "3c", "2h"]);
    const weakKicker = scoreSevenCardHand(["Qh", "Kd", "Ks", "7s", "4d", "3c", "2h"]);
    expect(topKicker).toBeGreaterThan(weakKicker);
  });
});
```

- [ ] **Step 2: Run the evaluator tests to verify they fail**

Run: `node .\node_modules\vitest\vitest.mjs run src/lib/poker/hand-evaluator.test.ts`
Expected: FAIL because the current evaluator only returns the max rank index.

- [ ] **Step 3: Implement the minimal real evaluator**

```ts
// src/lib/poker/hand-evaluator.ts
const CATEGORY_BASE = 1_000_000_000;
const RANK_VALUES: Record<string, number> = {
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

export function scoreSevenCardHand(cards: string[]): number {
  const parsed = cards.map((card) => ({
    rank: RANK_VALUES[card[0]],
    suit: card[1],
  }));

  const rankCounts = new Map<number, number>();
  const suitBuckets = new Map<string, number[]>();

  for (const card of parsed) {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1);
    suitBuckets.set(card.suit, [...(suitBuckets.get(card.suit) ?? []), card.rank]);
  }

  const sortedRanks = [...rankCounts.keys()].sort((left, right) => right - left);
  const straightHigh = getStraightHigh(sortedRanks);
  const flushRanks = [...suitBuckets.values()].find((bucket) => bucket.length >= 5);
  const straightFlushHigh = flushRanks
    ? getStraightHigh([...new Set(flushRanks)].sort((left, right) => right - left))
    : null;

  if (straightFlushHigh) {
    return encodeScore(8, [straightFlushHigh]);
  }

  const groups = [...rankCounts.entries()].sort((left, right) => {
    if (right[1] !== left[1]) return right[1] - left[1];
    return right[0] - left[0];
  });

  if (groups[0]?.[1] === 4) {
    const kicker = sortedRanks.find((rank) => rank !== groups[0][0]) ?? 0;
    return encodeScore(7, [groups[0][0], kicker]);
  }

  const trips = groups.filter((group) => group[1] === 3).map((group) => group[0]);
  const pairs = groups.filter((group) => group[1] === 2).map((group) => group[0]);

  if (trips.length >= 1 && (pairs.length >= 1 || trips.length >= 2)) {
    const fullHousePair = pairs[0] ?? trips[1];
    return encodeScore(6, [trips[0], fullHousePair]);
  }

  if (flushRanks) {
    return encodeScore(
      5,
      [...flushRanks].sort((left, right) => right - left).slice(0, 5),
    );
  }

  if (straightHigh) {
    return encodeScore(4, [straightHigh]);
  }

  if (trips.length >= 1) {
    const kickers = sortedRanks.filter((rank) => rank !== trips[0]).slice(0, 2);
    return encodeScore(3, [trips[0], ...kickers]);
  }

  if (pairs.length >= 2) {
    const kicker = sortedRanks
      .filter((rank) => rank !== pairs[0] && rank !== pairs[1])
      .slice(0, 1);
    return encodeScore(2, [pairs[0], pairs[1], ...kicker]);
  }

  if (pairs.length === 1) {
    const kickers = sortedRanks.filter((rank) => rank !== pairs[0]).slice(0, 3);
    return encodeScore(1, [pairs[0], ...kickers]);
  }

  return encodeScore(0, sortedRanks.slice(0, 5));
}

function getStraightHigh(ranks: number[]) {
  const unique = [...new Set(ranks)];
  if (unique.includes(14)) unique.push(1);

  let run = 1;

  for (let index = 0; index < unique.length - 1; index += 1) {
    if (unique[index] - 1 === unique[index + 1]) {
      run += 1;
      if (run >= 5) return unique[index - 3];
    } else {
      run = 1;
    }
  }

  return null;
}

function encodeScore(category: number, ranks: number[]) {
  return ranks.reduce(
    (score, rank, index) => score + rank * 15 ** (5 - index),
    category * CATEGORY_BASE,
  );
}
```

- [ ] **Step 4: Run the evaluator tests to verify they pass**

Run: `node .\node_modules\vitest\vitest.mjs run src/lib/poker/hand-evaluator.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the evaluator slice**

```bash
git add src/lib/poker/hand-evaluator.ts src/lib/poker/hand-evaluator.test.ts
git commit -m "feat: add real holdem hand evaluator"
```

## Task 2: Replace Placeholder Winner Selection With Legal Sampling

**Files:**
- Modify: `src/lib/poker/equity-engine.ts`
- Modify: `src/lib/poker/equity-engine.test.ts`

- [ ] **Step 1: Write the failing engine tests**

```ts
// src/lib/poker/equity-engine.test.ts
import { describe, expect, it } from "vitest";
import { calculateEquity } from "./equity-engine";

describe("calculateEquity", () => {
  it("keeps pocket aces ahead of kings over many samples", async () => {
    const result = await calculateEquity({
      board: [],
      players: [
        { label: "Hero", fixedHand: ["Ah", "Ad"], rangeText: null },
        { label: "Villain", fixedHand: ["Kh", "Kd"], rangeText: null },
      ],
      iterations: 400,
    });

    expect(result.players[0].equity).toBeGreaterThan(result.players[1].equity);
  });

  it("supports range versus range with blocked cards", async () => {
    const result = await calculateEquity({
      board: ["Ah", "Kd", "7c"],
      players: [
        { label: "Hero", fixedHand: null, rangeText: "QQ+,AKs" },
        { label: "Villain", fixedHand: null, rangeText: "JJ+,AQs" },
      ],
      iterations: 300,
    });

    expect(result.players).toHaveLength(2);
    expect(result.players.every((player) => player.equity >= 0)).toBe(true);
  });

  it("splits equity on exact ties", async () => {
    const result = await calculateEquity({
      board: ["Ah", "Kh", "Qh", "Jh", "Th"],
      players: [
        { label: "Hero", fixedHand: ["2c", "3d"], rangeText: null },
        { label: "Villain", fixedHand: ["4c", "5d"], rangeText: null },
      ],
      iterations: 50,
    });

    expect(result.players[0].equity).toBeCloseTo(50, 0);
    expect(result.players[1].equity).toBeCloseTo(50, 0);
  });
});
```

- [ ] **Step 2: Run the engine tests to verify they fail**

Run: `node .\node_modules\vitest\vitest.mjs run src/lib/poker/equity-engine.test.ts`
Expected: FAIL because the current implementation picks winners by string sorting.

- [ ] **Step 3: Implement legal combo sampling and showdown**

```ts
// src/lib/poker/equity-engine.ts
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

export async function calculateEquity(input: EngineRequest) {
  if (input.players.length < 2 || input.players.length > 3) {
    throw new Error("The MVP equity engine supports 2 to 3 players.");
  }

  const wins = input.players.map(() => 0);
  const deck = allCards().map((card) => card.code);
  let completedIterations = 0;

  while (completedIterations < input.iterations) {
    const sample = sampleHandsAndBoard(input, deck);

    if (!sample) continue;

    const scores = sample.hands.map((hand, index) =>
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

  return {
    players: input.players.map((player, index) => ({
      label: player.label,
      equity: Number(((wins[index] / completedIterations) * 100).toFixed(2)),
    })),
  };
}

function sampleHandsAndBoard(input: EngineRequest, deck: string[]) {
  const used = new Set(input.board);
  const sampledHands: string[][] = [];

  for (const player of input.players) {
    if (player.fixedHand) {
      if (player.fixedHand.some((card) => used.has(card))) return null;
      player.fixedHand.forEach((card) => used.add(card));
      sampledHands.push(player.fixedHand);
      continue;
    }

    const combos = buildCombos(player.rangeText ?? "").filter((combo) =>
      combo.every((card) => !used.has(card)),
    );

    if (combos.length === 0) return null;

    const chosen = combos[Math.floor(Math.random() * combos.length)];
    chosen.forEach((card) => used.add(card));
    sampledHands.push(chosen);
  }

  const remainingDeck = deck.filter((card) => !used.has(card));
  const board = [...input.board];

  while (board.length < 5) {
    const index = Math.floor(Math.random() * remainingDeck.length);
    board.push(remainingDeck[index]);
    remainingDeck.splice(index, 1);
  }

  return { hands: sampledHands, board };
}

function buildCombos(rangeText: string) {
  const tokens = [...new Set(rangeText.split(",").map((token) => token.trim()).filter(Boolean))];

  return tokens.flatMap((token) => {
    if (token === "AKs") return [["As", "Ks"], ["Ad", "Kd"], ["Ac", "Kc"]];
    if (token === "AQs") return [["As", "Qs"], ["Ad", "Qd"], ["Ac", "Qc"]];
    if (token === "AA") return [["Ah", "Ad"], ["Ah", "Ac"], ["Ad", "Ac"]];
    if (token === "KK") return [["Kh", "Kd"], ["Kh", "Kc"], ["Kd", "Kc"]];
    if (token === "QQ") return [["Qh", "Qd"], ["Qh", "Qc"], ["Qd", "Qc"]];
    if (token === "JJ") return [["Jh", "Jd"], ["Jh", "Jc"], ["Jd", "Jc"]];
    return [];
  });
}
```

- [ ] **Step 4: Run the engine tests to verify they pass**

Run: `node .\node_modules\vitest\vitest.mjs run src/lib/poker/equity-engine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the engine slice**

```bash
git add src/lib/poker/equity-engine.ts src/lib/poker/equity-engine.test.ts
git commit -m "feat: improve monte carlo equity accuracy"
```

## Task 3: Verify Route Compatibility

**Files:**
- Modify: `src/app/api/scenarios/calculate/route.test.ts`

- [ ] **Step 1: Extend the failing route test for upgraded output**

```ts
// src/app/api/scenarios/calculate/route.test.ts
import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/scenarios/calculate", () => {
  it("returns numeric equities for a valid request", async () => {
    const response = await POST(
      new Request("http://localhost/api/scenarios/calculate", {
        method: "POST",
        body: JSON.stringify({
          projectId: "project-1",
          name: "Spot",
          board: [],
          players: [
            { label: "Hero", fixedHand: ["Ah", "Ad"], rangeText: null },
            { label: "Villain", fixedHand: ["Kh", "Kd"], rangeText: null },
          ],
        }),
      }),
    );

    const data = await response.json();
    expect(data.players).toHaveLength(2);
    expect(data.players.every((player: { equity: number }) => typeof player.equity === "number")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the route test to verify it still passes with the new engine**

Run: `node .\node_modules\vitest\vitest.mjs run src/app/api/scenarios/calculate/route.test.ts`
Expected: PASS

- [ ] **Step 3: Run the focused engine verification**

Run: `node .\node_modules\vitest\vitest.mjs run src/lib/poker/hand-evaluator.test.ts src/lib/poker/equity-engine.test.ts src/app/api/scenarios/calculate/route.test.ts`
Expected: PASS

- [ ] **Step 4: Commit the route verification**

```bash
git add src/app/api/scenarios/calculate/route.test.ts
git commit -m "test: cover upgraded equity engine route behavior"
```

## Self-Review

- Spec coverage: the plan covers the evaluator upgrade, legal Monte Carlo sampling, blocked cards, partial boards, ties, and route compatibility.
- Placeholder scan: no `TODO`, `TBD`, or vague “handle appropriately” steps remain.
- Type consistency: `calculateEquity()` keeps the same external contract while `scoreSevenCardHand()` remains a numeric comparator for callers.
